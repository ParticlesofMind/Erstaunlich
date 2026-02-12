import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, LogIn, Loader2 } from 'lucide-react'
import WordCard from '../components/WordCard'
import { useFavorites } from '../hooks/useDictionary'
import { useAuthContext } from '../contexts/AuthContext'
import SearchBar from '../components/SearchBar'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { favoriteEntries, favoriteDates, loading } = useFavorites()
  const { user } = useAuthContext()
  const [filter, setFilter] = useState('')
  const [selectedWordTypes, setSelectedWordTypes] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'frequency'>('name-asc')

  const filteredEntries = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return favoriteEntries
    return favoriteEntries.filter((entry) => {
      const wordMatch = entry.word.word.toLowerCase().includes(q)
      const defMatch = entry.definitions.some((def) => def.text.toLowerCase().includes(q))
      return wordMatch || defMatch
    })
  }, [favoriteEntries, filter])

  const allowedWordTypes = ['Adjektiv', 'Substantiv', 'Verb']
  const availableWordTypes = Array.from(new Set(favoriteEntries.map((e) => e.word.word_type)))
    .filter((wt) => allowedWordTypes.includes(wt))
    .sort()

  const typeFilteredEntries = useMemo(() => {
    if (selectedWordTypes.length === 0) return filteredEntries
    return filteredEntries.filter((entry) => selectedWordTypes.includes(entry.word.word_type))
  }, [filteredEntries, selectedWordTypes])

  const sortedEntries = useMemo(() => {
    return [...typeFilteredEntries].sort((a, b) => {
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
  }, [typeFilteredEntries, sortBy])

  const groupedByDate = useMemo(() => {
    const groups = new Map<string, { label: string; timestamp: number; entries: typeof filteredEntries }>()

    for (const entry of sortedEntries) {
      const addedAt = favoriteDates[entry.word.id] || new Date().toISOString()
      const date = new Date(addedAt)
      const key = date.toISOString().slice(0, 10)
      const label = new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(date)

      const existing = groups.get(key)
      if (existing) {
        existing.entries = [...existing.entries, entry]
      } else {
        groups.set(key, { label, timestamp: date.getTime(), entries: [entry] })
      }
    }

    return Array.from(groups.entries())
      .map(([key, value]) => ({ key, ...value }))
      .sort((a, b) => b.timestamp - a.timestamp)
  }, [sortedEntries, favoriteDates])

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Favoriten</h1>

      <div className="mb-4">
        <SearchBar value={filter} onChange={setFilter} placeholder="Favoriten filtern..." />
      </div>

      {(availableWordTypes.length > 0 || favoriteEntries.length > 0) && (
        <div className="mb-4">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex flex-wrap items-center gap-3 justify-between">
              {availableWordTypes.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap">
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
            </div>
          </div>
        </div>
      )}

      {!user && (
        <button
          onClick={() => navigate('/auth')}
          className="w-full flex items-center gap-3 p-4 mb-4 bg-brand-50 border border-brand-100 rounded-2xl text-left hover:bg-brand-100/60 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
            <LogIn className="w-4 h-4 text-brand-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-700">Anmelden für Cloud-Sync</p>
            <p className="text-xs text-brand-600/70">Speichere deine Favoriten geräteübergreifend</p>
          </div>
        </button>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
        </div>
      ) : favoriteEntries.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-sm text-gray-500 mb-1">Noch keine Favoriten</p>
          <p className="text-xs text-gray-400">
            Tippe auf das Lesezeichen-Symbol bei einem Wort,
            <br />
            um es hier zu speichern.
          </p>
        </div>
      ) : sortedEntries.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-sm text-gray-500 mb-1">Keine Treffer</p>
          <p className="text-xs text-gray-400">Passe deinen Filter an.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedByDate.map((group) => (
            <section key={group.key}>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                  {group.label}
                </h2>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="space-y-3">
                {group.entries.map((entry) => (
                  <WordCard
                    key={entry.word.id}
                    entry={entry}
                    onClick={() => navigate(`/word/${entry.word.id}`)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
