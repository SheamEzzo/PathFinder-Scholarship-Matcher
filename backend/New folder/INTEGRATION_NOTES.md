# Pathy matching files — integration notes

## Important limitation
The uploaded `backend.rar` is a NestJS starter only. It does not contain the existing
Pathy scholarship/profile/view services described in the PDF. Therefore the service
here is self-contained, but the controller intentionally returns an empty response
until connected to the real data source. Do not present this controller as fully
integrated with the application.

## Files to add
- `src/matches/matches.service.ts`
- `src/matches/matches.controller.ts`
- `src/matches/matches.module.ts`
- `test/backend.test.cjs`

## Change `src/app.module.ts`
Add this import with the other imports:

```ts
import { MatchesModule } from './matches/matches.module.js';
```

Then add `MatchesModule` to the `imports` array, preserving the existing `ObserveModule.forRoot(...)` entry:

```ts
imports: [
  ObserveModule.forRoot({
    appKey: 'YOUR_APP_KEY',
    appSecret: 'YOUR_APP_SECRET',
    serviceId: 'backend',
  }),
  MatchesModule,
],
```

Do not delete `AppController`, `AppService`, or Observe setup.

## Build and test
The test file uses Node's built-in test runner and imports compiled output.
Run the build first, then:

```bash
npm run build
node --test test/backend.test.cjs
```

If the existing project uses a different build output directory or test command,
adjust the test import/command to match its package scripts.

## Before merging
1. Connect `MatchesController` to the actual profile and scholarship data services.
2. The PDF specifically says matching behavior is owned inside
   `scholarship-views.service.ts`; coordinate with that shared-file owner before
   duplicating or moving scoring logic. Keep a single scoring source of truth.
3. Confirm the project's real field names and enum values. The types in this package
   are standalone examples based on the PDF, not proof of the absent project's exact
   interfaces.
4. The PDF also asks for the fixed test date 9 October 2026. For full integration,
   inject/use a controlled clock in the matching/view service rather than depending
   on the machine's current date.
