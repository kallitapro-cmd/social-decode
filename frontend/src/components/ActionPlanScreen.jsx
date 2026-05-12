import { useState } from 'react'
import { CheckCircle, ArrowLeft, Plus, MessageCircle, BookmarkPlus, ChevronDown, ChevronUp } from 'lucide-react'

const LEVEL_CONFIG = {
  leve: { emoji: '🟢', label: 'Leve', color: '#22c55e' },
  moderado: { emoji: '🟡', label: 'Moderado', color: '#eab308' },
  intenso: { emoji: '🔴', label: 'Intenso', color: '#ef4444' },
}

function ActivityCard({ activity, index }) {
  const [open, setOpen] = useState(false)
  const level = LEVEL_CONFIG[activity.level] || LEVEL_CONFIG.leve

  return (
    <div
      className="bg-card border border-border-subtle rounded-xl overflow-hidden"
      role="article"
      aria-label={`Atividade ${index + 1}: ${activity.title}`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/5 transition-colors"
        aria-expanded={open}
        aria-controls={`activity-body-${activity.id}`}
      >
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
          style={{ backgroundColor: '#1a1a2e', border: `2px solid ${level.color}`, color: level.color }}
          aria-hidden="true"
        >
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-text-main text-sm truncate">{activity.title}</p>
        </div>
        <span
          className="text-xs font-medium px-2 py-1 rounded-full flex-shrink-0"
          style={{ backgroundColor: level.color + '20', color: level.color }}
          aria-label={`Nível de desafio: ${level.label}`}
        >
          {level.emoji} {level.label}
        </span>
        {open ? (
          <ChevronUp size={16} className="text-text-muted flex-shrink-0" aria-hidden="true" />
        ) : (
          <ChevronDown size={16} className="text-text-muted flex-shrink-0" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div id={`activity-body-${activity.id}`} className="px-5 pb-5 flex flex-col gap-4">
          <p className="text-text-main text-sm leading-relaxed">{activity.description}</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="bg-background rounded-lg p-3">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                Onde praticar
              </p>
              <p className="text-sm text-text-main">{activity.context}</p>
            </div>
            <div className="bg-background rounded-lg p-3">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                O que observar
              </p>
              <p className="text-sm text-text-main">{activity.observe}</p>
            </div>
          </div>

          {activity.script && (
            <div
              className="rounded-lg p-4 border-l-4"
              style={{ backgroundColor: '#1e3a5f', borderColor: '#7ec8e3' }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#7ec8e3' }}>
                💬 Script social — frases que você pode usar
              </p>
              <p className="text-sm text-text-main italic leading-relaxed">"{activity.script}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ActionPlanScreen({ plan, onSave, onNewSituation, onBackToChat }) {
  const [saved, setSaved] = useState(false)

  function handleSave() {
    if (!saved) {
      onSave()
      setSaved(true)
    }
  }

  if (!plan) return null

  return (
    <main className="min-h-screen flex flex-col max-w-2xl mx-auto px-4 py-6">
      <header className="flex items-center gap-3 mb-6">
        <button
          onClick={onBackToChat}
          className="p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-card transition-colors"
          aria-label="Voltar para o chat"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-text-main">Seu Plano de Ação</h1>
      </header>

      <div
        className="rounded-2xl p-5 mb-6 border border-border-subtle"
        style={{ backgroundColor: '#16213e' }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#e8a838' }}
            aria-hidden="true"
          >
            <CheckCircle size={20} color="#1a1a2e" />
          </div>
          <div>
            <h2 className="font-bold text-text-main text-lg leading-tight mb-1">{plan.title}</h2>
            <p className="text-text-muted text-sm leading-relaxed">{plan.summary}</p>
          </div>
        </div>
      </div>

      <section aria-label="Atividades práticas">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text-main">
            {plan.activities?.length} atividades práticas
          </h3>
          <p className="text-xs text-text-muted">Clique em cada uma para ver detalhes</p>
        </div>
        <div className="flex flex-col gap-3" role="list">
          {plan.activities?.map((activity, idx) => (
            <div key={activity.id} role="listitem">
              <ActivityCard activity={activity} index={idx} />
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 mt-8">
        <button
          onClick={handleSave}
          disabled={saved}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold transition-colors disabled:opacity-60"
          style={{
            backgroundColor: saved ? '#2a2a4a' : '#e8a838',
            color: saved ? '#a0a0b0' : '#1a1a2e',
          }}
          aria-label={saved ? 'Plano já salvo' : 'Salvar este plano'}
        >
          <BookmarkPlus size={18} />
          {saved ? 'Plano salvo!' : 'Salvar plano'}
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onBackToChat}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border-subtle text-text-muted hover:text-text-main hover:border-secondary transition-colors text-sm font-medium"
            aria-label="Voltar ao chat"
          >
            <MessageCircle size={16} />
            Voltar ao chat
          </button>
          <button
            onClick={onNewSituation}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border-subtle text-text-muted hover:text-text-main hover:border-primary transition-colors text-sm font-medium"
            aria-label="Explorar nova situação"
          >
            <Plus size={16} />
            Nova situação
          </button>
        </div>
      </div>

      <div
        className="mt-6 rounded-xl p-4 border border-border-subtle text-center"
        style={{ backgroundColor: '#16213e' }}
        role="note"
      >
        <p className="text-xs text-text-muted leading-relaxed">
          Lembre-se: não existe forma "certa" de fazer essas atividades.
          O objetivo é praticar e observar, não performar. Vá no seu ritmo.
        </p>
      </div>
    </main>
  )
}
