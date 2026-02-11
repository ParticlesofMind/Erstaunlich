/**
 * Word Service - orchestrates Wiktionary API + Supabase caching + image generation
 */

import { searchWiktionary, fetchWiktionaryWord, type WiktionaryResult } from './wiktionaryApi'
import type { DictionaryEntry, Word, Definition, Example } from '../types/database'
import { supabase } from '../lib/supabase'

/** Convert Wiktionary result to our DictionaryEntry format */
function wiktionaryToEntry(wk: WiktionaryResult): DictionaryEntry {
  const wordId = `wk-${encodeURIComponent(wk.word)}`

  // Guess category from word type
  const categoryMap: Record<string, string> = {
    'Adjektiv': 'Beschreibend',
    'Substantiv': 'Gegenstand',
    'Verb': 'Handlung',
    'Adverb': 'Umstand',
    'Konjunktion': 'Verbindung',
    'Präposition': 'Verhältnis',
    'Interjektion': 'Ausruf',
    'Pronomen': 'Stellvertretung',
    'Artikel': 'Begleiter',
    'Numerale': 'Zahl',
    'Partikel': 'Partikel',
  }

  // Estimate difficulty from word length, number of syllables, rarity
  const syllCount = (wk.syllables.match(/·/g) || []).length + 1
  const difficulty = Math.min(5, Math.max(1, Math.ceil(syllCount * 0.8 + (wk.word.length > 12 ? 1 : 0))))

  // Build pronunciation display from syllables
  const pronDisplay = wk.syllables
    ? wk.syllables.replace(/·/g, ' - ')
    : wk.word.split('').join(' ')

  const word: Word = {
    id: wordId,
    word: wk.word,
    pronunciation: pronDisplay,
    syllables: wk.syllables,
    word_type: wk.wordType,
    category: categoryMap[wk.wordType] || wk.wordType || 'Allgemein',
    difficulty,
    synonyms: wk.synonyms.slice(0, 8),
    antonyms: wk.antonyms.slice(0, 6),
    created_at: new Date().toISOString(),
  }

  const definitions: Definition[] = wk.definitions.map((text, i) => ({
    id: `${wordId}-d${i}`,
    word_id: wordId,
    text,
    order: i + 1,
  }))

  const examples: Example[] = wk.examples.map((text, i) => {
    // Find the word (or a form of it) in the example to highlight
    const highlighted = findHighlightWord(text, wk.word)
    return {
      id: `${wordId}-e${i}`,
      word_id: wordId,
      text,
      highlighted_word: highlighted,
      order: i + 1,
    }
  })

  return { word, definitions, examples }
}

/** Find a form of the word in the example sentence for highlighting */
function findHighlightWord(sentence: string, baseWord: string): string {
  // Try exact match first
  if (sentence.includes(baseWord)) return baseWord

  // Try common German inflections
  const lower = baseWord.toLowerCase()
  const words = sentence.split(/\s+/)
  for (const w of words) {
    const clean = w.replace(/[.,!?;:"„"]/g, '')
    if (clean.toLowerCase().startsWith(lower.slice(0, Math.max(3, lower.length - 3)))) {
      return clean
    }
  }

  return baseWord
}

/** Search for words - returns entries from Wiktionary */
export async function searchWords(query: string): Promise<DictionaryEntry[]> {
  if (query.trim().length < 2) return []

  try {
    const wordList = await searchWiktionary(query, 15)

    // Fetch details for top results in parallel
    const topWords = wordList.slice(0, 8)
    const results = await Promise.allSettled(
      topWords.map((w) => fetchWiktionaryWord(w))
    )

    return results
      .filter(
        (r): r is PromiseFulfilledResult<WiktionaryResult> =>
          r.status === 'fulfilled' && r.value !== null
      )
      .map((r) => wiktionaryToEntry(r.value!))
      .filter((e) => e.definitions.length > 0)
  } catch (err) {
    console.error('Search error:', err)
    return []
  }
}

/** Fetch a single word from Wiktionary */
export async function fetchWord(word: string): Promise<DictionaryEntry | null> {
  try {
    const wk = await fetchWiktionaryWord(word)
    if (!wk) return null
    return wiktionaryToEntry(wk)
  } catch (err) {
    console.error('Fetch error:', err)
    return null
  }
}

/** Cache an entry to Supabase (if connected) */
export async function cacheEntry(entry: DictionaryEntry): Promise<void> {
  try {
    // Use type-safe any for upsert since DB might not match exactly
    const { error } = await (supabase.from('words') as any).upsert({
      id: entry.word.id,
      word: entry.word.word,
      pronunciation: entry.word.pronunciation,
      syllables: entry.word.syllables,
      word_type: entry.word.word_type,
      category: entry.word.category,
      difficulty: entry.word.difficulty,
      synonyms: entry.word.synonyms,
      antonyms: entry.word.antonyms,
      source: 'wiktionary',
    })
    if (error) console.warn('Cache error (words):', error.message)

    // Cache definitions
    for (const def of entry.definitions) {
      await (supabase.from('definitions') as any).upsert({
        id: def.id,
        word_id: def.word_id,
        text: def.text,
        order: def.order,
      })
    }

    // Cache examples
    for (const ex of entry.examples) {
      await (supabase.from('examples') as any).upsert({
        id: ex.id,
        word_id: ex.word_id,
        text: ex.text,
        highlighted_word: ex.highlighted_word,
        image_url: ex.image_url,
        order: ex.order,
      })
    }
  } catch {
    // Supabase not connected, silently ignore
  }
}

/** Get trending/featured words for the home page */
export async function getFeaturedWords(): Promise<string[]> {
  return [
    'Wanderlust', 'Gemütlichkeit', 'Schadenfreude', 'Zeitgeist',
    'Kindergarten', 'Fernweh', 'Weltanschauung', 'Sehnsucht',
    'Geborgenheit', 'Frühling', 'Schmetterling', 'Augenblick',
    'Feierabend', 'Backpfeifengesicht', 'Torschlusspanik', 'Fingerspitzengefühl',
    'Fremdschämen', 'Kopfkino', 'Luftschloss', 'Ohrwurm',
  ]
}
