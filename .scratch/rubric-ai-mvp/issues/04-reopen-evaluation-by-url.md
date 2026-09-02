# 04: Reopen a finished Evaluation directly by URL

**What to build:** `/evaluations/:evaluationId` becomes reload-safe. When that route loads with no
in-memory `POST` response available — a fresh page load, a reload after a successful submission,
or a direct link — it fetches the Evaluation via `GET /api/evaluations/{id}` (mocked per the
contract in the spec; this endpoint doesn't exist on the real backend yet) and renders the same
Result view used in ticket 02.

**Blocked by:** 02

**Status:** ready-for-agent

- [x] Reloading the browser on `/evaluations/:evaluationId` right after a successful submission
      shows the same completed Result view again, fetched via `GET /api/evaluations/{id}`
- [x] Navigating directly to `/evaluations/:evaluationId` for a known id (no prior submission in
      this session) renders the same Result view
- [x] The rendered content and advisory framing (Level as a named quality, Suggested grade marked
      advisory) match ticket 02's rules exactly — one Result view, two entry paths

## Comments

Implemented: `ResultPage` now only trusts router state (`location.state?.evaluation`) as the
immediate post-submit render path from ticket 02. Whenever that state is absent — a fresh load, a
reload, or a direct link — a new `useEvaluation` hook (`src/features/result/useEvaluation.js`, a
thin `useQuery` wrapper around the existing `getEvaluation` client call, `retry: false` so failures
surface immediately rather than after TanStack Query's default retry budget) fetches the Evaluation
via `GET /api/evaluations/{id}`. Both paths render through the same extracted `EvaluationView`
component, so the rendering rules from ticket 02 (Level as a named quality, Suggested grade always
marked advisory, Label lookup) apply identically regardless of entry path.

Also handled, since the real `GET /api/evaluations/{id}` contract (`docs/api/api.md`) defines
failure cases and leaving them unhandled would render a bare heading: a loading state while the
fetch is in flight, a non-retryable "no evaluation exists" message for both `404
evaluation_not_found` and the undocumented-by-design `400` malformed-id case (per `docs/api/api.md`
neither is fixed by retrying), and a retryable inline error (reusing the existing `ErrorBox`) for
any other failure.

Standards and Spec review (two parallel sub-agents) both came back clean on hard violations. Spec
review caught one real bug: the first pass keyed the non-retryable branch off HTTP status `404`
alone, so a `400` malformed-id response fell into the generic "you can try again" branch with a
Retry button that would deterministically fail again — fixed to also treat `400` (and, per the
Standards review's note that this codebase already keys error branching off the domain `code` field
rather than raw status, `evaluation_not_found` by `code`) as unresolvable. Two minor DRY nits from
the Standards pass were also applied: a `isFetchPath` local replacing a `!submittedEvaluation` guard
repeated three times, and a shared `renderAt` test helper factoring out the duplicated
`QueryClientProvider > MemoryRouter > Routes` scaffold between `renderResult` and
`renderResultAtUrl`.

`npm test` (31 tests, 10 in `ResultPage.test.jsx` covering both entry paths, the loading state, and
all three fetch-failure shapes), `npm run lint`, and `npm run build` all pass.
