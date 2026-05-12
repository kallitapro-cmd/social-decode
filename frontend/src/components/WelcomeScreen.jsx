import { useState } from 'react'
import { BookOpen, Sparkles, MessageCircle } from 'lucide-react'

const SUGGESTIONS = [
  'Iniciar conversas com pessoas novas',
  'Entender sarcasmo e ironia',
  'Participar de grupos e rodas de conversa',
  'Recusar convites sem ofender',
  'Small talk no trabalho',
  'Saber quando a pessoa quer encerrar a conversa',
  'Lidar com críticas no ambiente de trabalho',
  'Entender pedidos indiretos',
]

export default function WelcomeScreen({ onStart, onViewSaved, savedCount }) {
  const [input, setInput] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = input.trim()
    if (trimmed.length < 5) return
    onStart(trimmed)
  }

  function handleSuggestion(text) {
    setInput(text)
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-10">
      <header className="w-full max-w-2xl flex items-center justify-between mb-10">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#e8a838' }}
            aria-hidden="true"
          >
            <Sparkles size={20} color="#1a1a2e" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-text-main tracking-tight">Social Decode</span>
        </div>

        {savedCount > 0 && (
          <button
            onClick={onViewSaved}
            className="flex items-center gap-2 text-sm text-secondary hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-card"
            aria-label={`Ver meus planos salvos (${savedCount} planos)`}
          >
            <BookOpen size={16} />
            <span>Meus planos ({savedCount})</span>
          </button>
        )}
      </header>

      <section className="w-full max-w-2xl flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-main mb-3 leading-tight">
            Entenda situações sociais,{' '}
            <span style={{ color: '#e8a838' }}>no seu ritmo</span>
          </h1>
          <p className="text-text-muted text-lg leading-relaxed max-w-lg mx-auto">
            Descreva uma situação social que você quer compreender melhor.
            Sem julgamento. Sem respostas vagas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Descreva a situação social que você quer entender melhor... Ex: "não sei como iniciar uma conversa com colegas de trabalho"'
              className="w-full bg-card border border-border-subtle rounded-xl p-4 text-text-main placeholder-text-muted resize-none focus:outline-none focus:border-primary transition-colors"
              style={{ minHeight: '130px', fontSize: '16px' }}
              aria-label="Descreva a situação social"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <div className="absolute bottom-3 right-3 text-xs text-text-muted" aria-hidden="true">
              Enter para enviar
            </div>
          </div>

          <button
            type="submit"
            disabled={input.trim().length < 5}
            className="w-full py-4 rounded-xl font-semibold text-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: input.trim().length >= 5 ? '#e8a838' : '#4a4a6a',
              color: '#1a1a2e',
            }}
            aria-label="Iniciar conversa para decodificar a situação"
          >
            Decodificar esta situação
          </button>
        </form>

        <div>
          <p className="text-text-muted text-sm mb-3 font-medium">
            Situações comuns — clique para usar:
          </p>
          <div className="flex flex-wrap gap-2" role="list">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestion(suggestion)}
                role="listitem"
                className="px-3 py-2 rounded-lg text-sm border border-border-subtle text-text-muted hover:text-text-main hover:border-secondary transition-colors"
                aria-label={`Usar sugestão: ${suggestion}`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-2">
          {[
            { icon: '🔍', label: 'Regras explícitas', desc: 'Sem "todo mundo sabe"' },
            { icon: '💬', label: 'Scripts prontos', desc: 'Frases que você pode usar' },
            { icon: '🪜', label: 'Prática gradual', desc: 'Do simples ao desafiador' },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-card rounded-xl p-4 text-center border border-border-subtle"
              aria-label={`${item.label}: ${item.desc}`}
            >
              <div className="text-2xl mb-2" aria-hidden="true">{item.icon}</div>
              <div className="text-sm font-medium text-text-main mb-1">{item.label}</div>
              <div className="text-xs text-text-muted">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {savedCount === 0 && (
        <footer className="mt-12 text-center">
          <button
            onClick={onViewSaved}
            className="text-sm text-text-muted hover:text-secondary transition-colors"
          >
            <BookOpen size={14} className="inline mr-1" />
            Ver meus planos salvos
          </button>
        </footer>
      )}
    </main>
  )
}
