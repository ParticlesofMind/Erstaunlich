import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import WordCard from '../components/WordCard'
import { useFavorites } from '../hooks/useDictionary'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { favoriteEntries } = useFavorites()

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Favoriten</h1>

      {favoriteEntries.length === 0 ? (
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
