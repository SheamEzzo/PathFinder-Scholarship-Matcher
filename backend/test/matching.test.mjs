// Run after `npm run build` from the backend folder:  node test/matching.test.mjs
import assert from 'node:assert/strict';
import { seedScholarships as seed } from '../dist/scholarships/data/scholarships.seed.js';
import { calculateMatch as calc } from '../dist/matches/match-calculator.js';

const lina = { age: 22, currentFieldOfStudy: 'Computer Science', currentEducationLevel: 'bachelor',
  languages: ['Arabic', 'English'], budget: 0, preferredCountries: ['Germany', 'Canada'],
  preferredStudyAreas: ['Computer Science'] };
const byId = (id) => seed.find((s) => s.id === id);
const today = new Date().toISOString().slice(0, 10);
const ranked = seed.filter((s) => s.applicationDeadline >= today)
  .map((s) => ({ s, m: calc(lina, s) }))
  .sort((a, b) => Number(b.m.eligible) - Number(a.m.eligible) || b.m.matchPercentage - a.m.matchPercentage
    || a.s.applicationDeadline.localeCompare(b.s.applicationDeadline) || a.s.id - b.s.id);

assert.equal(ranked[0].s.id, 1);                                             // best match on top
assert.ok(ranked.filter((x) => !x.m.eligible).every((x) => x.m.matchPercentage <= 49)); // rule 4
assert.ok(ranked.filter((x) => x.m.eligible).every((x) => x.m.matchPercentage >= 60));  // rule 3
assert.match(calc(lina, byId(3)).missingRequirements.join(' '), /French/);   // French missing
assert.equal(calc(lina, byId(4)).eligible, false);                           // PhD needs master
assert.equal(calc({ ...lina, languages: ['English', 'Japanese'] }, byId(9)).eligible, true); // flow D
assert.equal(calc({ ...lina, age: 36 }, byId(1)).eligible, false);           // age limit 35
const poor = { ...lina, budget: 500, preferredCountries: ['Germany'] };       // rule 6
assert.ok(calc(poor, byId(2)).matchPercentage > calc(poor, { ...byId(8), estimatedAnnualCost: 15000 }).matchPercentage);
assert.deepEqual(calc(lina, byId(1)), calc(lina, byId(1)));                  // determinism
console.log('matching tests passed');
