import { searchWords } from './wordService'
import type { DictionaryEntry } from '../types/database'

const CACHE_KEY = 'erstaunlich-category-cache'
const CACHE_VERSION = 1

export interface CategoryCache {
  version: number
  timestamp: number
  data: Record<string, DictionaryEntry[]>
}

const categories = [
  {
    name: 'Gefühle & Emotionen',
    keywords: ['Liebe', 'Angst', 'Freude', 'Trauer', 'Hoffnung'],
  },
  {
    name: 'Natur & Umwelt',
    keywords: ['Wald', 'Berg', 'Fluss', 'Baum', 'Tier'],
  },
  {
    name: 'Essen & Trinken',
    keywords: ['Brot', 'Kaffee', 'Wasser', 'Wein', 'Obst'],
  },
  {
    name: 'Reisen & Orte',
    keywords: ['Reise', 'Stadt', 'Land', 'Abenteuer', 'Weg'],
  },
  {
    name: 'Alltag & Familie',
    keywords: ['Familie', 'Haus', 'Schule', 'Kind', 'Mutter'],
  },
  {
    name: 'Kultur & Kunst',
    keywords: ['Musik', 'Theater', 'Kunst', 'Tanz', 'Lied'],
  },
  {
    name: 'Körper & Gesundheit',
    keywords: ['Gesundheit', 'Herz', 'Kopf', 'Hand', 'Auge'],
  },
  {
    name: 'Beruf & Arbeit',
    keywords: ['Arbeit', 'Büro', 'Lehrer', 'Handel', 'Chef'],
  },
  {
    name: 'Wissenschaft',
    keywords: ['Wissenschaft', 'Experiment', 'Forschung', 'Theorie', 'Zahl'],
  },
  {
    name: 'Philosophie & Geschichte',
    keywords: ['Freiheit', 'Wahrheit', 'Macht', 'Zeit', 'Mensch'],
  },
]

function loadCache(): CategoryCache | null {
  try {
    const stored = localStorage.getItem(CACHE_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored) as CategoryCache
    if (parsed.version !== CACHE_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

function saveCache(cache: CategoryCache): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch (err) {
    console.warn('Failed to save category cache:', err)
  }
}

export async function preloadCategoryCache(): Promise<void> {
  const existing = loadCache()
  if (existing && Date.now() - existing.timestamp < 24 * 60 * 60 * 1000) {
    return
  }

  const data: Record<string, DictionaryEntry[]> = {}

  for (const cat of categories) {
    try {
      const results = await Promise.allSettled(cat.keywords.map((keyword) => searchWords(keyword)))
      const combined = results
        .filter((r): r is PromiseFulfilledResult<DictionaryEntry[]> => r.status === 'fulfilled')
        .flatMap((r) => r.value)
      const unique = new Map<string, DictionaryEntry>()
      for (const entry of combined) {
        if (!unique.has(entry.word.id)) unique.set(entry.word.id, entry)
      }
      data[cat.name] = Array.from(unique.values())
    } catch (err) {
      console.warn(`Failed to preload category ${cat.name}:`, err)
      data[cat.name] = []
    }
  }

  saveCache({
    version: CACHE_VERSION,
    timestamp: Date.now(),
    data,
  })
}

export function getCategoryWords(categoryName: string): DictionaryEntry[] {
  const cache = loadCache()
  if (!cache) return []
  return cache.data[categoryName] || []
}

export function isCacheReady(): boolean {
  return loadCache() !== null
}
