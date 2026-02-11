/**
 * AI Image Generation Service
 *
 * Providers (in priority order):
 *  1. HuggingFace Inference API  – FLUX.1-schnell (needs free HF token, best quality)
 *  2. Pollinations.ai             – Free, zero-config fallback (uses FLUX under the hood)
 *
 * Generated images are cached in Supabase Storage + generated_images table.
 */

import { supabase } from '../lib/supabase'

// ─── Types ───────────────────────────────────────────────────────

export interface ImageGenResult {
  url: string
  prompt: string
  provider: ImageProvider
  cached: boolean
}

export type ImageProvider = 'huggingface' | 'pollinations' | 'supabase-edge'

interface ImageServiceConfig {
  huggingfaceToken?: string
  supabaseUrl?: string
  supabaseAnonKey?: string
}

let config: ImageServiceConfig = {}

// ─── Configuration ───────────────────────────────────────────────

export function configureImageService(cfg: Partial<ImageServiceConfig>) {
  config = { ...config, ...cfg }
}

export function getActiveProvider(): ImageProvider {
  if (config.huggingfaceToken) return 'huggingface'
  return 'pollinations'
}

/** Image generation is always available (Pollinations needs no token) */
export function isImageGenAvailable(): boolean {
  return true
}

// ─── Prompt builder ──────────────────────────────────────────────

export function buildImagePrompt(word: string, exampleText: string, definition?: string): string {
  const meaning = definition || exampleText
  return (
    `A clean, minimal illustration for the German word "${word}" (${meaning}). ` +
    `Scene: ${exampleText.slice(0, 140)}. ` +
    `Style: soft watercolor sketch, pastel palette, white background, no text or letters.`
  )
}

// ─── Cache layer (Supabase) ──────────────────────────────────────

/**
 * Look up a previously generated image by example_id.
 */
export async function getCachedImage(exampleId: string): Promise<string | null> {
  try {
    const { data } = await supabase
      .from('generated_images')
      .select('url')
      .eq('example_id', exampleId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    return (data as any)?.url ?? null
  } catch {
    return null
  }
}

/**
 * Persist a generated image to Supabase Storage and record its URL.
 * Returns the public URL, or falls back to the original URL on failure.
 */
async function cacheImage(
  imageBlob: Blob,
  exampleId: string,
  prompt: string,
): Promise<string> {
  const filename = `generated/${exampleId}-${Date.now()}.png`

  try {
    // Upload to storage bucket
    const { error: uploadErr } = await supabase.storage
      .from('dictionary-images')
      .upload(filename, imageBlob, { contentType: 'image/png', upsert: true })

    if (uploadErr) throw uploadErr

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('dictionary-images')
      .getPublicUrl(filename)

    const publicUrl = urlData.publicUrl

    // Save to generated_images table
    await supabase.from('generated_images').insert({
      example_id: exampleId,
      prompt,
      url: publicUrl,
    } as any)

    return publicUrl
  } catch (err) {
    console.warn('Image cache failed (non-critical):', err)
    return '' // caller will use the blob URL
  }
}

// ─── Main generate function ──────────────────────────────────────

export async function generateImage(
  prompt: string,
  exampleId?: string,
): Promise<ImageGenResult> {
  // 1. Try HuggingFace Inference API (best quality, needs token)
  if (config.huggingfaceToken) {
    try {
      return await generateViaHuggingFace(prompt, exampleId)
    } catch (err) {
      console.warn('HuggingFace failed, falling back to Pollinations:', err)
    }
  }

  // 2. Pollinations.ai (free, no token needed)
  return generateViaPollinations(prompt, exampleId)
}

// ─── HuggingFace Inference API (FLUX.1-schnell) ─────────────────

const HF_MODEL = 'black-forest-labs/FLUX.1-schnell'
const HF_API = `https://api-inference.huggingface.co/models/${HF_MODEL}`

async function generateViaHuggingFace(
  prompt: string,
  exampleId?: string,
): Promise<ImageGenResult> {
  const res = await fetch(HF_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.huggingfaceToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { width: 512, height: 512, num_inference_steps: 4 },
    }),
  })

  if (!res.ok) {
    const errBody = await res.text().catch(() => '')
    if (res.status === 503) {
      // Model cold-starting — parse estimated time
      try {
        const info = JSON.parse(errBody)
        const secs = Math.ceil(info.estimated_time || 30)
        throw new Error(`Modell wird geladen – bitte in ~${secs}s erneut versuchen.`)
      } catch {
        throw new Error('Modell wird geladen – bitte in ~30s erneut versuchen.')
      }
    }
    throw new Error(`HuggingFace API Fehler (${res.status}): ${errBody.slice(0, 200)}`)
  }

  const blob = await res.blob()
  let url = URL.createObjectURL(blob)

  // Cache if we have an example ID
  if (exampleId) {
    const cached = await cacheImage(blob, exampleId, prompt)
    if (cached) url = cached
  }

  return { url, prompt, provider: 'huggingface', cached: !!exampleId }
}

// ─── Pollinations.ai (free fallback, FLUX-based) ────────────────

async function generateViaPollinations(
  prompt: string,
  _exampleId?: string,
): Promise<ImageGenResult> {
  // Truncate prompt to avoid overly long URLs
  const shortPrompt = prompt.length > 500 ? prompt.slice(0, 500) : prompt
  const encodedPrompt = encodeURIComponent(shortPrompt)
  const seed = Math.floor(Math.random() * 2_147_483_647)
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${seed}&model=flux&nologo=true`

  // Pollinations serves the image directly at the URL.
  // Return it without fetching to avoid CORS/timeout issues.
  // The <img> tag will load it directly.
  return { url: imageUrl, prompt, provider: 'pollinations', cached: false }
}
