import { useNavigate } from 'react-router-dom'
import { Bookmark, BookmarkCheck, Volume2, RotateCcw } from 'lucide-react'
import type { DictionaryEntry } from '../types/database'
import AiImage from './AiImage'
import { mockEntries } from '../data/mockData'

interface Props {
  entry: DictionaryEntry
  isFavorite: boolean
  onToggleFavorite: () => void
  onBack?: () => void
}

const freqLabels = ['', 'selten', 'wenig', 'mittel', 'häufig', 'sehr häufig']

function FrequencyMeter({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5 items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-3 h-4 rounded-sm ${
              i <= level ? 'bg-emerald-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-400">{freqLabels[level] || ''}</span>
    </div>
  )
}

function HighlightedText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight) return <>{text}</>
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="text-brand-600 font-semibold underline decoration-brand-600/40 underline-offset-2">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

export default function DictionaryEntryView({ entry, isFavorite, onToggleFavorite, onBack }: Props) {
  const navigate = useNavigate()
  const { word, definitions, examples } = entry

  const sortedDefinitions = [...definitions].sort((a, b) => a.order - b.order)
  const sortedExamples = [...examples].sort((a, b) => a.order - b.order)
  const examplesByDefinition = new Map<string, typeof examples>()

  for (const def of sortedDefinitions) {
    examplesByDefinition.set(def.id, [])
  }

  if (sortedDefinitions.length === 1) {
    examplesByDefinition.set(sortedDefinitions[0].id, sortedExamples)
  } else if (sortedDefinitions.length > 1) {
    sortedExamples.forEach((ex, index) => {
      const orderIndex = (ex.order || index + 1) - 1
      const defIndex = Math.abs(orderIndex) % sortedDefinitions.length
      const defId = sortedDefinitions[defIndex].id
      examplesByDefinition.get(defId)?.push(ex)
    })
  }

  const playPronunciation = () => {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(word.word)
    utterance.lang = 'de-DE'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  const handleRelatedClick = (term: string) => {
    const normalized = term.trim().toLowerCase()
    const mockMatch = mockEntries.find((entry) => entry.word.word.toLowerCase() === normalized)
    if (mockMatch) {
      navigate(`/word/${mockMatch.word.id}`)
      return
    }
    navigate(`/word/wk-${encodeURIComponent(term)}`)
  }

  const etymologySteps = word.etymology?.length
    ? (word.etymology[word.etymology.length - 1].toLowerCase().includes(word.word.toLowerCase())
        ? word.etymology
        : [...word.etymology, word.word])
    : []

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {/* Header label */}
      <div className="px-4 pt-3 pb-1">
        <span className="text-xs text-gray-400 tracking-wider uppercase">dictionary</span>
      </div>

      {/* Back + bookmark row */}
      <div className="flex items-center justify-between px-4 py-2">
        {onBack ? (
          <button onClick={onBack} className="p-1 -ml-1 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <div />
        )}
        <button
          onClick={onToggleFavorite}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? (
            <BookmarkCheck className="w-6 h-6 text-brand-600 fill-brand-600" />
          ) : (
            <Bookmark className="w-6 h-6 text-gray-400" />
          )}
        </button>
      </div>

      {/* Word title + Image */}
      <div className="px-4 md:px-6 flex items-start gap-3 md:gap-4">
        <div className="flex-1 min-w-0 max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            {word.article && word.word_type === 'Substantiv' ? (
              <>
                <span className="text-2xl md:text-3xl font-bold text-brand-500 mr-2">{word.article}</span>
                {word.word}
              </>
            ) : word.word}
          </h1>
          {word.word_type === 'Substantiv' && word.plural && (
            <p className="text-sm text-gray-500 mt-1">
              Plural: <span className="font-medium text-gray-700">{word.plural}</span>
            </p>
          )}
          
          {/* Meta pills */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">Wortart</span>
              <span className="text-xs font-medium text-brand-600">{word.word_type}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">Kategorie</span>
              <span className="text-xs font-medium text-brand-600">{word.category}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">Häufigkeit</span>
              <FrequencyMeter level={word.frequency} />
            </div>
          </div>

          {/* Etymology */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Etymologie</h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {etymologySteps.length > 0 ? (
                etymologySteps.map((step, index) => (
                  <div key={`${step}-${index}`} className="flex items-center gap-2">
                    <span className="text-xs text-gray-700 bg-gray-100 rounded-full px-2 py-1">
                      {step}
                    </span>
                    {index < etymologySteps.length - 1 && (
                      <span className="text-xs text-gray-300">-&gt;</span>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-xs text-gray-500">Keine Etymologie verfugbar.</span>
              )}
            </div>
          </div>

          {/* Pronunciation */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Aussprache</h2>
            <div className="flex items-center gap-3 mt-2">
              <button onClick={playPronunciation} className="p-2 rounded-full bg-brand-100 hover:bg-brand-200 transition-colors active:scale-95" aria-label="Aussprache abspielen">
                <Volume2 className="w-5 h-5 text-brand-600" />
              </button>
              <span className="text-base text-gray-700">
                {word.pronunciation.split(' - ').map((syl, i, arr) => (
                  <span key={i}>
                    {i === 1 ? (
                      <span className="font-semibold text-brand-600">{syl}</span>
                    ) : (
                      <span>{syl}</span>
                    )}
                    {i < arr.length - 1 && <span className="mx-1 text-gray-400">-</span>}
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>
        
        {/* Main word illustration */}
        <div className="flex-shrink-0">
          <AiImage
            word={word.word}
            exampleText={definitions[0]?.text || word.word}
            definition={definitions[0]?.text}
            exampleId={`word-${word.id}`}
            size="lg"
          />
        </div>
      </div>

      {/* Definitions */}
      <section className="px-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Bedeutung</h2>
        <div className="space-y-3">
          {sortedDefinitions.map((def, i) => {
            const defExamples = examplesByDefinition.get(def.id) || []
            return (
              <div key={def.id} className="flex items-start gap-3 group">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500 mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-700 leading-relaxed flex-1">{def.text}</p>
                    <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all" aria-label="Refresh">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                  {defExamples.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {defExamples.map((ex, exIndex) => (
                        <div key={ex.id} className="bg-gray-50 rounded-xl p-3">
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-medium text-gray-400 mt-0.5">
                              {i + 1}.{exIndex + 1}
                            </span>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              <HighlightedText text={ex.text} highlight={ex.highlighted_word} />
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Synonyms & Antonyms */}
      {(word.synonyms.length > 0 || word.antonyms.length > 0) && (
        <section className="px-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Synonyme & Gegenteile</h2>
          {word.synonyms.length > 0 && (
            <div className="mb-2">
              <div className="flex items-start gap-2">
                <span className="text-sm text-gray-400 mt-0.5">≡</span>
                <div className="flex flex-wrap gap-1.5">
                  {word.synonyms.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleRelatedClick(s)}
                      className="text-sm text-brand-600 underline decoration-brand-200 underline-offset-2 cursor-pointer hover:decoration-brand-400 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {word.antonyms.length > 0 && (
            <div>
              <div className="flex items-start gap-2">
                <span className="text-sm text-gray-400 mt-0.5">≠</span>
                <div className="flex flex-wrap gap-1.5">
                  {word.antonyms.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => handleRelatedClick(a)}
                      className="text-sm text-gray-600 underline decoration-gray-300 underline-offset-2 cursor-pointer hover:decoration-gray-500 transition-colors"
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Conjugation for verbs */}
      {word.conjugation && word.word_type === 'Verb' && (
        <section className="px-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Konjugation</h2>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">3. Person Präsens</span>
              <span className="font-medium text-gray-800">{word.conjugation.present3rd}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Präteritum</span>
              <span className="font-medium text-gray-800">{word.conjugation.pastSimple}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Partizip II</span>
              <span className="font-medium text-gray-800">{word.conjugation.pastParticiple}</span>
            </div>
            {word.conjugation.auxiliary && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Hilfsverb</span>
                <span className="font-medium text-gray-800">{word.conjugation.auxiliary}</span>
              </div>
            )}
          </div>
        </section>
      )}

    </div>
  )
}
