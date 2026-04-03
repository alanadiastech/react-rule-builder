import { RuleBuilder } from './components/rule-builder/RuleBuilder'
import { useRuleBuilder } from './hooks/use-rule-builder'
import './styles/index.css'

function App() {
  const {
    addCondition,
    addGroup,
    removeRule,
    rootGroup,
    setGroupOperator,
    updateConditionById,
  } = useRuleBuilder()

  return (
    <main className="app-shell">
      <RuleBuilder
        onAddCondition={addCondition}
        onAddGroup={addGroup}
        onRemoveRule={removeRule}
        onSetGroupOperator={setGroupOperator}
        onUpdateCondition={updateConditionById}
        rootGroup={rootGroup}
      />
    </main>
  )
}

export default App
