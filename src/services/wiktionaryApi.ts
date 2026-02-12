/**
 * German Wiktionary API service
 * Parses wikitext from de.wiktionary.org to extract structured word data
 */

const WIKTIONARY_API = 'https://de.wiktionary.org/w/api.php'

export interface WiktionaryResult {
  word: string
  wordType: string
  pronunciation: string
  syllables: string
  definitions: string[]
  examples: string[]
  synonyms: string[]
  antonyms: string[]
  translations: Record<string, string>
  /** Genus for nouns: 'm' | 'f' | 'n' */
  genus: string
  /** Plural form for nouns */
  plural: string
  /** Verb conjugation: { present3rd, pastSimple, pastParticiple, auxiliary } */
  conjugation: {
    present3rd: string
    pastSimple: string
    pastParticiple: string
    auxiliary: string
  } | null
}

/** Search Wiktionary for German words matching a query */
export async function searchWiktionary(query: string, limit = 20): Promise<string[]> {
  const params = new URLSearchParams({
    action: 'opensearch',
    search: query,
    limit: String(limit),
    namespace: '0',
    format: 'json',
    origin: '*',
  })

  const res = await fetch(`${WIKTIONARY_API}?${params}`)
  if (!res.ok) throw new Error(`Wiktionary search failed: ${res.status}`)

  const data = await res.json()
  // opensearch returns [query, [titles], [descriptions], [urls]]
  return (data[1] as string[]) || []
}

/** Fetch and parse full word data from Wiktionary */
export async function fetchWiktionaryWord(word: string): Promise<WiktionaryResult | null> {
  const params = new URLSearchParams({
    action: 'parse',
    page: word,
    prop: 'wikitext',
    format: 'json',
    origin: '*',
  })

  const res = await fetch(`${WIKTIONARY_API}?${params}`)
  if (!res.ok) return null

  const data = await res.json()
  if (data.error) return null

  const wikitext: string = data.parse?.wikitext?.['*'] || ''
  if (!wikitext) return null

  return parseWikitext(word, wikitext)
}

/** Parse wikitext into structured data */
function parseWikitext(word: string, text: string): WiktionaryResult {
  return {
    word,
    wordType: extractWordType(text),
    pronunciation: extractPronunciation(text),
    syllables: extractSyllables(text),
    definitions: extractDefinitions(text),
    examples: extractExamples(text),
    synonyms: extractSynonyms(text),
    antonyms: extractAntonyms(text),
    translations: extractTranslations(text),
    genus: extractGenus(text),
    plural: extractPlural(text),
    conjugation: extractConjugation(text),
  }
}

function extractWordType(text: string): string {
  // Match {{Wortart|Adjektiv|Deutsch}} or {{Wortart|Substantiv|Deutsch}}, etc.
  const match = text.match(/\{\{Wortart\|([^|]+)\|Deutsch\}\}/)
  return match?.[1] || ''
}

/** Extract grammatical gender (Genus) for nouns */
function extractGenus(text: string): string {
  // Look for {{Deutsch Substantiv Übersicht with Genus=m/f/n
  const genusMatch = text.match(/Genus\s*=\s*([mfn])/)
  if (genusMatch) return genusMatch[1]
  // Also check for {{m}}, {{f}}, {{n}} after Substantiv header
  const headerMatch = text.match(/Wortart\|Substantiv\|Deutsch\}\}[^\n]*\{\{([mfn])\}\}/)
  if (headerMatch) return headerMatch[1]
  return ''
}

/** Extract plural form for nouns */
function extractPlural(text: string): string {
  // Match Nominativ Plural=Häuser in the Substantiv Übersicht
  const match = text.match(/Nominativ Plural\s*=\s*([^\n|]+)/)
  if (match) {
    const plural = match[1].trim()
    // Handle "—" or "-" meaning no plural
    if (plural === '—' || plural === '-' || plural === '—') return ''
    return cleanWikiMarkup(plural)
  }
  // Also check {{Pl.}} in Worttrennung
  const plMatch = text.match(/\{\{Pl\.\}\}\s*([^\n]+)/)
  if (plMatch) return cleanWikiMarkup(plMatch[1].split(',')[0].trim())
  return ''
}

/** Extract verb conjugation from Deutsch Verb Übersicht */
function extractConjugation(text: string): WiktionaryResult['conjugation'] {
  // Check if this is a verb
  if (!text.match(/Wortart\|Verb\|Deutsch/)) return null

  const present3rd = text.match(/Präsens_er[^=]*=\s*([^\n|]+)/)?.  [1]?.trim() || ''
  const pastSimple = text.match(/Präteritum_ich[^=]*=\s*([^\n|]+)/)?.  [1]?.trim() || ''
  const pastParticiple = text.match(/Partizip II[^=]*=\s*([^\n|]+)/)?.  [1]?.trim() || ''
  const auxiliary = text.match(/Hilfsverb[^=]*=\s*([^\n|]+)/)?.  [1]?.trim() || 'haben'

  if (!present3rd && !pastSimple && !pastParticiple) return null

  return {
    present3rd: cleanWikiMarkup(present3rd),
    pastSimple: cleanWikiMarkup(pastSimple),
    pastParticiple: cleanWikiMarkup(pastParticiple),
    auxiliary: cleanWikiMarkup(auxiliary),
  }
}

function extractPronunciation(text: string): string {
  // Match IPA: {{Lautschrift|ɛɐ̯ˈʃta͡ʊnlɪç}}
  const match = text.match(/\{\{Lautschrift\|([^}]+)\}\}/)
  return match?.[1] || ''
}

function extractSyllables(text: string): string {
  // Extract from {{Worttrennung}} section
  // Usually like: er·staun·lich, {{Komp.}} er·staun·li·cher
  const section = extractSection(text, 'Worttrennung')
  if (!section) return ''
  // Get first line, remove markup
  const line = section.split('\n')[0].replace(/^:/, '').trim()
  // Take only the base form (before any comma)
  const base = line.split(',')[0].trim()
  return cleanWikiMarkup(base)
}

function extractDefinitions(text: string): string[] {
  const section = extractSection(text, 'Bedeutungen')
  if (!section) return []

  return section
    .split('\n')
    .filter((line) => line.match(/^:\[?\d/))
    .map((line) => {
      // Remove the [1] numbering and clean markup
      return cleanWikiMarkup(line.replace(/^:\[?\d+\]?\s*/, ''))
    })
    .filter(Boolean)
}

function extractExamples(text: string): string[] {
  const section = extractSection(text, 'Beispiele')
  if (!section) return []

  return section
    .split('\n')
    .filter((line) => line.match(/^:\[?\d/))
    .map((line) => {
      let cleaned = line.replace(/^:\[?\d+\]?\s*/, '')
      // Remove <ref>...</ref> tags
      cleaned = cleaned.replace(/<ref[^>]*>.*?<\/ref>/gs, '')
      cleaned = cleaned.replace(/<ref[^>]*\/>/g, '')
      // Remove quotes
      cleaned = cleaned.replace(/[„""]/g, '')
      return cleanWikiMarkup(cleaned).trim()
    })
    .filter((ex) => ex.length > 10)
    .slice(0, 4) // Limit to 4 examples
}

function extractSynonyms(text: string): string[] {
  const section = extractSection(text, 'Sinnverwandte Wörter')
  if (!section) {
    // Also try "Synonyme"
    const altSection = extractSection(text, 'Synonyme')
    if (!altSection) return []
    return extractLinkedWords(altSection)
  }
  return extractLinkedWords(section)
}

function extractAntonyms(text: string): string[] {
  const section = extractSection(text, 'Gegenwörter')
  if (!section) return []
  return extractLinkedWords(section)
}

function extractTranslations(text: string): Record<string, string> {
  const translations: Record<string, string> = {}
  // Match {{Ü|en|amazing}} patterns
  const regex = /\{\{Ü[t]?\|(\w{2})\|([^}|]+)/g
  let match
  while ((match = regex.exec(text)) !== null) {
    const lang = match[1]
    const word = match[2]
    if (!translations[lang]) {
      translations[lang] = word
    }
  }
  return translations
}

/** Extract a section between two headers */
function extractSection(text: string, sectionName: string): string | null {
  // Wiktionary uses {{Bedeutungen}}, {{Beispiele}}, etc. as section markers
  const startPattern = new RegExp(`\\{\\{${escapeRegex(sectionName)}\\}\\}`)
  const startMatch = text.match(startPattern)
  if (!startMatch || startMatch.index === undefined) return null

  const startIdx = startMatch.index + startMatch[0].length
  // Find the next section header {{ ... }}
  const rest = text.slice(startIdx)
  const endMatch = rest.match(/\n\{\{[A-ZÄÖÜ]/)
  const endIdx = endMatch?.index ?? rest.length

  return rest.slice(0, endIdx).trim()
}

/** Extract [[linked]] words from a section */
function extractLinkedWords(text: string): string[] {
  const words: string[] = []
  // Match [[word]] patterns
  const regex = /\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]/g
  let match
  while ((match = regex.exec(text)) !== null) {
    const w = match[1].trim()
    // Skip certain patterns
    if (w && !w.includes(':') && !w.startsWith('w:') && w.length < 40) {
      words.push(w)
    }
  }
  // Deduplicate
  return [...new Set(words)].slice(0, 12)
}

/** Clean wiki markup from text */
function cleanWikiMarkup(text: string): string {
  return text
    // Remove '' (bold/italic markers)
    .replace(/''+/g, '')
    // Remove [[link|display]] → display
    .replace(/\[\[(?:[^|\]]*\|)?([^\]]+)\]\]/g, '$1')
    // Remove {{ }} templates (simple ones)
    .replace(/\{\{[^}]*\}\}/g, '')
    // Remove remaining brackets
    .replace(/[[\]]/g, '')
    // Clean up whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Get a random set of German words from common starting letters */
export async function getRandomWords(count = 20): Promise<string[]> {
  const prefixes = [
    'Haus', 'Berg', 'Wasser', 'Licht', 'Freund', 'Nacht', 'Sonne', 'Wald',
    'Blume', 'Stein', 'Wind', 'Feuer', 'Erde', 'Herz', 'Gold', 'Stern',
    'Traum', 'Garten', 'Musik', 'Kunst',
  ]
  const shuffled = prefixes.sort(() => Math.random() - 0.5).slice(0, Math.ceil(count / 3))
  const allResults: string[] = []

  for (const prefix of shuffled) {
    try {
      const results = await searchWiktionary(prefix, 8)
      allResults.push(...results)
    } catch {
      // Continue on error
    }
  }

  return [...new Set(allResults)].slice(0, count)
}
