import { describe, expect, it } from 'vitest'
import { getEvaluationErrorCopy } from './evaluationErrors'

describe('getEvaluationErrorCopy', () => {
  it.each(['invalid_model_output', 'rate_limited', 'upstream_unavailable'])(
    'marks %s as retryable with its own message',
    (code) => {
      const copy = getEvaluationErrorCopy(code)
      expect(copy.retryable).toBe(true)
      expect(copy.message).toEqual(expect.any(String))
    },
  )

  it('marks configuration_error as not retryable and framed as a problem to report', () => {
    const copy = getEvaluationErrorCopy('configuration_error')
    expect(copy.retryable).toBe(false)
    expect(copy.message).toMatch(/kontakt/i)
  })

  it('gives every known code distinct copy', () => {
    const codes = ['invalid_model_output', 'rate_limited', 'upstream_unavailable', 'configuration_error']
    const messages = codes.map((code) => getEvaluationErrorCopy(code).message)
    expect(new Set(messages).size).toBe(codes.length)
  })

  it('falls back to a retryable generic message for an unrecognized code', () => {
    const copy = getEvaluationErrorCopy('something_unexpected')
    expect(copy.retryable).toBe(true)
    expect(copy.message).toEqual(expect.any(String))
  })
})
