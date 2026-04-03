import type { RuleCondition, RuleConditionPatch } from '../../types/rule'
import {
  booleanValueOptions,
  comparisonOperatorLabels,
  getDefaultOperatorForField,
  getDefaultValueForField,
  getRuleFieldDefinition,
  ruleFieldDefinitions,
} from './rule-builder.constants'

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
  const fieldDefinition =
    getRuleFieldDefinition(condition.field) ?? ruleFieldDefinitions[0]
  const operatorOptions = fieldDefinition.operators.map((operator) => ({
    label: comparisonOperatorLabels[operator],
    value: operator,
  }))
  const operatorSelectId = `${condition.id}-operator`
  const valueInputId = `${condition.id}-value`
  const valueAsString =
    typeof condition.value === 'string' ? condition.value : String(condition.value)

  return (
    <div aria-label={`Condicao ${condition.id}`} className="rule-condition">
      <div className="rule-field">
        <label className="rule-label" htmlFor={fieldInputId}>
          Campo
        </label>
        <select
          className="rule-select"
          id={fieldInputId}
          onChange={(event) => {
            const nextField = getRuleFieldDefinition(event.target.value)

            if (!nextField) {
              return
            }

            onUpdateCondition(condition.id, {
              field: nextField.key,
              operator: getDefaultOperatorForField(nextField),
              value: getDefaultValueForField(nextField),
            })
          }}
          value={condition.field}
        >
          {ruleFieldDefinitions.map((field) => (
            <option key={field.key} value={field.key}>
              {field.label}
            </option>
          ))}
        </select>
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
        {fieldDefinition.type === 'enum' && (
          <select
            className="rule-select"
            id={valueInputId}
            onChange={(event) => {
              onUpdateCondition(condition.id, {
                value: event.target.value,
              })
            }}
            value={valueAsString}
          >
            {fieldDefinition.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {fieldDefinition.type === 'boolean' && (
          <select
            className="rule-select"
            id={valueInputId}
            onChange={(event) => {
              onUpdateCondition(condition.id, {
                value: event.target.value === 'true',
              })
            }}
            value={valueAsString}
          >
            {booleanValueOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {fieldDefinition.type === 'number' && (
          <input
            className="rule-input"
            id={valueInputId}
            onChange={(event) => {
              onUpdateCondition(condition.id, {
                value: event.target.value === '' ? 0 : Number(event.target.value),
              })
            }}
            step="any"
            type="number"
            value={typeof condition.value === 'number' ? condition.value : 0}
          />
        )}

        {fieldDefinition.type === 'string' && (
          <input
            className="rule-input"
            id={valueInputId}
            onChange={(event) => {
              onUpdateCondition(condition.id, {
                value: event.target.value,
              })
            }}
            placeholder="Ex.: Brasil"
            type="text"
            value={valueAsString}
          />
        )}
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
