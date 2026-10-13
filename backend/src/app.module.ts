import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { MatchesModule } from './matches/matches.module.js';
import { ProfileModule } from './profile/profile.module.js';
import { FavoritesModule } from './favorites/favorites.module.js';
import { ScholarshipsModule } from './scholarships/scholarships.module.js';
export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'backend',
    }),
    MatchesModule,
    ProfileModule,
    FavoritesModule,
    ScholarshipsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
