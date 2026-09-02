# 03: Handle evaluation failures with clear, actionable errors

**What to build:** When `POST /api/evaluations` fails, the Educator sees a client-friendly inline
error box (never raw JSON) rendered near the submit button, without the rest of the form becoming
unusable. Each of the four documented `{code, message}` failure shapes gets its own copy and
action: `invalid_model_output`, `rate_limited`, and `upstream_unavailable` explain the problem and
offer a manual Retry that resubmits the exact same text; `configuration_error` explains that this
is a service problem to report and does not offer a retry. No failure ever triggers an automatic
retry — every retry is an explicit click.

**Blocked by:** 02

**Status:** ready-for-agent

- [x] Mocking each of `invalid_model_output`, `rate_limited`, and `upstream_unavailable` shows an
      inline, non-blocking error box with distinct, plain-language copy and a visible Retry
      control for each
- [x] Clicking Retry resubmits the same text that was already in the form, without requiring the
      Educator to re-type or re-upload it
- [x] Mocking `configuration_error` shows an inline error box framed as a problem to report, with
      no Retry control
- [x] The rest of the Upload form (the textarea, the Label field) remains interactive while an
      error box is showing
- [x] No error ever triggers a retry without an explicit click

## Comments
