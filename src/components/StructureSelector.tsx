import { useState } from 'react'
import { BookMarked, ChevronDown, ChevronRight, Award } from 'lucide-react'
import {
  getAllLevels,
  getStructuresByLevel,
  type CEFRLevel,
  type GrammarStructure,
} from '../data/grammarStructures'
import { useGrammarProgress } from '../hooks/useGrammarProgress'

interface Props {
  onSelectStructure: (structure: GrammarStructure) => void
  onClose: () => void
}

const levelColors: Record<CEFRLevel, string> = {
  A1: 'bg-green-100 text-green-800 border-green-200',
  A2: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  B1: 'bg-blue-100 text-blue-800 border-blue-200',
  B2: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  C1: 'bg-purple-100 text-purple-800 border-purple-200',
  C2: 'bg-pink-100 text-pink-800 border-pink-200',
}

const levelDescriptions: Record<CEFRLevel, string> = {
  A1: 'Anfänger - Einfache Hauptsätze und Fragen',
  A2: 'Grundlegend - Zeit, Modalverben, erste Nebensätze',
  B1: 'Mittelstufe - Komplexe Gründe, Kontraste, Relativsätze',
  B2: 'Fortgeschritten - Nuancierte Zeit- und Bedingungssätze',
  C1: 'Sehr fortgeschritten - Komplexe Einbettungen und Stil',
  C2: 'Kompetent - Nahezu muttersprachliche Nuancen',
}

export default function StructureSelector({ onSelectStructure, onClose }: Props) {
  const { progress, getStructureProgress, getStructureAccuracy } = useGrammarProgress()
  const [expandedLevel, setExpandedLevel] = useState<CEFRLevel | null>(progress.currentLevel)
  const levels = getAllLevels()

  const toggleLevel = (level: CEFRLevel) => {
    setExpandedLevel(expandedLevel === level ? null : level)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                <BookMarked className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Struktur-Training</h2>
                <p className="text-sm text-gray-500">Wähle eine Grammatikstruktur zum Üben</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Levels */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-3">
            {levels.map((level) => {
              const structures = getStructuresByLevel(level)
              const isExpanded = expandedLevel === level

              return (
                <div key={level} className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Level header */}
                  <button
                    onClick={() => toggleLevel(level)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-bold border ${levelColors[level]}`}>
                        {level}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {levelDescriptions[level]}
                        </p>
                        <p className="text-xs text-gray-500">
                          {structures.length} {structures.length === 1 ? 'Struktur' : 'Strukturen'}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {/* Structures list */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      <div className="p-4 space-y-2">
                        {structures.map((structure) => {
                          const structureProgress = getStructureProgress(structure.id)
                          const accuracy = getStructureAccuracy(structure.id)
                          const isMastered = structureProgress?.mastered || false

                          return (
                            <button
                              key={structure.id}
                              onClick={() => onSelectStructure(structure)}
                              className="w-full text-left p-3 bg-white rounded-lg hover:ring-2 hover:ring-brand-200 transition-all group relative"
                            >
                              {isMastered && (
                                <div className="absolute top-2 right-2">
                                  <Award className="w-5 h-5 text-yellow-500" />
                                </div>
                              )}
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors">
                                    {structure.name}
                                  </h4>
                                  <p className="text-xs text-brand-600 font-mono mt-1">
                                    {structure.pattern}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {structure.explanation}
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {structure.topics.slice(0, 3).map((topic) => (
                                      <span
                                        key={topic}
                                        className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                                      >
                                        {topic}
                                      </span>
                                    ))}
                                  </div>
                                  {structureProgress && (
                                    <div className="mt-2 text-xs text-gray-500">
                                      📊 {structureProgress.successes}/{structureProgress.attempts} erfolgreich
                                      {accuracy > 0 && ` (${accuracy}%)`}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  {[...Array(structure.difficulty)].map((_, i) => (
                                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                                  ))}
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer tip */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <p className="text-xs text-gray-500 text-center">
            💡 Tipp: Beginne mit einem niedrigeren Level und arbeite dich hoch • 🏆 = Gemeistert
          </p>
        </div>
      </div>
    </div>
  )
}
