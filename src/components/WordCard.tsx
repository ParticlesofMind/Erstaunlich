import { useState } from 'react'
import type { DictionaryEntry } from '../types/database'
import { getNounThumbnailUrl } from '../services/imageService'

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

function NounThumbnail({ word, definition, size = 'sm' }: { word: string; definition?: string; size?: 'sm' | 'lg' }) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)
  const px = size === 'lg' ? 512 : 256
  const url = getNounThumbnailUrl(word, definition, px)

  if (errored) return null

  const sizeClass = size === 'lg' ? 'w-full h-full' : 'w-16 h-16 rounded-xl'

  return (
    <div className={`${sizeClass} overflow-hidden flex-shrink-0 bg-gray-50 relative`}>
      <img
        src={url}
        alt={word}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
      />
      {!loaded && !errored && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-brand-100 animate-pulse" />
      )}
    </div>
  )
}

export default function WordCard({ entry, onClick, compact = false }: Props) {
  const { word, definitions } = entry
  const isNoun = word.word_type === 'Substantiv'

  // Display article for nouns
  const displayName = word.article && isNoun
    ? `${word.article} ${word.word}`
    : word.word

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left px-4 py-3 bg-white rounded-xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all group"
      >
        <div className="flex items-center gap-3">
          {isNoun && <NounThumbnail word={word.word} definition={definitions[0]?.text} />}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <span className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                  {displayName}
                </span>
                <span className="ml-2 text-xs text-gray-400">{word.word_type}</span>
              </div>
              <FrequencyDots level={word.frequency} />
            </div>
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{definitions[0]?.text}</p>
          </div>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all group overflow-hidden"
    >
      <div className="flex">
        {/* Thumbnail for nouns */}
        {isNoun && (
          <div className="w-28 md:w-36 flex-shrink-0">
            <NounThumbnail word={word.word} definition={definitions[0]?.text} size="lg" />
          </div>
        )}
        {/* Content */}
        <div className={`flex-1 min-w-0 p-5 ${isNoun ? 'pl-4' : ''}`}>
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
        </div>
      </div>
    </button>
  )
}
