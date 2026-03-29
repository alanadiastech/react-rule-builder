import { useState } from 'react'

import type {
  LogicalOperator,
  RuleCondition,
  RuleConditionPatch,
  RuleGroup,
} from '../types/rule'
import {
  addConditionToGroup,
  addGroupToGroup,
  createRootRuleGroup,
  removeRuleFromGroup,
  updateCondition,
  updateGroupOperator,
} from '../utils/rule-tree'

type UseRuleBuilderResult = {
  addCondition: (groupId: string, condition?: RuleCondition) => void
  addGroup: (groupId: string, group?: RuleGroup) => void
  removeRule: (ruleId: string) => void
  rootGroup: RuleGroup
  setGroupOperator: (groupId: string, operator: LogicalOperator) => void
  updateConditionById: (conditionId: string, patch: RuleConditionPatch) => void
}

export const useRuleBuilder = (
  initialGroup: RuleGroup = createRootRuleGroup(),
): UseRuleBuilderResult => {
  const [rootGroup, setRootGroup] = useState<RuleGroup>(initialGroup)

  const addCondition = (groupId: string, condition?: RuleCondition) => {
    setRootGroup((currentGroup) => addConditionToGroup(currentGroup, groupId, condition))
  }

  const addGroup = (groupId: string, group?: RuleGroup) => {
    setRootGroup((currentGroup) => addGroupToGroup(currentGroup, groupId, group))
  }

  const removeRule = (ruleId: string) => {
    setRootGroup((currentGroup) => removeRuleFromGroup(currentGroup, ruleId))
  }

  const setGroupOperator = (groupId: string, operator: LogicalOperator) => {
    setRootGroup((currentGroup) => updateGroupOperator(currentGroup, groupId, operator))
  }

  const updateConditionById = (conditionId: string, patch: RuleConditionPatch) => {
    setRootGroup((currentGroup) => updateCondition(currentGroup, conditionId, patch))
  }

  return {
    addCondition,
    addGroup,
    removeRule,
    rootGroup,
    setGroupOperator,
    updateConditionById,
  }
}
