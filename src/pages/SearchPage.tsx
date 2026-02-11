import { useNavigate } from 'react-router-dom'
import { BookOpen, Loader2 } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import WordCard from '../components/WordCard'
import { useSearch } from '../hooks/useDictionary'

export default function SearchPage() {
  const navigate = useNavigate()
  const { query, results, loading, search } = useSearch()

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Suche</h1>
      <p className="text-xs text-gray-400 mb-4">Durchsuche hunderttausende Wörter aus Wiktionary</p>
      <SearchBar value={query} onChange={search} autoFocus />

      <div className="mt-6">
        {query.trim().length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-sm text-gray-400">Gib ein Wort ein, um zu suchen</p>
            <p className="text-xs text-gray-300 mt-1">z.B. Wanderlust, Schmetterling, Angst...</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-16 gap-2">
            <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
            <span className="text-sm text-gray-400">Wiktionary durchsuchen…</span>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Kein Ergebnis für &ldquo;{query}&rdquo;</p>
            <p className="text-xs text-gray-300 mt-1">Versuch es mit einem anderen Wort</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-gray-400 mb-2">
              {results.length} Ergebnis{results.length !== 1 && 'se'} von Wiktionary
            </p>
            {results.map((entry) => (
              <WordCard
                key={entry.word.id}
                entry={entry}
                onClick={() => navigate(`/word/${entry.word.id}`)}
                compact
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
