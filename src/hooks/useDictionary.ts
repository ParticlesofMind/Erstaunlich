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
  const [loading, setLoading] = useState(false)

  // Sync favorites from Supabase when user logs in
  useEffect(() => {
    if (!user) return

    setLoading(true)
    supabase
      .from('user_favorites')
      .select('word_id')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (!error && data) {
          const ids = data.map((f) => f.word_id)
          setFavorites(ids)
          localStorage.setItem('erstaunlich-favorites', JSON.stringify(ids))
        }
        setLoading(false)
      })
  }, [user])

  const toggle = useCallback(async (id: string, wordText?: string) => {
    const isFav = favorites.includes(id)

    // Optimistic update
    const next = isFav ? favorites.filter((f) => f !== id) : [...favorites, id]
    setFavorites(next)
    localStorage.setItem('erstaunlich-favorites', JSON.stringify(next))

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
      } catch {
        // Revert on error
        setFavorites(favorites)
        localStorage.setItem('erstaunlich-favorites', JSON.stringify(favorites))
      }
    }
  }, [favorites, user])

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites])

  const favoriteEntries = mockEntries.filter((e) => favorites.includes(e.word.id))

  return { favorites, toggle, isFavorite, favoriteEntries, loading }
}
