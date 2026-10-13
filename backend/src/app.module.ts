import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { MatchesModule } from './matches/matches.module.js';
import { ProfileModule } from './profile/profile.module.js';
import { FavoritesModule } from './favorites/favorites.module.js';
import { ScholarshipsModule } from './scholarships/scholarships.module.js';

@Module({
  imports: [MatchesModule, ProfileModule, FavoritesModule, ScholarshipsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
