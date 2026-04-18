import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { RuleGroup } from '../../../types/rule'
import { RuleBuilder } from '../RuleBuilder'

const invalidRootGroup: RuleGroup = {
  id: 'root',
  operator: 'and',
  rules: [
    {
      field: 'device.location',
      id: 'condition-1',
      operator: 'equals',
      value: '',
    },
  ],
}

describe('RuleBuilder', () => {
  it('renders the builder shell without opening the review flow by default', () => {
    render(
      <RuleBuilder
        onAddCondition={vi.fn()}
        onAddGroup={vi.fn()}
        onRemoveRule={vi.fn()}
        onSetGroupOperator={vi.fn()}
        onUpdateCondition={vi.fn()}
        rootGroup={invalidRootGroup}
      />,
    )

    expect(screen.getByText('Construtor de Regras')).not.toBeNull()
    expect(screen.getByText('Monte regras aninhadas passo a passo')).not.toBeNull()
    expect(screen.getByRole('alert').textContent).toContain('Informe um valor.')
    expect(screen.queryByText('Resumo da regra')).toBeNull()
    expect(screen.queryByText('Confirme a leitura antes de salvar')).toBeNull()
    expect(screen.queryByText('Ver JSON da regra')).toBeNull()
  })

  it('shows save feedback for invalid builders and opens a review modal for valid ones', () => {
    const validRootGroup: RuleGroup = {
      id: 'root',
      operator: 'and',
      rules: [
        {
          field: 'transaction.type',
          id: 'condition-1',
          operator: 'equals',
          value: 'purchase',
        },
      ],
    }

    const { rerender } = render(
      <RuleBuilder
        onAddCondition={vi.fn()}
        onAddGroup={vi.fn()}
        onRemoveRule={vi.fn()}
        onSetGroupOperator={vi.fn()}
        onUpdateCondition={vi.fn()}
        rootGroup={invalidRootGroup}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Salvar regra' }))

    expect(screen.getByText('Corrija 1 condição antes de salvar.')).not.toBeNull()

    rerender(
      <RuleBuilder
        onAddCondition={vi.fn()}
        onAddGroup={vi.fn()}
        onRemoveRule={vi.fn()}
        onSetGroupOperator={vi.fn()}
        onUpdateCondition={vi.fn()}
        rootGroup={validRootGroup}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Salvar regra' }))

    expect(screen.getByRole('dialog')).not.toBeNull()
    expect(screen.getByText('Resumo da regra')).not.toBeNull()
    expect(screen.getByText('Confirme a leitura antes de salvar')).not.toBeNull()
    expect(screen.getByText('Se Tipo de transação igual a Compra.')).not.toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar salvamento' }))

    expect(screen.getByText('Regra validada e pronta para salvar.')).not.toBeNull()
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('shows plural save feedback when more than one condition is invalid', () => {
    const invalidGroupWithMultipleErrors: RuleGroup = {
      id: 'root',
      operator: 'and',
      rules: [
        {
          field: 'device.location',
          id: 'condition-1',
          operator: 'equals',
          value: '',
        },
        {
          field: 'transaction.amount',
          id: 'condition-2',
          operator: 'greater_than',
          value: '',
        },
      ],
    }

    render(
      <RuleBuilder
        onAddCondition={vi.fn()}
        onAddGroup={vi.fn()}
        onRemoveRule={vi.fn()}
        onSetGroupOperator={vi.fn()}
        onUpdateCondition={vi.fn()}
        rootGroup={invalidGroupWithMultipleErrors}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Salvar regra' }))

    expect(screen.getByText('Corrija 2 condições antes de salvar.')).not.toBeNull()
  })

  it('allows closing the review modal to keep editing', () => {
    const validRootGroup: RuleGroup = {
      id: 'root',
      operator: 'and',
      rules: [
        {
          field: 'transaction.type',
          id: 'condition-1',
          operator: 'equals',
          value: 'purchase',
        },
      ],
    }

    render(
      <RuleBuilder
        onAddCondition={vi.fn()}
        onAddGroup={vi.fn()}
        onRemoveRule={vi.fn()}
        onSetGroupOperator={vi.fn()}
        onUpdateCondition={vi.fn()}
        rootGroup={validRootGroup}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Salvar regra' }))
    fireEvent.click(screen.getByRole('button', { name: 'Voltar e editar' }))

    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByText('Regra validada e pronta para salvar.')).toBeNull()
  })

  it('allows closing the review modal with Escape and backdrop click', () => {
    const validRootGroup: RuleGroup = {
      id: 'root',
      operator: 'and',
      rules: [
        {
          field: 'transaction.type',
          id: 'condition-1',
          operator: 'equals',
          value: 'purchase',
        },
      ],
    }

    const { container } = render(
      <RuleBuilder
        onAddCondition={vi.fn()}
        onAddGroup={vi.fn()}
        onRemoveRule={vi.fn()}
        onSetGroupOperator={vi.fn()}
        onUpdateCondition={vi.fn()}
        rootGroup={validRootGroup}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Salvar regra' }))
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Enter' })

    expect(screen.getByRole('dialog')).not.toBeNull()

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })

    expect(screen.queryByRole('dialog')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Salvar regra' }))
    fireEvent.click(container.querySelector('.rule-review-modal__backdrop') as Element)

    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
