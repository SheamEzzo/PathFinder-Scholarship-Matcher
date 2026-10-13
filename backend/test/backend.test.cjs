const { test, before, after, mock } = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../dist/setup');
const { MatchesService } = require('../dist/matches/matches.service');
const { ScholarshipsService } = require('../dist/scholarships/scholarships.service');
const { seedScholarships } = require('../dist/scholarships/data/scholarships.seed');

const lina = {
  age: 22, currentFieldOfStudy: 'Computer Science', currentEducationLevel: 'bachelor',
  languages: ['Arabic', 'English'], budget: 0,
  preferredCountries: ['Germany', 'Canada'], preferredStudyAreas: ['Computer Science'],
};
let app, base;
before(async () => {
  // A fixed calendar date makes seeded deadline tests reproducible in later years.
  mock.timers.enable({ apis: ['Date'], now: new Date('2026-10-09T12:00:00Z') });
  app = await createApp(); await app.listen(0, '127.0.0.1'); base = (await app.getUrl()) + '/api';
});
after(async () => { await app?.close(); mock.timers.reset(); });

async function request(path, method = 'GET', body) {
  const response = await fetch(base + path, {
    method, headers: { 'Content-Type': 'application/json' },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return { status: response.status, data: await response.json() };
}

test('seed coverage, browsing, combined filters, missing IDs and invalid queries', async () => {
  const { data, status } = await request('/scholarships');
  assert.equal(status, 200);
  assert.ok(data.total >= 15);
  assert.ok(new Set(data.items.map(s => s.country)).size >= 5);
  assert.ok(new Set(data.items.map(s => s.studyLevel)).size >= 3);
  assert.ok(new Set(data.items.map(s => s.requiredEducationLevel)).size >= 3);
  assert.ok(new Set(data.items.map(s => s.fundingLevel)).size >= 3);
  assert.ok(data.items.some(s => s.ageRestriction));
  assert.equal(data.items.find(s => s.id === 16).deadlineStatus, 'closed');
  assert.ok(data.items.every(s => s.match === null));
  const filtered = await request('/scholarships?country=germany&fieldOfStudy=computer%20science&educationLevel=bachelor&fundingLevel=fully_funded');
  assert.ok(filtered.data.total > 0);
  assert.ok(filtered.data.items.every(s => s.country === 'Germany' && s.fundingLevel === 'fully_funded' && s.requiredEducationLevel === 'bachelor'));
  assert.match((await request('/scholarships?country=Nowhere')).data.message, /No scholarships/);
  assert.equal((await request('/scholarships/999')).status, 404);
  assert.equal((await request('/scholarships/abc')).status, 400);
  assert.equal((await request('/scholarships?fundingLevel=invalid')).status, 400);
  assert.equal((await request('/scholarships?country=Germany&country=Canada')).status, 400);
  assert.equal((await request('/scholarships?unknown=1')).status, 400);
});

test('profile validation, ranking, changes, consistency and favorites through HTTP', async () => {
  assert.deepEqual((await request('/profile')).data, { profile: null });
  const missing = await request('/matches');
  assert.equal(missing.status, 400);
  assert.match(missing.data.message, /age.*languages.*budget/);
  assert.equal((await request('/profile', 'PATCH', { age: 23 })).status, 404);
  for (const body of [
    {}, { ...lina, age: 3 }, { ...lina, age: 150 }, { ...lina, age: 0 },
    { ...lina, age: 22.5 }, { ...lina, budget: -1 }, { ...lina, budget: '100' },
    { ...lina, languages: [] }, { ...lina, languages: ['   '] },
    { ...lina, languages: ['English', ' english '] },
    { ...lina, preferredCountries: [] }, { ...lina, preferredStudyAreas: [] },
    { ...lina, currentFieldOfStudy: ' ' }, { ...lina, currentFieldOfStudy: 7 },
    { ...lina, currentEducationLevel: 'unknown' }, { ...lina, extra: true },
  ]) {
    const response = await request('/profile', 'POST', body);
    assert.equal(response.status, 400, JSON.stringify(body));
    assert.ok(response.data.message.length > 0);
  }
  assert.equal((await request('/profile', 'POST', { ...lina, currentFieldOfStudy: ' Computer Science ' })).status, 201);
  assert.equal((await request('/profile')).data.profile.currentFieldOfStudy, 'Computer Science');
  assert.equal((await request('/profile', 'POST', lina)).status, 409);
  const first = (await request('/matches')).data;
  assert.deepEqual((await request('/matches')).data, first);
  assert.equal(first.totalOpen, 15);
  assert.equal(first.items[0].id, 1);
  assert.equal(first.items[0].match.matchPercentage, 100);
  assert.ok(!first.items.some(s => s.id === 16));
  assert.equal(first.eligibleCount, first.items.filter(s => s.match.eligible).length);
  let ineligibleSeen = false;
  for (let i = 0; i < first.items.length; i++) {
    const item = first.items[i];
    assert.equal(item.rank, i + 1);
    assert.ok(item.match.matchPercentage >= 0 && item.match.matchPercentage <= 100);
    if (!item.match.eligible) {
      ineligibleSeen = true;
      assert.ok(item.match.matchPercentage <= 49);
      assert.ok(item.match.missingRequirements.length > 0);
    } else { assert.equal(ineligibleSeen, false); }
    if (i > 0) {
      const previous = first.items[i - 1];
      assert.ok(previous.match.matchPercentage >= item.match.matchPercentage);
      if (previous.match.matchPercentage === item.match.matchPercentage) {
        assert.ok(previous.applicationDeadline <= item.applicationDeadline);
      }
    }
    assert.deepEqual((await request(`/scholarships/${item.id}`)).data.match, item.match);
  }
  const narrowed = (await request('/matches?country=Germany&fundingLevel=fully_funded')).data;
  assert.deepEqual(narrowed.items, first.items.filter(s => s.country === 'Germany' && s.fundingLevel === 'fully_funded'));
  assert.equal(narrowed.eligibleCount, first.eligibleCount);
  assert.match((await request('/matches?country=Nowhere')).data.message, /No scholarships/);

  assert.match((await request('/favorites')).data.message, /No favorites/);
  assert.equal((await request('/favorites/999', 'POST')).status, 404);
  assert.equal((await request('/favorites/1', 'POST')).status, 201);
  assert.equal((await request('/favorites/1', 'POST')).status, 409);
  assert.equal((await request('/favorites')).data.total, 1);
  assert.equal((await request('/scholarships/1')).data.isFavorite, true);
  assert.equal((await request('/scholarships')).data.items.find(s => s.id === 1).isFavorite, true);
  assert.equal((await request('/matches')).data.items.find(s => s.id === 1).isFavorite, true);
  assert.deepEqual((await request('/favorites')).data.items[0].match, first.items[0].match);
  assert.equal((await request('/profile', 'PATCH', { languages: ['Arabic', 'English', 'French'] })).status, 200);
  assert.equal((await request('/scholarships/3')).data.match.eligible, true);
  assert.equal((await request('/matches')).data.items.find(s => s.id === 3).match.eligible, true);
  assert.equal((await request('/scholarships/4')).data.match.eligible, false);
  assert.equal((await request('/profile', 'PATCH', { currentEducationLevel: 'master' })).status, 200);
  assert.equal((await request('/scholarships/4')).data.match.eligible, true);
  const oldBudgetScore = (await request('/scholarships/8')).data.match.matchPercentage;
  assert.equal((await request('/profile', 'PATCH', { budget: 14000, preferredCountries: ['Italy'] })).status, 200);
  assert.equal((await request('/scholarships/8')).data.match.scoreBreakdown.preferencePoints, 20);
  assert.equal((await request('/favorites')).data.items[0].match.matchPercentage, 90);
  assert.equal((await request('/scholarships/8')).data.match.matchPercentage, oldBudgetScore);
  for (const body of [{}, { age: null }, { languages: null }, { budget: -10 }, { extra: 1 }]) {
    assert.equal((await request('/profile', 'PATCH', body)).status, 400);
  }
  assert.equal((await request('/profile')).data.profile.budget, 14000);
  assert.equal((await request('/favorites/1', 'DELETE')).status, 200);
  assert.equal((await request('/favorites')).data.total, 0);
  assert.equal((await request('/favorites/1', 'DELETE')).status, 404);
  assert.equal((await request('/scholarships/1')).data.isFavorite, false);
  assert.equal((await request('/favorites/16', 'POST')).status, 201);
  assert.equal((await request('/favorites')).data.items[0].deadlineStatus, 'closed');

  await request('/profile', 'PATCH', { currentFieldOfStudy: 'History' });
  const none = (await request('/matches')).data;
  assert.equal(none.eligibleCount, 0);
  assert.equal(none.total, 15);
  assert.match(none.message, /None.*fully eligible/);
});

test('funding, age boundaries, language AND, degree hierarchy, score explanations and deadline boundaries', () => {
  const service = new MatchesService();
  const scholarships = new ScholarshipsService();
  const full = service.calculate(seedScholarships[0], lina);
  const partial = service.calculate(seedScholarships[6], lina);
  const tuition = service.calculate(seedScholarships[7], lina);
  assert.ok(full.matchPercentage > partial.matchPercentage);
  assert.ok(full.matchPercentage > tuition.matchPercentage);
  assert.equal(service.calculate(seedScholarships[7], { ...lina, budget: 14000 }).matchPercentage, 100);
  assert.equal(service.calculate(seedScholarships[0], { ...lina, age: 35 }).eligible, true);
  assert.equal(service.calculate(seedScholarships[0], { ...lina, age: 36 }).eligible, false);
  assert.equal(service.calculate(seedScholarships[8], lina).eligible, false);
  assert.equal(service.calculate(seedScholarships[8], { ...lina, languages: ['English', 'Japanese'] }).eligible, true);
  assert.equal(service.calculate(seedScholarships[3], lina).eligible, false);
  assert.equal(service.calculate(seedScholarships[3], { ...lina, currentEducationLevel: 'master' }).eligible, true);
  for (const scholarship of seedScholarships) {
    for (const profile of [lina, { ...lina, age: 70, currentEducationLevel: 'high_school', languages: ['Arabic'] }]) {
      const match = service.calculate(scholarship, profile);
      const raw = match.scoreBreakdown.eligibilityPoints + match.scoreBreakdown.preferencePoints;
      assert.equal(match.matchPercentage, match.eligible ? raw : Math.min(49, raw));
      assert.equal(match.eligible, match.missingRequirements.length === 0);
      assert.equal(match.unmetPreferences.length, match.preferences.filter(p => !p.met).length);
    }
  }
  assert.equal(scholarships.deadlineStatus(seedScholarships[0], '2027-03-15'), 'open');
  assert.equal(scholarships.deadlineStatus(seedScholarships[0], '2027-03-16'), 'closed');
});

test('a new application instance starts with empty profile and favorites', async () => {
  const fresh = await createApp();
  try {
    await fresh.listen(0, '127.0.0.1');
    const url = (await fresh.getUrl()) + '/api';
    assert.deepEqual(await (await fetch(url + '/profile')).json(), { profile: null });
    assert.equal((await (await fetch(url + '/favorites')).json()).total, 0);
  } finally { await fresh.close(); }
});
