import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { FavoritesService } from './favorites.service.js';
import { ScholarshipViewsService } from '../scholarships/scholarship-views.service.js';

@Controller('favorites')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly viewsService: ScholarshipViewsService,
  ) {}

  @Get()
  findAll() {
    return this.viewsService.favorites();
  }

  @Post(':scholarshipId')
  create(@Param('scholarshipId', ParseIntPipe) id: number) {
    return this.favoritesService.create(id);
  }

  @Delete(':scholarshipId')
  remove(@Param('scholarshipId', ParseIntPipe) id: number) {
    return this.favoritesService.remove(id);
  }
}
