import { describe, expect, it, vi } from 'vitest'

import type { RuleCondition, RuleGroup } from '../../../types/rule'
import * as constants from '../rule-builder.constants'
import {
  collectRuleValidationErrors,
  validateRuleCondition,
} from '../rule-builder.validation'

const createCondition = (overrides: Partial<RuleCondition>): RuleCondition => ({
  field: 'device.location',
  id: 'condition-1',
  operator: 'equals',
  value: 'Brasil',
  ...overrides,
})

const createGroup = (rules: RuleGroup['rules']): RuleGroup => ({
  id: 'root',
  operator: 'and',
  rules,
})

describe('validateRuleCondition', () => {
  it.each([
    [
      'flags an unknown field',
      createCondition({ field: 'unknown.field' }),
      ['Selecione um campo válido.'],
    ],
    [
      'flags an incompatible operator',
      createCondition({ field: 'transaction.amount', operator: 'contains' }),
      ['Selecione um operador compatível com o campo.'],
    ],
    [
      'flags an empty string value',
      createCondition({ value: '   ' }),
      ['Informe um valor.'],
    ],
    [
      'flags an invalid number',
      createCondition({ field: 'transaction.amount', value: 'abc' }),
      ['Informe um número válido.'],
    ],
    [
      'flags an invalid enum value',
      createCondition({ field: 'transaction.type', value: 'transfer' }),
      ['Selecione um valor válido.'],
    ],
    [
      'flags an invalid boolean value',
      createCondition({ field: 'security.is_vpn', value: 'true' }),
      ['Selecione Sim ou Não.'],
    ],
    [
      'accepts a valid condition',
      createCondition({ field: 'transaction.type', value: 'purchase' }),
      [],
    ],
    [
      'accepts a valid string condition',
      createCondition({ field: 'device.location', value: 'Bahia' }),
      [],
    ],
    [
      'accepts a valid number condition',
      createCondition({
        field: 'transaction.amount',
        operator: 'greater_than',
        value: 99,
      }),
      [],
    ],
    [
      'accepts a valid boolean condition',
      createCondition({ field: 'security.is_vpn', value: true }),
      [],
    ],
  ])('%s', (_, condition, expected) => {
    expect(validateRuleCondition(condition)).toEqual(expected)
  })
})

describe('collectRuleValidationErrors', () => {
  it('collects errors from nested groups', () => {
    const nestedGroup: RuleGroup = {
      id: 'group-1',
      operator: 'or',
      rules: [
        createCondition({
          field: 'device.location',
          id: 'condition-2',
          value: '',
        }),
      ],
    }

    expect(
      collectRuleValidationErrors(
        createGroup([
          createCondition({
            field: 'transaction.amount',
            id: 'condition-1',
            operator: 'greater_than',
            value: Number.NaN,
          }),
          nestedGroup,
        ]),
      ),
    ).toEqual({
      'condition-1': ['Informe um número válido.'],
      'condition-2': ['Informe um valor.'],
    })
  })

  it('returns an empty object when no rules are invalid', () => {
    expect(
      collectRuleValidationErrors(
        createGroup([
          createCondition({ field: 'device.location', value: 'Brasil' }),
          createCondition({
            field: 'security.is_vpn',
            id: 'condition-2',
            value: false,
          }),
        ]),
      ),
    ).toEqual({})
  })

  it('treats enum fields without options as invalid', () => {
    const getRuleFieldDefinitionSpy = vi
      .spyOn(constants, 'getRuleFieldDefinition')
      .mockReturnValue({
        key: 'custom.enum',
        label: 'Custom enum',
        operators: ['equals'],
        type: 'enum',
      })

    expect(
      validateRuleCondition({
        field: 'custom.enum',
        id: 'condition-3',
        operator: 'equals',
        value: 'value',
      }),
    ).toEqual(['Selecione um valor válido.'])

    getRuleFieldDefinitionSpy.mockRestore()
  })
})
