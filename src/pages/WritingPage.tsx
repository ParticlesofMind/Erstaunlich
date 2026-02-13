import { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle, Loader2, ChevronDown, ChevronRight, Award, BookOpen } from 'lucide-react'
import { useAuthContext } from '../contexts/AuthContext'
import { 
  getChatResponse, 
  type ChatMessage, 
  type ChatMode,
  type StructureTrainingSession,
  type TopicConversation
} from '../services/chatbotService'
import { 
  getAllLevels,
  getStructuresByLevel,
  type GrammarStructure, 
  type CEFRLevel 
} from '../data/grammarStructures'
import { useGrammarProgress } from '../hooks/useGrammarProgress'

const levelColors: Record<CEFRLevel, string> = {
  A1: 'bg-green-100 text-green-800',
  A2: 'bg-emerald-100 text-emerald-800',
  B1: 'bg-blue-100 text-blue-800',
  B2: 'bg-indigo-100 text-indigo-800',
  C1: 'bg-purple-100 text-purple-800',
  C2: 'bg-pink-100 text-pink-800',
}

export default function WritingPage() {
  const { user } = useAuthContext()
  const { 
    progress, 
    recordAttempt, 
    completeTrainingSession,
    getStructureProgress,
    getStructureAccuracy
  } = useGrammarProgress()
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hallo! Wähle eine Grammatikstruktur oder ein Thema aus der Liste, um zu beginnen. 📚',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<ChatMode>('structure-training')
  const [trainingSession, setTrainingSession] = useState<StructureTrainingSession | null>(null)
  const [topicConversation, setTopicConversation] = useState<TopicConversation | null>(null)
  const [expandedLevel, setExpandedLevel] = useState<CEFRLevel | null>(progress.currentLevel)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const levels = getAllLevels()

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
      const response = await getChatResponse(
        [...messages, userMessage], 
        mode, 
        trainingSession || undefined,
        topicConversation || undefined
      )
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      
      // Update training session progress and track attempts
      if (mode === 'structure-training' && trainingSession) {
        const isSuccess = response.includes('✓')
        recordAttempt(trainingSession.structure.id, trainingSession.structure.level, isSuccess)
        
        if (isSuccess) {
          const newCompleted = trainingSession.sentencesCompleted + 1
          setTrainingSession({
            ...trainingSession,
            sentencesCompleted: newCompleted,
          })
          
          // Check if session is complete
          if (newCompleted >= trainingSession.sentencesRequired) {
            completeTrainingSession()
          }
        }
      }
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

  const handleSelectStructure = (structure: GrammarStructure) => {
    const newSession: StructureTrainingSession = {
      structure,
      sentencesRequired: 5,
      sentencesCompleted: 0,
      userLevel: progress.currentLevel,
    }
    
    setTrainingSession(newSession)
    setTopicConversation(null)
    setSelectedTopic(null)
    setMode('structure-training')
    
    const structureProgress = getStructureProgress(structure.id)
    const progressText = structureProgress 
      ? `\n\n📊 Bisheriger Fortschritt: ${structureProgress.successes}/${structureProgress.attempts} erfolgreich (${Math.round(structureProgress.successes / structureProgress.attempts * 100)}%)`
      : ''
    
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: `Perfekt! Lass uns "${structure.name}" üben. 📚\n\n**Struktur:** ${structure.pattern}\n\n**Erklärung:** ${structure.explanation}\n\n**Beispiel:** ${structure.examples[0]}${progressText}\n\n✏️ Bilde jetzt 5 Sätze mit dieser Struktur. ${structure.topics.length > 0 ? `Du kannst über folgende Themen schreiben: ${structure.topics.slice(0, 3).join(', ')}.` : ''}\n\nFang an!`,
      timestamp: new Date(),
    }
    
    setMessages([assistantMessage])
  }

  const handleSelectTopic = (topic: string) => {
    setSelectedTopic(topic)
    setTrainingSession(null)
    setTopicConversation({
      topic,
      userLevel: progress.currentLevel,
    })
    setMode('topic-conversation')
    
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: `Super! Lass uns über "${topic}" sprechen. 💬\n\nSchreib mir etwas zu diesem Thema auf Deutsch. Ich gebe dir Feedback und helfe dir, deine Grammatik zu verbessern!`,
      timestamp: new Date(),
    }
    
    setMessages([assistantMessage])
  }
  
  const toggleLevel = (level: CEFRLevel) => {
    setExpandedLevel(expandedLevel === level ? null : level)
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

  const topics = [
    'Alltag',
    'Familie',
    'Reisen',
    'Arbeit',
    'Hobbys',
    'Essen & Trinken',
    'Sport',
    'Natur',
    'Kultur',
    'Technologie',
  ]

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Sidebar - Structures & Topics */}
      <aside className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
          <h2 className="font-semibold text-gray-900">Themen & Strukturen</h2>
          <p className="text-xs text-gray-500 mt-1">Wähle aus, was du üben möchtest</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {/* Topics Section */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Themen
            </h3>
            <div className="space-y-1">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleSelectTopic(topic)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedTopic === topic
                      ? 'bg-brand-100 text-brand-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Structures Section */}
          <div className="p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Grammatik-Strukturen
            </h3>
            <div className="space-y-2">
              {levels.map((level) => {
                const structures = getStructuresByLevel(level)
                const isExpanded = expandedLevel === level

                return (
                  <div key={level} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => toggleLevel(level)}
                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${levelColors[level]}`}>
                          {level}
                        </span>
                        <span className="text-xs text-gray-600">
                          ({structures.length})
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="border-t border-gray-200 bg-gray-50">
                        {structures.map((structure) => {
                          const structureProgress = getStructureProgress(structure.id)
                          const accuracy = getStructureAccuracy(structure.id)
                          const isMastered = structureProgress?.mastered || false
                          const isActive = trainingSession?.structure.id === structure.id

                          return (
                            <button
                              key={structure.id}
                              onClick={() => handleSelectStructure(structure)}
                              className={`w-full text-left px-3 py-2 border-b border-gray-100 last:border-b-0 transition-colors ${
                                isActive
                                  ? 'bg-brand-50 hover:bg-brand-100'
                                  : 'hover:bg-gray-100'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1">
                                    <p className={`text-xs font-medium truncate ${
                                      isActive ? 'text-brand-700' : 'text-gray-900'
                                    }`}>
                                      {structure.name}
                                    </p>
                                    {isMastered && (
                                      <Award className="w-3 h-3 text-amber-500 flex-shrink-0" />
                                    )}
                                  </div>
                                  {structureProgress && (
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {Math.round(accuracy)}% • {structureProgress.attempts} Versuche
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Training Progress Header */}
        {trainingSession && (
          <div className="flex-shrink-0 px-4 py-2 bg-gradient-to-br from-brand-50 to-purple-50 border-b border-brand-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-600" />
                <p className="text-sm font-medium text-gray-900">
                  {trainingSession.structure.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs font-semibold text-brand-600">
                  {trainingSession.sentencesCompleted} / {trainingSession.sentencesRequired}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
              <div
                className="bg-gradient-to-r from-brand-500 to-purple-500 h-1 rounded-full transition-all"
                style={{
                  width: `${(trainingSession.sentencesCompleted / trainingSession.sentencesRequired) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {selectedTopic && !trainingSession && (
          <div className="flex-shrink-0 px-4 py-2 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-200">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <p className="text-sm font-medium text-gray-900">Thema: {selectedTopic}</p>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  message.role === 'user'
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <p
                  className={`text-xs mt-1.5 ${
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
              <div className="bg-gray-100 text-gray-900 rounded-2xl px-4 py-2.5">
                <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white px-6 py-3">
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Schreib etwas auf Deutsch..."
              className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
              rows={2}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2 h-[42px]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-1.5 px-1">
            Enter = Senden • Shift+Enter = Neue Zeile
          </p>
        </div>
      </div>
    </div>
  )
}
