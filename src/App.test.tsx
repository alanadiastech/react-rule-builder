import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  it('wires the rule builder interactions end to end', () => {
    render(<App />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Adicionar condição ao grupo root' }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Adicionar grupo dentro de root' }),
    )
    fireEvent.change(screen.getAllByLabelText('Operador lógico')[0], {
      target: { value: 'or' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Remover condicao/ }))

    expect(screen.getByText('Grupo aninhado')).not.toBeNull()
    expect(
      (screen.getAllByLabelText('Operador lógico')[0] as HTMLSelectElement).value,
    ).toBe('or')
    expect(screen.queryByRole('button', { name: /Remover condicao/ })).toBeNull()
  })
})
