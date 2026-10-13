import { Injectable } from '@nestjs/common';
import {
  calculateMatch,
  type MatchProfile,
  type MatchResult,
  type MatchScholarship,
} from './match-calculator.js';

export type { MatchResult } from './match-calculator.js';

/**
 * Thin Nest wrapper around the pure calculator. Every screen gets its match
 * through this single method, so results are identical everywhere.
 */
@Injectable()
export class MatchesService {
  calculate(profile: MatchProfile, scholarship: MatchScholarship): MatchResult {
    return calculateMatch(profile, scholarship);
  }
}
