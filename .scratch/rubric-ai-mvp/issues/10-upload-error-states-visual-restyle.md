# 10: Upload error states visual restyle

**What to build:** Restyle `UploadPage`'s existing retryable and non-retryable error handling
(`docs/design.md` §22–§24) to match the rest of the redesigned app's visual language. This is a
pure visual change — no change to which errors are retryable, what triggers Retry, or how the form
behaves while an error is visible.

**Blocked by:** 06

**Status:** ready-for-agent

- [ ] All four error shapes (`invalid_model_output`, `rate_limited`, `upstream_unavailable`,
      `configuration_error`) render with the new visual style, in the same inline, non-blocking
      location near the submit button
- [ ] The three retryable errors still offer a working Retry that resubmits the same text;
      `configuration_error` still offers no Retry and still reads as a problem to report
- [ ] The textarea, file picker, and Label field remain editable while an error is visible, exactly
      as before
- [ ] All existing `UploadPage` tests (golden path, all four error shapes, the `beforeunload`
      guard) keep passing unchanged
- [ ] Visible copy is Danish, sourced from the centralized strings module from ticket 06

## Comments
