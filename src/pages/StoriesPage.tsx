import { BookOpen, User, ChevronRight, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { stories } from '../data/stories'

type Genre = 'Alltag' | 'Psychologisch' | 'Absurd' | 'Gesellschaft' | 'Krieg'

const GENRE_INFO: Record<Genre, { label: string; color: string }> = {
  'Alltag': { label: 'Alltag', color: 'bg-blue-50 border-blue-200' },
  'Psychologisch': { label: 'Psychologisch', color: 'bg-purple-50 border-purple-200' },
  'Absurd': { label: 'Absurd', color: 'bg-amber-50 border-amber-200' },
  'Gesellschaft': { label: 'Gesellschaft', color: 'bg-green-50 border-green-200' },
  'Krieg': { label: 'Krieg', color: 'bg-red-50 border-red-200' }
}

export default function StoriesPage() {
  const navigate = useNavigate()

  // Group stories by genre
  const storyGroups = stories.reduce((acc, story) => {
    const genre = story.genre as Genre
    if (!acc[genre]) acc[genre] = []
    acc[genre].push(story)
    return acc
  }, {} as Record<Genre, typeof stories>)

  // Sort genres in display order
  const genreOrder: Genre[] = ['Alltag', 'Psychologisch', 'Absurd', 'Gesellschaft', 'Krieg']

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      {/* Hero */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-brand-600" />
          <h1 className="text-xl font-bold text-gray-900">Kurzgeschichten</h1>
        </div>
        <p className="text-sm text-gray-500">
          {stories.length} Geschichten — Doppelklick auf jedes Wort für die Definition
        </p>
      </div>

      {/* Stories by genre */}
      <div className="space-y-8">
        {genreOrder.map((genre) => {
          const genreStories = storyGroups[genre]
          if (!genreStories) return null

          return (
            <div key={genre}>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm font-semibold text-gray-700">{GENRE_INFO[genre].label}</h2>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {genreStories.length}
                </span>
              </div>

              <div className="space-y-2">
                {genreStories.map((story) => (
                  <button
                    key={story.id}
                    onClick={() => navigate(`/stories/${story.id}`)}
                    className={`w-full rounded-2xl border p-4 flex items-center gap-4 text-left transition-all group hover:shadow-sm active:scale-[0.99] ${GENRE_INFO[genre].color} hover:border-brand-300`}
                  >
                    {/* Difficulty badge */}
                    <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-brand-50 flex items-center justify-center flex-shrink-0 transition-colors border border-gray-200 group-hover:border-brand-200">
                      <span className="text-xs font-bold text-gray-600 group-hover:text-brand-600 text-center">
                        {story.difficulty === 'Anfänger' && 'A1'}
                        {story.difficulty === 'Mittelstufe' && 'B1'}
                        {story.difficulty === 'Fortgeschritten' && 'C1'}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-brand-700 transition-colors truncate">
                        {story.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-gray-500 flex items-center gap-1 truncate">
                          <User className="w-3 h-3 flex-shrink-0" />
                          {story.author}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0">
                          <FileText className="w-3 h-3" />
                          {story.pageCount} S.
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
