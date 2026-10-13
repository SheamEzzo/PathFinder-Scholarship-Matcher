import { Injectable } from '@nestjs/common';
import { FavoritesService } from '../favorites/favorites.service.js';
import { MatchesService } from '../matches/matches.service.js';
import { ProfileService, StudentProfile } from '../profile/profile.service.js';
import { ScholarshipsService } from './scholarships.service.js';
import { Scholarship } from './scholarship.interface.js';
import { FilterScholarshipsDto } from './dto/filter-scholarships.dto.js';

@Injectable()
export class ScholarshipViewsService {
  constructor(
    private readonly scholarshipsService: ScholarshipsService,
    private readonly profileService: ProfileService,
    private readonly matchesService: MatchesService,
    private readonly favoritesService: FavoritesService,
  ) {}

  private present(
    scholarship: Scholarship,
    profile: StudentProfile | null,
    today: string,
  ) {
    return {
      ...scholarship,
      deadlineStatus: this.scholarshipsService.deadlineStatus(
        scholarship,
        today,
      ),
      isFavorite: this.favoritesService.has(scholarship.id),
      match: profile
        ? this.matchesService.calculateForScholarship(profile, scholarship)
        : null,
    };
  }

  findAll(filters: FilterScholarshipsDto) {
    const profile = this.profileService.findOne();
    const today = new Date().toISOString().slice(0, 10);
    const items = this.scholarshipsService
      .findAll()
      .filter((scholarship) =>
        this.scholarshipsService.matchesFilters(scholarship, filters),
      )
      .map((scholarship) => this.present(scholarship, profile, today));
    return {
      items,
      total: items.length,
      message: items.length ? null : 'No scholarships match these filters.',
    };
  }

  findOne(id: number) {
    return this.present(
      this.scholarshipsService.findOne(id),
      this.profileService.findOne(),
      new Date().toISOString().slice(0, 10),
    );
  }

  favorites() {
    const profile = this.profileService.findOne();
    const today = new Date().toISOString().slice(0, 10);
    const items = this.favoritesService
      .findAll()
      .map((id) =>
        this.present(this.scholarshipsService.findOne(id), profile, today),
      );
    return {
      items,
      total: items.length,
      message: items.length ? null : 'No favorites saved yet.',
    };
  }

  matches(filters: FilterScholarshipsDto) {
    const profile = this.profileService.requireProfile();
    const today = new Date().toISOString().slice(0, 10);
    // Compute and rank BEFORE filtering; filters only hide existing results.
    const ranked = this.scholarshipsService
      .findAll()
      .filter(
        (scholarship) =>
          this.scholarshipsService.deadlineStatus(scholarship, today) ===
          'open',
      )
      .map((scholarship) => ({
        ...this.present(scholarship, profile, today),
        match: this.matchesService.calculateForScholarship(
          profile,
          scholarship,
        ),
      }))
      .sort(
        (a, b) =>
          Number(b.match.eligible) - Number(a.match.eligible) ||
          b.match.matchPercentage - a.match.matchPercentage ||
          a.applicationDeadline.localeCompare(b.applicationDeadline) ||
          a.id - b.id,
      )
      .map((scholarship, index) => ({ ...scholarship, rank: index + 1 }));
    const items = ranked.filter((scholarship) =>
      this.scholarshipsService.matchesFilters(scholarship, filters),
    );
    const eligibleCount = ranked.filter(
      (scholarship) => scholarship.match.eligible,
    ).length;
    return {
      items,
      total: items.length,
      totalOpen: ranked.length,
      eligibleCount,
      filteredEligibleCount: items.filter(
        (scholarship) => scholarship.match.eligible,
      ).length,
      message:
        ranked.length === 0
          ? 'No open scholarships are currently available.'
          : eligibleCount === 0
            ? 'None of the open scholarships are fully eligible for your profile.'
            : items.length === 0
              ? 'No scholarships match these filters.'
              : null,
      filterMessage:
        items.length === 0 ? 'No scholarships match these filters.' : null,
    };
  }
}
