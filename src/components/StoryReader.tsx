import { useState, useCallback } from 'react'
import { ArrowLeft, BookOpen, User, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Story } from '../data/stories'
import WordPopup from './WordPopup'

interface Props {
  story: Story
}

interface PopupState {
  word: string
  position: { x: number; y: number }
}

/**
 * Renders a short story with interactive word look-up on double-click.
 * Double-click any word → floating popup with Wiktionary definition.
 */
export default function StoryReader({ story }: Props) {
  const [popup, setPopup] = useState<PopupState | null>(null)
  const navigate = useNavigate()

  const normalizeStoryText = useCallback((text: string) => {
    const stopWords = new Set([
      'der',
      'die',
      'das',
      'den',
      'dem',
      'des',
      'ein',
      'eine',
      'einer',
      'einem',
      'einen',
      'und',
      'oder',
      'aber',
      'doch',
      'nicht',
      'nur',
      'auch',
      'noch',
      'schon',
      'sehr',
      'so',
      'zu',
      'zum',
      'zur',
      'im',
      'in',
      'am',
      'an',
      'auf',
      'aus',
      'bei',
      'mit',
      'ohne',
      'von',
      'vom',
      'vor',
      'unter',
      'gegen',
      'fuer',
      'nach',
      'bis',
      'als',
      'da',
      'dass',
      'weil',
      'wenn',
      'wie',
      'wer',
      'was',
      'wo',
      'dann',
      'denn',
      'ja',
      'nein',
      'ich',
      'du',
      'er',
      'sie',
      'es',
      'wir',
      'ihr',
      'mich',
      'dich',
      'sich',
      'ihn',
      'ihm',
      'uns',
      'euch',
      'mein',
      'dein',
      'sein',
      'unser',
      'euer',
      'dies',
      'diese',
      'dieser',
      'dieses',
    ])

    const letterRegex = /^[A-Za-zÄÖÜäöüß]+$/

    const normalizeLine = (line: string) => {
      let cleaned = line
        .replace(/\s+([,.;:!?])/g, '$1')
        .replace(/\s+/g, ' ')
        .trim()

      cleaned = cleaned.replace(
        /(?:\b[A-Za-zÄÖÜäöüß]\s+){2,}[A-Za-zÄÖÜäöüß]\b/g,
        (match) => match.replace(/\s+/g, '')
      )

      const tokens = cleaned.split(' ').filter(Boolean)
      const merged: string[] = []

      for (const token of tokens) {
        if (merged.length === 0) {
          merged.push(token)
          continue
        }

        const prev = merged[merged.length - 1]
        const prevLower = prev.toLowerCase()
        const tokenLower = token.toLowerCase()

        const shouldMerge =
          letterRegex.test(prev) &&
          letterRegex.test(token) &&
          !stopWords.has(prevLower) &&
          !stopWords.has(tokenLower) &&
          (prev.length <= 2 || token.length <= 2)

        if (shouldMerge) {
          merged[merged.length - 1] = `${prev}${token}`
        } else {
          merged.push(token)
        }
      }

      return merged.join(' ')
    }

    return text
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map((line) => normalizeLine(line))
      .join('\n')
  }, [])

  const handleDoubleClick = useCallback((_e: React.MouseEvent<HTMLDivElement>) => {
    // Get the word the user double-clicked on
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) return

    const selectedText = selection.toString().trim()
    if (!selectedText || selectedText.includes(' ') || selectedText.length > 40) return

    // Get position from the range
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    setPopup({
      word: selectedText,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top,
      },
    })
  }, [])

  // Estimate reading time (~200 words/min for German)
  const normalizedText = normalizeStoryText(story.text)
  const wordCount = normalizedText.split(/\s+/).length
  const readingMinutes = Math.max(1, Math.round(wordCount / 200))

  // Split text into paragraphs, removing standalone page numbers
  const paragraphs = normalizedText
    .split('\n')
    .filter((p) => {
      const trimmed = p.trim()
      return trimmed.length > 0 && !/^\d{1,2}$/.test(trimmed)
    })

  return (
    <div className="max-w-2xl mx-auto pb-24 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate('/stories')}
            className="p-1.5 -ml-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-gray-900 truncate">{story.title}</h1>
            <p className="text-xs text-gray-400 truncate">{story.author}</p>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 flex-shrink-0">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs">{story.pageCount} S.</span>
          </div>
        </div>
      </div>

      {/* Story cover / info banner */}
      <div className="mx-4 mt-6 mb-8 bg-gradient-to-br from-brand-50 via-purple-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-brand-100/60">
        <div className="flex items-center gap-2 text-xs text-brand-500 font-medium mb-3 uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          Kurzgeschichte
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">{story.title}</h2>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {story.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            ~{readingMinutes} Min.
          </span>
        </div>
        <div className="mt-4 pt-4 border-t border-brand-100/60">
          <p className="text-xs text-brand-600/70 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Doppelklick auf ein Wort → Definition anzeigen
          </p>
        </div>
      </div>

      {/* Story text */}
      <div
        className="px-6 md:px-10 select-text cursor-text"
        onDoubleClick={handleDoubleClick}
      >
        <article className="max-w-none">
          {paragraphs.map((paragraph, i) => {
            const trimmed = paragraph.trim()

            // Detect dialogue lines (start with „ or " or —)
            const isDialogue = /^[„""–—]/.test(trimmed)

            return (
              <p
                key={i}
                className={`
                  text-[16px] md:text-[17px] leading-[1.9] md:leading-[2] text-gray-800 mb-6
                  selection:bg-brand-100 selection:text-brand-900
                  font-[system-ui]
                  ${i === 0 ? 'first-letter:text-4xl first-letter:font-bold first-letter:text-brand-700 first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:leading-none' : ''}
                  ${isDialogue ? 'pl-4 border-l-2 border-brand-200/60' : ''}
                `}
              >
                {paragraph}
              </p>
            )
          })}
        </article>
      </div>

      {/* End marker */}
      <div className="flex items-center justify-center gap-4 px-6 mt-12 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-lg text-gray-300">✦</span>
          <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">Ende</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Back to stories button */}
      <div className="flex justify-center px-6 mb-4">
        <button
          onClick={() => navigate('/stories')}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Alle Geschichten
        </button>
      </div>

      {/* Word definition popup */}
      {popup && (
        <WordPopup
          word={popup.word}
          position={popup.position}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  )
}
