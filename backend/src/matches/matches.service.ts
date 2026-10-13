import { Injectable } from '@nestjs/common';
import type { CreateProfileDto } from '../profile/dto/create-profile.dto.js';
import type { Scholarship as ScholarshipRecord } from '../scholarships/scholarship.interface.js';

export type EducationLevel = 'high_school' | 'bachelor' | 'master' | 'phd';

export type FundingLevel = 'tuition_only' | 'partially_funded' | 'fully_funded';

export interface StudentProfile {
  age: number;
  educationLevel: EducationLevel;
  fieldOfStudy: string;
  country?: string;
  languages: string[];
  budget: number;
}

export interface ScholarshipRequirements {
  minAge?: number | null;
  maxAge?: number | null;
  requiredEducationLevel: EducationLevel;
  fieldOfStudy: string;
  requiredLanguages: string[];
}

export interface ScholarshipPreferences {
  country: string;
  fieldOfStudy: string;
  remainingCost: number;
}

export interface Scholarship {
  id: number;
  title: string;
  deadline: string;
  deadlineStatus: 'open' | 'closed';
  fundingLevel: FundingLevel;
  requirements: ScholarshipRequirements;
  preferences: ScholarshipPreferences;
}

export interface MatchResult {
  eligible: boolean;
  score: number;
  matchPercentage: number;
  eligibilityStatus: 'Eligible' | 'Not Eligible';
  matchingReasons: string[];
  missingRequirements: string[];
  unmetPreferences: string[];
  scoreBreakdown: {
    requirementsMet: number;
    totalRequirements: number;
    preferencesMet: number;
    totalPreferences: number;
    requirementPoints: number;
    preferencePoints: number;
  };
}

export interface MatchedScholarship extends Scholarship {
  match: MatchResult;
  rank: number;
}

export interface MatchFilters {
  country?: string;
  fieldOfStudy?: string;
  educationLevel?: EducationLevel;
  fundingLevel?: FundingLevel;
  search?: string;
}

export interface MatchList {
  items: MatchedScholarship[];
  total: number;
  totalOpen: number;
  eligibleCount: number;
  filteredEligibleCount: number;
}

const EDUCATION_RANK: Record<EducationLevel, number> = {
  high_school: 1,
  bachelor: 2,
  master: 3,
  phd: 4,
};

@Injectable()
export class MatchesService {
  /**
   * The single source of truth for eligibility and scoring.
   * Eligible: 70 + 10 for each met preference.
   * Ineligible: min(49, round(40 * met requirements / total requirements)
   *                 + 10 * met preferences).
   */
  calculate(profile: StudentProfile, scholarship: Scholarship): MatchResult {
    const missingRequirements: string[] = [];
    const matchingReasons: string[] = [];
    const unmetPreferences: string[] = [];

    const ageUnrestricted =
      scholarship.requirements.minAge == null &&
      scholarship.requirements.maxAge == null;

    const ageMet =
      ageUnrestricted ||
      ((scholarship.requirements.minAge == null ||
        profile.age >= scholarship.requirements.minAge) &&
        (scholarship.requirements.maxAge == null ||
          profile.age <= scholarship.requirements.maxAge));

    if (ageMet) {
      matchingReasons.push(
        ageUnrestricted
          ? 'No age restriction applies'
          : 'Age is within the allowed range',
      );
    } else {
      missingRequirements.push('Age is outside the allowed range');
    }

    const educationMet =
      EDUCATION_RANK[profile.educationLevel] >=
      EDUCATION_RANK[scholarship.requirements.requiredEducationLevel];

    if (educationMet) {
      matchingReasons.push('Education requirement is met');
    } else {
      missingRequirements.push(
        `Minimum education required: ${scholarship.requirements.requiredEducationLevel}`,
      );
    }

    const fieldMet = this.sameText(
      profile.fieldOfStudy,
      scholarship.requirements.fieldOfStudy,
    );

    if (fieldMet) {
      matchingReasons.push('Required field of study is met');
    } else {
      missingRequirements.push(
        `Required field of study: ${scholarship.requirements.fieldOfStudy}`,
      );
    }

    const missingLanguages = scholarship.requirements.requiredLanguages.filter(
      (language) =>
        !profile.languages.some((known) => this.sameText(known, language)),
    );

    for (const language of scholarship.requirements.requiredLanguages) {
      if (
        missingLanguages.some((missing) => this.sameText(missing, language))
      ) {
        missingRequirements.push(`Required language missing: ${language}`);
      } else {
        matchingReasons.push(`Language requirement met: ${language}`);
      }
    }

    const requirementChecks = [
      ageMet,
      educationMet,
      fieldMet,
      ...scholarship.requirements.requiredLanguages.map(
        (language) =>
          !missingLanguages.some((missing) => this.sameText(missing, language)),
      ),
    ];

    const requirementsMet = requirementChecks.filter(Boolean).length;
    const totalRequirements = requirementChecks.length;
    const eligible = missingRequirements.length === 0;

    const countryMet = this.sameText(
      profile.country ?? '',
      scholarship.preferences.country,
    );
    if (!countryMet) {
      unmetPreferences.push(
        `Preferred country: ${scholarship.preferences.country}`,
      );
    }

    const studyAreaMet = this.sameText(
      profile.fieldOfStudy,
      scholarship.preferences.fieldOfStudy,
    );
    if (!studyAreaMet) {
      unmetPreferences.push(
        `Preferred study area: ${scholarship.preferences.fieldOfStudy}`,
      );
    }

    // A zero budget and zero remaining cost count as affordable.
    const affordable = scholarship.preferences.remainingCost <= profile.budget;
    if (!affordable) {
      unmetPreferences.push('Remaining cost is above the student budget');
    }

    const preferencesMet = [countryMet, studyAreaMet, affordable].filter(
      Boolean,
    ).length;
    const preferencePoints = preferencesMet * 10;
    const requirementPoints = eligible
      ? 70
      : Math.min(
          49,
          Math.round(
            40 *
              (totalRequirements === 0
                ? 1
                : requirementsMet / totalRequirements),
          ),
        );

    const score = eligible
      ? 70 + preferencePoints
      : Math.min(49, requirementPoints + preferencePoints);

    return {
      eligible,
      score: Math.max(0, Math.min(100, Math.round(score))),
      matchPercentage:
        totalRequirements === 0
          ? 100
          : Math.round((requirementsMet / totalRequirements) * 100),
      eligibilityStatus: eligible ? 'Eligible' : 'Not Eligible',
      matchingReasons,
      missingRequirements,
      unmetPreferences,
      scoreBreakdown: {
        requirementsMet,
        totalRequirements,
        preferencesMet,
        totalPreferences: 3,
        requirementPoints,
        preferencePoints,
      },
    };
  }

  calculateForScholarship(
    profile: CreateProfileDto,
    scholarship: ScholarshipRecord,
  ): MatchResult {
    const missingRequirements: string[] = [];
    const matchingReasons: string[] = [];
    const unmetPreferences: string[] = [];
    const ageMet =
      scholarship.ageRestriction === null ||
      ((scholarship.ageRestriction.min === undefined ||
        profile.age >= scholarship.ageRestriction.min) &&
        (scholarship.ageRestriction.max === undefined ||
          profile.age <= scholarship.ageRestriction.max));
    const educationMet =
      EDUCATION_RANK[profile.currentEducationLevel] >=
      EDUCATION_RANK[scholarship.requiredEducationLevel];
    const fieldMet = scholarship.eligibleFieldsOfStudy.some((field) =>
      this.sameText(profile.currentFieldOfStudy, field),
    );
    const missingLanguages = scholarship.languageRequirements.filter(
      (language) =>
        !profile.languages.some((known) => this.sameText(known, language)),
    );

    if (ageMet) {
      matchingReasons.push(
        scholarship.ageRestriction === null
          ? 'No age restriction applies'
          : 'Age is within the allowed range',
      );
    } else {
      missingRequirements.push('Age is outside the allowed range');
    }

    if (educationMet) {
      matchingReasons.push('Education requirement is met');
    } else {
      missingRequirements.push(
        `Minimum education required: ${scholarship.requiredEducationLevel}`,
      );
    }

    if (fieldMet) {
      matchingReasons.push('Required field of study is met');
    } else {
      missingRequirements.push(
        `Eligible fields of study: ${scholarship.eligibleFieldsOfStudy.join(', ')}`,
      );
    }

    for (const language of scholarship.languageRequirements) {
      if (
        missingLanguages.some((missing) => this.sameText(missing, language))
      ) {
        missingRequirements.push(`Required language missing: ${language}`);
      } else {
        matchingReasons.push(`Language requirement met: ${language}`);
      }
    }

    const requirementChecks = [
      ageMet,
      educationMet,
      fieldMet,
      ...scholarship.languageRequirements.map(
        (language) =>
          !missingLanguages.some((missing) => this.sameText(missing, language)),
      ),
    ];
    const requirementsMet = requirementChecks.filter(Boolean).length;
    const totalRequirements = requirementChecks.length;
    const eligible = missingRequirements.length === 0;

    const countryMet = profile.preferredCountries.some((country) =>
      this.sameText(country, scholarship.country),
    );
    const studyAreaMet = profile.preferredStudyAreas.some((area) =>
      scholarship.eligibleFieldsOfStudy.some((field) =>
        this.sameText(area, field),
      ),
    );
    const affordable = scholarship.estimatedAnnualCost <= profile.budget;

    if (!countryMet) {
      unmetPreferences.push(`Preferred country: ${scholarship.country}`);
    }
    if (!studyAreaMet) {
      unmetPreferences.push(
        `Preferred study area: ${scholarship.eligibleFieldsOfStudy.join(', ')}`,
      );
    }
    if (!affordable) {
      unmetPreferences.push('Remaining cost is above the student budget');
    }

    const preferencesMet = [countryMet, studyAreaMet, affordable].filter(
      Boolean,
    ).length;
    const preferencePoints = preferencesMet * 10;
    const requirementPoints = eligible
      ? 70
      : Math.min(
          49,
          Math.round(
            40 *
              (totalRequirements === 0
                ? 1
                : requirementsMet / totalRequirements),
          ),
        );
    const score = eligible
      ? 70 + preferencePoints
      : Math.min(49, requirementPoints + preferencePoints);

    return {
      eligible,
      score: Math.max(0, Math.min(100, Math.round(score))),
      matchPercentage:
        totalRequirements === 0
          ? 100
          : Math.round((requirementsMet / totalRequirements) * 100),
      eligibilityStatus: eligible ? 'Eligible' : 'Not Eligible',
      matchingReasons,
      missingRequirements,
      unmetPreferences,
      scoreBreakdown: {
        requirementsMet,
        totalRequirements,
        preferencesMet,
        totalPreferences: 3,
        requirementPoints,
        preferencePoints,
      },
    };
  }

  /**
   * Evaluates open scholarships, sorts the complete list, assigns ranks,
   * and only then applies filters so rank remains stable after filtering.
   */
  getMatches(
    profile: StudentProfile,
    scholarships: Scholarship[],
    filters: MatchFilters = {},
  ): MatchList {
    const open = scholarships
      .filter((scholarship) => this.isOpen(scholarship))
      .map((scholarship) => ({
        ...scholarship,
        match: this.calculate(profile, scholarship),
        rank: 0,
      }))
      .sort((a, b) => {
        if (a.match.eligible !== b.match.eligible) {
          return a.match.eligible ? -1 : 1;
        }
        if (a.match.score !== b.match.score) {
          return b.match.score - a.match.score;
        }
        const deadlineDifference =
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        if (deadlineDifference !== 0) return deadlineDifference;
        return a.id - b.id;
      })
      .map((scholarship, index) => ({
        ...scholarship,
        rank: index + 1,
      }));

    const eligibleCount = open.filter((item) => item.match.eligible).length;
    const filtered = open.filter((item) => this.matchesFilters(item, filters));
    const filteredEligibleCount = filtered.filter(
      (item) => item.match.eligible,
    ).length;

    return {
      items: filtered,
      total: filtered.length,
      totalOpen: open.length,
      eligibleCount,
      filteredEligibleCount,
    };
  }

  private isOpen(scholarship: Scholarship): boolean {
    if (scholarship.deadlineStatus === 'closed') return false;
    // The deadline is considered valid through the end of its UTC date.
    const deadline = new Date(
      `${scholarship.deadline.slice(0, 10)}T23:59:59.999Z`,
    );
    return (
      !Number.isNaN(deadline.getTime()) && deadline.getTime() >= Date.now()
    );
  }

  private matchesFilters(
    scholarship: MatchedScholarship,
    filters: MatchFilters,
  ): boolean {
    if (
      filters.country &&
      !this.sameText(scholarship.preferences.country, filters.country)
    )
      return false;

    if (
      filters.fieldOfStudy &&
      !this.sameText(scholarship.preferences.fieldOfStudy, filters.fieldOfStudy)
    )
      return false;

    if (
      filters.educationLevel &&
      scholarship.requirements.requiredEducationLevel !== filters.educationLevel
    )
      return false;

    if (
      filters.fundingLevel &&
      scholarship.fundingLevel !== filters.fundingLevel
    )
      return false;

    if (filters.search) {
      const query = filters.search.trim().toLocaleLowerCase();
      const searchable = [
        scholarship.title,
        scholarship.preferences.country,
        scholarship.preferences.fieldOfStudy,
      ]
        .join(' ')
        .toLocaleLowerCase();
      if (!searchable.includes(query)) return false;
    }

    return true;
  }

  private sameText(left: string, right: string): boolean {
    return left.trim().toLocaleLowerCase() === right.trim().toLocaleLowerCase();
  }
}
