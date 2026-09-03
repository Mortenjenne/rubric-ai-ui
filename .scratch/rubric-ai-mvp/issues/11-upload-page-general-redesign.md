# 11: Upload page (Ny indlevering) general redesign

**What to build:** Redesign `UploadPage` per `docs/design.md` §6–§8, in one pass. Ticket 10 already
restyled the error states via the shared `ErrorBox`; this ticket covers everything else on the page,
which is still unstyled browser-default form controls.

- Add the missing copy from the §6 wireframe: a subheading, an instruction line above the textarea,
  a textarea placeholder, a live character count below the textarea, a Mærkat placeholder, and the
  local-storage-only helper text below the Mærkat field.
- Visually hide the native file `<input>` (kept in the DOM and reachable via the existing `<label>`,
  so clicking the label still opens the file picker and the field stays keyboard-accessible) so the
  browser's own "Vælg fil / Der er ikke valgt nogen fil" chrome no longer renders next to the
  restyled label text.
- After a file is loaded into the textarea, show the "Fil indlæst: `<name>`" feedback line from §7.
- Restyle the textarea, Mærkat input, labels, and submit button to match the rest of the app's
  visual language (spacing, `--border`/`--text-h` tokens, rounded corners, the accent color for the
  primary action) — no separate "primary button" style exists yet in the app, so this introduces
  one, filled with `var(--accent)`.
- Restyle the in-progress status line to match History/Evaluation's loading rows (icon + text),
  same copy as today.

Out of scope: the `Vurdér indlevering` disabled-until-non-whitespace behavior, the beforeunload
guard, and anything under ticket 10 (error states) — none of that changes here, visually or
behaviorally.

**Blocked by:** 06, 10

**Status:** ready-for-human

- [x] The page shows the §6 subheading and instruction copy, and the textarea has the §6 placeholder
- [x] A live "N tegn" character count renders below the textarea and updates as the user types or
      loads a file
- [x] The native file input no longer shows browser-default "Vælg fil" / "Der er ikke valgt nogen
      fil" chrome; the existing label text remains the only visible trigger and still opens the file
      picker and populates the textarea exactly as before
- [x] After loading a file, a "Fil indlæst: `<filename>`" line appears near the file picker
- [x] The textarea, Mærkat field, labels, and submit button are restyled to match the rest of the
      app (tokens, spacing, rounded corners); the submit button uses a new filled/accent primary
      style
- [x] The Mærkat field shows the local-storage-only helper text from §6
- [x] The in-progress status renders as an icon + text row consistent with History/Evaluation's
      loading states, same copy as today
- [x] All existing `UploadPage` tests (golden path, file upload, blank-text guard, `beforeunload`
      guard, all four error shapes) keep passing unchanged; new tests cover the character count and
      the file-loaded feedback line
- [x] Visible copy is Danish, sourced from the centralized strings module from ticket 06

## Comments

The native file input is kept in the DOM (not removed) and visually hidden with the standard
clip-based sr-only technique, ordered directly before its `<label>` so `.fileInput:focus-visible +
.fileLabel` gives keyboard users a visible focus ring on Tab — label-click delegation to a
same-DOM-order-independent `htmlFor` still opens the file picker as before.

