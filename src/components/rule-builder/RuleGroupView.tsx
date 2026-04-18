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
import type { RuleValidationErrors } from './rule-builder.validation'

type RuleGroupViewProps = {
  conditionErrors: RuleValidationErrors
  group: RuleGroup
  isRoot?: boolean
  onAddCondition: (groupId: string, condition?: RuleCondition) => void
  onAddGroup: (groupId: string) => void
  onRemoveRule: (ruleId: string) => void
  onSetGroupOperator: (groupId: string, operator: RuleGroup['operator']) => void
  onUpdateCondition: (conditionId: string, patch: RuleConditionPatch) => void
}

export const RuleGroupView = ({
  conditionErrors,
  group,
  isRoot = false,
  onAddCondition,
  onAddGroup,
  onRemoveRule,
  onSetGroupOperator,
  onUpdateCondition,
}: RuleGroupViewProps) => {
  const defaultField = ruleFieldDefinitions[0]
  const conditionRules = group.rules.filter(
    (rule): rule is RuleCondition => !isRuleGroup(rule),
  )
  const groupTitleId = `${group.id}-title`
  const groupDescriptionId = `${group.id}-description`
  const groupRules = group.rules.filter((rule) => isRuleGroup(rule))
  const operatorSelectId = `${group.id}-logical-operator`
  const renderAddConditionButton = () => {
    return (
      <div className="rule-group__inline-actions">
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
      </div>
    )
  }

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
          <>
            <div className="rule-group__empty">
              Ainda nao ha regras. Adicione uma condição ou um grupo.
            </div>
            {renderAddConditionButton()}
          </>
        )}

        {conditionRules.map((rule) => (
          <div className="rule-group__item" key={rule.id}>
            <RuleConditionView
              condition={rule}
              errors={conditionErrors[rule.id]}
              onRemoveRule={onRemoveRule}
              onUpdateCondition={onUpdateCondition}
            />
          </div>
        ))}

        {group.rules.length > 0 && renderAddConditionButton()}

        {groupRules.map((rule) => (
          <div className="rule-group__item" key={rule.id}>
            <RuleGroupView
              conditionErrors={conditionErrors}
              group={rule}
              onAddCondition={onAddCondition}
              onAddGroup={onAddGroup}
              onRemoveRule={onRemoveRule}
              onSetGroupOperator={onSetGroupOperator}
              onUpdateCondition={onUpdateCondition}
            />
          </div>
        ))}
      </div>
    </fieldset>
  )
}
