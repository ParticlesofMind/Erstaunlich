import { useParams, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import DictionaryEntryView from '../components/DictionaryEntryView'
import { useEntry } from '../hooks/useDictionary'
import { useFavorites } from '../hooks/useDictionary'

export default function WordPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { entry, loading } = useEntry(id)
  const { isFavorite, toggle } = useFavorites()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <p className="text-lg font-medium text-gray-900 mb-2">Wort nicht gefunden</p>
        <p className="text-sm text-gray-500 mb-4">Das gesuchte Wort ist nicht in der Datenbank.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors"
        >
          Zur Startseite
        </button>
      </div>
    )
  }

  return (
    <div className="pb-24 md:pb-6">
      <DictionaryEntryView
        entry={entry}
        isFavorite={isFavorite(entry.word.id)}
        onToggleFavorite={() => toggle(entry.word.id, entry.word.word)}
        onBack={() => navigate(-1)}
      />
    </div>
  )
}
