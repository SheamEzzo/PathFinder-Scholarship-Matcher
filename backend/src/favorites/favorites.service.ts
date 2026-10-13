import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ScholarshipsService } from '../scholarships/scholarships.service.js';

@Injectable()
export class FavoritesService {
  private readonly favoriteIds = new Set<number>();

  constructor(private readonly scholarshipsService: ScholarshipsService) {}

  has(id: number): boolean {
    return this.favoriteIds.has(id);
  }

  findAll(): number[] {
    return [...this.favoriteIds];
  }

  create(id: number) {
    this.scholarshipsService.findOne(id);

    if (this.favoriteIds.has(id))
      throw new ConflictException(
        'This scholarship is already saved in favorites.',
      );

    this.favoriteIds.add(id);

    return {
      scholarshipId: id,
      isFavorite: true,
      message: 'Scholarship added to favorites.',
    };
  }

  remove(id: number) {
    this.scholarshipsService.findOne(id);

    if (!this.favoriteIds.delete(id))
      throw new NotFoundException('This scholarship is not in favorites.');

    return {
      scholarshipId: id,
      isFavorite: false,
      message: 'Scholarship removed from favorites.',
    };
  }
}
