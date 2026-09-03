# 14: PageHeader shell component

**What to build:** Add the small, low-contrast top header the polish brief's item 5 asks for,
above the routed page content — "context rather than duplicate navigation." Fulfills the
`PageHeader` component `docs/design.md` §35 already listed as intended but unbuilt.

- New `src/shared/ui/PageHeader.jsx` + `.module.css`: "Rubric AI" on the left, the Underviser
  identity on the right, a subtle bottom border (`--border-subtle`, ticket 12), low-contrast text
  (`--text`).
- New `strings.app.name` ('Rubric AI') in `src/shared/i18n/strings.js` — the header and (ticket
  15's) sidebar wordmark both read from the same string rather than each hardcoding it. The
  identity text itself reuses the existing `strings.sidebar.identity` ('Underviser') rather than
  duplicating that string under a new key.
- Wired into `src/App.jsx`: the shell is now sidebar + a `.content` column (header above `<main>`)
  instead of sidebar + bare `<main>`. Sidebar itself is untouched by this ticket — no navigation
  was added to the header, per the brief ("do not put the main navigation in both the sidebar and
  header").

**Blocked by:** 13

**Status:** ready-for-human

- [x] Header renders above every routed page, with "Rubric AI" left / "Underviser" right
- [x] Header has a subtle bottom border and low-contrast text, not competing with the sidebar
- [x] No nav links appear in the header — Ny indlevering/Historik remain sidebar-only
- [x] `docs/design.md` §5's wireframe shows the header
- [x] All existing tests keep passing (one intentionally updated, see Comments)

## Comments

`App.test.jsx`'s shell test previously asserted `screen.getByText('Underviser')` once. Since the
header now repeats that identity text next to the sidebar's own (both shown per the brief's own
mockups in §5 and §6), that query would now match two elements and throw. Updated the test to
scope each assertion to its landmark instead of loosening it: `within(screen.getByRole('complementary'))`
for the sidebar's copy, `within(screen.getByRole('banner'))` for the header's — plus a new
assertion that the header shows "Rubric AI". This is a structural addition the test necessarily
needs to reflect, not a case of folding new behavior into an unrelated test.
