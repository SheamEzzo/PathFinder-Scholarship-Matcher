export type EducationLevel = "high_school" | "bachelor" | "master" | "phd";
export type FundingLevel = "fully_funded" | "partially_funded" | "tuition_only";
export interface Profile {
  age: number;
  currentFieldOfStudy: string;
  currentEducationLevel: EducationLevel;
  languages: string[];
  budget: number;
  preferredCountries: string[];
  preferredStudyAreas: string[];
}
export interface Condition {
  key: string;
  met: boolean;
  message: string;
}
export interface Match {
  matchPercentage: number;
  eligible: boolean;
  eligibilityStatus: "Eligible" | "Not eligible";
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
export interface Scholarship {
  id: number;
  title: string;
  country: string;
  institution: string;
  eligibleFieldsOfStudy: string[];
  studyLevel: EducationLevel;
  requiredEducationLevel: EducationLevel;
  languageRequirements: string[];
  ageRestriction: { min?: number; max?: number } | null;
  fundingLevel: FundingLevel;
  estimatedAnnualCost: number;
  applicationDeadline: string;
  description: string;
  deadlineStatus: "open" | "closed";
  isFavorite: boolean;
  match: Match | null;
  rank?: number;
}
export interface ScholarshipList {
  items: Scholarship[];
  total: number;
  message: string | null;
}
export interface MatchList extends ScholarshipList {
  totalOpen: number;
  eligibleCount: number;
  filteredEligibleCount: number;
  filterMessage: string | null;
}
export interface Filters {
  country: string;
  fieldOfStudy: string;
  educationLevel: string;
  fundingLevel: string;
}
export const emptyFilters: Filters = {
  country: "",
  fieldOfStudy: "",
  educationLevel: "",
  fundingLevel: "",
};
export const educationLabels: Record<EducationLevel, string> = {
  high_school: "High school",
  bachelor: "Bachelor’s",
  master: "Master’s",
  phd: "PhD",
};
export const fundingLabels: Record<FundingLevel, string> = {
  fully_funded: "Fully funded",
  partially_funded: "Partially funded",
  tuition_only: "Tuition only",
};
export const dateLabel = (value: string) =>
  new Date(value + "T12:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
export const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
