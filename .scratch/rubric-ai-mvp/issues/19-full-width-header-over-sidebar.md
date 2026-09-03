# 19: Full-width header spanning the sidebar

**What to build:** Follow-up to ticket 18 based on direct user feedback: the header only spanned
the content column, sitting to the right of the sidebar. Extend it to span the full page width,
above both the sidebar and the content — "Rubric AI" over the sidebar column, "Underviser" and
the theme toggle pushed to the header's right, over the content column.

- `App.jsx`: restructured so `PageHeader` is a sibling above a `.shell` row (sidebar + main),
  instead of being nested inside a content column to the right of the sidebar. New `.appShell`
  wrapper (flex column) holds header + shell; `.shell` (flex row, sidebar + main) is unchanged
  internally. Dropped the now-unneeded `.content` wrapper.
- `PageHeader`: `.brand` ("Rubric AI") is now a fixed-width block —
  `calc(250px - 1.5rem)`, i.e. the sidebar's 250px width minus the header's own left padding — so
  it lines up directly above the sidebar column rather than just sitting at the header's left
  edge. `.right` (identity + `ThemeToggle`) gets `margin-left: auto` to push it to the header's
  right edge, over the content column.
- `docs/design.md` §5: wireframe and prose updated to show the header spanning both columns.

**Blocked by:** 18

**Status:** ready-for-human

- [x] Header bar spans the full width, above both the sidebar and the content area
- [x] "Rubric AI" renders in the segment directly above the sidebar
- [x] "Underviser" and the theme toggle render together at the header's right edge
- [x] Sidebar remains nav-only below the header, unchanged from ticket 18
- [x] All existing tests keep passing unchanged (landmark roles — `banner`/`navigation`/
      `complementary` — are unaffected by the wrapper restructuring)

## Comments

The `calc(250px - 1.5rem)` brand width is a direct pixel coupling to the sidebar's width
(`Sidebar.module.css`'s `.sidebar { width: 250px }`) and the header's own left padding. If the
sidebar width ever changes, this constant needs updating alongside it — there's no shared token
for it since it's a one-off layout alignment, not a reusable value.
