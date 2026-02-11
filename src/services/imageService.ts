/**
 * AI Image Generation Service
 * Generates images via Supabase Edge Function or direct HuggingFace API
 */

export interface ImageGenResult {
  url: string
  prompt: string
}

type ImageProvider = 'huggingface' | 'supabase-edge'

interface ImageServiceConfig {
  provider: ImageProvider
  huggingfaceToken?: string
  supabaseUrl?: string
  supabaseAnonKey?: string
}

const DEFAULT_CONFIG: ImageServiceConfig = {
  provider: 'huggingface',
}

let config: ImageServiceConfig = { ...DEFAULT_CONFIG }

export function configureImageService(cfg: Partial<ImageServiceConfig>) {
  config = { ...config, ...cfg }
}

/**
 * Build a prompt for generating a dictionary illustration
 */
export function buildImagePrompt(word: string, exampleText: string, definition?: string): string {
  return (
    `Simple, clean illustration for a German dictionary. ` +
    `The word is "${word}" which means: ${definition || exampleText}. ` +
    `Scene based on: "${exampleText.slice(0, 120)}". ` +
    `Style: minimal watercolor sketch, soft colors, white background, educational illustration. ` +
    `No text, no letters, no words in the image.`
  )
}

/**
 * Generate an image for a dictionary example
 */
export async function generateImage(prompt: string): Promise<ImageGenResult> {
  // Try Supabase Edge Function first if configured
  if (config.provider === 'supabase-edge' && config.supabaseUrl && config.supabaseAnonKey) {
    return generateViaEdgeFunction(prompt)
  }

  // Fall back to direct HuggingFace API
  if (config.huggingfaceToken) {
    return generateViaHuggingFace(prompt)
  }

  throw new Error('No image generation provider configured. Set a HuggingFace token or Supabase Edge Function URL.')
}

/**
 * Generate via Supabase Edge Function (recommended - keeps API keys server-side)
 */
async function generateViaEdgeFunction(prompt: string): Promise<ImageGenResult> {
  const res = await fetch(`${config.supabaseUrl}/functions/v1/generate-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.supabaseAnonKey}`,
    },
    body: JSON.stringify({ prompt }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Edge function error: ${err}`)
  }

  const data = await res.json()
  return { url: data.url, prompt }
}

/**
 * Generate via HuggingFace Inference API directly (client-side, needs token)
 */
async function generateViaHuggingFace(prompt: string): Promise<ImageGenResult> {
  const model = 'black-forest-labs/FLUX.1-schnell'
  const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.huggingfaceToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        width: 512,
        height: 512,
        num_inference_steps: 4,
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    if (res.status === 503) {
      throw new Error('Model is loading, please try again in a moment...')
    }
    throw new Error(`HuggingFace API error: ${err}`)
  }

  // Response is a blob image
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  return { url, prompt }
}

/**
 * Check if image generation is available
 */
export function isImageGenAvailable(): boolean {
  return !!(
    config.huggingfaceToken ||
    (config.provider === 'supabase-edge' && config.supabaseUrl && config.supabaseAnonKey)
  )
}
