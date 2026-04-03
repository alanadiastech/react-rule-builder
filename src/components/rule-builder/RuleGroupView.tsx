import type { RuleCondition, RuleConditionPatch, RuleGroup } from '../../types/rule'
import { isRuleGroup } from '../../types/rule'
import { createRuleCondition } from '../../utils/create-rule-condition'
import { RuleConditionView } from './RuleConditionView'
import {
  getDefaultOperatorForField,
  getDefaultValueForField,
  logicalOperatorLabels,
  ruleFieldDefinitions,
} from './rule-builder.constants'

type RuleGroupViewProps = {
  group: RuleGroup
  isRoot?: boolean
  onAddCondition: (groupId: string, condition?: RuleCondition) => void
  onAddGroup: (groupId: string) => void
  onRemoveRule: (ruleId: string) => void
  onSetGroupOperator: (groupId: string, operator: RuleGroup['operator']) => void
  onUpdateCondition: (conditionId: string, patch: RuleConditionPatch) => void
}

export const RuleGroupView = ({
  group,
  isRoot = false,
  onAddCondition,
  onAddGroup,
  onRemoveRule,
  onSetGroupOperator,
  onUpdateCondition,
}: RuleGroupViewProps) => {
  const defaultField = ruleFieldDefinitions[0]
  const groupTitleId = `${group.id}-title`
  const groupDescriptionId = `${group.id}-description`
  const operatorSelectId = `${group.id}-logical-operator`

  return (
    <fieldset
      aria-describedby={groupDescriptionId}
      aria-labelledby={groupTitleId}
      className="rule-group"
    >
      <legend className="rule-group__legend" id={groupTitleId}>
        {isRoot ? 'Grupo raiz' : 'Grupo aninhado'}
      </legend>

      <header className="rule-group__header">
        <div className="rule-group__title">
          <small id={groupDescriptionId}>Identificador: {group.id}</small>
        </div>

        <div className="rule-group__controls">
          <div className="rule-field rule-field--compact">
            <label className="rule-label" htmlFor={operatorSelectId}>
              Operador lógico
            </label>
            <select
              className="rule-select"
              id={operatorSelectId}
              onChange={(event) => {
                onSetGroupOperator(group.id, event.target.value as RuleGroup['operator'])
              }}
              value={group.operator}
            >
              <option value="and">{logicalOperatorLabels.and}</option>
              <option value="or">{logicalOperatorLabels.or}</option>
            </select>
          </div>

          {!isRoot && (
            <button
              aria-label={`Remover grupo ${group.id}`}
              className="rule-button rule-button--danger"
              onClick={() => {
                onRemoveRule(group.id)
              }}
              type="button"
            >
              Remover grupo
            </button>
          )}
        </div>
      </header>

      <div className="rule-group__content">
        {group.rules.length === 0 && (
          <div className="rule-group__empty">
            Ainda nao ha regras. Adicione uma condição ou um grupo.
          </div>
        )}

        {group.rules.map((rule) => {
          if (isRuleGroup(rule)) {
            return (
              <RuleGroupView
                group={rule}
                key={rule.id}
                onAddCondition={onAddCondition}
                onAddGroup={onAddGroup}
                onRemoveRule={onRemoveRule}
                onSetGroupOperator={onSetGroupOperator}
                onUpdateCondition={onUpdateCondition}
              />
            )
          }

          return (
            <RuleConditionView
              condition={rule}
              key={rule.id}
              onRemoveRule={onRemoveRule}
              onUpdateCondition={onUpdateCondition}
            />
          )
        })}
      </div>

      <footer className="rule-group__actions">
        <button
          aria-label={`Adicionar condição ao grupo ${group.id}`}
          className="rule-button"
          onClick={() => {
            onAddCondition(
              group.id,
              createRuleCondition({
                field: defaultField.key,
                operator: getDefaultOperatorForField(defaultField),
                value: getDefaultValueForField(defaultField),
              }),
            )
          }}
          type="button"
        >
          Adicionar condição
        </button>

        <button
          aria-label={`Adicionar grupo dentro de ${group.id}`}
          className="rule-button rule-button--secondary"
          onClick={() => {
            onAddGroup(group.id)
          }}
          type="button"
        >
          Adicionar grupo
        </button>
      </footer>
    </fieldset>
  )
}
