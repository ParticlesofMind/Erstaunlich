import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BookOpen, Loader2, Wifi } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import WordCard from '../components/WordCard'
import { useSearch } from '../hooks/useDictionary'

const categories = [
  {
    name: 'Gefühle & Emotionen',
    description: 'Liebe, Angst, Freude, Trauer …',
    keyword: 'Liebe',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=260&fit=crop',
    color: 'from-rose-500/70',
  },
  {
    name: 'Natur & Umwelt',
    description: 'Wald, Berg, Fluss, Tier …',
    keyword: 'Wald',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=260&fit=crop',
    color: 'from-emerald-600/70',
  },
  {
    name: 'Essen & Trinken',
    description: 'Brot, Kaffee, Kuchen, Wein …',
    keyword: 'Brot',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=260&fit=crop',
    color: 'from-amber-600/70',
  },
  {
    name: 'Reisen & Orte',
    description: 'Wanderlust, Fernweh, Abenteuer …',
    keyword: 'Reise',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=260&fit=crop',
    color: 'from-sky-600/70',
  },
  {
    name: 'Alltag & Familie',
    description: 'Haus, Schule, Arbeit, Kind …',
    keyword: 'Familie',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=260&fit=crop',
    color: 'from-violet-600/70',
  },
  {
    name: 'Kultur & Kunst',
    description: 'Musik, Theater, Literatur …',
    keyword: 'Musik',
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=260&fit=crop',
    color: 'from-fuchsia-600/70',
  },
  {
    name: 'Körper & Gesundheit',
    description: 'Herz, Kopf, Schmerz, Kraft …',
    keyword: 'Gesundheit',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=260&fit=crop',
    color: 'from-teal-600/70',
  },
  {
    name: 'Beruf & Arbeit',
    description: 'Büro, Lehrer, Handel, Beruf …',
    keyword: 'Arbeit',
    image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&h=260&fit=crop',
    color: 'from-slate-700/70',
  },
  {
    name: 'Wissenschaft',
    description: 'Forschung, Experiment, Theorie …',
    keyword: 'Wissenschaft',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=260&fit=crop',
    color: 'from-indigo-600/70',
  },
  {
    name: 'Philosophie & Geschichte',
    description: 'Zeitgeist, Dasein, Freiheit …',
    keyword: 'Freiheit',
    image: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=400&h=260&fit=crop',
    color: 'from-stone-700/70',
  },
]

export default function SearchPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { query, results, loading, search } = useSearch()

  // Pre-populate search from URL ?q= parameter (e.g. from category cards)
  useEffect(() => {
    const q = searchParams.get('q')
    if (q && !query) {
      search(q)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showSearchResults = query.trim().length > 0

  const handleCategoryClick = (keyword: string) => {
    search(keyword)
    // Update URL without navigation so the back button works cleanly
    window.history.replaceState(null, '', `?q=${encodeURIComponent(keyword)}`)
  }

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
          {loading ? (
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
        /* Category Grid */
        <section>
          <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-4">Kategorien entdecken</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.keyword)}
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
