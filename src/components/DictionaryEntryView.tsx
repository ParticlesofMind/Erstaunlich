import { Bookmark, BookmarkCheck, Volume2, RotateCcw } from 'lucide-react'
import type { DictionaryEntry } from '../types/database'
import AiImage from './AiImage'

interface Props {
  entry: DictionaryEntry
  isFavorite: boolean
  onToggleFavorite: () => void
  onBack?: () => void
}

function DifficultyMeter({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5 items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-3 h-4 rounded-sm ${
            i <= level ? 'bg-brand-600' : 'bg-gray-200'
          }`}
        />
      ))}
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
  const { word, definitions, examples } = entry

  const playPronunciation = () => {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(word.word)
    utterance.lang = 'de-DE'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="max-w-2xl mx-auto pb-8">
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

      {/* Word title */}
      <div className="px-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">{word.word}</h1>
      </div>

      {/* Meta pills */}
      <div className="flex items-center gap-4 px-6 mt-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">Wortart</span>
          <span className="text-xs font-medium text-brand-600">{word.word_type}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">Kategorie</span>
          <span className="text-xs font-medium text-brand-600">{word.category}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">Schwierigkeit</span>
          <DifficultyMeter level={word.difficulty} />
        </div>
      </div>

      {/* Pronunciation */}
      <section className="px-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Aussprache</h2>
        <div className="flex items-center gap-3">
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
      </section>

      {/* Definitions */}
      <section className="px-6 mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Bedeutung</h2>
        <div className="space-y-3">
          {definitions.map((def, i) => (
            <div key={def.id} className="flex items-start gap-3 group">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed flex-1">{def.text}</p>
              <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all" aria-label="Refresh">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Synonyms & Antonyms */}
      {(word.synonyms.length > 0 || word.antonyms.length > 0) && (
        <section className="px-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Synonyme & Gegenteile</h2>
          {word.synonyms.length > 0 && (
            <div className="mb-2">
              <div className="flex items-start gap-2">
                <span className="text-sm text-gray-400 mt-0.5">≡</span>
                <div className="flex flex-wrap gap-1.5">
                  {word.synonyms.map((s) => (
                    <span
                      key={s}
                      className="text-sm text-brand-600 underline decoration-brand-200 underline-offset-2 cursor-pointer hover:decoration-brand-400 transition-colors"
                    >
                      {s}
                    </span>
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
                    <span
                      key={a}
                      className="text-sm text-gray-600 underline decoration-gray-300 underline-offset-2 cursor-pointer hover:decoration-gray-500 transition-colors"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Examples */}
      {examples.length > 0 && (
        <section className="px-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Beispiele</h2>
          <div className="space-y-5">
            {examples.map((ex) => (
              <div key={ex.id} className="flex gap-4 group">
                <div className="flex-1">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <HighlightedText text={ex.text} highlight={ex.highlighted_word} />
                  </p>
                </div>
                <AiImage
                  word={word.word}
                  exampleText={ex.text}
                  definition={definitions[0]?.text}
                  existingUrl={ex.image_url}
                  exampleId={ex.id}
                  size="lg"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
