import type { RuleCondition, RuleGroup } from '../../types/rule'
import { isRuleGroup } from '../../types/rule'
import { getRuleFieldDefinition } from './rule-builder.constants'

export type RuleValidationErrors = Record<string, string[]>

const getValueErrorMessage = (condition: RuleCondition) => {
  const fieldDefinition = getRuleFieldDefinition(condition.field)

  if (!fieldDefinition) {
    return 'Selecione um campo válido.'
  }

  if (!fieldDefinition.operators.includes(condition.operator)) {
    return 'Selecione um operador compatível com o campo.'
  }

  if (fieldDefinition.type === 'string') {
    return String(condition.value).trim() === '' ? 'Informe um valor.' : null
  }

  if (fieldDefinition.type === 'number') {
    return typeof condition.value !== 'number' || Number.isNaN(condition.value)
      ? 'Informe um número válido.'
      : null
  }

  if (fieldDefinition.type === 'boolean') {
    return typeof condition.value !== 'boolean' ? 'Selecione Sim ou Não.' : null
  }

  const validOptions = fieldDefinition.options?.map((option) => option.value) ?? []

  return typeof condition.value !== 'string' || !validOptions.includes(condition.value)
    ? 'Selecione um valor válido.'
    : null
}

export const validateRuleCondition = (condition: RuleCondition): string[] => {
  const errorMessage = getValueErrorMessage(condition)

  return errorMessage ? [errorMessage] : []
}

export const collectRuleValidationErrors = (
  group: RuleGroup,
  errors: RuleValidationErrors = {},
): RuleValidationErrors => {
  for (const rule of group.rules) {
    if (isRuleGroup(rule)) {
      collectRuleValidationErrors(rule, errors)
      continue
    }

    const conditionErrors = validateRuleCondition(rule)

    if (conditionErrors.length > 0) {
      errors[rule.id] = conditionErrors
    }
  }

  return errors
}
