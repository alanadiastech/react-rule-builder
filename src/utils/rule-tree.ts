import type {
  LogicalOperator,
  RuleCondition,
  RuleConditionPatch,
  RuleGroup,
  RuleNode,
} from '../types/rule'
import { isRuleGroup } from '../types/rule'
import { createRuleCondition } from './create-rule-condition'
import { createRuleGroup } from './create-rule-group'

export const createRootRuleGroup = (): RuleGroup => {
  return createRuleGroup({
    id: 'root',
    operator: 'and',
  })
}

export const addConditionToGroup = (
  group: RuleGroup,
  groupId: string,
  condition: RuleCondition = createRuleCondition(),
): RuleGroup => {
  return updateGroupById(group, groupId, (currentGroup) => ({
    ...currentGroup,
    rules: [...currentGroup.rules, condition],
  }))
}

export const addGroupToGroup = (
  group: RuleGroup,
  groupId: string,
  childGroup: RuleGroup = createRuleGroup(),
): RuleGroup => {
  return updateGroupById(group, groupId, (currentGroup) => ({
    ...currentGroup,
    rules: [...currentGroup.rules, childGroup],
  }))
}

export const removeRuleFromGroup = (group: RuleGroup, ruleId: string): RuleGroup => {
  return removeRule(group, ruleId)
}

export const updateGroupOperator = (
  group: RuleGroup,
  groupId: string,
  operator: LogicalOperator,
): RuleGroup => {
  return updateGroupById(group, groupId, (currentGroup) => ({
    ...currentGroup,
    operator,
  }))
}

export const updateCondition = (
  group: RuleGroup,
  conditionId: string,
  patch: RuleConditionPatch,
): RuleGroup => {
  return mapRuleTree(group, (rule) => {
    if (isRuleGroup(rule) || rule.id !== conditionId) {
      return rule
    }

    return {
      ...rule,
      ...patch,
    }
  })
}

const updateGroupById = (
  group: RuleGroup,
  groupId: string,
  update: (group: RuleGroup) => RuleGroup,
): RuleGroup => {
  if (group.id === groupId) {
    return update(group)
  }

  return {
    ...group,
    rules: group.rules.map((rule) => {
      if (!isRuleGroup(rule)) {
        return rule
      }

      return updateGroupById(rule, groupId, update)
    }),
  }
}

const removeRule = (group: RuleGroup, ruleId: string): RuleGroup => {
  return {
    ...group,
    rules: group.rules
      .filter((rule) => rule.id !== ruleId)
      .map((rule) => {
        if (!isRuleGroup(rule)) {
          return rule
        }

        return removeRule(rule, ruleId)
      }),
  }
}

const mapRuleTree = (
  group: RuleGroup,
  transform: (rule: RuleNode) => RuleNode,
): RuleGroup => {
  return {
    ...group,
    rules: group.rules.map((rule) => {
      const nextRule = transform(rule)

      if (!isRuleGroup(nextRule)) {
        return nextRule
      }

      return mapRuleTree(nextRule, transform)
    }),
  }
}
