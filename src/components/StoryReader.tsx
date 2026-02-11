import { useState, useCallback } from 'react'
import { ArrowLeft, BookOpen, User } from 'lucide-react'
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

  // Split text into paragraphs, removing standalone page numbers
  const paragraphs = story.text
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

      {/* Story info banner */}
      <div className="mx-4 mt-5 mb-6 bg-gradient-to-r from-brand-50 to-purple-50 rounded-2xl p-5 border border-brand-100/60">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{story.title}</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <User className="w-4 h-4" />
          <span>{story.author}</span>
        </div>
        <p className="text-xs text-brand-600/70 mt-3 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          Doppelklick auf ein Wort → Definition anzeigen
        </p>
      </div>

      {/* Story text */}
      <div
        className="px-5 md:px-8 select-text cursor-text"
        onDoubleClick={handleDoubleClick}
      >
        <article className="prose prose-gray max-w-none">
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className={`text-[15px] md:text-base leading-[1.85] text-gray-800 mb-5 selection:bg-brand-100 selection:text-brand-900 ${
                i === 0 ? 'first-letter:text-2xl first-letter:font-bold first-letter:text-brand-700 first-letter:float-left first-letter:mr-1 first-letter:mt-0.5' : ''
              }`}
            >
              {paragraph}
            </p>
          ))}
        </article>
      </div>

      {/* End marker */}
      <div className="flex items-center justify-center gap-3 px-6 mt-10 mb-4">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">Ende</span>
        <div className="h-px flex-1 bg-gray-200" />
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
