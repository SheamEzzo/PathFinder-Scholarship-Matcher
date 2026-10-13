/**
 * Pure matching logic (no NestJS, no I/O).
 * This is the ONE place where eligibility, score and explanation are decided,
 * so the percentage, the status and the explanation can never disagree
 * (business rules 9 and 10).
 *
 * Scoring model
 * -------------
 * Eligible (all eligibility requirements met)  ->  60 .. 100
 *   60            base points for being eligible
 *   + 0..25       affordability (full points when the remaining yearly cost
 *                 fits the budget, otherwise proportional to budget / cost)
 *   + 10          the scholarship's country is one of the preferred countries
 *   + 5           the scholarship covers one of the preferred study areas
 *
 * Not eligible (at least one requirement missing)  ->  0 .. 49
 *   up to 30      proportional to the share of requirements that are met
 *   + up to 16    40% of the preference points the student would earn
 *   (never above 49, so it can never beat or reach an eligible scholarship)
 */

export interface MatchProfile {
  age: number;
  currentFieldOfStudy: string;
  currentEducationLevel: string;
  languages: string[];
  budget: number;
  preferredCountries: string[];
  preferredStudyAreas: string[];
}

export interface MatchScholarship {
  country: string;
  eligibleFieldsOfStudy: string[];
  requiredEducationLevel: string;
  languageRequirements: string[];
  ageRestriction: { min?: number; max?: number } | null;
  estimatedAnnualCost: number;
}

export interface Condition {
  key: string;
  met: boolean;
  message: string;
}

export interface MatchResult {
  eligible: boolean;
  eligibilityStatus: 'Eligible' | 'Not eligible';
  /** Final 0-100 value shown everywhere in the app. */
  matchPercentage: number;
  matchingReasons: string[];
  missingRequirements: string[];
  unmetPreferences: string[];
  requirements: Condition[];
  preferences: Condition[];
  scoreBreakdown: {
    eligibilityPoints: number;
    preferencePoints: number;
    ineligibleCap: number | null;
  };
}

export const INELIGIBLE_CAP = 49;
const ELIGIBLE_BASE = 60;
const AFFORDABILITY_POINTS = 25;
const COUNTRY_POINTS = 10;
const STUDY_AREA_POINTS = 5;

const EDUCATION_RANK: Record<string, number> = {
  high_school: 1,
  bachelor: 2,
  master: 3,
  phd: 4,
};

const EDUCATION_LABEL: Record<string, string> = {
  high_school: 'High school',
  bachelor: "Bachelor's degree",
  master: "Master's degree",
  phd: 'PhD',
};

const same = (a: string, b: string) =>
  a.trim().toLocaleLowerCase() === b.trim().toLocaleLowerCase();

const usd = (value: number) => `$${value.toLocaleString('en-US')}`;

function ageRangeText(range: { min?: number; max?: number }): string {
  if (range.min != null && range.max != null)
    return `${range.min}-${range.max} years`;
  if (range.max != null) return `up to ${range.max} years`;
  return `at least ${range.min} years`;
}

export function calculateMatch(
  profile: MatchProfile,
  scholarship: MatchScholarship,
): MatchResult {
  const requirements: Condition[] = [];

  // --- Eligibility requirements -------------------------------------------
  const range = scholarship.ageRestriction;
  const hasAgeLimit = !!range && (range.min != null || range.max != null);
  const ageMet =
    !hasAgeLimit ||
    ((range!.min == null || profile.age >= range!.min) &&
      (range!.max == null || profile.age <= range!.max));
  requirements.push({
    key: 'age',
    met: ageMet,
    message: !hasAgeLimit
      ? 'Age: no age restriction'
      : ageMet
        ? `Age: ${profile.age} is within the allowed range (${ageRangeText(range!)})`
        : `Age: ${profile.age} is outside the allowed range (${ageRangeText(range!)})`,
  });

  const requiredRank = EDUCATION_RANK[scholarship.requiredEducationLevel] ?? 0;
  const educationMet =
    (EDUCATION_RANK[profile.currentEducationLevel] ?? 0) >= requiredRank;
  const requiredLabel =
    EDUCATION_LABEL[scholarship.requiredEducationLevel] ??
    scholarship.requiredEducationLevel;
  requirements.push({
    key: 'education',
    met: educationMet,
    message: educationMet
      ? `Education: ${requiredLabel} or higher is required, and you meet it`
      : `Education: ${requiredLabel} or higher is required, you currently hold ${
          EDUCATION_LABEL[profile.currentEducationLevel] ??
          profile.currentEducationLevel
        }`,
  });

  const fieldMet = scholarship.eligibleFieldsOfStudy.some((field) =>
    same(field, profile.currentFieldOfStudy),
  );
  requirements.push({
    key: 'field',
    met: fieldMet,
    message: fieldMet
      ? `Field of study: ${profile.currentFieldOfStudy} is eligible`
      : `Field of study: only ${scholarship.eligibleFieldsOfStudy.join(', ')} accepted — you study ${profile.currentFieldOfStudy}`,
  });

  for (const language of scholarship.languageRequirements) {
    const known = profile.languages.some((l) => same(l, language));
    requirements.push({
      key: `language:${language}`,
      met: known,
      message: known
        ? `Language requirement met: ${language}`
        : `Required language: ${language} — not in your profile`,
    });
  }

  const requirementsMet = requirements.filter((c) => c.met).length;
  const eligible = requirementsMet === requirements.length;

  // --- Preferences ----------------------------------------------------------
  const countryMet = profile.preferredCountries.some((c) =>
    same(c, scholarship.country),
  );
  const areaMet = profile.preferredStudyAreas.some((area) =>
    scholarship.eligibleFieldsOfStudy.some((field) => same(area, field)),
  );
  const cost = scholarship.estimatedAnnualCost;
  const affordable = cost <= profile.budget;
  const affordabilityPoints = affordable
    ? AFFORDABILITY_POINTS
    : Math.round(AFFORDABILITY_POINTS * (Math.max(profile.budget, 0) / cost));

  const preferences: Condition[] = [
    {
      key: 'country',
      met: countryMet,
      message: countryMet
        ? `Preferred country: ${scholarship.country} is on your list`
        : `Preferred country: ${scholarship.country} is not on your list`,
    },
    {
      key: 'studyArea',
      met: areaMet,
      message: areaMet
        ? 'Preferred study area: matches one of your areas'
        : `Preferred study area: none of your areas is covered (${scholarship.eligibleFieldsOfStudy.join(', ')})`,
    },
    {
      key: 'budget',
      met: affordable,
      message: affordable
        ? cost === 0
          ? 'Budget: nothing left for you to pay (fully covered)'
          : `Budget: remaining cost ${usd(cost)}/year fits your budget of ${usd(profile.budget)}`
        : `Budget: remaining cost ${usd(cost)}/year is above your budget of ${usd(profile.budget)}`,
    },
  ];

  const preferencePoints =
    (countryMet ? COUNTRY_POINTS : 0) +
    (areaMet ? STUDY_AREA_POINTS : 0) +
    affordabilityPoints;

  // --- Final score ------------------------------------------------------------
  let eligibilityPoints: number;
  let shownPreferencePoints: number;
  if (eligible) {
    eligibilityPoints = ELIGIBLE_BASE;
    shownPreferencePoints = preferencePoints;
  } else {
    eligibilityPoints = Math.round(30 * (requirementsMet / requirements.length));
    shownPreferencePoints = Math.round(preferencePoints * 0.4);
  }
  let score = eligibilityPoints + shownPreferencePoints;
  if (!eligible) score = Math.min(INELIGIBLE_CAP, score);
  score = Math.max(0, Math.min(100, score));

  return {
    eligible,
    eligibilityStatus: eligible ? 'Eligible' : 'Not eligible',
    matchPercentage: score,
    matchingReasons: [...requirements, ...preferences]
      .filter((c) => c.met)
      .map((c) => c.message),
    missingRequirements: requirements.filter((c) => !c.met).map((c) => c.message),
    unmetPreferences: preferences.filter((c) => !c.met).map((c) => c.message),
    requirements,
    preferences,
    scoreBreakdown: {
      eligibilityPoints,
      preferencePoints: shownPreferencePoints,
      ineligibleCap: eligible ? null : INELIGIBLE_CAP,
    },
  };
}
