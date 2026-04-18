import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { RuleCondition, RuleGroup } from '../../../types/rule'
import { RuleGroupView } from '../RuleGroupView'

const createCondition = (id: string, field = 'user.account_status'): RuleCondition => ({
  field,
  id,
  operator: 'equals',
  value: 'active',
})

const createGroup = (rules: RuleGroup['rules'], isRoot = true): RuleGroup => ({
  id: isRoot ? 'root' : 'group-1',
  operator: 'and',
  rules,
})

describe('RuleGroupView', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders the empty state and both add actions', () => {
    render(
      <RuleGroupView
        conditionErrors={{}}
        group={createGroup([])}
        isRoot
        onAddCondition={vi.fn()}
        onAddGroup={vi.fn()}
        onRemoveRule={vi.fn()}
        onSetGroupOperator={vi.fn()}
        onUpdateCondition={vi.fn()}
      />,
    )

    expect(
      screen.getByText('Ainda nao ha regras. Adicione uma condição ou um grupo.'),
    ).not.toBeNull()
    expect(
      screen.getByRole('button', { name: 'Adicionar condição ao grupo root' }),
    ).not.toBeNull()
    expect(
      screen.getByRole('button', { name: 'Adicionar grupo dentro de root' }),
    ).not.toBeNull()
    expect(screen.queryByRole('button', { name: 'Remover grupo root' })).toBeNull()
  })

  it('renders simple conditions before nested groups and wires group actions', () => {
    const onAddCondition = vi.fn()
    const onAddGroup = vi.fn()
    const onRemoveRule = vi.fn()
    const onSetGroupOperator = vi.fn()

    const randomUuidSpy = vi
      .spyOn(crypto, 'randomUUID')
      .mockReturnValue('11111111-1111-1111-1111-111111111111')

    const nestedGroup: RuleGroup = {
      id: 'child-group',
      operator: 'and',
      rules: [],
    }
    const condition = createCondition('condition-1', 'device.location')
    const { container } = render(
      <RuleGroupView
        conditionErrors={{ 'condition-1': ['Informe um valor.'] }}
        group={createGroup([nestedGroup, condition], false)}
        onAddCondition={onAddCondition}
        onAddGroup={onAddGroup}
        onRemoveRule={onRemoveRule}
        onSetGroupOperator={onSetGroupOperator}
        onUpdateCondition={vi.fn()}
      />,
    )

    const content = container.querySelector('.rule-group__content')
    const children = content ? Array.from(content.children) : []

    expect(children[0]?.textContent).toContain('Localização do dispositivo')
    expect(children[1]?.textContent).toContain('Adicionar condição')
    expect(children[2]?.textContent).toContain('Grupo aninhado')

    fireEvent.change(screen.getAllByLabelText('Operador lógico')[0], {
      target: { value: 'or' },
    })
    fireEvent.click(
      screen.getAllByRole('button', { name: 'Adicionar condição ao grupo group-1' })[0],
    )
    fireEvent.click(
      screen.getAllByRole('button', { name: 'Adicionar grupo dentro de group-1' })[0],
    )
    fireEvent.click(screen.getAllByRole('button', { name: 'Remover grupo group-1' })[0])

    expect(onSetGroupOperator).toHaveBeenCalledWith('group-1', 'or')
    expect(onAddCondition).toHaveBeenCalledWith(
      'group-1',
      expect.objectContaining({
        field: 'user.account_status',
        id: '11111111-1111-1111-1111-111111111111',
        operator: 'equals',
        value: 'active',
      }),
    )
    expect(onAddGroup).toHaveBeenCalledWith('group-1')
    expect(onRemoveRule).toHaveBeenCalledWith('group-1')
    expect(within(children[2] as HTMLElement).getByText('Grupo aninhado')).not.toBeNull()
    randomUuidSpy.mockRestore()
  })
})
