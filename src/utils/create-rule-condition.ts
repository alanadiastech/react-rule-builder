import type { ComparisonOperator, RuleCondition, RuleValue } from '../types/rule'

type CreateRuleConditionInput = {
  field?: string
  id?: string
  operator?: ComparisonOperator
  value?: RuleValue
}

export const createRuleCondition = (
  input: CreateRuleConditionInput = {},
): RuleCondition => {
  return {
    id: input.id ?? crypto.randomUUID(),
    field: input.field ?? '',
    operator: input.operator ?? 'equals',
    value: input.value ?? '',
  }
}
