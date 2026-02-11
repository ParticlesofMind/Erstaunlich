import { useState, useCallback } from 'react'
import { generateImage, buildImagePrompt, isImageGenAvailable, type ImageGenResult } from '../services/imageService'

interface UseImageGenerationReturn {
  imageUrl: string | null
  loading: boolean
  error: string | null
  generate: (word: string, exampleText: string, definition?: string) => Promise<void>
  regenerate: () => Promise<void>
  isAvailable: boolean
}

export function useImageGeneration(): UseImageGenerationReturn {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastParams, setLastParams] = useState<{ word: string; example: string; definition?: string } | null>(null)

  const generate = useCallback(async (word: string, exampleText: string, definition?: string) => {
    setLoading(true)
    setError(null)
    setLastParams({ word, example: exampleText, definition })

    try {
      const prompt = buildImagePrompt(word, exampleText, definition)
      const result: ImageGenResult = await generateImage(prompt)
      setImageUrl(result.url)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  const regenerate = useCallback(async () => {
    if (!lastParams) return
    await generate(lastParams.word, lastParams.example, lastParams.definition)
  }, [lastParams, generate])

  return {
    imageUrl,
    loading,
    error,
    generate,
    regenerate,
    isAvailable: isImageGenAvailable(),
  }
}
