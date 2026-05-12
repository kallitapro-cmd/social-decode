import { useState, useEffect, useRef } from 'react'
import { Send, Loader2, Sparkles, ArrowLeft, FileText } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function ChatScreen({
  situation,
  messages,
  setMessages,
  onPlanGenerated,
  onNewSituation,
}) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const userMessageCount = messages.filter((m) => m.role === 'user').length

  useEffect(() => {
    if (messages.length === 0) {
      sendInitialMessage()
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  async function sendInitialMessage() {
    setIsLoading(true)
    setError(null)
    const initialMessages = [{ role: 'user', content: situation }]
    setMessages(initialMessages)

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: initialMessages }),
      })
      if (!res.ok) throw new Error(`Erro ${res.status}`)
      const data = await res.json()
      setMessages([...initialMessages, { role: 'assistant', content: data.content }])
    } catch (err) {
      setError('Não consegui conectar ao servidor. Verifique sua conexão e tente novamente.')
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  async function handleSend(e) {
    e?.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const newMessages = [...messages, { role: 'user', content: trimmed }]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      if (!res.ok) throw new Error(`Erro ${res.status}`)
      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.content }])
    } catch (err) {
      setError('Não consegui enviar sua mensagem. Tente novamente.')
      setMessages(newMessages.slice(0, -1))
      setInput(trimmed)
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  async function handleGeneratePlan() {
    setIsGeneratingPlan(true)
    setError(null)

    try {
      const res = await fetch(`${API_URL}/api/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ situation, messages }),
      })
      if (!res.ok) throw new Error(`Erro ${res.status}`)
      const plan = await res.json()
      onPlanGenerated(plan)
    } catch (err) {
      setError('Não consegui gerar o plano agora. Tente novamente em alguns segundos.')
    } finally {
      setIsGeneratingPlan(false)
    }
  }

  const canGeneratePlan = userMessageCount >= 3 && !isLoading

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto">
      <header className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 border-b border-border-subtle bg-background">
        <button
          onClick={onNewSituation}
          className="p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-card transition-colors"
          aria-label="Voltar para a tela inicial"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#e8a838' }}
            aria-hidden="true"
          >
            <Sparkles size={14} color="#1a1a2e" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-text-muted truncate">{situation}</p>
          </div>
        </div>
        {canGeneratePlan && (
          <button
            onClick={handleGeneratePlan}
            disabled={isGeneratingPlan}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 flex-shrink-0"
            style={{ backgroundColor: '#e8a838', color: '#1a1a2e' }}
            aria-label="Gerar plano de ação personalizado"
          >
            {isGeneratingPlan ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <FileText size={14} />
            )}
            <span className="hidden sm:inline">Gerar meu plano</span>
            <span className="sm:hidden">Plano</span>
          </button>
        )}
      </header>

      <div
        className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4"
        role="log"
        aria-label="Conversa com a IA"
        aria-live="polite"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mr-2 mt-1"
                style={{ backgroundColor: '#e8a838' }}
                aria-hidden="true"
              >
                <Sparkles size={13} color="#1a1a2e" strokeWidth={2.5} />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'rounded-tr-sm text-text-main'
                  : 'rounded-tl-sm text-text-main'
              }`}
              style={{
                backgroundColor: msg.role === 'user' ? '#1e3a5f' : '#1e2a40',
              }}
              aria-label={msg.role === 'user' ? 'Sua mensagem' : 'Resposta da IA'}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start" aria-label="IA está digitando">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mr-2 mt-1"
              style={{ backgroundColor: '#e8a838' }}
              aria-hidden="true"
            >
              <Sparkles size={13} color="#1a1a2e" strokeWidth={2.5} />
            </div>
            <div
              className="rounded-2xl rounded-tl-sm px-4 py-3"
              style={{ backgroundColor: '#1e2a40' }}
            >
              <div className="flex gap-1 items-center h-5" aria-hidden="true">
                <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div
            className="bg-red-900/30 border border-red-700/50 rounded-xl px-4 py-3 text-sm text-red-300"
            role="alert"
          >
            {error}
          </div>
        )}

        {canGeneratePlan && !isLoading && (
          <div
            className="flex items-center gap-3 bg-card border border-border-subtle rounded-xl px-4 py-3"
            role="status"
          >
            <span className="text-2xl" aria-hidden="true">✨</span>
            <div className="flex-1">
              <p className="text-sm text-text-main font-medium">Pronto para o plano?</p>
              <p className="text-xs text-text-muted">
                Clique em "Gerar meu plano" para receber atividades práticas personalizadas.
              </p>
            </div>
          </div>
        )}

        {userMessageCount > 0 && userMessageCount < 3 && !isLoading && (
          <p className="text-center text-xs text-text-muted" aria-live="polite">
            Continue conversando ({3 - userMessageCount} resposta{3 - userMessageCount !== 1 ? 's' : ''} para liberar o plano)
          </p>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 border-t border-border-subtle bg-background px-4 py-3">
        <form onSubmit={handleSend} className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua resposta..."
            className="flex-1 bg-card border border-border-subtle rounded-xl px-4 py-3 text-text-main placeholder-text-muted resize-none focus:outline-none focus:border-primary transition-colors"
            style={{ minHeight: '50px', maxHeight: '120px', fontSize: '16px' }}
            rows={1}
            disabled={isLoading}
            aria-label="Digite sua mensagem"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            onInput={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            style={{ backgroundColor: '#e8a838' }}
            aria-label="Enviar mensagem"
          >
            {isLoading ? (
              <Loader2 size={20} color="#1a1a2e" className="animate-spin" />
            ) : (
              <Send size={20} color="#1a1a2e" />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
