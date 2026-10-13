var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
var _a, _b, _c, _d;
import { Injectable } from '@nestjs/common';
import { FavoritesService } from '../favorites/favorites.service';
import { MatchesService } from '../matches/matches.service';
import { ProfileService } from '../profile/profile.service';
import { ScholarshipsService } from './scholarships.service';
let ScholarshipViewsService = class ScholarshipViewsService {
  scholarshipsService;
  profileService;
  matchesService;
  favoritesService;
  constructor(
    scholarshipsService,
    profileService,
    matchesService,
    favoritesService,
  ) {
    this.scholarshipsService = scholarshipsService;
    this.profileService = profileService;
    this.matchesService = matchesService;
    this.favoritesService = favoritesService;
  }
  present(scholarship, profile, today) {
    return {
      ...scholarship,
      deadlineStatus: this.scholarshipsService.deadlineStatus(
        scholarship,
        today,
      ),
      isFavorite: this.favoritesService.has(scholarship.id),
      match: profile
        ? this.matchesService.calculate(scholarship, profile)
        : null,
    };
  }
  findAll(filters) {
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
  findOne(id) {
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
  matches(filters) {
    const profile = this.profileService.requireProfile();
    const today = new Date().toISOString().slice(0, 10);
    const ranked = this.scholarshipsService
      .findAll()
      .filter(
        (scholarship) =>
          this.scholarshipsService.deadlineStatus(scholarship, today) ===
          'open',
      )
      .map((scholarship) => ({
        ...this.present(scholarship, profile, today),
        match: this.matchesService.calculate(scholarship, profile),
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
};
ScholarshipViewsService = __decorate(
  [
    Injectable(),
    __metadata('design:paramtypes', [
      typeof (_a =
        typeof ScholarshipsService !== 'undefined' && ScholarshipsService) ===
      'function'
        ? _a
        : Object,
      typeof (_b = typeof ProfileService !== 'undefined' && ProfileService) ===
      'function'
        ? _b
        : Object,
      typeof (_c = typeof MatchesService !== 'undefined' && MatchesService) ===
      'function'
        ? _c
        : Object,
      typeof (_d =
        typeof FavoritesService !== 'undefined' && FavoritesService) ===
      'function'
        ? _d
        : Object,
    ]),
  ],
  ScholarshipViewsService,
);
export { ScholarshipViewsService };
//# sourceMappingURL=scholarship-views.service.js.map
