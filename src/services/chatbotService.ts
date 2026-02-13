/**
 * Chatbot Service
 * 
 * Handles conversation with AI writing assistant and grammar structure training.
 * Supports structure-based learning with contextual feedback.
 */

import { getStructureById, type GrammarStructure, type CEFRLevel } from '../data/grammarStructures'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export type ChatMode = 'free' | 'structure-training' | 'topic-conversation'

export interface StructureTrainingSession {
  structure: GrammarStructure
  sentencesRequired: number
  sentencesCompleted: number
  topic?: string
  userLevel: CEFRLevel
}

export interface TopicConversation {
  topic: string
  userLevel: CEFRLevel
}

/**
 * Get a chat response from the AI assistant.
 * 
 * @param messages - Conversation history
 * @param mode - Chat mode (free conversation, structure training, or topic conversation)
 * @param trainingSession - Current training session (if in structure-training mode)
 * @param topicConversation - Current topic conversation (if in topic-conversation mode)
 * @returns AI response text
 */
export async function getChatResponse(
  messages: ChatMessage[],
  mode: ChatMode = 'free',
  trainingSession?: StructureTrainingSession,
  topicConversation?: TopicConversation
): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const lastUserMessage = messages.filter((m) => m.role === 'user').pop()
  if (!lastUserMessage) {
    return 'Ich habe deine Nachricht nicht verstanden. Bitte versuche es erneut.'
  }

  const userText = lastUserMessage.content.trim()

  // Topic conversation mode
  if (mode === 'topic-conversation' && topicConversation) {
    return getTopicConversationResponse(userText, topicConversation)
  }

  // Structure training mode
  if (mode === 'structure-training' && trainingSession) {
    return getStructureTrainingResponse(userText, trainingSession)
  }

  // Free conversation mode
  return getFreeConversationResponse(userText, messages)
}

/**
 * Generate response for topic conversation mode
 */
function getTopicConversationResponse(userText: string, conversation: TopicConversation): string {
  const { topic } = conversation
  
  // Simple topic-based feedback
  const wordCount = userText.split(' ').length
  
  if (wordCount < 5) {
    return `Interessant! Versuche, mehr über "${topic}" zu schreiben. Schreib einen längeren Satz oder beschreibe deine Gedanken ausführlicher. 💭`
  }
  
  // Detect structures being used
  const detectedStructures = detectUsedStructures(userText)
  
  const responses = [
    `Super! Dein Text über "${topic}" ist gut. ${detectedStructures.length > 0 ? `Ich sehe, dass du ${detectedStructures[0].name} verwendest - sehr gut! 👏` : 'Versuche, komplexere Satzstrukturen zu verwenden.'}\n\nWas möchtest du noch über ${topic} erzählen?`,
    `Sehr schön! ${wordCount > 15 ? 'Dein Text ist ausführlich und interessant.' : 'Kannst du noch mehr Details hinzufügen?'}\n\nThink about: Wann? Wo? Warum? Mit wem?\n\nSchreib weiter über ${topic}!`,
    `Gut gemacht! 🎉\n\n${detectedStructures.length > 0 ? `Du verwendest schon ${detectedStructures[0].name}. Weiter so!` : 'Versuche, Nebensätze mit "weil", "dass" oder "wenn" zu verwenden.'}\n\nWas ist deine Meinung zu ${topic}?`,
    `Toll! Deine Grammatik zum Thema "${topic}" ist ${wordCount > 10 ? 'sehr gut' : 'gut'}.\n\nTipp: ${getRandomTip()}\n\nErzähle mir mehr!`,
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
}

/**
 * Get random grammar tip
 */
function getRandomTip(): string {
  const tips = [
    'Nutze Adjektive, um deine Sätze interessanter zu machen.',
    'Versuche verschiedene Zeitformen (Präsens, Perfekt, Präteritum).',
    'Verwende "weil" um Gründe zu erklären.',
    'Übe mit Relativsätzen: "der Mann, der..." / "die Frau, die..."',
    'Achte auf die richtige Reihenfolge: Zeit - Art - Ort',
  ]
  return tips[Math.floor(Math.random() * tips.length)]
}

/**
 * Generate response for structure training mode
 */
function getStructureTrainingResponse(
  userText: string,
  session: StructureTrainingSession
): string {
  const { structure, sentencesCompleted, sentencesRequired, topic } = session
  
  // Validate sentence structure
  const validation = validateStructure(userText, structure)
  
  if (validation.isValid) {
    const remaining = sentencesRequired - sentencesCompleted - 1
    
    if (remaining <= 0) {
      return `🎉 Ausgezeichnet! Du hast alle ${sentencesRequired} Sätze erfolgreich gebildet!\n\n✓ Dein letzter Satz: "${userText}"\n\n${structure.name} ist jetzt gemeistert! Möchtest du mit einer neuen Struktur weitermachen oder in den freien Übungsmodus wechseln?`
    }
    
    return `✓ Sehr gut! Das ist ein korrekter Satz mit der Struktur "${structure.pattern}".\n\n📝 Noch ${remaining} ${remaining === 1 ? 'Satz' : 'Sätze'} ${topic ? `zum Thema "${topic}"` : ''}.\n\n💡 Tipp: ${getContextualTip(structure, topic)}`
  } else {
    return `⚠️ Fast! Achte auf die Struktur: "${structure.pattern}"\n\n${validation.feedback}\n\nℹ️ Beispiel: ${structure.examples[Math.floor(Math.random() * structure.examples.length)]}\n\nVersuch es noch einmal!`
  }
}

/**
 * Validate if user's sentence follows the structure pattern
 */
function validateStructure(
  userText: string,
  structure: GrammarStructure
): { isValid: boolean; feedback: string } {
  const normalized = userText.toLowerCase().trim()
  
  // Basic validation rules for common structures
  
  // A1 structures
  if (structure.id === 'a1-w-questions') {
    const wWords = ['wo', 'wer', 'was', 'wann', 'warum', 'wie', 'welche', 'wessen']
    const startsWithW = wWords.some((w) => normalized.startsWith(w + ' '))
    const hasQuestion = userText.endsWith('?')
    
    if (!startsWithW) {
      return { isValid: false, feedback: 'W-Fragen beginnen mit einem Fragewort (wo, wer, was, wann, warum, wie).' }
    }
    if (!hasQuestion) {
      return { isValid: false, feedback: 'Vergiss nicht das Fragezeichen am Ende!' }
    }
    return { isValid: true, feedback: '' }
  }
  
  if (structure.id === 'a1-yes-no-questions') {
    const hasQuestion = userText.endsWith('?')
    const verbAtStart = /^(bist|hast|kommst|gehst|trinkst|isst|machst|kannst|willst|musst|sollst|darfst|magst|bin|habe|komme|gehe|trinke|esse|mache|kann|will|muss|soll|darf|mag)\s/i.test(normalized)
    
    if (!verbAtStart) {
      return { isValid: false, feedback: 'Bei Ja/Nein-Fragen steht das Verb an erster Position.' }
    }
    if (!hasQuestion) {
      return { isValid: false, feedback: 'Vergiss nicht das Fragezeichen!' }
    }
    return { isValid: true, feedback: '' }
  }
  
  if (structure.id === 'a1-negation') {
    const hasNegation = normalized.includes('nicht') || normalized.includes('kein')
    if (!hasNegation) {
      return { isValid: false, feedback: 'Der Satz muss eine Verneinung mit "nicht" oder "kein" enthalten.' }
    }
    return { isValid: true, feedback: '' }
  }
  
  // A2 structures
  if (structure.id === 'a2-weil') {
    const hasWeil = normalized.includes('weil')
    if (!hasWeil) {
      return { isValid: false, feedback: 'Der Satz muss "weil" enthalten.' }
    }
    // Check if there's something after weil (basic check)
    const weilIndex = normalized.indexOf('weil')
    const afterWeil = normalized.substring(weilIndex + 4).trim()
    if (afterWeil.length < 5) {
      return { isValid: false, feedback: 'Nach "weil" muss ein vollständiger Nebensatz folgen.' }
    }
    return { isValid: true, feedback: '' }
  }
  
  if (structure.id === 'a2-dass') {
    const hasDass = normalized.includes('dass')
    if (!hasDass) {
      return { isValid: false, feedback: 'Der Satz muss "dass" enthalten.' }
    }
    return { isValid: true, feedback: '' }
  }
  
  if (structure.id === 'a2-wenn-condition') {
    const hasWenn = normalized.startsWith('wenn') || normalized.includes(', wenn')
    if (!hasWenn) {
      return { isValid: false, feedback: 'Der Satz muss "wenn" enthalten für eine Bedingung.' }
    }
    return { isValid: true, feedback: '' }
  }
  
  // B1 structures
  if (structure.id === 'b1-obwohl') {
    const hasObwohl = normalized.includes('obwohl')
    if (!hasObwohl) {
      return { isValid: false, feedback: 'Der Satz muss "obwohl" enthalten (Kontrast).' }
    }
    return { isValid: true, feedback: '' }
  }
  
  if (structure.id === 'b1-bevor-nachdem') {
    const hasBevorNachdem = normalized.includes('bevor') || normalized.includes('nachdem')
    if (!hasBevorNachdem) {
      return { isValid: false, feedback: 'Der Satz muss "bevor" oder "nachdem" enthalten.' }
    }
    return { isValid: true, feedback: '' }
  }
  
  if (structure.id === 'b1-damit') {
    const hasDamit = normalized.includes('damit')
    if (!hasDamit) {
      return { isValid: false, feedback: 'Der Satz muss "damit" enthalten (Zweck).' }
    }
    return { isValid: true, feedback: '' }
  }
  
  if (structure.id === 'b1-um-zu') {
    const hasUmZu = normalized.includes('um zu') || normalized.includes('um ... zu')
    if (!hasUmZu) {
      return { isValid: false, feedback: 'Der Satz muss "um ... zu" enthalten.' }
    }
    return { isValid: true, feedback: '' }
  }
  
  // B2 structures
  if (structure.id === 'b2-waehrend') {
    const hasWaehrend = normalized.includes('während')
    if (!hasWaehrend) {
      return { isValid: false, feedback: 'Der Satz muss "während" enthalten (Gleichzeitigkeit).' }
    }
    return { isValid: true, feedback: '' }
  }
  
  if (structure.id === 'b2-als-past') {
    const hasAls = normalized.startsWith('als') || normalized.includes(', als')
    if (!hasAls) {
      return { isValid: false, feedback: 'Der Satz muss "als" enthalten (Vergangenheit).' }
    }
    return { isValid: true, feedback: '' }
  }
  
  if (structure.id === 'b2-falls') {
    const hasFalls = normalized.startsWith('falls') || normalized.includes(', falls')
    if (!hasFalls) {
      return { isValid: false, feedback: 'Der Satz muss "falls" enthalten (unsichere Bedingung).' }
    }
    return { isValid: true, feedback: '' }
  }
  
  if (structure.id === 'b2-indem') {
    const hasIndem = normalized.includes('indem')
    if (!hasIndem) {
      return { isValid: false, feedback: 'Der Satz muss "indem" enthalten (Art und Weise).' }
    }
    return { isValid: true, feedback: '' }
  }
  
  // C1 structures
  if (structure.id === 'c1-je-desto') {
    const hasJe = normalized.includes('je ')
    const hasDesto = normalized.includes('desto') || normalized.includes('umso')
    if (!hasJe || !hasDesto) {
      return { isValid: false, feedback: 'Der Satz muss "je ... desto/umso" enthalten.' }
    }
    return { isValid: true, feedback: '' }
  }
  
  // Default: accept if sentence is long enough and has a verb
  if (userText.split(' ').length >= 4) {
    return { isValid: true, feedback: '' }
  }
  
  return { isValid: false, feedback: 'Der Satz ist zu kurz. Bilde einen vollständigen Satz mit der gegebenen Struktur.' }
}

/**
 * Get contextual tip based on structure and topic
 */
function getContextualTip(structure: GrammarStructure, topic?: string): string {
  const tips = [
    `Versuche einen Satz ${topic ? `über ${topic}` : 'aus deinem Alltag'}.`,
    'Verwende verschiedene Subjekte (ich, du, er, sie, wir, ihr, sie).',
    'Denk an konkrete Situationen aus deinem Leben.',
    'Kombiniere die Struktur mit Vokabeln, die du kennst.',
  ]
  
  if (structure.relatedVocab && structure.relatedVocab.length > 0) {
    tips.push(`Nutze Vokabeln wie: ${structure.relatedVocab.slice(0, 3).join(', ')}`)
  }
  
  return tips[Math.floor(Math.random() * tips.length)]
}

/**
 * Generate response for free conversation mode
 */
function getFreeConversationResponse(userText: string, _messages: ChatMessage[]): string {
  const normalized = userText.toLowerCase()

  // Grammar help
  if (normalized.includes('wie sagt man') || normalized.includes('wie schreibt man')) {
    return 'Das ist eine gute Frage! Um dir zu helfen, bräuchte ich mehr Kontext. Kannst du mir einen vollständigen Satz geben, den du schreiben möchtest?'
  }

  // Detect structures being used
  const detectedStructures = detectUsedStructures(userText)
  if (detectedStructures.length > 0) {
    const structureNames = detectedStructures.map((s) => s.name).join(', ')
    return `Sehr gut! Ich sehe, dass du ${structureNames} verwendest. ${provideFeedback(userText, detectedStructures)}\n\nMöchtest du diese Struktur gezielt üben? Wechsle in den "Struktur-Training" Modus!`
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
 * Detect which grammar structures are used in the text
 */
function detectUsedStructures(text: string): GrammarStructure[] {
  const normalized = text.toLowerCase()
  const detected: GrammarStructure[] = []
  
  // Import structures dynamically to avoid circular dependencies
  if (normalized.includes('weil')) {
    const structure = getStructureById('a2-weil')
    if (structure) detected.push(structure)
  }
  if (normalized.includes('dass')) {
    const structure = getStructureById('a2-dass')
    if (structure) detected.push(structure)
  }
  if (normalized.includes('obwohl')) {
    const structure = getStructureById('b1-obwohl')
    if (structure) detected.push(structure)
  }
  if (normalized.includes('während')) {
    const structure = getStructureById('b2-waehrend')
    if (structure) detected.push(structure)
  }
  if (normalized.includes('je ') && (normalized.includes('desto') || normalized.includes('umso'))) {
    const structure = getStructureById('c1-je-desto')
    if (structure) detected.push(structure)
  }
  
  return detected
}

/**
 * Provide feedback based on detected structures
 */
function provideFeedback(_text: string, _structures: GrammarStructure[]): string {
  if (_structures.length === 0) return ''
  
  const feedbacks = [
    'Das zeigt, dass du fortgeschritten bist!',
    'Weiter so!',
    'Diese Struktur meisterst du gut!',
    'Perfekt für dein Niveau!',
  ]
  
  return feedbacks[Math.floor(Math.random() * feedbacks.length)]
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
