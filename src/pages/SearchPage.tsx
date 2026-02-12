import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, Loader2, Wifi } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import WordCard from '../components/WordCard'
import { useSearch } from '../hooks/useDictionary'
import { searchWords } from '../services/wordService'
import type { DictionaryEntry } from '../types/database'

const categories = [
  {
    name: 'Gefühle & Emotionen',
    description: 'Liebe, Angst, Freude, Trauer …',
    keywords: ['Liebe', 'Angst', 'Freude', 'Trauer', 'Hoffnung'],
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=260&fit=crop',
    color: 'from-rose-500/70',
  },
  {
    name: 'Natur & Umwelt',
    description: 'Wald, Berg, Fluss, Tier …',
    keywords: ['Wald', 'Berg', 'Fluss', 'Baum', 'Tier'],
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=260&fit=crop',
    color: 'from-emerald-600/70',
  },
  {
    name: 'Essen & Trinken',
    description: 'Brot, Kaffee, Kuchen, Wein …',
    keywords: ['Brot', 'Kaffee', 'Wasser', 'Wein', 'Obst'],
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=260&fit=crop',
    color: 'from-amber-600/70',
  },
  {
    name: 'Reisen & Orte',
    description: 'Wanderlust, Fernweh, Abenteuer …',
    keywords: ['Reise', 'Stadt', 'Land', 'Abenteuer', 'Weg'],
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=260&fit=crop',
    color: 'from-sky-600/70',
  },
  {
    name: 'Alltag & Familie',
    description: 'Haus, Schule, Arbeit, Kind …',
    keywords: ['Familie', 'Haus', 'Schule', 'Kind', 'Mutter'],
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=260&fit=crop',
    color: 'from-violet-600/70',
  },
  {
    name: 'Kultur & Kunst',
    description: 'Musik, Theater, Literatur …',
    keywords: ['Musik', 'Theater', 'Kunst', 'Tanz', 'Lied'],
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=260&fit=crop',
    color: 'from-fuchsia-600/70',
  },
  {
    name: 'Körper & Gesundheit',
    description: 'Herz, Kopf, Schmerz, Kraft …',
    keywords: ['Gesundheit', 'Herz', 'Kopf', 'Hand', 'Auge'],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=260&fit=crop',
    color: 'from-teal-600/70',
  },
  {
    name: 'Beruf & Arbeit',
    description: 'Büro, Lehrer, Handel, Beruf …',
    keywords: ['Arbeit', 'Büro', 'Lehrer', 'Handel', 'Chef'],
    image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&h=260&fit=crop',
    color: 'from-slate-700/70',
  },
  {
    name: 'Wissenschaft',
    description: 'Forschung, Experiment, Theorie …',
    keywords: ['Wissenschaft', 'Experiment', 'Forschung', 'Theorie', 'Zahl'],
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=260&fit=crop',
    color: 'from-indigo-600/70',
  },
  {
    name: 'Philosophie & Geschichte',
    description: 'Zeitgeist, Dasein, Freiheit …',
    keywords: ['Freiheit', 'Wahrhheit', 'Macht', 'Zeit', 'Mensch'],
    image: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=400&h=260&fit=crop',
    color: 'from-stone-700/70',
  },
]

export default function SearchPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { query, results, loading, search } = useSearch()
  const [selectedWordTypes, setSelectedWordTypes] = useState<string[]>([])
  const [browsedCategory, setBrowsedCategory] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [categoryResults, setCategoryResults] = useState<DictionaryEntry[]>([])
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [loadedCategory, setLoadedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'frequency'>('name-asc')
  const filterDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Handle URL parameters for category browse or free search
  useEffect(() => {
    const q = searchParams.get('q')
    const categoryName = searchParams.get('category')
    const filterParam = searchParams.get('filter')
    let cancelled = false

    if (categoryName) {
      // Browse category mode: load category words from Wiktionary
      setBrowsedCategory(categoryName)
      setCategoryFilter(filterParam || '')
      search('')

      if (categoryName === loadedCategory) return

      const cat = categories.find((c) => c.name === categoryName)
      if (!cat) {
        setCategoryResults([])
        setCategoryLoading(false)
        setLoadedCategory(categoryName)
        return
      }

      setCategoryLoading(true)
      Promise.allSettled(cat.keywords.map((keyword) => searchWords(keyword)))
        .then((results) => {
          if (cancelled) return
          const combined = results
            .filter((r): r is PromiseFulfilledResult<DictionaryEntry[]> => r.status === 'fulfilled')
            .flatMap((r) => r.value)
          const unique = new Map<string, DictionaryEntry>()
          for (const entry of combined) {
            if (!unique.has(entry.word.id)) unique.set(entry.word.id, entry)
          }
          setCategoryResults(Array.from(unique.values()))
        })
        .catch(() => {
          if (!cancelled) setCategoryResults([])
        })
        .finally(() => {
          if (!cancelled) {
            setCategoryLoading(false)
            setLoadedCategory(categoryName)
          }
        })
      return () => {
        cancelled = true
      }
    }

    if (q) {
      // Free text search mode
      setBrowsedCategory(null)
      setCategoryFilter('')
      setCategoryResults([])
      setCategoryLoading(false)
      setLoadedCategory(null)
      search(q)
    } else {
      setBrowsedCategory(null)
      setCategoryFilter('')
      setCategoryResults([])
      setCategoryLoading(false)
      setLoadedCategory(null)
      search('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    if (!browsedCategory) return

    if (filterDebounceRef.current) clearTimeout(filterDebounceRef.current)

    filterDebounceRef.current = setTimeout(() => {
      const nextFilter = categoryFilter.trim()
      const currentCategory = searchParams.get('category')
      const currentFilter = searchParams.get('filter') || ''

      if (currentCategory === browsedCategory && currentFilter === nextFilter) return

      const nextParams: Record<string, string> = { category: browsedCategory }
      if (nextFilter.length > 0) nextParams.filter = nextFilter
      setSearchParams(nextParams, { replace: true })
    }, 300)

    return () => {
      if (filterDebounceRef.current) clearTimeout(filterDebounceRef.current)
    }
  }, [browsedCategory, categoryFilter, searchParams, setSearchParams])

  const showSearchResults = query.trim().length > 0 || browsedCategory !== null

  const categoryFiltered = useMemo(() => {
    if (!browsedCategory) return []
    const trimmed = categoryFilter.trim().toLowerCase()
    if (!trimmed) return categoryResults
    return categoryResults.filter((entry) => {
      const wordMatch = entry.word.word.toLowerCase().includes(trimmed)
      const defMatch = entry.definitions.some((def) => def.text.toLowerCase().includes(trimmed))
      return wordMatch || defMatch
    })
  }, [browsedCategory, categoryFilter, categoryResults])

  // Use results from Wiktionary search or category list
  const sourceResults = browsedCategory ? categoryFiltered : results

  const allowedWordTypes = ['Adjektiv', 'Substantiv', 'Verb']
  const availableWordTypes = Array.from(new Set(sourceResults.map((e) => e.word.word_type)))
    .filter((wt) => allowedWordTypes.includes(wt))
    .sort()
  
  // Filter results by selected word types
  const filteredResults = selectedWordTypes.length > 0
    ? sourceResults.filter((e) => selectedWordTypes.includes(e.word.word_type))
    : sourceResults

  // Sort filtered results
  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.word.word.localeCompare(b.word.word, 'de')
      case 'name-desc':
        return b.word.word.localeCompare(a.word.word, 'de')
      case 'frequency':
        return (b.word.frequency || 0) - (a.word.frequency || 0)
      default:
        return 0
    }
  })

  const handleCategoryClick = (categoryName: string) => {
    setSearchParams({ category: categoryName })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      {browsedCategory && (
        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-start gap-3">
            <button
              onClick={() => {
                navigate('/')
                setBrowsedCategory(null)
                setCategoryResults([])
                setCategoryLoading(false)
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              title="Kategorien zurück"
              aria-label="Kategorien zurück"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{browsedCategory}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {categories.find((c) => c.name === browsedCategory)?.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <SearchBar
          value={browsedCategory ? categoryFilter : query}
          onChange={(value) => {
            if (browsedCategory) {
              setCategoryFilter(value)
            } else {
              search(value)
            }
          }}
          placeholder={browsedCategory ? 'In Kategorie filtern…' : 'Wort suchen…'}
        />
      </div>

      {/* Filters and Sort (shown when searching or browsing category) */}
      {showSearchResults && (
        <div className="mb-4 space-y-3">
          {(browsedCategory || (sourceResults.length > 0 && availableWordTypes.length > 1)) && (
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex flex-wrap items-center gap-3 justify-between">
                {sourceResults.length > 0 && availableWordTypes.length > 1 && (
                  <div className="flex items-center gap-3 flex-wrap">
                    {selectedWordTypes.length > 0 && (
                      <button
                        onClick={() => setSelectedWordTypes([])}
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        Alle zurücksetzen
                      </button>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {availableWordTypes.map((wt) => {
                        const isSelected = selectedWordTypes.includes(wt)
                        return (
                          <button
                            key={wt}
                            onClick={() => {
                              setSelectedWordTypes((prev) =>
                                prev.includes(wt)
                                  ? prev.filter((x) => x !== wt)
                                  : [...prev, wt]
                              )
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              isSelected
                                ? 'bg-brand-600 text-white'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'
                            }`}
                          >
                            {wt}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {browsedCategory && (
                  <div className="ml-auto">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-gray-600 border border-gray-200 hover:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      aria-label="Sortieren"
                    >
                      <option value="name-asc">A–Z</option>
                      <option value="name-desc">Z–A</option>
                      <option value="frequency">Häufigkeit</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {showSearchResults ? (
        <div>
          {browsedCategory ? (
            // Category browse mode
            <>
              {categoryLoading ? (
                <div className="flex items-center justify-center py-12 gap-2">
                  <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
                  <span className="text-sm text-gray-400">Wörter laden…</span>
                </div>
              ) : (
                <>
                  <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-3">
                    {sortedResults.length} Wort{sortedResults.length !== 1 && 'e'}
                  </h2>
                  <div className="space-y-2">
                    {sortedResults.map((entry) => (
                      <WordCard
                        key={entry.word.id}
                        entry={entry}
                        onClick={() => navigate(`/word/${entry.word.id}`)}
                        compact
                      />
                    ))}
                    {sortedResults.length === 0 && (
                      <div className="text-center py-12">
                        <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-sm text-gray-400">Keine Wörter mit ausgewählten Filtern</p>
                        <p className="text-xs text-gray-300 mt-1">Versuche, deine Filter zu ändern</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            // Search mode
            <>
              {loading ? (
                <div className="flex items-center justify-center py-12 gap-2">
                  <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
                  <span className="text-sm text-gray-400">Wiktionary durchsuchen…</span>
                </div>
              ) : (
                <>
                  <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-3">
                    {sortedResults.length} Ergebnis{sortedResults.length !== 1 && 'se'}
                  </h2>
                  <div className="space-y-2">
                    {sortedResults.map((entry) => (
                      <WordCard
                        key={entry.word.id}
                        entry={entry}
                        onClick={() => navigate(`/word/${entry.word.id}`)}
                        compact
                      />
                    ))}
                    {sortedResults.length === 0 && (
                      <div className="text-center py-12">
                        <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-sm text-gray-400">Keine Ergebnisse mit ausgewählten Filtern</p>
                        <p className="text-xs text-gray-300 mt-1">Versuche, deine Filter zu ändern</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      ) : (
        /* Category Grid */
        <section>
          <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-4">Kategorien entdecken</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="relative overflow-hidden rounded-2xl aspect-[4/3] group text-left"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} via-black/30 to-transparent`} />
                <div className="absolute inset-0 flex flex-col justify-end p-3.5">
                  <h3 className="text-sm font-bold text-white leading-tight drop-shadow-sm">{cat.name}</h3>
                  <p className="text-[10px] text-white/75 mt-0.5 line-clamp-1">{cat.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
