export type LogicalOperator = 'and' | 'or'

export type ComparisonOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'greater_than_or_equal'
  | 'less_than'
  | 'less_than_or_equal'
  | 'in'
  | 'not_in'

export type RuleValue = string | number | boolean | string[]

export type RuleCondition = {
  id: string
  field: string
  operator: ComparisonOperator
  value: RuleValue
}

export type RuleGroup = {
  id: string
  operator: LogicalOperator
  rules: RuleNode[]
}

export type RuleNode = RuleCondition | RuleGroup

export type RuleConditionPatch = Partial<Omit<RuleCondition, 'id'>>

export const isRuleGroup = (rule: RuleNode): rule is RuleGroup => {
  return 'rules' in rule
}
