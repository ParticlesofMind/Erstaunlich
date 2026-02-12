import { useState, useEffect, useCallback, useRef } from 'react'
import type { DictionaryEntry } from '../types/database'
import { mockEntries, getEntry, getWordOfTheDay } from '../data/mockData'
import { searchWords, fetchWord, getFeaturedWords } from '../services/wordService'
import { supabase } from '../lib/supabase'
import { useAuthContext } from '../contexts/AuthContext'

export function useAllEntries() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadFeatured() {
      try {
        const words = await getFeaturedWords()
        // Fetch first 6 featured words from Wiktionary
        const results = await Promise.allSettled(
          words.slice(0, 6).map((w) => fetchWord(w))
        )
        const fetched = results
          .filter((r): r is PromiseFulfilledResult<DictionaryEntry | null> => r.status === 'fulfilled')
          .map((r) => r.value)
          .filter((e): e is DictionaryEntry => e !== null && e.definitions.length > 0)

        if (!cancelled) {
          // Combine with mock data as fallback
          const combined = fetched.length > 0 ? fetched : mockEntries
          setEntries(combined)
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setEntries(mockEntries)
          setLoading(false)
        }
      }
    }

    loadFeatured()
    return () => { cancelled = true }
  }, [])

  return { entries, loading }
}

export function useEntry(id: string | undefined) {
  const [entry, setEntry] = useState<DictionaryEntry | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      // Check mock data first (for backward compat)
      const mockEntry = getEntry(id!)
      if (mockEntry) {
        if (!cancelled) {
          setEntry(mockEntry)
          setLoading(false)
        }
        return
      }

      // Decode the word from the ID format "wk-<encoded_word>"
      if (id!.startsWith('wk-')) {
        const word = decodeURIComponent(id!.slice(3))
        const fetched = await fetchWord(word)
        if (!cancelled) {
          setEntry(fetched)
          setLoading(false)
        }
      } else {
        if (!cancelled) {
          setEntry(null)
          setLoading(false)
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [id])

  return { entry, loading }
}

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<DictionaryEntry[]>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const search = useCallback((q: string) => {
    setQuery(q)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (q.trim().length === 0) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)

    debounceRef.current = setTimeout(async () => {
      try {
        const apiResults = await searchWords(q)
        setResults(apiResults)
      } catch {
        // Fallback to mock data search
        const q2 = q.toLowerCase()
        setResults(
          mockEntries.filter(
            (e) =>
              e.word.word.toLowerCase().includes(q2) ||
              e.definitions.some((d) => d.text.toLowerCase().includes(q2))
          )
        )
      } finally {
        setLoading(false)
      }
    }, 350)
  }, [])

  return { query, results, loading, search }
}

export function useWordOfTheDay() {
  const [entry, setEntry] = useState<DictionaryEntry | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      // Try to fetch a featured word from Wiktionary
      const featured = [
        'Wanderlust', 'Gemütlichkeit', 'Schadenfreude', 'Zeitgeist',
        'Sehnsucht', 'Fernweh', 'Geborgenheit', 'Schmetterling',
        'Frühling', 'Ohrwurm', 'Kopfkino', 'Augenblick',
      ]
      const dayWord = featured[new Date().getDate() % featured.length]

      try {
        const fetched = await fetchWord(dayWord)
        if (!cancelled && fetched && fetched.definitions.length > 0) {
          setEntry(fetched)
          return
        }
      } catch {
        // Fallback
      }

      if (!cancelled) setEntry(getWordOfTheDay())
    }

    load()
    return () => { cancelled = true }
  }, [])

  return entry
}

export function useFavorites() {
  const { user } = useAuthContext()
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('erstaunlich-favorites') || '[]')
    } catch {
      return []
    }
  })
  const [favoriteDates, setFavoriteDates] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('erstaunlich-favorite-dates') || '{}')
    } catch {
      return {}
    }
  })
  // Map word_id -> word text from Supabase (for resolving without parsing IDs)
  const [favoriteWords, setFavoriteWords] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('erstaunlich-favorite-words') || '{}')
    } catch {
      return {}
    }
  })
  const [favoriteEntries, setFavoriteEntries] = useState<DictionaryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [resolving, setResolving] = useState(false)

  // Sync favorites from Supabase when user logs in
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    supabase
      .from('user_favorites')
      .select('word_id, word, created_at')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to load favorites from Supabase:', error.message)
        }
        if (!error && data && data.length > 0) {
          const ids = data.map((f) => f.word_id)
          const wordMap: Record<string, string> = {}
          const dateMap: Record<string, string> = {}
          for (const f of data) {
            wordMap[f.word_id] = f.word
            dateMap[f.word_id] = f.created_at
          }
          setFavorites(ids)
          setFavoriteWords(wordMap)
          setFavoriteDates(dateMap)
          localStorage.setItem('erstaunlich-favorites', JSON.stringify(ids))
          localStorage.setItem('erstaunlich-favorite-words', JSON.stringify(wordMap))
          localStorage.setItem('erstaunlich-favorite-dates', JSON.stringify(dateMap))
        }
        setLoading(false)
      })
  }, [user])

  // Backfill missing dates for existing favorites
  useEffect(() => {
    if (favorites.length === 0) return
    const missing = favorites.filter((id) => !favoriteDates[id])
    if (missing.length === 0) return
    const now = new Date().toISOString()
    const updated = { ...favoriteDates }
    for (const id of missing) {
      updated[id] = now
    }
    setFavoriteDates(updated)
    localStorage.setItem('erstaunlich-favorite-dates', JSON.stringify(updated))
  }, [favorites, favoriteDates])

  // Resolve favorite IDs to full DictionaryEntry objects
  useEffect(() => {
    if (favorites.length === 0) {
      setFavoriteEntries([])
      return
    }

    let cancelled = false
    setResolving(true)

    async function resolve() {
      // Start with mock entries that match
      const fromMock = mockEntries.filter((e) => favorites.includes(e.word.id))

      // Find IDs not covered by mocks (Wiktionary entries)
      const mockIds = new Set(fromMock.map((e) => e.word.id))
      const remaining = favorites.filter((id) => !mockIds.has(id))

      // Fetch Wiktionary entries in parallel
      const fetched: DictionaryEntry[] = []
      if (remaining.length > 0) {
        const results = await Promise.allSettled(
          remaining.map((id) => {
            // Use the word text from Supabase if available, otherwise decode from ID
            let wordText: string | null = favoriteWords[id] || null
            if (!wordText && id.startsWith('wk-')) {
              wordText = decodeURIComponent(id.slice(3))
            }
            if (wordText) {
              return fetchWord(wordText)
            }
            return Promise.resolve(null)
          })
        )
        for (let i = 0; i < results.length; i++) {
          const r = results[i]
          const id = remaining[i]
          if (r.status === 'fulfilled' && r.value) {
            fetched.push(r.value)
          } else {
            // Create a minimal fallback entry so the word at least shows up
            const wordText = favoriteWords[id] || (id.startsWith('wk-') ? decodeURIComponent(id.slice(3)) : id)
            fetched.push({
              word: {
                id,
                word: wordText,
                pronunciation: '',
                syllables: '',
                word_type: '',
                category: 'Allgemein',
                difficulty: 1,
                frequency: 1,
                article: '',
                plural: '',
                conjugation: null,
                synonyms: [],
                antonyms: [],
                created_at: new Date().toISOString(),
              },
              definitions: [{ id: `${id}-d0`, word_id: id, text: 'Definition wird geladen…', order: 1 }],
              examples: [],
            })
          }
        }
      }

      if (!cancelled) {
        setFavoriteEntries([...fromMock, ...fetched])
        setResolving(false)
      }
    }

    resolve()
    return () => { cancelled = true }
  }, [favorites, favoriteWords])

  const toggle = useCallback(async (id: string, wordText?: string) => {
    const isFav = favorites.includes(id)

    // Optimistic update
    const next = isFav ? favorites.filter((f) => f !== id) : [...favorites, id]
    setFavorites(next)
    localStorage.setItem('erstaunlich-favorites', JSON.stringify(next))

    if (isFav) {
      setFavoriteDates((prev) => {
        const updated = { ...prev }
        delete updated[id]
        localStorage.setItem('erstaunlich-favorite-dates', JSON.stringify(updated))
        return updated
      })
    } else {
      const createdAt = new Date().toISOString()
      setFavoriteDates((prev) => {
        const updated = { ...prev, [id]: createdAt }
        localStorage.setItem('erstaunlich-favorite-dates', JSON.stringify(updated))
        return updated
      })
    }

    // Also update the word map for newly added favorites
    if (!isFav && wordText) {
      setFavoriteWords((prev) => {
        const updated = { ...prev, [id]: wordText }
        localStorage.setItem('erstaunlich-favorite-words', JSON.stringify(updated))
        return updated
      })
    }

    // Sync to Supabase if logged in
    if (user) {
      try {
        if (isFav) {
          await supabase
            .from('user_favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('word_id', id)
        } else {
          await supabase
            .from('user_favorites')
            .insert({ user_id: user.id, word_id: id, word: wordText || id })
        }
      } catch (err) {
        console.error('Failed to sync favorite to Supabase:', err)
        // Revert on error
        setFavorites(favorites)
        localStorage.setItem('erstaunlich-favorites', JSON.stringify(favorites))
      }
    }
  }, [favorites, user])

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites])

  return { favorites, toggle, isFavorite, favoriteEntries, favoriteDates, loading: loading || resolving }
}
