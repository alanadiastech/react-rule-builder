import type { RuleCondition, RuleConditionPatch, RuleGroup } from '../../types/rule'
import { RuleGroupView } from './RuleGroupView'
import { collectRuleValidationErrors } from './rule-builder.validation'

type RuleBuilderProps = {
  onAddCondition: (groupId: string, condition?: RuleCondition) => void
  onAddGroup: (groupId: string) => void
  onRemoveRule: (ruleId: string) => void
  onSetGroupOperator: (groupId: string, operator: RuleGroup['operator']) => void
  onUpdateCondition: (conditionId: string, patch: RuleConditionPatch) => void
  rootGroup: RuleGroup
}

export const RuleBuilder = ({
  onAddCondition,
  onAddGroup,
  onRemoveRule,
  onSetGroupOperator,
  onUpdateCondition,
  rootGroup,
}: RuleBuilderProps) => {
  const validationErrors = collectRuleValidationErrors(rootGroup)

  return (
    <section className="rule-builder">
      <div className="rule-builder__header">
        <div>
          <p className="rule-builder__eyebrow">Construtor de Regras</p>
          <h1>Monte regras aninhadas passo a passo</h1>
        </div>
      </div>

      <RuleGroupView
        conditionErrors={validationErrors}
        group={rootGroup}
        isRoot
        onAddCondition={onAddCondition}
        onAddGroup={onAddGroup}
        onRemoveRule={onRemoveRule}
        onSetGroupOperator={onSetGroupOperator}
        onUpdateCondition={onUpdateCondition}
      />

      <details className="rule-preview">
        <summary className="rule-preview__summary">Ver JSON da regra</summary>

        <pre className="rule-preview__code">
          <code>{JSON.stringify(rootGroup, null, 2)}</code>
        </pre>
      </details>
    </section>
  )
}
