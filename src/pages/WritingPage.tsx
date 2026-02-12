import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, MessageCircle, Loader2 } from 'lucide-react'
import { useAuthContext } from '../contexts/AuthContext'
import { getChatResponse, type ChatMessage } from '../services/chatbotService'

export default function WritingPage() {
  const { user } = useAuthContext()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hallo! Ich bin dein Deutsch-Schreibassistent. Ich kann dir helfen, deine Schreibfähigkeiten zu verbessern. Schreib mir etwas auf Deutsch und ich gebe dir Feedback!',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await getChatResponse([...messages, userMessage])
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Entschuldigung, ich konnte deine Nachricht nicht verarbeiten. Bitte versuche es später erneut.',
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      textareaRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <MessageCircle className="w-16 h-16 text-brand-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Anmeldung erforderlich</h2>
        <p className="text-gray-600 mb-6">
          Du musst angemeldet sein, um den Schreibassistenten zu nutzen.
        </p>
        <a
          href="/Erstaunlich/auth"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors font-medium"
        >
          Jetzt anmelden
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schreibassistent</h1>
            <p className="text-sm text-gray-500">Übe Deutsch schreiben mit KI-Feedback</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              <p
                className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-brand-100' : 'text-gray-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString('de-DE', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 py-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Schreib etwas auf Deutsch..."
            className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            rows={2}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Senden</span>
              </>
            )}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2">
          Tipp: Drücke Enter zum Senden, Shift+Enter für neue Zeile
        </p>
      </div>
    </div>
  )
}
