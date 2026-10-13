import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { EducationLevel, FundingLevel } from '../../common/types.js';
import { Trim } from '../../common/transforms.js';

export class FilterScholarshipsDto {
  @ValidateIf((_, value) => value !== undefined)
  @Trim()
  @IsString()
  @IsNotEmpty()
  country?: string;

  @ValidateIf((_, value) => value !== undefined)
  @Trim()
  @IsString()
  @IsNotEmpty()
  fieldOfStudy?: string;

  // This filters the minimum CURRENT qualification, not the degree awarded.
  @ValidateIf((_, value) => value !== undefined)
  @IsEnum(EducationLevel)
  educationLevel?: EducationLevel;

  @ValidateIf((_, value) => value !== undefined)
  @IsEnum(FundingLevel)
  fundingLevel?: FundingLevel;
}
