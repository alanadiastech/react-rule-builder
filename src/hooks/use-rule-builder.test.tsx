import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { RuleCondition, RuleGroup } from '../types/rule'
import { useRuleBuilder } from './use-rule-builder'

const createCondition = (id: string, field = 'user.account_status'): RuleCondition => ({
  field,
  id,
  operator: 'equals',
  value: 'active',
})

const createGroup = (id: string): RuleGroup => ({
  id,
  operator: 'and',
  rules: [],
})

describe('useRuleBuilder', () => {
  it('creates a default root group when none is provided', () => {
    const { result } = renderHook(() => useRuleBuilder())

    expect(result.current.rootGroup).toMatchObject({
      operator: 'and',
      rules: [],
    })
  })

  it('manages condition and group updates', () => {
    const initialGroup = createGroup('root')
    const providedCondition = createCondition('condition-1')
    const providedGroup = createGroup('group-1')
    const { result } = renderHook(() => useRuleBuilder(initialGroup))

    act(() => {
      result.current.addCondition('root', providedCondition)
      result.current.addGroup('root', providedGroup)
      result.current.updateConditionById('condition-1', {
        operator: 'not_equals',
        value: 'inactive',
      })
      result.current.setGroupOperator('group-1', 'or')
      result.current.removeRule('condition-1')
    })

    expect(result.current.rootGroup).toEqual({
      id: 'root',
      operator: 'and',
      rules: [
        {
          id: 'group-1',
          operator: 'or',
          rules: [],
        },
      ],
    })
  })
})
