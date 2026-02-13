import { BookMarked, Target, Award, X } from 'lucide-react'
import type { StructureTrainingSession } from '../services/chatbotService'

interface Props {
  session: StructureTrainingSession
  onEndSession: () => void
}

export default function StructureTrainingPanel({ session, onEndSession }: Props) {
  const { structure, sentencesCompleted, sentencesRequired } = session
  const progress = (sentencesCompleted / sentencesRequired) * 100

  return (
    <div className="bg-gradient-to-br from-brand-50 to-purple-50 border border-brand-200 rounded-xl p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <BookMarked className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Struktur-Training</h3>
            <p className="text-xs text-gray-600">{structure.level} • {structure.name}</p>
          </div>
        </div>
        <button
          onClick={onEndSession}
          className="p-1 hover:bg-white rounded-lg transition-colors"
          title="Training beenden"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Pattern */}
      <div className="bg-white rounded-lg p-3 mb-3">
        <p className="text-xs text-gray-500 mb-1">Muster:</p>
        <p className="text-sm font-mono text-brand-700">{structure.pattern}</p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-brand-600" />
            <span className="font-medium text-gray-700">Fortschritt</span>
          </div>
          <span className="font-semibold text-brand-600">
            {sentencesCompleted} / {sentencesRequired}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-500 to-purple-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Examples */}
      <details className="mt-3">
        <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-900 transition-colors flex items-center gap-1">
          <Award className="w-3.5 h-3.5" />
          Beispiele anzeigen
        </summary>
        <div className="mt-2 space-y-1">
          {structure.examples.slice(0, 3).map((example, i) => (
            <p key={i} className="text-xs text-gray-700 bg-white rounded px-2 py-1">
              • {example}
            </p>
          ))}
        </div>
      </details>
    </div>
  )
}
