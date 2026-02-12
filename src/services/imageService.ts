/**
 * AI Image Generation Service
 *
 * Providers (in priority order):
 *  1. HuggingFace Inference API  – Stable Diffusion XL (needs free HF token)
 *  2. Pollinations.ai             – Free, zero-config fallback (always works)
 *
 * Pollinations is the primary provider due to reliability (no auth needed).
 * New API: https://pollinations.ai/p/{prompt}
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

/** Deterministic seed from a string — same word always gives the same image */
function hashSeed(text: string): number {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0
  }
  return Math.abs(hash) % 2_147_483_647
}

/** Style suffix applied to every noun thumbnail for a consistent look */
const NOUN_STYLE =
  'Cute 3D clay render of the object, soft plastic material, smooth rounded shapes, ' +
  'subtle shadows, pastel color palette, studio lighting, light gray background, ' +
  'single centered object, Pixar style, no text, no letters, no words.'

/**
 * Get a deterministic Pollinations URL for a noun thumbnail.
 * No async call needed — the URL loads directly in an <img> tag.
 */
export function getNounThumbnailUrl(word: string, definition?: string, size = 512): string {
  const context = definition ? ` (${definition.slice(0, 80)})` : ''
  const prompt = `${word}${context}. ${NOUN_STYLE}`
  const short = prompt.length > 500 ? prompt.slice(0, 500) : prompt
  const seed = hashSeed(word.toLowerCase())
  return `https://pollinations.ai/p/${encodeURIComponent(short)}?width=${size}&height=${size}&seed=${seed}&nologo=true`
}

/**
 * Build a prompt specifically for noun thumbnail images.
 * Produces a consistent, recognizable 3D clay/Pixar style.
 */
export function buildNounThumbnailPrompt(word: string, definition?: string): string {
  const context = definition ? ` (${definition.slice(0, 80)})` : ''
  return `${word}${context}. ${NOUN_STYLE}`
}

export function buildImagePrompt(word: string, exampleText: string, definition?: string): string {
  const meaning = definition || exampleText
  return (
    `A clean, minimal illustration for the German word "${word}" (${meaning}). ` +
    `Scene: ${exampleText.slice(0, 140)}. ` +
    `Style: soft watercolor sketch, pastel palette, white background, no text or letters.`
  )
}

/**
 * Generate a deterministic noun thumbnail.
 * Same word → same seed → same image every time.
 */
export async function generateNounThumbnail(
  word: string,
  definition?: string,
): Promise<ImageGenResult> {
  const prompt = buildNounThumbnailPrompt(word, definition)
  const seed = hashSeed(word.toLowerCase())

  // Try HuggingFace first
  if (config.huggingfaceToken) {
    try {
      return await generateViaHuggingFace(prompt, undefined, { seed })
    } catch (err) {
      console.warn('HF failed for noun thumbnail, falling back:', err)
    }
  }

  // Pollinations fallback with deterministic seed
  return generateViaPollinations(prompt, undefined, { seed })
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
  // 1. Try HuggingFace Inference API (if token available)
  if (config.huggingfaceToken) {
    try {
      return await generateViaHuggingFace(prompt, exampleId)
    } catch (err) {
      const errMsg = (err as Error).message
      // Only log if it's not the deprecation error
      if (errMsg !== 'HF_DEPRECATED') {
        console.warn('HuggingFace failed, falling back to Pollinations:', errMsg)
      }
      // Continue to fallback
    }
  }

  // 2. Pollinations.ai (free, no token needed, always works)
  return generateViaPollinations(prompt, exampleId)
}

// ─── HuggingFace Inference API (Stable Diffusion XL) ─────────────────

// Using SDXL for better reliability and availability
const HF_MODEL = 'stabilityai/stable-diffusion-xl-base-1.0'
const HF_API = `https://api-inference.huggingface.co/models/${HF_MODEL}`

async function generateViaHuggingFace(
  prompt: string,
  exampleId?: string,
  opts?: { seed?: number },
): Promise<ImageGenResult> {
  const params: Record<string, unknown> = { 
    width: 512, 
    height: 512, 
    num_inference_steps: 25,
    guidance_scale: 7.5
  }
  if (opts?.seed !== undefined) params.seed = opts.seed

  const res = await fetch(HF_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.huggingfaceToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: prompt, parameters: params }),
  })

  if (!res.ok) {
    const errBody = await res.text().catch(() => '')
    
    // Check for common API messages
    if (errBody.includes('moved') || errBody.includes('deprecated') || errBody.includes('updated')) {
      console.warn('HuggingFace model deprecated/moved, using fallback')
      throw new Error('HF_DEPRECATED')
    }
    
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
    
    console.warn('HuggingFace error:', errBody.slice(0, 300))
    throw new Error(`HuggingFace nicht verfügbar – verwende Pollinations`)
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
  opts?: { seed?: number },
): Promise<ImageGenResult> {
  // Truncate prompt to avoid overly long URLs
  const shortPrompt = prompt.length > 500 ? prompt.slice(0, 500) : prompt
  const encodedPrompt = encodeURIComponent(shortPrompt)
  const seed = opts?.seed ?? Math.floor(Math.random() * 2_147_483_647)
  const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=512&height=512&seed=${seed}&nologo=true`

  // Pollinations serves the image directly at the URL.
  // Return it without fetching to avoid CORS/timeout issues.
  // The <img> tag will load it directly.
  return { url: imageUrl, prompt, provider: 'pollinations', cached: false }
}
