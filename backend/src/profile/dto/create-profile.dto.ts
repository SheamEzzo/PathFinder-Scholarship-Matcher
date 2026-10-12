import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { EducationLevel } from '../../common/types.js';
import { Trim, TrimItems } from '../../common/transforms.js';

const caseInsensitiveKey = (item: unknown) =>
  typeof item === 'string' ? item.toLowerCase() : item;

export class CreateProfileDto {
  @IsInt({ message: 'Age must be a whole number.' })
  @Min(16, { message: 'Age must be at least 16.' })
  @Max(100, { message: 'Age must not exceed 100.' })
  age: number;

  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'Current field of study is required.' })
  currentFieldOfStudy: string;

  @IsEnum(EducationLevel, {
    message:
      'Current education level must be high_school, bachelor, master or phd.',
  })
  currentEducationLevel: EducationLevel;

  @TrimItems()
  @IsArray()
  @ArrayNotEmpty({ message: 'Select at least one language.' })
  @ArrayUnique(caseInsensitiveKey)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  languages: string[];

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Budget must be a finite number in USD per year.' },
  )
  @Min(0, { message: 'Budget cannot be negative.' })
  budget: number;

  @TrimItems()
  @IsArray()
  @ArrayNotEmpty({ message: 'Select at least one preferred country.' })
  @ArrayUnique(caseInsensitiveKey)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  preferredCountries: string[];

  @TrimItems()
  @IsArray()
  @ArrayNotEmpty({ message: 'Select at least one preferred study area.' })
  @ArrayUnique(caseInsensitiveKey)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  preferredStudyAreas: string[];
}
