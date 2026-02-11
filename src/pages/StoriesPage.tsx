import { BookOpen, User, ChevronRight, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { stories } from '../data/stories'

export default function StoriesPage() {
  const navigate = useNavigate()

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

      {/* Story list */}
      <div className="space-y-2">
        {stories.map((story, i) => (
          <button
            key={story.id}
            onClick={() => navigate(`/stories/${story.id}`)}
            className="w-full bg-white rounded-2xl border border-gray-100 hover:border-brand-200 p-4 flex items-center gap-4 text-left transition-all group hover:shadow-sm active:scale-[0.99]"
          >
            {/* Number */}
            <div className="w-10 h-10 rounded-xl bg-brand-50 group-hover:bg-brand-100 flex items-center justify-center flex-shrink-0 transition-colors">
              <span className="text-sm font-bold text-brand-600">{i + 1}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-brand-700 transition-colors truncate">
                {story.title}
              </h3>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs text-gray-400 flex items-center gap-1 truncate">
                  <User className="w-3 h-3 flex-shrink-0" />
                  {story.author}
                </span>
                <span className="text-xs text-gray-300 flex items-center gap-1 flex-shrink-0">
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
}
