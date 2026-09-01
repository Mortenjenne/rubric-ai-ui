import { describe, expect, it } from 'vitest'
import { getLabel, saveLabel } from './labels'

describe('label storage', () => {
  it('saves and retrieves a Label keyed by evaluationId', () => {
    saveLabel('eval-1', 'Anna')

    expect(getLabel('eval-1')).toBe('Anna')
  })

  it('does not store a blank Label', () => {
    saveLabel('eval-2', '   ')

    expect(getLabel('eval-2')).toBeUndefined()
  })

  it('keeps Labels for different evaluations independent', () => {
    saveLabel('eval-1', 'Anna')
    saveLabel('eval-2', 'Ben')

    expect(getLabel('eval-1')).toBe('Anna')
    expect(getLabel('eval-2')).toBe('Ben')
  })
})
