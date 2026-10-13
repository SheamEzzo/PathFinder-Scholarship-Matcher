import { Module } from '@nestjs/common';
import { ScholarshipsController } from './scholarships.controller';
import { ScholarshipDataModule } from './scholarship-data.module';

@Module({
  imports: [ScholarshipDataModule],
  controllers: [ScholarshipsController],
})
export class ScholarshipsModule {}
