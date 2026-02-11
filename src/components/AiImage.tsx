import { useState, useEffect } from 'react'
import { RefreshCw, Sparkles, ImageOff } from 'lucide-react'
import { generateImage, buildImagePrompt, isImageGenAvailable } from '../services/imageService'

interface Props {
  word: string
  exampleText: string
  definition?: string
  existingUrl?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function AiImage({ word, exampleText, definition, existingUrl, size = 'md' }: Props) {
  const [url, setUrl] = useState<string | null>(existingUrl || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const available = isImageGenAvailable()

  // Use existing URL if provided
  useEffect(() => {
    if (existingUrl) setUrl(existingUrl)
  }, [existingUrl])

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const prompt = buildImagePrompt(word, exampleText, definition)
      const result = await generateImage(prompt)
      setUrl(result.url)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const sizeClasses = {
    sm: 'w-16 h-16 rounded-lg',
    md: 'w-20 h-20 md:w-24 md:h-24 rounded-xl',
    lg: 'w-32 h-32 md:w-40 md:h-40 rounded-2xl',
  }

  const sizeClass = sizeClasses[size]

  // If we have a URL, show the image with a regenerate overlay
  if (url) {
    return (
      <div className={`${sizeClass} relative group flex-shrink-0 overflow-hidden`}>
        <img
          src={url}
          alt={`Illustration für ${word}`}
          className="w-full h-full object-cover"
          onError={() => setUrl(null)}
        />
        {/* Regenerate overlay */}
        {available && (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
            aria-label="Bild neu generieren"
          >
            <RefreshCw className={`w-5 h-5 text-white drop-shadow-md ${loading ? 'animate-spin' : ''}`} />
          </button>
        )}
        {loading && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-white animate-spin" />
          </div>
        )}
      </div>
    )
  }

  // No URL yet - show generate button or placeholder
  return (
    <div className={`${sizeClass} relative flex-shrink-0 overflow-hidden`}>
      {available ? (
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full h-full bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-200 flex flex-col items-center justify-center gap-1 hover:from-brand-100 hover:to-brand-200 transition-all"
          style={{ borderRadius: 'inherit' }}
          aria-label="KI-Bild generieren"
        >
          {loading ? (
            <RefreshCw className="w-5 h-5 text-brand-500 animate-spin" />
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span className="text-[9px] text-brand-600 font-medium">KI-Bild</span>
            </>
          )}
        </button>
      ) : (
        <div
          className="w-full h-full bg-gray-100 border border-gray-200 flex flex-col items-center justify-center gap-1"
          style={{ borderRadius: 'inherit' }}
        >
          <ImageOff className="w-4 h-4 text-gray-300" />
        </div>
      )}
      {error && (
        <div className="absolute -bottom-6 left-0 right-0 text-[8px] text-red-500 text-center truncate">
          {error}
        </div>
      )}
    </div>
  )
}
