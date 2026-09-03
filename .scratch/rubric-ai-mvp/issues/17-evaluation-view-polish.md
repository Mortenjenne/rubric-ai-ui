# 17: Evaluation view polish

**What to build:** Apply the ticket-12 tokens and spacing scale across the Evaluation view per
the polish brief's items 8–10, and confirm the two constraints the brief calls out (readable
Findings without excessive nesting; Suggested grade and Levels staying restrained/neutral).

- `SuggestedGradePanel`: explicit `--surface` background (previously relied on showing through to
  whatever was behind it), radius bumped 8px → 10px, the advisory caption recolored to the new
  `--text-muted` tier so it reads as secondary next to the large grade value — a restrained
  advisory panel per item 9, without restructuring the shared `SuggestedGrade` primitive itself
  (see Comments).
- `Finding`, `EvaluationColumn`, `SubmissionPanel`, `EvaluationLabel`, `ResultPage`: spacing moved
  onto the `--space-*` scale (ticket 12), `Finding` cards get an explicit `--surface` background.
  Evidence-quote and Level-badge colors needed no file changes — they already read `--accent-bg`/
  `--accent-border`/`--code-bg`, which ticket 12 already repointed at the new teal/neutral tokens.
- Confirmed (no change needed): Findings already use subtle bordered cards with plain
  `section + section` separators around them — not cards nested inside cards — matching item 8.
  Level badges already render as neutral text-only pills (`--code-bg`, no color-ranking) —
  matching item 10. `useShowSubmissionPanelOnce`/`consumeSubmissionPanelOnce` (ticket 08) still
  correctly gate the Submission column to the immediate post-submit render only — reload/History
  entry paths render the two-column layout with no Submission panel, per the brief's closing
  domain constraint.

**Blocked by:** 16

**Status:** ready-for-human

- [x] Suggested grade panel renders on the surface token with the muted advisory caption
- [x] Finding cards, evidence quotes, and Level badges render with the new teal/neutral tokens
- [x] No hardcoded hex/`rgb()` colors introduced in any `.module.css` (grepped clean)
- [x] Reloading an Evaluation URL still shows the two-column layout with no Submission panel;
      only the immediate post-submit render shows three columns
- [x] All existing tests keep passing unchanged

## Comments

Deliberately did not restructure `SuggestedGrade.jsx` into a separate all-caps "ADVISORY" badge
plus caption (closer to the brief's illustrative English mockup) because that component is shared
between this panel and `HistoryPage`'s compact table-row rendering, and `SuggestedGradePanel`'s
own CSS reaches into `SuggestedGrade`'s rendered `<strong>`/`<span>` via descendant selectors
(`.card strong`, `.card span`) — restructuring the shared markup would have required touching
`HistoryPage` too (out of scope for this ticket) and risked breaking that coupling. The existing
Danish copy (`vejledende — et udgangspunkt, ikke en endelig karakter`) already reads as advisory;
this ticket only restyled the surrounding tokens, not the copy or markup.
