function resolveApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL
  if (configured) return configured
  if (import.meta.env.DEV) return 'http://localhost:8081'
  throw new Error('VITE_API_BASE_URL must be set outside of development')
}

const API_BASE_URL = resolveApiBaseUrl()

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.message ?? `Request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.code = body?.code
    this.body = body
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(response.status, body)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

/**
 * @param {string} submissionText
 * @returns {Promise<object>} the created Evaluation
 */
export function createEvaluation(submissionText) {
  return request('/api/evaluations', {
    method: 'POST',
    body: JSON.stringify({ submissionText }),
  })
}

/** @returns {Promise<object[]>} Evaluation summary rows, newest first */
export function listEvaluations() {
  return request('/api/evaluations')
}

/**
 * @param {string} evaluationId
 * @returns {Promise<object>} the full Evaluation
 */
export function getEvaluation(evaluationId) {
  return request(`/api/evaluations/${evaluationId}`)
}
