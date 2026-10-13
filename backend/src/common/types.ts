export enum EducationLevel {
  HIGH_SCHOOL = 'high_school',
  BACHELOR = 'bachelor',
  MASTER = 'master',
  PHD = 'phd',
}

export enum FundingLevel {
  TUITION_ONLY = 'tuition_only',
  PARTIALLY_FUNDED = 'partially_funded',
  FULLY_FUNDED = 'fully_funded',
}

export const normalize = (value: string): string =>
  value.trim().toLocaleLowerCase();

export const includesValue = (values: string[], value: string): boolean =>
  values.some((item) => normalize(item) === normalize(value));
