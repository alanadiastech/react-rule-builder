import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { RuleCondition } from '../../../types/rule'
import { RuleConditionView } from '../RuleConditionView'

const createCondition = (overrides: Partial<RuleCondition>): RuleCondition => ({
  field: 'user.account_status',
  id: 'condition-1',
  operator: 'equals',
  value: 'active',
  ...overrides,
})

describe('RuleConditionView', () => {
  afterEach(() => {
    cleanup()
  })

  it('updates field, operator and removes a condition', () => {
    const onRemoveRule = vi.fn()
    const onUpdateCondition = vi.fn()

    render(
      <RuleConditionView
        condition={createCondition({})}
        onRemoveRule={onRemoveRule}
        onUpdateCondition={onUpdateCondition}
      />,
    )

    fireEvent.change(screen.getByLabelText('Campo'), {
      target: { value: 'transaction.amount' },
    })
    fireEvent.change(screen.getByLabelText('Operador'), {
      target: { value: 'not_equals' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Remover condicao condition-1' }))

    expect(onUpdateCondition).toHaveBeenNthCalledWith(1, 'condition-1', {
      field: 'transaction.amount',
      operator: 'equals',
      value: 0,
    })
    expect(onUpdateCondition).toHaveBeenNthCalledWith(2, 'condition-1', {
      operator: 'not_equals',
    })
    expect(onRemoveRule).toHaveBeenCalledWith('condition-1')
  })

  it.each([
    ['enum', createCondition({ field: 'transaction.type', value: 'purchase' }), 'select'],
    ['boolean', createCondition({ field: 'security.is_vpn', value: true }), 'select'],
    ['number', createCondition({ field: 'transaction.amount', value: 10 }), 'spinbutton'],
    ['string', createCondition({ field: 'device.location', value: 'Brasil' }), 'textbox'],
  ])('renders the correct value control for %s fields', (_, condition, role) => {
    render(
      <RuleConditionView
        condition={condition}
        onRemoveRule={vi.fn()}
        onUpdateCondition={vi.fn()}
      />,
    )

    if (role === 'select') {
      expect(screen.getAllByRole('combobox').at(-1)?.tagName).toBe('SELECT')
      return
    }

    expect(screen.getByRole(role)).not.toBeNull()
  })

  it('updates number and boolean values with the correct types', () => {
    const onUpdateCondition = vi.fn()
    const { rerender } = render(
      <RuleConditionView
        condition={createCondition({ field: 'transaction.amount', value: 10 })}
        onRemoveRule={vi.fn()}
        onUpdateCondition={onUpdateCondition}
      />,
    )

    fireEvent.change(screen.getByRole('spinbutton'), {
      target: { value: '27' },
    })

    rerender(
      <RuleConditionView
        condition={createCondition({ field: 'security.is_vpn', value: true })}
        onRemoveRule={vi.fn()}
        onUpdateCondition={onUpdateCondition}
      />,
    )

    fireEvent.change(screen.getAllByRole('combobox')[2], {
      target: { value: 'false' },
    })

    expect(onUpdateCondition).toHaveBeenNthCalledWith(1, 'condition-1', {
      value: 27,
    })
    expect(onUpdateCondition).toHaveBeenNthCalledWith(2, 'condition-1', {
      value: false,
    })
  })

  it('updates enum and string values with the correct payload', () => {
    const onUpdateCondition = vi.fn()
    const { rerender } = render(
      <RuleConditionView
        condition={createCondition({ field: 'transaction.type', value: 'purchase' })}
        onRemoveRule={vi.fn()}
        onUpdateCondition={onUpdateCondition}
      />,
    )

    fireEvent.change(screen.getAllByRole('combobox')[2], {
      target: { value: 'refund' },
    })

    rerender(
      <RuleConditionView
        condition={createCondition({ field: 'device.location', value: 'Brasil' })}
        onRemoveRule={vi.fn()}
        onUpdateCondition={onUpdateCondition}
      />,
    )

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Bahia' },
    })

    expect(onUpdateCondition).toHaveBeenNthCalledWith(1, 'condition-1', {
      value: 'refund',
    })
    expect(onUpdateCondition).toHaveBeenNthCalledWith(2, 'condition-1', {
      value: 'Bahia',
    })
  })

  it('renders enum and boolean value controls with error metadata', () => {
    const { rerender } = render(
      <RuleConditionView
        condition={createCondition({ field: 'transaction.type', value: 'purchase' })}
        errors={['Selecione um valor válido.']}
        onRemoveRule={vi.fn()}
        onUpdateCondition={vi.fn()}
      />,
    )

    expect(screen.getAllByRole('combobox')[2].getAttribute('aria-invalid')).toBe('true')
    expect(screen.getAllByRole('combobox')[2].getAttribute('aria-describedby')).toBe(
      'condition-1-error',
    )

    rerender(
      <RuleConditionView
        condition={createCondition({ field: 'security.is_vpn', value: true })}
        errors={['Selecione Sim ou Não.']}
        onRemoveRule={vi.fn()}
        onUpdateCondition={vi.fn()}
      />,
    )

    expect(screen.getAllByRole('combobox')[2].getAttribute('aria-invalid')).toBe('true')
    expect(screen.getAllByRole('combobox')[2].getAttribute('aria-describedby')).toBe(
      'condition-1-error',
    )
  })

  it('falls back to zero for invalid numeric values and empty numeric input', () => {
    const onUpdateCondition = vi.fn()

    render(
      <RuleConditionView
        condition={createCondition({
          field: 'transaction.amount',
          value: 'not-a-number',
        })}
        onRemoveRule={vi.fn()}
        onUpdateCondition={onUpdateCondition}
      />,
    )

    const numberInput = screen.getByRole('spinbutton') as HTMLInputElement

    expect(numberInput.value).toBe('0')

    fireEvent.change(numberInput, {
      target: { value: '' },
    })

    expect(onUpdateCondition).toHaveBeenCalledWith('condition-1', {
      value: 0,
    })
  })

  it('ignores unknown field changes', () => {
    const onUpdateCondition = vi.fn()

    render(
      <RuleConditionView
        condition={createCondition({})}
        onRemoveRule={vi.fn()}
        onUpdateCondition={onUpdateCondition}
      />,
    )

    fireEvent.change(screen.getAllByRole('combobox')[0], {
      target: { value: 'unknown.field' },
    })

    expect(onUpdateCondition).not.toHaveBeenCalled()
  })

  it('falls back to the first field definition when the field is unknown', () => {
    render(
      <RuleConditionView
        condition={createCondition({ field: 'unknown.field', value: 'mystery' })}
        onRemoveRule={vi.fn()}
        onUpdateCondition={vi.fn()}
      />,
    )

    expect(screen.getAllByRole('combobox')[1].textContent).toContain('igual a')
    expect(screen.getAllByRole('combobox')[2].textContent).toContain('Ativa')
  })

  it('renders and associates validation errors with the value field', () => {
    render(
      <RuleConditionView
        condition={createCondition({ field: 'device.location', value: '' })}
        errors={['Informe um valor.']}
        onRemoveRule={vi.fn()}
        onUpdateCondition={vi.fn()}
      />,
    )

    const valueField = screen.getByRole('textbox')

    expect(screen.getByRole('alert').textContent).toContain('Informe um valor.')
    expect(valueField.getAttribute('aria-invalid')).toBe('true')
    expect(valueField.getAttribute('aria-describedby')).toBe('condition-1-error')
  })

  it('renders numeric fields with error metadata', () => {
    render(
      <RuleConditionView
        condition={createCondition({ field: 'transaction.amount', value: 12 })}
        errors={['Informe um número válido.']}
        onRemoveRule={vi.fn()}
        onUpdateCondition={vi.fn()}
      />,
    )

    const valueField = screen.getByRole('spinbutton')

    expect(valueField.getAttribute('aria-invalid')).toBe('true')
    expect(valueField.getAttribute('aria-describedby')).toBe('condition-1-error')
  })
})
