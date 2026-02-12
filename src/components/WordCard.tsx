import type { DictionaryEntry } from '../types/database'

interface Props {
  entry: DictionaryEntry
  onClick: () => void
  compact?: boolean
}

const freqLabels = ['', 'selten', 'wenig', 'mittel', 'häufig', 'sehr häufig']

function FrequencyDots({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${i <= level ? 'bg-emerald-500' : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <span className="text-[10px] text-gray-400 ml-0.5">{freqLabels[level] || ''}</span>
    </div>
  )
}

export default function WordCard({ entry, onClick, compact = false }: Props) {
  const { word, definitions } = entry

  // Display article for nouns
  const displayName = word.article && word.word_type === 'Substantiv'
    ? `${word.article} ${word.word}`
    : word.word

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left px-4 py-3 bg-white rounded-xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all group"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
              {displayName}
            </span>
            <span className="ml-2 text-xs text-gray-400">{word.word_type}</span>
          </div>
          <FrequencyDots level={word.frequency} />
        </div>
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{definitions[0]?.text}</p>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-5 bg-white rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
          {displayName}
        </h3>
        <FrequencyDots level={word.frequency} />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 font-medium">{word.word_type}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">{word.category}</span>
        {word.plural && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">Pl. {word.plural}</span>
        )}
      </div>
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{definitions[0]?.text}</p>
      {word.synonyms.length > 0 && (
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {word.synonyms.slice(0, 3).map((s) => (
            <span key={s} className="text-xs text-gray-400">#{s}</span>
          ))}
        </div>
      )}
    </button>
  )
}
