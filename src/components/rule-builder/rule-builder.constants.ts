import type { ComparisonOperator, LogicalOperator, RuleValue } from '../../types/rule'

export type RuleFieldType = 'boolean' | 'enum' | 'number' | 'string'

export type RuleFieldOption = {
  label: string
  value: string
}

export type RuleFieldDefinition = {
  key: string
  label: string
  operators: ComparisonOperator[]
  options?: RuleFieldOption[]
  type: RuleFieldType
}

export const comparisonOperatorLabels: Record<ComparisonOperator, string> = {
  contains: 'contém',
  ends_with: 'termina com',
  equals: 'igual a',
  greater_than: 'maior que',
  greater_than_or_equal: 'maior ou igual a',
  in: 'está em',
  less_than: 'menor que',
  less_than_or_equal: 'menor ou igual a',
  not_equals: 'diferente de',
  not_in: 'não está em',
  starts_with: 'começa com',
}

export const logicalOperatorLabels: Record<LogicalOperator, string> = {
  and: 'E',
  or: 'OU',
}

export const ruleFieldDefinitions: RuleFieldDefinition[] = [
  {
    key: 'user.account_status',
    label: 'Status da conta',
    operators: ['equals', 'not_equals', 'in', 'not_in'],
    options: [
      { label: 'Ativa', value: 'active' },
      { label: 'Inativa', value: 'inactive' },
      { label: 'Bloqueada', value: 'blocked' },
    ],
    type: 'enum',
  },
  {
    key: 'transaction.amount',
    label: 'Valor da transação',
    operators: [
      'equals',
      'greater_than',
      'greater_than_or_equal',
      'less_than',
      'less_than_or_equal',
    ],
    type: 'number',
  },
  {
    key: 'transaction.type',
    label: 'Tipo de transação',
    operators: ['equals', 'not_equals'],
    options: [
      { label: 'Compra', value: 'purchase' },
      { label: 'Reembolso', value: 'refund' },
      { label: 'Chargeback', value: 'chargeback' },
    ],
    type: 'enum',
  },
  {
    key: 'device.location',
    label: 'Localização do dispositivo',
    operators: ['equals', 'not_equals', 'contains', 'starts_with', 'ends_with'],
    type: 'string',
  },
  {
    key: 'security.is_vpn',
    label: 'VPN ativa',
    operators: ['equals', 'not_equals'],
    type: 'boolean',
  },
]

export const booleanValueOptions: RuleFieldOption[] = [
  { label: 'Sim', value: 'true' },
  { label: 'Não', value: 'false' },
]

export const getRuleFieldDefinition = (fieldKey: string) => {
  return ruleFieldDefinitions.find((field) => field.key === fieldKey)
}

export const getDefaultOperatorForField = (field: RuleFieldDefinition) => {
  return field.operators[0] ?? 'equals'
}

export const getDefaultValueForField = (field: RuleFieldDefinition): RuleValue => {
  if (field.type === 'boolean') {
    return true
  }

  if (field.type === 'number') {
    return 0
  }

  if (field.type === 'enum') {
    return field.options?.[0]?.value ?? ''
  }

  return ''
}
