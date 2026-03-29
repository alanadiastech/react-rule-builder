import { afterEach, describe, expect, it, vi } from 'vitest'

import { createRuleGroup } from '../create-rule-group'

describe('createRuleGroup', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates a group with default values', () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('22222222-2222-2222-2222-222222222222')

    expect(createRuleGroup()).toEqual({
      id: '22222222-2222-2222-2222-222222222222',
      operator: 'and',
      rules: [],
    })
  })

  it('creates a group with provided values', () => {
    expect(
      createRuleGroup({
        id: 'group-2',
        operator: 'or',
      }),
    ).toEqual({
      id: 'group-2',
      operator: 'or',
      rules: [],
    })
  })
})
