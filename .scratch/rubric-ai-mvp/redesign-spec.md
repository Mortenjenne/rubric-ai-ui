# Rubric AI frontend — redesign & Danish localization

## Problem Statement

The MVP UI (Upload, Evaluation, History) is functionally complete but visually minimal: unstyled
semantic HTML, English copy for an audience of Danish-speaking Educators, and an Evaluation page
that always reserves a Submission column even though Submission text only exists in memory right
after a fresh submit — every other entry path (a History click-through, a direct link, a reload)
has nothing to put there. History reads as a paragraph list rather than something scannable at a
glance, and nothing in the current visual language distinguishes this from a rough prototype.

## Solution

Apply the design direction in `docs/design.md` across the three existing views, as a backlog of
small, independently shippable tickets — the same review/test/commit discipline tickets 01–06
already used, not one large redesign diff. Build on the CSS custom-property token system already
defined in `src/index.css` rather than introducing a new design system. Danish translation (ticket
06, tracked separately) ships first; every ticket after it authors new UI copy directly in Danish.

## User Stories

1. As an Educator, I want the Evaluation page to default to a two-column layout (Evaluation |
   Suggested grade) when no Submission text is available, so that I'm never shown a broken or
   empty Submission panel on a History visit or reload.
2. As an Educator, I want the Evaluation page to show a three-column layout with my Submission text
   visible immediately after I submit, so that I can cross-reference the Evaluation against what I
   just wrote while it's still fresh.
3. As an Educator, I want the Suggested grade in a clearly secondary panel with explicit advisory
   framing, so that it never visually competes with my own judgement.
4. As an Educator, I want Findings to be collapsible, with the first Finding expanded by default, so
   that a six-Criterion Evaluation doesn't force me to scroll past detail I don't need yet.
5. As an Educator, I want evidence quotes visually distinguished from generic paragraphs (quotation
   styling, a subtle border), so that I can immediately tell a verbatim Submission quote from the
   model's own commentary.
6. As an Educator, I want Level badges rendered as neutral text badges (e.g. "[ Tilfredsstillende
   ]"), never as stars, percentages, progress bars, or colored dots, so that I never mistake a Level
   for a numeric or ranked score.
7. As an Educator, I want a calm, low-chrome visual language — neutral surfaces, subtle borders, no
   gradients or metrics-dashboard styling — so the tool reads as a professional workspace, not an AI
   product demo.
8. As an Educator, I want a persistent sidebar showing "Ny indlevering" and "Historik", so that I
   can move between the two workflows without hunting for a nav bar.
9. As an Educator, I want the sidebar to show a static "Underviser" identity indicator, so the shell
   reads as a real workspace without implying a login/account system exists.
10. As an Educator, I want History rows shown in a table-like list with columns for Label, Created,
    and Suggested grade, so I can scan several rows at once instead of parsing free-form paragraphs.
11. As an Educator, I want to search History by Label, so that I can find a specific past Evaluation
    quickly once History has many rows.
12. As an Educator, I want a History row with no saved Label to show a clear "Ingen mærkat"
    placeholder rather than a blank cell, so the table never looks broken.
13. As an Educator, I want a calm skeleton-row loading state in History, so the table's shape is
    visible while data loads instead of a bare spinner.
14. As an Educator, I want an explicit empty-History state with a way back to Ny indlevering, so a
    first-time visit isn't a blank table with no next step.
15. As an Educator, I want History's error state styled consistently with the rest of the app's
    error handling, so a failed fetch doesn't strand me with no way forward.
16. As an Educator, I want the Evaluation loading state to say I'm retrieving a saved Evaluation
    (not evaluating a new one), so I don't confuse a page load with a fresh 20–90 second submission.
17. As an Educator, I want a distinct "not found" state (no Retry, since retrying can't fix an
    unresolvable id) offering a way back to History, so a stale or malformed link doesn't strand me.
18. As an Educator, I want the Evaluation fetch-failure state's Retry styled consistently with
    Upload's error handling, so the whole app feels like one tool.
19. As an Educator, I want Upload's own error states restyled to match the rest of the app's visual
    language, so nothing reads like a different, unfinished prototype stitched in.
20. As an Educator, I want the redesigned UI to stay fully keyboard-navigable — visible focus
    states, interactive History rows reachable and activatable by keyboard — so I'm not forced to
    use a mouse.
21. As an Educator, I want the layout to degrade gracefully on a narrower window (stacked sections,
    a collapsible Submission panel, Suggested grade moved near the top on mobile), so the tool stays
    usable off a wide desktop monitor.
22. As an Educator, I want all of this delivered without introducing UI for Rubric browsing,
    authentication, pagination, or backend-modeled submission identity, so the redesign doesn't
    quietly expand scope beyond what was already decided out of scope for the MVP.

## Implementation Decisions

- **Ticket backlog**: each cluster of `docs/design.md` becomes its own small ticket under
  `.scratch/rubric-ai-mvp/issues/`, continuing the existing numbering after 06, with the same
  review/test/commit discipline as tickets 01–06.
- **Styling foundation**: extend the CSS custom-property tokens already defined in `src/index.css`
  (`--text`, `--bg`, `--border`, `--accent`, `--shadow`, light/dark via `prefers-color-scheme`)
  rather than introducing a new design-system layer or CSS-in-JS library.
- **Component architecture**: keep the existing feature-folder structure; add new shared primitives
  (Button, Badge, EmptyState, LoadingState, PageHeader) only once a ticket's implementation actually
  needs one, not speculatively because `docs/design.md` §35 lists them.
- **Evaluation page layout**: two-column default (Vurdering | Vejledende); the three-column variant
  (adds Indlevering) renders only when `location.state?.evaluation` is present — the `isFetchPath`
  distinction `ResultPage` already has. No new state is needed; the layout keys off data already
  there.
- **History table**: keeps the row-based/clickable-link interaction model already shipped in ticket
  05; the visual redesign wraps that interaction in a table-like layout without changing the
  underlying `useEvaluations`/`getLabel` data flow.
- **Search by Label**: a purely client-side substring filter over the already-fetched `evaluations`
  list — Label lives only in `localStorage`, so there's no server-side search to call.
- **Findings collapse/expand**: local component state per Finding, no persistence across reloads;
  the first Finding expanded by default per `docs/design.md` §14.
- **Sidebar navigation** replaces the current horizontal `Nav`; its two items map 1:1 to the
  existing `/` and `/history` routes — no new routes.
- **Copy**: all new/changed UI copy is Danish, sourced from the centralized strings module tracked
  in ticket 06 — redesign tickets add to that module, they don't reintroduce inline literals.
  Domain terminology matches the Danish UI labels and avoid-lists now recorded in `CONTEXT.md`.

## Testing Decisions

- Reuse the single seam already established for this project: MSW stubbing the network boundary
  (`POST /api/evaluations`, `GET /api/evaluations`, `GET /api/evaluations/{id}`), React Testing
  Library + `user-event` driving interaction, assertions on rendered output only — never component
  internals or the Query cache. No new seam for this redesign.
- New interaction behavior (Findings collapse/expand, History search-by-Label, keyboard navigation
  of History rows) gets its own `user-event`-driven tests asserting on rendered/ARIA state (e.g.
  `aria-expanded`, filtered row count), following `HistoryPage.test.jsx`'s existing pattern.
- Pure visual/layout changes with no behavioral difference (colors, spacing, the sidebar shell,
  responsive breakpoints) are **not** unit-tested — verify these by running the app (`/run` or
  `npm run dev`) and checking the golden path and breakpoints in a browser.
- Existing tests (`UploadPage.test.jsx`, `ResultPage.test.jsx`, `HistoryPage.test.jsx`,
  `App.test.jsx`) keep passing behaviorally; where they assert literal English copy, update them to
  the new Danish copy (or to role/structure-based queries) as part of whichever ticket changes that
  copy — not held for a big-bang rewrite at the end.

## Out of Scope

- Rubric reference, Level descriptions, active-Rubric visibility (already out of scope per the
  original MVP spec; unchanged).
- Authentication, accounts, per-Educator History scoping (ADR 0001; unchanged).
- Pagination of `GET /api/evaluations` (unchanged).
- Backend-modeled submission identity (unchanged).
- Adding a "Back to History" action to the Evaluation not-found state (`docs/design.md` §20) — new
  behavior beyond what ticket 04 shipped; deferred to its own future ticket, not bundled here.
- A general i18n framework or language switcher — Danish is hardcoded (ticket 06); no English
  fallback or runtime language switching.
- Any change to the backend API contract, including whether `GET /api/evaluations` should carry
  `overallAssessment` — the frontend continues building against the documented `docs/api/api.md`
  contract as-is.

## Further Notes

- Ticket 06 (`.scratch/rubric-ai-mvp/issues/06-translate-ui-to-danish.md`) is a prerequisite for
  every ticket generated from this spec and should ship first.
- `docs/design.md` is the source design reference for this spec — it was reconciled earlier in this
  session to match already-shipped behavior (the History row contract, `ResultPage`'s
  post-submit-only Submission column, the single History/Evaluations nav item). Read it alongside
  this spec, not instead of it — it carries the detailed wireframes this spec's prose summarizes.
- `CONTEXT.md` carries the canonical Danish UI label and avoid-list per domain term — check there
  before inventing a translation for any new UI copy.
