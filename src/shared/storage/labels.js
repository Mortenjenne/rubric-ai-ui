const STORAGE_KEY = 'rubric-ai:labels'

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

/**
 * @param {string} evaluationId
 * @param {string} label
 */
export function saveLabel(evaluationId, label) {
  if (!label || !label.trim()) return

  const all = readAll()
  all[evaluationId] = label.trim()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

/**
 * @param {string} evaluationId
 * @returns {string | undefined}
 */
export function getLabel(evaluationId) {
  return readAll()[evaluationId]
}
