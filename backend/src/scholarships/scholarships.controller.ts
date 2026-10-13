import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ScholarshipViewsService } from './scholarship-views.service.js';
import { FilterScholarshipsDto } from './dto/filter-scholarships.dto.js';

@Controller('scholarships')
export class ScholarshipsController {
  constructor(private readonly viewsService: ScholarshipViewsService) {}

  @Get()
  findAll(@Query() filters: FilterScholarshipsDto) {
    return this.viewsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.viewsService.findOne(id);
  }
}
