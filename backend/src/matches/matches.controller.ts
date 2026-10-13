import { Controller, Get, Query } from '@nestjs/common';
import { MatchesService, MatchFilters, StudentProfile, Scholarship } from './matches.service.js';

/**
 * Thin HTTP layer. Connect getMatches() to the project's actual profile and
 * scholarship-view data source when those services are available.
 */
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  getMatches(@Query() _query: Record<string, string>) {
    // This scaffold deliberately does not invent a profile or scholarship seed.
    // The actual project integration should obtain both from existing services.
    return {
      items: [],
      total: 0,
      totalOpen: 0,
      eligibleCount: 0,
      filteredEligibleCount: 0,
      message:
        'Connect MatchesController to the existing profile and scholarship view services.',
    };
  }
}
