import { Module } from '@nestjs/common';
import { ScholarshipsController } from './scholarships.controller.js';
import { ScholarshipDataModule } from './scholarship-data.module.js';

@Module({
  imports: [ScholarshipDataModule],
  controllers: [ScholarshipsController],
})
export class ScholarshipsModule {}
