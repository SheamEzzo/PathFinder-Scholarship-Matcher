import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller.js';
import { MatchesService } from './matches.service.js';
import { ScholarshipDataModule } from '../scholarships/scholarship-data.module.js';

@Module({
  imports: [ScholarshipDataModule],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
