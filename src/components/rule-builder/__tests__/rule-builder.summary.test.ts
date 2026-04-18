import { describe, expect, it } from 'vitest'

import type { RuleGroup } from '../../../types/rule'
import { createRuleSummary } from '../rule-builder.summary'

describe('createRuleSummary', () => {
  it('returns an empty summary when there are no rules', () => {
    expect(
      createRuleSummary({
        id: 'root',
        operator: 'and',
        rules: [],
      }),
    ).toBe('Nenhuma condição configurada.')
  })

  it('summarizes flat rule groups with localized labels', () => {
    expect(
      createRuleSummary({
        id: 'root',
        operator: 'and',
        rules: [
          {
            field: 'user.account_status',
            id: 'condition-1',
            operator: 'equals',
            value: 'active',
          },
          {
            field: 'transaction.amount',
            id: 'condition-2',
            operator: 'greater_than',
            value: 500,
          },
        ],
      }),
    ).toBe('Se Status da conta igual a Ativa e Valor da transação maior que 500.')
  })

  it('summarizes nested groups and unknown fields', () => {
    const group: RuleGroup = {
      id: 'root',
      operator: 'or',
      rules: [
        {
          field: 'security.is_vpn',
          id: 'condition-1',
          operator: 'equals',
          value: true,
        },
        {
          id: 'group-1',
          operator: 'and',
          rules: [
            {
              field: 'unknown.field',
              id: 'condition-2',
              operator: 'equals',
              value: 'custom',
            },
          ],
        },
      ],
    }

    expect(createRuleSummary(group)).toBe(
      'Se VPN ativa igual a Sim ou (unknown.field igual a custom).',
    )
  })

  it('falls back to raw values when boolean or enum options are unknown', () => {
    expect(
      createRuleSummary({
        id: 'root',
        operator: 'and',
        rules: [
          {
            field: 'security.is_vpn',
            id: 'condition-1',
            operator: 'equals',
            value: 'maybe',
          },
          {
            field: 'user.account_status',
            id: 'condition-2',
            operator: 'equals',
            value: 'paused',
          },
        ],
      }),
    ).toBe('Se VPN ativa igual a maybe e Status da conta igual a paused.')
  })

  it('falls back to the raw operator label when it is unknown', () => {
    expect(
      createRuleSummary({
        id: 'root',
        operator: 'and',
        rules: [
          {
            field: 'device.location',
            id: 'condition-1',
            operator: 'custom_operator' as never,
            value: 'Brasil',
          },
        ],
      }),
    ).toBe('Se Localização do dispositivo custom_operator Brasil.')
  })
})
