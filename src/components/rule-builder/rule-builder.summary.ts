import type { RuleCondition, RuleGroup, RuleNode } from '../../types/rule'
import { isRuleGroup } from '../../types/rule'
import {
  booleanValueOptions,
  comparisonOperatorLabels,
  getRuleFieldDefinition,
  logicalOperatorLabels,
} from './rule-builder.constants'

const getConditionValueLabel = (condition: RuleCondition) => {
  const fieldDefinition = getRuleFieldDefinition(condition.field)

  if (!fieldDefinition) {
    return String(condition.value)
  }

  if (fieldDefinition.type === 'boolean') {
    return (
      booleanValueOptions.find((option) => option.value === String(condition.value))
        ?.label ?? String(condition.value)
    )
  }

  if (fieldDefinition.type === 'enum') {
    return (
      fieldDefinition.options?.find((option) => option.value === String(condition.value))
        ?.label ?? String(condition.value)
    )
  }

  return String(condition.value)
}

const summarizeCondition = (condition: RuleCondition) => {
  const fieldLabel = getRuleFieldDefinition(condition.field)?.label ?? condition.field
  const operatorLabel = comparisonOperatorLabels[condition.operator] ?? condition.operator
  const valueLabel = getConditionValueLabel(condition)

  return `${fieldLabel} ${operatorLabel} ${valueLabel}`
}

const summarizeNode = (node: RuleNode): string => {
  if (!isRuleGroup(node)) {
    return summarizeCondition(node)
  }

  return summarizeGroup(node, true)
}

const summarizeGroup = (group: RuleGroup, nested = false): string => {
  if (group.rules.length === 0) {
    return nested ? 'grupo vazio' : 'Nenhuma condição configurada.'
  }

  const connector = ` ${logicalOperatorLabels[group.operator].toLowerCase()} `
  const content = group.rules.map(summarizeNode).join(connector)

  return nested ? `(${content})` : `Se ${content}.`
}

export const createRuleSummary = (group: RuleGroup) => {
  return summarizeGroup(group)
}
