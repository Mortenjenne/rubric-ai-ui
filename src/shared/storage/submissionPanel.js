const STORAGE_KEY_PREFIX = 'rubric-ai:submission-shown:'

/**
 * The Submission panel on the Evaluation page must only ever appear once, on the render
 * immediately following a successful submission — never after a reload of that same URL. The
 * browser preserves router state across a reload (history.state survives F5, unlike a fresh
 * navigation), so this flag is what actually prevents the panel from reappearing.
 * @param {string} evaluationId
 * @returns {boolean} true the first time this is called for this evaluationId, false after
 */
export function consumeSubmissionPanelOnce(evaluationId) {
  try {
    const key = `${STORAGE_KEY_PREFIX}${evaluationId}`
    if (sessionStorage.getItem(key)) return false
    sessionStorage.setItem(key, '1')
    return true
  } catch {
    return false
  }
}
