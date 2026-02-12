/**
 * Chatbot Service
 * 
 * Handles conversation with AI writing assistant.
 * Currently configured to use a Llama model (placeholder for future implementation).
 */

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

/**
 * Get a chat response from the AI assistant.
 * 
 * @param messages - Conversation history
 * @returns AI response text
 * 
 * TODO: Integrate with actual Llama model API
 * For now, returns helpful writing feedback as a placeholder
 */
export async function getChatResponse(messages: ChatMessage[]): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const lastUserMessage = messages.filter((m) => m.role === 'user').pop()
  if (!lastUserMessage) {
    return 'Ich habe deine Nachricht nicht verstanden. Bitte versuche es erneut.'
  }

  const userText = lastUserMessage.content.toLowerCase()

  // Placeholder response logic
  // TODO: Replace with actual Llama model API call
  
  // Grammar help
  if (userText.includes('wie sagt man') || userText.includes('wie schreibt man')) {
    return 'Das ist eine gute Frage! Um dir zu helfen, bräuchte ich mehr Kontext. Kannst du mir einen vollständigen Satz geben, den du schreiben möchtest?'
  }

  // Writing feedback
  if (userText.split(' ').length > 10) {
    return `Sehr gut! Dein Text ist interessant. Hier sind ein paar Tipps:\n\n✓ Deine Satzstruktur ist klar\n✓ Versuche, mehr Adjektive zu verwenden\n✓ Achte auf die richtige Verwendung von Artikeln (der, die, das)\n\nMöchtest du, dass ich dir bei einem bestimmten Aspekt helfe?`
  }

  // Short responses
  if (userText.split(' ').length <= 5) {
    return 'Das ist ein guter Anfang! Versuch, einen längeren Satz zu schreiben. Beschreibe mir zum Beispiel, was du heute gemacht hast oder was du gerne machst.'
  }

  // Default encouraging response
  return `Danke für deinen Text! Ich sehe, dass du übst. Das ist großartig! 

Hier sind einige Vorschläge:
• Verwende mehr beschreibende Wörter
• Achte auf die Verbkonjugation
• Übe mit verschiedenen Zeitformen

Was möchtest du als Nächstes schreiben?`
}

/**
 * Future implementation notes:
 * 
 * To integrate with Llama (or another LLM):
 * 
 * 1. Option A: Use Hugging Face Inference API
 *    - Model: meta-llama/Llama-2-7b-chat-hf or similar
 *    - Endpoint: https://api-inference.huggingface.co/models/...
 *    - Requires HF API token
 * 
 * 2. Option B: Use Ollama locally
 *    - Run llama2 or llama3 locally
 *    - API endpoint: http://localhost:11434/api/generate
 *    - No API key needed, but requires local setup
 * 
 * 3. Option C: Use OpenRouter or similar
 *    - Access to various models including Llama
 *    - Paid service with API key
 * 
 * Example Hugging Face implementation:
 * 
 * const response = await fetch(
 *   'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf',
 *   {
 *     method: 'POST',
 *     headers: {
 *       'Authorization': `Bearer ${process.env.HF_API_TOKEN}`,
 *       'Content-Type': 'application/json',
 *     },
 *     body: JSON.stringify({
 *       inputs: conversationPrompt,
 *       parameters: {
 *         max_new_tokens: 500,
 *         temperature: 0.7,
 *         top_p: 0.95,
 *       },
 *     }),
 *   }
 * )
 * 
 * const data = await response.json()
 * return data[0].generated_text
 */
