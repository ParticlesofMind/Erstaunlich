import { useNavigate } from 'react-router-dom'
import { Heart, LogIn, Loader2 } from 'lucide-react'
import WordCard from '../components/WordCard'
import { useFavorites } from '../hooks/useDictionary'
import { useAuthContext } from '../contexts/AuthContext'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { favoriteEntries, loading } = useFavorites()
  const { user } = useAuthContext()

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Favoriten</h1>

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
      ) : (
        <div className="space-y-3">
          {favoriteEntries.map((entry) => (
            <WordCard
              key={entry.word.id}
              entry={entry}
              onClick={() => navigate(`/word/${entry.word.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
