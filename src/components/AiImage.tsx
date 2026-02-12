import { useState, useEffect } from 'react'
import { RefreshCw, Sparkles, ImageOff, Zap } from 'lucide-react'
import {
  generateImage,
  buildImagePrompt,
  isImageGenAvailable,
  getCachedImage,
  getActiveProvider,
  type ImageProvider,
} from '../services/imageService'

interface Props {
  word: string
  exampleText: string
  definition?: string
  existingUrl?: string
  exampleId?: string
  size?: 'sm' | 'md' | 'lg'
}

const providerLabel: Record<ImageProvider, string> = {
  huggingface: 'FLUX',
  pollinations: 'FLUX',
  'supabase-edge': 'Edge',
}

export default function AiImage({ word, exampleText, definition, existingUrl, exampleId, size = 'md' }: Props) {
  const [url, setUrl] = useState<string | null>(existingUrl || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [provider, setProvider] = useState<ImageProvider | null>(null)
  const available = isImageGenAvailable()

  // Load from existing URL or Supabase cache
  useEffect(() => {
    if (existingUrl) {
      setUrl(existingUrl)
      return
    }
    if (exampleId) {
      getCachedImage(exampleId).then((cached) => {
        if (cached) setUrl(cached)
      })
    }
  }, [existingUrl, exampleId])

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const prompt = buildImagePrompt(word, exampleText, definition)
      const result = await generateImage(prompt, exampleId)
      setUrl(result.url)
      setProvider(result.provider)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const sizeClasses = {
    sm: 'w-24 h-24 rounded-lg',
    md: 'w-32 h-32 md:w-40 md:h-40 rounded-xl',
    lg: 'w-64 h-64 md:w-72 md:h-72 rounded-2xl',
  }

  const sizeClass = sizeClasses[size]

  // ── Has image ──
  if (url) {
    return (
      <div className={`${sizeClass} relative group flex-shrink-0 overflow-hidden shadow-sm`}>
        <img
          src={url}
          alt={`Illustration: ${word}`}
          className="w-full h-full object-cover"
          onError={() => setUrl(null)}
        />
        {/* Provider badge */}
        {provider && (
          <span className="absolute top-1 left-1 text-[7px] font-bold uppercase tracking-wider bg-black/50 text-white px-1.5 py-0.5 rounded-full backdrop-blur-sm">
            {providerLabel[provider]}
          </span>
        )}
        {/* Regenerate overlay */}
        {available && !loading && (
          <button
            onClick={handleGenerate}
            className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
            aria-label="Bild neu generieren"
          >
            <RefreshCw className="w-5 h-5 text-white drop-shadow-md" />
          </button>
        )}
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>
    )
  }

  // ── Placeholder / generate button ──
  return (
    <div className={`${sizeClass} relative flex-shrink-0 overflow-hidden`}>
      {available ? (
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full h-full bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-200/60 flex flex-col items-center justify-center gap-1 hover:from-brand-100 hover:to-brand-200 active:scale-95 transition-all cursor-pointer"
          style={{ borderRadius: 'inherit' }}
          aria-label="KI-Bild generieren"
        >
          {loading ? (
            <div className="flex flex-col items-center gap-1">
              <div className="w-5 h-5 border-2 border-brand-300/40 border-t-brand-500 rounded-full animate-spin" />
              <span className="text-[8px] text-brand-400 font-medium animate-pulse">
                {getActiveProvider() === 'huggingface' ? 'FLUX…' : 'Generiere…'}
              </span>
            </div>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span className="text-[9px] text-brand-600 font-semibold">KI-Bild</span>
              <span className="text-[7px] text-brand-400 flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5" /> Kostenlos
              </span>
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
        <div className="absolute -bottom-7 left-0 right-0 text-[8px] text-red-500 text-center truncate px-1">
          {error}
        </div>
      )}
    </div>
  )
}
