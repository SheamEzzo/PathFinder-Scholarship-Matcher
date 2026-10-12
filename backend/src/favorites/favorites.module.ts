import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller.js';
import { ScholarshipDataModule } from '../scholarships/scholarship-data.module';

@Module({
  imports: [ScholarshipDataModule],
  controllers: [FavoritesController],
})
export class FavoritesModule {}
