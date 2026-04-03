import type { RuleCondition, RuleConditionPatch } from '../../types/rule'

const operatorOptions: Array<{
  label: string
  value: RuleCondition['operator']
}> = [
  { label: 'igual a', value: 'equals' },
  { label: 'diferente de', value: 'not_equals' },
  { label: 'contem', value: 'contains' },
  { label: 'comeca com', value: 'starts_with' },
  { label: 'termina com', value: 'ends_with' },
  { label: 'maior que', value: 'greater_than' },
  { label: 'maior ou igual a', value: 'greater_than_or_equal' },
  { label: 'menor que', value: 'less_than' },
  { label: 'menor ou igual a', value: 'less_than_or_equal' },
  { label: 'esta em', value: 'in' },
  { label: 'nao esta em', value: 'not_in' },
]

type RuleConditionViewProps = {
  condition: RuleCondition
  onRemoveRule: (ruleId: string) => void
  onUpdateCondition: (conditionId: string, patch: RuleConditionPatch) => void
}

export const RuleConditionView = ({
  condition,
  onRemoveRule,
  onUpdateCondition,
}: RuleConditionViewProps) => {
  const fieldInputId = `${condition.id}-field`
  const operatorSelectId = `${condition.id}-operator`
  const valueInputId = `${condition.id}-value`

  return (
    <div aria-label={`Condicao ${condition.id}`} className="rule-condition">
      <div className="rule-field">
        <label className="rule-label" htmlFor={fieldInputId}>
          Campo
        </label>
        <input
          className="rule-input"
          id={fieldInputId}
          onChange={(event) => {
            onUpdateCondition(condition.id, {
              field: event.target.value,
            })
          }}
          placeholder="Ex.: status"
          type="text"
          value={condition.field}
        />
      </div>

      <div className="rule-field">
        <label className="rule-label" htmlFor={operatorSelectId}>
          Operador
        </label>
        <select
          className="rule-select"
          id={operatorSelectId}
          onChange={(event) => {
            onUpdateCondition(condition.id, {
              operator: event.target.value as RuleCondition['operator'],
            })
          }}
          value={condition.operator}
        >
          {operatorOptions.map((operator) => (
            <option key={operator.value} value={operator.value}>
              {operator.label}
            </option>
          ))}
        </select>
      </div>

      <div className="rule-field">
        <label className="rule-label" htmlFor={valueInputId}>
          Valor
        </label>
        <input
          className="rule-input"
          id={valueInputId}
          onChange={(event) => {
            onUpdateCondition(condition.id, {
              value: event.target.value,
            })
          }}
          placeholder="Ex.: ativo"
          type="text"
          value={String(condition.value)}
        />
      </div>

      <button
        aria-label={`Remover condicao ${condition.id}`}
        className="rule-button rule-button--danger"
        onClick={() => {
          onRemoveRule(condition.id)
        }}
        type="button"
      >
        Remover
      </button>
    </div>
  )
}
