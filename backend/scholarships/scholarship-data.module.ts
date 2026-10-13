import { Module } from '@nestjs/common';
import { ProfileModule } from '../profile/profile.module';
import { MatchesService } from '../matches/matches.service';
import { FavoritesService } from '../favorites/favorites.service';
import { ScholarshipsService } from './scholarships.service';
import { ScholarshipViewsService } from './scholarship-views.service';

@Module({
  imports: [ProfileModule],
  providers: [ScholarshipsService, MatchesService, FavoritesService, ScholarshipViewsService],
  exports: [ScholarshipViewsService, FavoritesService],
})
export class ScholarshipDataModule {}
