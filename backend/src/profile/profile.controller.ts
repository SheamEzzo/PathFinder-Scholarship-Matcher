import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ProfileService } from './profile.service.js';
import { CreateProfileDto } from './dto/create-profile.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  findOne() {
    return { profile: this.profileService.findOne() };
  }

  @Post()
  create(@Body() dto: CreateProfileDto) {
    return this.profileService.create(dto);
  }

  @Patch()
  update(@Body() dto: UpdateProfileDto) {
    return this.profileService.update(dto);
  }
}
