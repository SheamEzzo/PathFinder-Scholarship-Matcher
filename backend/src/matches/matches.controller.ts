import { Controller, Get, Query } from '@nestjs/common';
import { ScholarshipViewsService } from '../scholarships/scholarship-views.service.js';
import { FilterScholarshipsDto } from '../scholarships/dto/filter-scholarships.dto.js';

@Controller('matches')
export class MatchesController {
  constructor(private readonly viewsService: ScholarshipViewsService) {}

  /** Ranked results for the current profile (400 if there is no profile yet). */
  @Get()
  getMatches(@Query() filters: FilterScholarshipsDto) {
    return this.viewsService.matches(filters);
  }
}
