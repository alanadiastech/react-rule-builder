import type { RuleCondition, RuleConditionPatch, RuleGroup } from '../../types/rule'
import { RuleGroupView } from './RuleGroupView'

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
  return (
    <section className="rule-builder">
      <div className="rule-builder__header">
        <div>
          <p className="rule-builder__eyebrow">Construtor de Regras</p>
          <h1>Monte regras aninhadas passo a passo</h1>
        </div>
      </div>

      <RuleGroupView
        group={rootGroup}
        isRoot
        onAddCondition={onAddCondition}
        onAddGroup={onAddGroup}
        onRemoveRule={onRemoveRule}
        onSetGroupOperator={onSetGroupOperator}
        onUpdateCondition={onUpdateCondition}
      />
    </section>
  )
}
