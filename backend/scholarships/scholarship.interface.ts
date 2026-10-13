import { EducationLevel, FundingLevel } from '../common/types';

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
}
