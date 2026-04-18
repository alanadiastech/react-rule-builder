import { useEffect, useRef, useState } from 'react'

import type { RuleCondition, RuleConditionPatch, RuleGroup } from '../../types/rule'
import { RuleGroupView } from './RuleGroupView'
import { createRuleSummary } from './rule-builder.summary'
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
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null)
  const saveButtonRef = useRef<HTMLButtonElement | null>(null)
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{
    kind: 'error' | 'success'
    text: string
  } | null>(null)
  const validationErrors = collectRuleValidationErrors(rootGroup)
  const validationCount = Object.keys(validationErrors).length
  const summary = createRuleSummary(rootGroup)

  const handleSave = () => {
    if (validationCount > 0) {
      setIsReviewOpen(false)
      setSaveMessage({
        kind: 'error',
        text:
          validationCount === 1
            ? 'Corrija 1 condição antes de salvar.'
            : `Corrija ${validationCount} condições antes de salvar.`,
      })
      return
    }

    setSaveMessage(null)
    setIsReviewOpen(true)
  }

  const handleCloseReview = () => {
    setIsReviewOpen(false)
  }

  const handleConfirmSave = () => {
    setIsReviewOpen(false)
    setSaveMessage({
      kind: 'success',
      text: 'Regra validada e pronta para salvar.',
    })
  }

  useEffect(() => {
    if (isReviewOpen) {
      confirmButtonRef.current?.focus()
      return
    }

    saveButtonRef.current?.focus()
  }, [isReviewOpen])

  return (
    <section className="rule-builder">
      <div className="rule-builder__header">
        <div>
          <p className="rule-builder__eyebrow">Construtor de Regras</p>
          <h1>Monte regras aninhadas passo a passo</h1>
        </div>

        <button
          className="rule-button"
          onClick={handleSave}
          ref={saveButtonRef}
          type="button"
        >
          Salvar regra
        </button>
      </div>

      {saveMessage && (
        <p
          aria-live="polite"
          className={
            saveMessage.kind === 'error'
              ? 'rule-builder__feedback rule-builder__feedback--error'
              : 'rule-builder__feedback rule-builder__feedback--success'
          }
          role="status"
        >
          {saveMessage.text}
        </p>
      )}

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

      {isReviewOpen && (
        <div
          aria-labelledby="rule-review-title"
          className="rule-review-modal"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              handleCloseReview()
            }
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="rule-review-modal__backdrop" onClick={handleCloseReview} />

          <div className="rule-review-modal__content">
            <p className="rule-summary__eyebrow">Resumo da regra</p>
            <h2 id="rule-review-title">Confirme a leitura antes de salvar</h2>
            <p className="rule-summary__text">{summary}</p>

            <details className="rule-preview rule-preview--modal">
              <summary className="rule-preview__summary">Ver JSON da regra</summary>

              <pre className="rule-preview__code">
                <code>{JSON.stringify(rootGroup, null, 2)}</code>
              </pre>
            </details>

            <div className="rule-review-modal__actions">
              <button
                className="rule-button rule-button--secondary"
                onClick={handleCloseReview}
                type="button"
              >
                Voltar e editar
              </button>

              <button
                className="rule-button"
                onClick={handleConfirmSave}
                ref={confirmButtonRef}
                type="button"
              >
                Confirmar salvamento
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
