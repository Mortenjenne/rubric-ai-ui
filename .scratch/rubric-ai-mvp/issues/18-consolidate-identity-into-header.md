# 18: Consolidate identity/theme-toggle into the header; sidebar becomes nav-only

**What to build:** Follow-up to tickets 14–15 based on direct user feedback: the "Rubric AI"
name and "Underviser" identity were showing in both the sidebar and the header, and the header
was spread edge-to-edge (`justify-content: space-between`). Consolidate to one copy of each,
left-aligned.

- `PageHeader`: dropped `justify-content: space-between` for a left-aligned cluster (`gap`
  instead). Now renders "Rubric AI", the Underviser identity, **and** the `ThemeToggle` — all
  three grouped together on the left, toggle immediately after Underviser.
- `Sidebar`: removed the "Rubric AI" wordmark and the entire footer (identity line + theme
  toggle) — the sidebar is nav-only now (Ny indlevering / Historik). `ThemeToggle` and the
  identity line live once, in the header, not twice.
- `docs/design.md` §5: updated the wireframe and prose to match — one header cluster, no sidebar
  footer. Also dropped the "Indstillinger" secondary-nav placeholder line, since it was described
  as living in the sidebar footer that no longer exists and was never actually built in `Sidebar.jsx`
  to begin with (dead spec, not a real removal).

**Blocked by:** 17

**Status:** ready-for-human

- [x] "Rubric AI" and "Underviser" each render exactly once in the whole app shell (header only)
- [x] Header content is left-aligned as one cluster, not spread across the bar
- [x] Theme toggle renders in the header, immediately after "Underviser"
- [x] Sidebar contains only the two nav links — no wordmark, no footer, no theme toggle
- [x] All existing tests keep passing; `App.test.jsx`'s shell test updated to match (see Comments)

## Comments

`App.test.jsx` previously asserted "Underviser" appeared in both `role="complementary"` (sidebar)
and `role="banner"` (header) — that was ticket 14 accommodating the intentional duplication the
brief's mockups showed at the time. Since the duplication is now removed by explicit request,
updated the test to assert "Underviser" and the theme toggle only within the header, and dropped
the sidebar-scoped assertion entirely rather than leaving a stale check for text that's no longer
there.
