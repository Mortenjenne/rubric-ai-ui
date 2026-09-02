# 09: History redesign

**What to build:** Redesign `HistoryPage` per `docs/design.md` §26–§30, in one pass:

- Restyle the row list into the table-like layout: Label / Created / Suggested grade columns.
- A row with no saved Label shows a clear "Ingen mærkat" fallback, not a blank cell.
- A calm skeleton-row loading state instead of a bare loading message.
- An explicit empty state (no past Evaluations) with a way back to Ny indlevering.
- Restyle the fetch-error/retry state to match the rest of the app.
- Add a client-side search box that filters the already-fetched list by Label substring — Label
  lives only in `localStorage`, so this never calls the backend.

**Blocked by:** 06

**Status:** ready-for-agent

- [ ] History rows render in a table-like layout with Label, Created, and Suggested grade columns,
      newest first, each row still navigating to its `/evaluations/:evaluationId` on click
- [ ] A row with no saved Label shows "Ingen mærkat"; a row with a saved Label shows it
- [ ] The loading state renders calm skeleton rows instead of a bare loading message
- [ ] An empty History (no Evaluations yet) shows an explicit empty state with a way back to Ny
      indlevering
- [ ] A failed fetch shows a restyled, retryable error consistent with the rest of the app
- [ ] Typing into the search box filters the visible rows to those whose Label contains the typed
      text (case-insensitive substring match); clearing the box shows all rows again
- [ ] All existing `HistoryPage` tests (ordering, Label lookup and fallback, empty state,
      click-through navigation, retryable error) keep passing; new tests cover the search filter
- [ ] Visible copy is Danish, sourced from the centralized strings module from ticket 06

## Comments
