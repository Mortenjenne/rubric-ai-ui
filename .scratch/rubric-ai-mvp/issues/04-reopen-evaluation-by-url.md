# 04: Reopen a finished Evaluation directly by URL

**What to build:** `/evaluations/:evaluationId` becomes reload-safe. When that route loads with no
in-memory `POST` response available — a fresh page load, a reload after a successful submission,
or a direct link — it fetches the Evaluation via `GET /api/evaluations/{id}` (mocked per the
contract in the spec; this endpoint doesn't exist on the real backend yet) and renders the same
Result view used in ticket 02.

**Blocked by:** 02

**Status:** ready-for-agent

- [ ] Reloading the browser on `/evaluations/:evaluationId` right after a successful submission
      shows the same completed Result view again, fetched via `GET /api/evaluations/{id}`
- [ ] Navigating directly to `/evaluations/:evaluationId` for a known id (no prior submission in
      this session) renders the same Result view
- [ ] The rendered content and advisory framing (Level as a named quality, Suggested grade marked
      advisory) match ticket 02's rules exactly — one Result view, two entry paths

## Comments
