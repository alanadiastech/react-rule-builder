import { describe, expect, it } from 'vitest'

import type { RuleGroup } from '../../types/rule'
import { createRuleCondition } from '../create-rule-condition'
import { createRuleGroup } from '../create-rule-group'
import {
  addConditionToGroup,
  addGroupToGroup,
  createRootRuleGroup,
  removeRuleFromGroup,
  updateCondition,
  updateGroupOperator,
} from '../rule-tree'

const createCondition = (overrides: Parameters<typeof createRuleCondition>[0] = {}) => {
  return createRuleCondition({
    field: 'status',
    operator: 'equals',
    value: 'active',
    ...overrides,
  })
}

const createGroup = (overrides: Partial<RuleGroup> = {}): RuleGroup => {
  return {
    ...createRuleGroup({
      id: 'group-1',
      operator: 'and',
    }),
    ...overrides,
  }
}

describe('rule-tree', () => {
  it('creates the root group with a stable id and default operator', () => {
    expect(createRootRuleGroup()).toEqual({
      id: 'root',
      operator: 'and',
      rules: [],
    })
  })

  it('adds a condition to the target group', () => {
    const rootGroup = createRootRuleGroup()
    const condition = createCondition({
      id: 'condition-1',
    })

    const nextGroup = addConditionToGroup(rootGroup, 'root', condition)

    expect(nextGroup.rules).toEqual([condition])
  })

  it('adds a child group to a nested group', () => {
    const childGroup = createGroup()
    const rootGroup: RuleGroup = {
      ...createRootRuleGroup(),
      rules: [childGroup],
    }
    const nestedGroup = createRuleGroup({
      id: 'group-2',
      operator: 'or',
    })

    const nextGroup = addGroupToGroup(rootGroup, 'group-1', nestedGroup)

    expect(nextGroup.rules[0]).toEqual({
      ...childGroup,
      rules: [nestedGroup],
    })
  })

  it('removes a rule from any depth in the tree', () => {
    const conditionToKeep = createCondition({
      id: 'condition-1',
    })
    const conditionToRemove = createCondition({
      id: 'condition-2',
      field: 'segment',
      operator: 'contains',
      value: 'vip',
    })
    const childGroup: RuleGroup = {
      ...createGroup(),
      rules: [conditionToRemove],
    }
    const rootGroup: RuleGroup = {
      ...createRootRuleGroup(),
      rules: [conditionToKeep, childGroup],
    }

    const nextGroup = removeRuleFromGroup(rootGroup, 'condition-2')

    expect(nextGroup).toEqual({
      ...rootGroup,
      rules: [conditionToKeep, { ...childGroup, rules: [] }],
    })
  })

  it.each([
    {
      name: 'updates the operator of the target group',
      rootGroup: {
        ...createRootRuleGroup(),
        rules: [createGroup()],
      } as RuleGroup,
      expectedRules: [
        {
          ...createGroup(),
          operator: 'or' as const,
        },
      ],
    },
    {
      name: 'keeps sibling conditions untouched when updating a nested group',
      rootGroup: {
        ...createRootRuleGroup(),
        rules: [
          createCondition({
            id: 'condition-1',
          }),
          createGroup(),
        ],
      } as RuleGroup,
      expectedRules: [
        createCondition({
          id: 'condition-1',
        }),
        {
          ...createGroup(),
          operator: 'or' as const,
        },
      ],
    },
  ])('$name', ({ rootGroup, expectedRules }) => {
    const nextGroup = updateGroupOperator(rootGroup, 'group-1', 'or')

    expect(nextGroup.rules).toEqual(expectedRules)
  })

  it.each([
    {
      name: 'updates a condition without changing other rules',
      rootGroup: {
        ...createRootRuleGroup(),
        rules: [
          createCondition({
            id: 'condition-1',
          }),
          createCondition({
            id: 'condition-2',
            field: 'region',
            value: 'br',
          }),
        ],
      } as RuleGroup,
      patch: {
        operator: 'not_equals' as const,
        value: 'inactive',
      },
      expectedRules: [
        {
          ...createCondition({
            id: 'condition-1',
          }),
          operator: 'not_equals' as const,
          value: 'inactive',
        },
        createCondition({
          id: 'condition-2',
          field: 'region',
          value: 'br',
        }),
      ],
    },
    {
      name: 'updates a nested condition inside a child group',
      rootGroup: {
        ...createRootRuleGroup(),
        rules: [
          {
            ...createGroup(),
            rules: [
              createCondition({
                id: 'condition-1',
              }),
            ],
          },
        ],
      } as RuleGroup,
      patch: {
        value: 'inactive',
      },
      expectedRules: [
        {
          ...createGroup(),
          rules: [
            {
              ...createCondition({
                id: 'condition-1',
              }),
              value: 'inactive',
            },
          ],
        },
      ],
    },
  ])('$name', ({ rootGroup, patch, expectedRules }) => {
    const nextGroup = updateCondition(rootGroup, 'condition-1', patch)

    expect(nextGroup.rules).toEqual(expectedRules)
  })
})
