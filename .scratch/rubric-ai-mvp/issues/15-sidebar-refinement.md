# 15: Sidebar refinement

**What to build:** Visual-only refinement of the existing sidebar per the polish brief's item 6 —
add the missing wordmark, give the active nav item a teal-tinted state instead of bold text, and
bring the width into the 240–260px range. No structural/navigation changes.

- Added the "Rubric AI" wordmark at the top of `Sidebar.jsx` (`docs/design.md` §5's wireframe
  already showed this above the primary nav actions; ticket 07 never built it). Reads from the
  same `strings.app.name` ticket 14 introduced, not a new hardcoded string.
- Active nav link: replaced the bold-text-only `.linkActive` with a teal-tinted background
  (`--accent-bg`), a small left accent indicator (`--accent`, via `border-left` so it doesn't
  shift layout — `.link` now always reserves a transparent 2px left border), and `--text-h`.
  Avoids a "large colored navigation pill" per the brief — it's a background tint plus a thin
  indicator, not a filled pill shape.
- Sidebar width: 220px → 250px.
- Confirmed no account/login UI needed adding or removing — already compliant before this ticket.

**Blocked by:** 14

**Status:** ready-for-human

- [x] "Rubric AI" wordmark renders above the nav links
- [x] Active nav link (Ny indlevering / Historik, whichever route is current) shows the
      teal-tinted background + left indicator instead of bold text
- [x] Sidebar width is 250px (within the 240–260px range)
- [x] No account/login/avatar UI present (unchanged from before)
- [x] All existing tests keep passing unchanged

## Comments

Restructured `.sidebar`'s layout from `justify-content: space-between` (which relied on there
being exactly two children — nav and footer) to a normal stack with `margin-top: auto` on
`.footer`, since adding the wordmark as a third child would otherwise have spread all three
children evenly down the sidebar instead of grouping the wordmark with the nav at the top.
