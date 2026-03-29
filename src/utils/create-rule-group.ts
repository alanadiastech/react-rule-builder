import type { LogicalOperator, RuleGroup } from '../types/rule'

type CreateRuleGroupInput = {
  id?: string
  operator?: LogicalOperator
}

export const createRuleGroup = (input: CreateRuleGroupInput = {}): RuleGroup => {
  return {
    id: input.id ?? crypto.randomUUID(),
    operator: input.operator ?? 'and',
    rules: [],
  }
}
