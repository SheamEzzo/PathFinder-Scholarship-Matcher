import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

export interface StudentProfile extends CreateProfileDto {}

@Injectable()
export class ProfileService {
  private profile: StudentProfile | null = null;

  findOne(): StudentProfile | null {
    return this.profile;
  }

  requireProfile(): StudentProfile {
    if (!this.profile) {
      throw new BadRequestException(
        'Complete your profile first: age, currentFieldOfStudy, currentEducationLevel, languages, budget, preferredCountries and preferredStudyAreas are required.',
      );
    }
    return this.profile;
  }

  create(dto: CreateProfileDto): StudentProfile {
    if (this.profile)
      throw new ConflictException(
        'A profile already exists. Use PATCH /profile to edit it.',
      );
    this.profile = { ...dto };
    return this.profile;
  }

  update(dto: UpdateProfileDto): StudentProfile {
    if (!this.profile)
      throw new NotFoundException(
        'Profile not found. Create your profile first.',
      );

    if (
      !dto ||
      typeof dto !== 'object' ||
      Array.isArray(dto) ||
      Object.keys(dto).length === 0
    ) {
      throw new BadRequestException(
        'Provide at least one profile field to update.',
      );
    }

    this.profile = { ...this.profile, ...dto };
    return this.profile;
  }
}
