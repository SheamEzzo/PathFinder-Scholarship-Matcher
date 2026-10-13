import { Module } from '@nestjs/common';
import { ProfileModule } from '../profile/profile.module.js';
import { MatchesService } from '../matches/matches.service.js';
import { FavoritesService } from '../favorites/favorites.service.js';
import { ScholarshipsService } from './scholarships.service.js';
import { ScholarshipViewsService } from './scholarship-views.service.js';

@Module({
  imports: [ProfileModule],
  providers: [
    ScholarshipsService,
    MatchesService,
    FavoritesService,
    ScholarshipViewsService,
  ],
  exports: [ScholarshipViewsService, FavoritesService],
})
export class ScholarshipDataModule {}
