# 07: Sidebar navigation shell

**What to build:** Replace the current horizontal top `Nav` with the persistent sidebar shell
described in `docs/design.md` §5: a "+ Ny indlevering" primary action, a "Historik" nav item, and a
static "Underviser" identity indicator at the bottom. The two nav items map 1:1 to the existing `/`
and `/history` routes — no new routes, no login/account UI, no functional Settings.

**Blocked by:** 06

**Status:** ready-for-agent

- [x] The app shell shows a sidebar (not a top nav bar) with "+ Ny indlevering" and "Historik" as
      the only two primary nav items, each navigating to the existing `/` and `/history` routes
- [x] The sidebar shows a static "Underviser" identity indicator; no login, account, or
      Educator-switching UI is introduced
- [x] Navigating between the two views and reloading on either still works exactly as before —
      only the navigation chrome changes, not routing or page behavior
- [x] Visible sidebar copy is Danish, sourced from the centralized strings module from ticket 06
- [x] Existing tests that assert on nav structure/labels are updated to match; the full suite
      passes

## Comments
