import { useState } from 'react'
import { ArrowLeft, Trash2, ChevronDown, ChevronUp, BookOpen } from 'lucide-react'

const LEVEL_CONFIG = {
  leve: { emoji: '🟢', label: 'Leve' },
  moderado: { emoji: '🟡', label: 'Moderado' },
  intenso: { emoji: '🔴', label: 'Intenso' },
}

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function PlanCard({ plan, onDelete }) {
  const [open, setOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function handleDelete() {
    if (confirmDelete) {
      onDelete(plan.id)
    } else {
      setConfirmDelete(true)
    }
  }

  return (
    <div
      className="bg-card border border-border-subtle rounded-xl overflow-hidden"
      role="article"
      aria-label={`Plano: ${plan.title}`}
    >
      <div className="flex items-center gap-3 px-5 py-4">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex-1 flex items-center gap-3 text-left min-w-0"
          aria-expanded={open}
          aria-controls={`plan-body-${plan.id}`}
          aria-label={`${open ? 'Fechar' : 'Expandir'} plano: ${plan.title}`}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#e8a83820' }}
            aria-hidden="true"
          >
            <BookOpen size={16} style={{ color: '#e8a838' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-text-main text-sm truncate">{plan.title}</p>
            <p className="text-xs text-text-muted">
              {formatDate(plan.savedAt)} · {plan.activities?.length ?? 0} atividades
            </p>
          </div>
          {open ? (
            <ChevronUp size={16} className="text-text-muted flex-shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown size={16} className="text-text-muted flex-shrink-0" aria-hidden="true" />
          )}
        </button>

        <button
          onClick={handleDelete}
          onBlur={() => setConfirmDelete(false)}
          className="p-2 rounded-lg transition-colors flex-shrink-0"
          style={{ color: confirmDelete ? '#ef4444' : '#a0a0b0' }}
          aria-label={confirmDelete ? 'Clique novamente para confirmar exclusão' : `Excluir plano: ${plan.title}`}
          title={confirmDelete ? 'Clique para confirmar exclusão' : 'Excluir plano'}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {open && (
        <div id={`plan-body-${plan.id}`} className="px-5 pb-5 flex flex-col gap-3">
          {plan.summary && (
            <p className="text-sm text-text-muted leading-relaxed border-t border-border-subtle pt-3">
              {plan.summary}
            </p>
          )}
          <div className="flex flex-col gap-2">
            {plan.activities?.map((act, idx) => {
              const level = LEVEL_CONFIG[act.level] || LEVEL_CONFIG.leve
              return (
                <div
                  key={act.id}
                  className="flex items-start gap-3 bg-background rounded-lg px-3 py-3"
                >
                  <span
                    className="text-xs font-bold text-text-muted mt-0.5 flex-shrink-0 w-4 text-center"
                    aria-hidden="true"
                  >
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-main font-medium">{act.title}</p>
                    <p className="text-xs text-text-muted mt-0.5">{act.description}</p>
                    {act.script && (
                      <p
                        className="text-xs mt-2 italic px-2 py-1 rounded"
                        style={{ backgroundColor: '#1e3a5f', color: '#7ec8e3' }}
                      >
                        "{act.script}"
                      </p>
                    )}
                  </div>
                  <span
                    className="text-xs flex-shrink-0 mt-0.5"
                    aria-label={`Nível: ${level.label}`}
                  >
                    {level.emoji}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SavedPlansScreen({ plans, onDelete, onBack }) {
  return (
    <main className="min-h-screen flex flex-col max-w-2xl mx-auto px-4 py-6">
      <header className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-card transition-colors"
          aria-label="Voltar para a tela inicial"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-text-main">Meus Planos</h1>
        {plans.length > 0 && (
          <span className="text-sm text-text-muted">({plans.length})</span>
        )}
      </header>

      {plans.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: '#16213e' }}
            aria-hidden="true"
          >
            <BookOpen size={28} style={{ color: '#e8a838' }} />
          </div>
          <h2 className="text-text-main font-semibold mb-2">Nenhum plano salvo ainda</h2>
          <p className="text-text-muted text-sm max-w-xs leading-relaxed">
            Após gerar um plano de ação, você pode salvá-lo aqui para consultar quando quiser.
          </p>
          <button
            onClick={onBack}
            className="mt-6 px-5 py-3 rounded-xl text-sm font-medium transition-colors"
            style={{ backgroundColor: '#e8a838', color: '#1a1a2e' }}
          >
            Explorar uma situação
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3" role="list" aria-label="Lista de planos salvos">
          {plans.map((plan) => (
            <div key={plan.id} role="listitem">
              <PlanCard plan={plan} onDelete={onDelete} />
            </div>
          ))}
          <p className="text-center text-xs text-text-muted mt-2">
            Máximo de 20 planos salvos. Os mais antigos são removidos automaticamente.
          </p>
        </div>
      )}
    </main>
  )
}
