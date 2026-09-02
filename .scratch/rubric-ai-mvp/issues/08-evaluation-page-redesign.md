# 08: Evaluation page redesign

**What to build:** Redesign `ResultPage` per `docs/design.md` §9–§21, in one pass:

- Default to a two-column layout (Evaluation | Suggested grade). Render the three-column variant
  (adding the Submission column) only in the immediate post-submit render, where Submission text
  actually exists in memory — never as an empty/placeholder Submission panel on any other entry
  path (History click-through, direct link, reload).
- Make each Finding collapsible, with the first Finding expanded by default (§14).
- Apply the calm visual language to the Suggested grade panel, Level badges, and evidence-quote
  styling (§3.2–§3.5, §15–§17) — neutral surfaces, no numeric/ranked-color treatment of Level,
  explicit advisory framing on the Suggested grade.
- Restyle the loading, not-found, and fetch-error states (§19–§21) to match, with no behavior
  change to any of them.

Do **not** add a "back to History" action to the not-found state — that's out of scope for this
ticket (deferred separately per the redesign spec); the not-found state keeps its current
no-Retry, no-button behavior, just restyled.

**Blocked by:** 06

**Status:** ready-for-agent

- [x] Visiting `/evaluations/:evaluationId` via History, a direct link, or a reload renders the
      two-column layout with no Submission panel — never an empty or broken one
- [x] Landing on `/evaluations/:evaluationId` immediately after a successful submission renders
      the three-column variant, with the just-submitted Submission text visible
- [x] Each Finding can be expanded and collapsed independently; the first Finding is expanded by
      default on load
- [x] The Suggested grade always renders with its advisory qualifier; Level always renders as
      neutral text, never a number, percentage, star rating, or ranked color
- [x] Evidence quotes are visually distinguished from other Finding text (e.g. quotation styling)
- [x] The loading, not-found, and fetch-error states render with the new visual style; the
      not-found state still has no Retry button and no "back to History" action
- [x] All existing `ResultPage` tests (both entry paths, loading, all fetch-failure shapes) keep
      passing; new tests cover Finding expand/collapse behavior
- [x] Visible copy is Danish, sourced from the centralized strings module from ticket 06

## Comments
