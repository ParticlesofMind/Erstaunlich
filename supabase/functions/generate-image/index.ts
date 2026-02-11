import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Supabase Edge Function: generate-image
 * 
 * Generates an AI image via HuggingFace Inference API
 * and optionally stores it in Supabase Storage.
 * 
 * Environment variables needed:
 *   HUGGINGFACE_TOKEN - Your HuggingFace API token
 */

const HF_MODEL = 'black-forest-labs/FLUX.1-schnell'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing "prompt" in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const hfToken = Deno.env.get('HUGGINGFACE_TOKEN')
    if (!hfToken) {
      return new Response(
        JSON.stringify({ error: 'HUGGINGFACE_TOKEN not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Call HuggingFace Inference API
    const hfRes = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
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

    if (!hfRes.ok) {
      const errText = await hfRes.text()
      console.error('HuggingFace API error:', errText)

      if (hfRes.status === 503) {
        return new Response(
          JSON.stringify({ error: 'Model is loading, please try again in 30 seconds' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ error: `Image generation failed: ${hfRes.status}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the image as bytes
    const imageBytes = new Uint8Array(await hfRes.arrayBuffer())
    const filename = `generated/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`

    // Try to store in Supabase Storage
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (supabaseUrl && supabaseKey) {
      const storageRes = await fetch(
        `${supabaseUrl}/storage/v1/object/dictionary-images/${filename}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'image/png',
            'x-upsert': 'true',
          },
          body: imageBytes,
        }
      )

      if (storageRes.ok) {
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/dictionary-images/${filename}`
        return new Response(
          JSON.stringify({ url: publicUrl, prompt, stored: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.warn('Storage upload failed, returning base64 instead:', await storageRes.text())
    }

    // Fallback: return base64 data URI
    const base64 = btoa(String.fromCharCode(...imageBytes))
    const dataUrl = `data:image/png;base64,${base64}`

    return new Response(
      JSON.stringify({ url: dataUrl, prompt, stored: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('Edge function error:', err)
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
