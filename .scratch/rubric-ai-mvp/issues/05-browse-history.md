# 05: Browse past Evaluations in History

**What to build:** The History view fetches `GET /api/evaluations` (mocked per the contract in the
spec; unpaginated, sorted newest first) and lists past Evaluations, each row showing when it was
created, its overall assessment, and its Suggested grade (marked advisory, same rendering rule as
the Result view). Each row also shows the Label from `localStorage` when one was saved for that
`evaluationId`. Clicking a row navigates to `/evaluations/:evaluationId`, landing on the same
Result view built in ticket 04.

**Blocked by:** 04

**Status:** ready-for-agent

- [ ] Visiting `/history` with several mocked past Evaluations shows one row per Evaluation,
      newest first, each showing its timestamp, overall assessment, and Suggested grade
      (advisory-labeled)
- [ ] A row whose `evaluationId` has a saved Label shows that Label; a row with no saved Label
      shows a reasonable fallback (no broken/empty rendering)
- [ ] Clicking a row navigates to that Evaluation's `/evaluations/:evaluationId` and renders its
      full Result view

## Comments
