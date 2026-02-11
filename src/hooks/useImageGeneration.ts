import { useState, useCallback } from 'react'
import {
  generateImage,
  buildImagePrompt,
  isImageGenAvailable,
  getActiveProvider,
  type ImageGenResult,
  type ImageProvider,
} from '../services/imageService'

interface UseImageGenerationReturn {
  imageUrl: string | null
  loading: boolean
  error: string | null
  provider: ImageProvider | null
  generate: (word: string, exampleText: string, definition?: string, exampleId?: string) => Promise<void>
  regenerate: () => Promise<void>
  isAvailable: boolean
  activeProvider: ImageProvider
}

export function useImageGeneration(): UseImageGenerationReturn {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [provider, setProvider] = useState<ImageProvider | null>(null)
  const [lastParams, setLastParams] = useState<{
    word: string; example: string; definition?: string; exampleId?: string
  } | null>(null)

  const generate = useCallback(async (
    word: string, exampleText: string, definition?: string, exampleId?: string,
  ) => {
    setLoading(true)
    setError(null)
    setLastParams({ word, example: exampleText, definition, exampleId })

    try {
      const prompt = buildImagePrompt(word, exampleText, definition)
      const result: ImageGenResult = await generateImage(prompt, exampleId)
      setImageUrl(result.url)
      setProvider(result.provider)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  const regenerate = useCallback(async () => {
    if (!lastParams) return
    await generate(lastParams.word, lastParams.example, lastParams.definition, lastParams.exampleId)
  }, [lastParams, generate])

  return {
    imageUrl,
    loading,
    error,
    provider,
    generate,
    regenerate,
    isAvailable: isImageGenAvailable(),
    activeProvider: getActiveProvider(),
  }
}
