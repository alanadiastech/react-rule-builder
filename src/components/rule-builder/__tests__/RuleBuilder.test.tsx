import { render, screen } from '@testing-library/react'
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
  it('renders the builder shell and the collapsible json preview', () => {
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
    expect(screen.getByText('Ver JSON da regra')).not.toBeNull()
    expect(screen.getByRole('alert').textContent).toContain('Informe um valor.')
    expect(document.body.textContent).toContain('"id": "root"')
  })
})
