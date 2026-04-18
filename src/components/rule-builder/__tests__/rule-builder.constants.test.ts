import { describe, expect, it } from 'vitest'

import {
  booleanValueOptions,
  comparisonOperatorLabels,
  getDefaultOperatorForField,
  getDefaultValueForField,
  getRuleFieldDefinition,
  logicalOperatorLabels,
} from '../rule-builder.constants'

describe('rule-builder.constants', () => {
  it('exposes localized labels', () => {
    expect(comparisonOperatorLabels.equals).toBe('igual a')
    expect(logicalOperatorLabels.and).toBe('E')
    expect(booleanValueOptions).toEqual([
      { label: 'Sim', value: 'true' },
      { label: 'Não', value: 'false' },
    ])
  })

  it('returns a field definition when it exists', () => {
    expect(getRuleFieldDefinition('transaction.amount')).toMatchObject({
      key: 'transaction.amount',
      type: 'number',
    })
  })

  it('returns undefined for unknown fields', () => {
    expect(getRuleFieldDefinition('unknown.field')).toBeUndefined()
  })

  it('returns the first operator by default and falls back to equals', () => {
    expect(
      getDefaultOperatorForField({
        key: 'field',
        label: 'Field',
        operators: ['greater_than'],
        type: 'number',
      }),
    ).toBe('greater_than')

    expect(
      getDefaultOperatorForField({
        key: 'field',
        label: 'Field',
        operators: [],
        type: 'string',
      }),
    ).toBe('equals')
  })

  it('returns default values for every field type', () => {
    expect(
      getDefaultValueForField({
        key: 'field',
        label: 'Field',
        operators: ['equals'],
        type: 'boolean',
      }),
    ).toBe(true)

    expect(
      getDefaultValueForField({
        key: 'field',
        label: 'Field',
        operators: ['equals'],
        type: 'number',
      }),
    ).toBe(0)

    expect(
      getDefaultValueForField({
        key: 'field',
        label: 'Field',
        operators: ['equals'],
        options: [{ label: 'One', value: 'one' }],
        type: 'enum',
      }),
    ).toBe('one')

    expect(
      getDefaultValueForField({
        key: 'field',
        label: 'Field',
        operators: ['equals'],
        options: [],
        type: 'enum',
      }),
    ).toBe('')

    expect(
      getDefaultValueForField({
        key: 'field',
        label: 'Field',
        operators: ['equals'],
        type: 'string',
      }),
    ).toBe('')
  })
})
