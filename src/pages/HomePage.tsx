import { useNavigate } from 'react-router-dom'
import { Sparkles, TrendingUp, BookOpen, Loader2, Wifi } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import WordCard from '../components/WordCard'
import { useAllEntries, useWordOfTheDay, useSearch } from '../hooks/useDictionary'

export default function HomePage() {
  const navigate = useNavigate()
  const { entries, loading } = useAllEntries()
  const wordOfDay = useWordOfTheDay()
  const { query, results, loading: searchLoading, search } = useSearch()

  const showSearchResults = query.trim().length > 0

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      {/* Hero */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center md:hidden">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Erstaunlich</h1>
        </div>
        <p className="text-sm text-gray-500">Das umfassendste Wörterbuch der deutschen Sprache</p>
        <div className="flex items-center gap-1.5 mt-1">
          <Wifi className="w-3 h-3 text-green-500" />
          <span className="text-[10px] text-gray-400">Wiktionary verbunden — hunderttausende Wörter</span>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <SearchBar value={query} onChange={search} />
      </div>

      {/* Search results */}
      {showSearchResults ? (
        <div>
          {searchLoading ? (
            <div className="flex items-center justify-center py-12 gap-2">
              <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
              <span className="text-sm text-gray-400">Wiktionary durchsuchen…</span>
            </div>
          ) : (
            <>
              <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-3">
                {results.length} Ergebnis{results.length !== 1 && 'se'} von Wiktionary
              </h2>
              <div className="space-y-2">
                {results.map((entry) => (
                  <WordCard
                    key={entry.word.id}
                    entry={entry}
                    onClick={() => navigate(`/word/${entry.word.id}`)}
                    compact
                  />
                ))}
                {results.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">Kein Ergebnis für &ldquo;{query}&rdquo;</p>
                    <p className="text-xs text-gray-300 mt-1">Versuch es mit einem anderen Wort</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Word of the Day */}
          {wordOfDay && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium">Wort des Tages</h2>
              </div>
              <button
                onClick={() => navigate(`/word/${wordOfDay.word.id}`)}
                className="w-full text-left p-5 bg-gradient-to-br from-brand-50 via-white to-brand-50/40 rounded-2xl border border-brand-100 hover:border-brand-200 hover:shadow-lg transition-all group"
              >
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-brand-600 mb-1 transition-colors">
                  {wordOfDay.word.word}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 font-medium">
                    {wordOfDay.word.word_type}
                  </span>
                  <span className="text-xs text-gray-400">{wordOfDay.word.category}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {wordOfDay.definitions[0]?.text}
                </p>
              </button>
            </section>
          )}

          {/* All Words */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-brand-500" />
              <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium">Alle Wörter</h2>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <WordCard
                    key={entry.word.id}
                    entry={entry}
                    onClick={() => navigate(`/word/${entry.word.id}`)}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
