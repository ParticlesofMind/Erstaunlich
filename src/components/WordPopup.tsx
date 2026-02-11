import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Loader2, ExternalLink, Volume2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { searchWiktionary, fetchWiktionaryWord } from '../services/wiktionaryApi'

interface Props {
  word: string
  position: { x: number; y: number }
  onClose: () => void
}

/**
 * A floating popup that appears when a word is double-clicked.
 * Fetches the definition from Wiktionary in real time.
 */
export default function WordPopup({ word, position, onClose }: Props) {
  const [loading, setLoading] = useState(true)
  const [definition, setDefinition] = useState<string | null>(null)
  const [wordType, setWordType] = useState<string | null>(null)
  const [pronunciation, setPronunciation] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Clean the selected word (strip punctuation)
  const cleanWord = word.replace(/[.,;:!?"""''„"«»()\[\]{}\-–—…]/g, '').trim()

  useEffect(() => {
    if (!cleanWord) {
      setError(true)
      setLoading(false)
      return
    }

    let cancelled = false

    async function lookup() {
      try {
        // First try direct fetch
        const result = await fetchWiktionaryWord(cleanWord)
        if (cancelled) return

        if (result) {
          setDefinition(result.definitions[0] || null)
          setWordType(result.wordType || null)
          setPronunciation(result.pronunciation || null)
          setLoading(false)
          return
        }

        // If direct fails, try search to find closest match
        const results = await searchWiktionary(cleanWord)
        if (cancelled) return

        if (results.length > 0) {
          const best = await fetchWiktionaryWord(results[0])
          if (cancelled) return
          if (best) {
            setDefinition(best.definitions[0] || null)
            setWordType(best.wordType || null)
            setPronunciation(best.pronunciation || null)
            setLoading(false)
            return
          }
        }

        setError(true)
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    lookup()
    return () => { cancelled = true }
  }, [cleanWord])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Position the popup so it doesn't overflow the viewport
  const adjustedPosition = useCallback(() => {
    const popupWidth = 320
    const popupHeight = 200
    let x = position.x
    let y = position.y - 10 // above the word

    // Horizontal bounds
    if (x + popupWidth / 2 > window.innerWidth) {
      x = window.innerWidth - popupWidth / 2 - 16
    }
    if (x - popupWidth / 2 < 0) {
      x = popupWidth / 2 + 16
    }

    // If too close to top, show below instead
    if (y - popupHeight < 0) {
      y = position.y + 30
    }

    return { x, y }
  }, [position])

  const pos = adjustedPosition()

  return (
    <div
      ref={popupRef}
      className="fixed z-[200] animate-in fade-in slide-in-from-bottom-2 duration-200"
      style={{
        left: pos.x,
        top: pos.y,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 border border-gray-200/80 w-[300px] md:w-[340px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-base font-bold text-gray-900 truncate">{cleanWord}</h3>
            {wordType && (
              <span className="text-[10px] font-medium text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-full flex-shrink-0">
                {wordType}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 -mr-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-3 min-h-[60px]">
          {loading && (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Wörterbuch wird geladen…</span>
            </div>
          )}

          {!loading && error && (
            <p className="text-sm text-gray-400 italic">
              Keine Definition für „{cleanWord}" gefunden.
            </p>
          )}

          {!loading && !error && (
            <div className="space-y-2">
              {pronunciation && (
                <div className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500 font-mono">{pronunciation}</span>
                </div>
              )}
              {definition && (
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
                  {definition}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && (
          <div className="px-4 pb-3 flex items-center justify-between">
            <button
              onClick={() => {
                onClose()
                navigate(`/word/wk-${encodeURIComponent(cleanWord)}`)
              }}
              className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1 transition-colors"
            >
              Vollständiger Eintrag
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Arrow pointing down */}
      <div
        className="w-3 h-3 bg-white border-b border-r border-gray-200/80 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1.5"
      />
    </div>
  )
}
