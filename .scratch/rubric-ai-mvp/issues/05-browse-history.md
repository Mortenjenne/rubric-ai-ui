# 05: Browse past Evaluations in History

**What to build:** The History view fetches `GET /api/evaluations` (mocked per the contract in the
spec; unpaginated, sorted newest first) and lists past Evaluations, each row showing when it was
created, its overall assessment, and its Suggested grade (marked advisory, same rendering rule as
the Result view). Each row also shows the Label from `localStorage` when one was saved for that
`evaluationId`. Clicking a row navigates to `/evaluations/:evaluationId`, landing on the same
Result view built in ticket 04.

**Blocked by:** 04

**Status:** ready-for-agent

- [x] Visiting `/history` with several mocked past Evaluations shows one row per Evaluation,
      newest first, each showing its timestamp, overall assessment, and Suggested grade
      (advisory-labeled)
- [x] A row whose `evaluationId` has a saved Label shows that Label; a row with no saved Label
      shows a reasonable fallback (no broken/empty rendering)
- [x] Clicking a row navigates to that Evaluation's `/evaluations/:evaluationId` and renders its
      full Result view

## Comments

Spec conflict found before implementing: this ticket's text says each row shows "its overall
assessment", but `docs/api/api.md`'s documented `GET /api/evaluations` summary row explicitly
excludes `overallAssessment` (only `evaluationId`, `rubricVersion`, `provider`, `model`,
`createdAt`, `suggestedGrade`) — called out by name as excluded, with rationale. Asked the user;
decided to follow `docs/api/api.md` as the authoritative backend contract. History rows show
timestamp, Label, and the advisory Suggested grade — no overall assessment. `newest first` ordering
is trusted from the API response (per the contract) rather than re-sorted client-side.

Implemented: `HistoryPage` (`src/features/history/HistoryPage.jsx`) fetches via a new
`useEvaluations` hook (`src/features/history/useEvaluations.js`, a thin `useQuery` wrapper around
the existing `listEvaluations` client call, mirroring `useEvaluation`'s `retry: false`). Each row
(`HistoryRow`) is a `Link` to `/evaluations/:evaluationId` wrapping the timestamp, the Label from
`localStorage` (`getLabel`, falling back to "No label saved"), and the Suggested grade.

The Suggested grade rendering (ticket: "same rendering rule as the Result view") was extracted into
a new shared `SuggestedGrade` component (`src/shared/ui/SuggestedGrade.jsx`) and `ResultPage` was
refactored to use it too, so the advisory framing has one source of truth instead of duplicated
markup/copy — verified this didn't change `ResultPage`'s rendered output (existing `ResultPage`
tests still pass unchanged).

Also added a loading state and a retryable `ErrorBox` for list-fetch failures, mirroring the
established pattern from `ResultPage`/ticket 04, even though not explicitly required by this
ticket's acceptance criteria — consistent with existing convention rather than new behavior.

Standards and Spec review (two parallel sub-agents) both came back clean, no hard violations or
missing/wrong requirements. Standards review suggested two minor judgement calls, both applied:
extracted the row markup into a `HistoryRow` component to match `ResultPage`'s `EvaluationView`
convention of naming row/section pieces.

`npm test` (36 tests, 5 new in `HistoryPage.test.jsx` covering rows/ordering, Label lookup and
fallback, the empty state, click-through navigation, and the retryable error), `npm run lint`, and
`npm run build` all pass.
