import { FavoritesService } from '../favorites/favorites.service';
import { MatchesService } from '../matches/matches.service';
import { ProfileService } from '../profile/profile.service';
import { ScholarshipsService } from './scholarships.service';
import { FilterScholarshipsDto } from './dto/filter-scholarships.dto';
export declare class ScholarshipViewsService {
  private readonly scholarshipsService;
  private readonly profileService;
  private readonly matchesService;
  private readonly favoritesService;
  constructor(
    scholarshipsService: ScholarshipsService,
    profileService: ProfileService,
    matchesService: MatchesService,
    favoritesService: FavoritesService,
  );
  private present;
  findAll(filters: FilterScholarshipsDto): {
    items: any;
    total: any;
    message: string | null;
  };
  findOne(id: number): any;
  favorites(): {
    items: any;
    total: any;
    message: string | null;
  };
  matches(filters: FilterScholarshipsDto): {
    items: any;
    total: any;
    totalOpen: any;
    eligibleCount: any;
    filteredEligibleCount: any;
    message: string | null;
    filterMessage: string | null;
  };
}
