import { afterEach, describe, expect, it, vi } from 'vitest'

import { createRuleCondition } from '../create-rule-condition'

describe('createRuleCondition', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates a condition with default values', () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('11111111-1111-1111-1111-111111111111')

    expect(createRuleCondition()).toEqual({
      id: '11111111-1111-1111-1111-111111111111',
      field: '',
      operator: 'equals',
      value: '',
    })
  })

  it('creates a condition with provided values', () => {
    expect(
      createRuleCondition({
        id: 'condition-2',
        field: 'status',
        operator: 'equals',
        value: 'active',
      }),
    ).toEqual({
      id: 'condition-2',
      field: 'status',
      operator: 'equals',
      value: 'active',
    })
  })
})
