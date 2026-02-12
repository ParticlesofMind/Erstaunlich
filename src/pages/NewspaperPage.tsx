import { Newspaper, ChevronRight, Clock, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  author: string
  date: string
  category: 'Politik' | 'Wirtschaft' | 'Wissenschaft' | 'Kultur'
  readTime: number
}

const articles: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Klimagipfel endet mit ambitioniertem Abkommen',
    excerpt: 'Auf der internationalen Klimakonferenz in Wien haben sich über 190 Länder auf ein neues Abkommen zur Reduzierung von Emissionen geeinigt...',
    author: 'Anna Müller',
    date: '2026-02-12',
    category: 'Politik',
    readTime: 5
  },
  {
    id: 'news-2',
    title: 'Tech-Unternehmen investiert 2 Milliarden Euro in Deutschland',
    excerpt: 'Ein großes amerikanisches Technologieunternehmen kündigte heute an, 2 Milliarden Euro in eine neue Fabrik in Baden-Württemberg zu investieren...',
    author: 'Klaus Weber',
    date: '2026-02-11',
    category: 'Wirtschaft',
    readTime: 4
  },
  {
    id: 'news-3',
    title: 'Forscher entdecken neue Art von Korallenriffbakterien',
    excerpt: 'Wissenschaftler der Universität Hamburg haben eine bislang unbekannte Bakterienart in Korallenriffen entdeckt, die möglicherweise der Ökologie helfen könnte...',
    author: 'Dr. Marie Schmidt',
    date: '2026-02-10',
    category: 'Wissenschaft',
    readTime: 6
  },
  {
    id: 'news-4',
    title: 'Berliner Philharmoniker startet Tournee durch Asia',
    excerpt: 'Die renommierte Berliner Philharmoniker beginnen diese Woche eine Konzertreise durch China, Japan und Südkorea. Die erste Aufführung findet in Peking statt...',
    author: 'Thomas Berger',
    date: '2026-02-09',
    category: 'Kultur',
    readTime: 3
  },
  {
    id: 'news-5',
    title: 'Neue U-Bahn-Linie in München offiziell eröffnet',
    excerpt: 'Der Bürgermeister von München eröffnete heute offiziell die neue U6-Linie. Sie verbindet den Flughafen direkt mit der Innenstadt in nur 40 Minuten...',
    author: 'Peter Wagner',
    date: '2026-02-08',
    category: 'Politik',
    readTime: 4
  },
  {
    id: 'news-6',
    title: 'Deutsche Fußball-Nationalmannschaft qualifiziert sich für Weltmeisterschaft',
    excerpt: 'Mit einem 3:2-Sieg gegen Italien sicherte sich die deutsche Mannschaft gestern Abend den Platz für die Fußball-Weltmeisterschaft im kommenden Sommer...',
    author: 'Hans Jürgen',
    date: '2026-02-07',
    category: 'Kultur',
    readTime: 5
  }
]

const categoryColors: Record<NewsArticle['category'], string> = {
  'Politik': 'bg-blue-50 text-blue-700 border-blue-200',
  'Wirtschaft': 'bg-green-50 text-green-700 border-green-200',
  'Wissenschaft': 'bg-purple-50 text-purple-700 border-purple-200',
  'Kultur': 'bg-amber-50 text-amber-700 border-amber-200'
}

export default function NewspaperPage() {
  const navigate = useNavigate()

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-6">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Newspaper className="w-6 h-6 text-brand-600" />
          <h1 className="text-2xl font-bold text-gray-900">Zeitungen</h1>
        </div>
        <p className="text-sm text-gray-500">
          Lesen Sie die neuesten deutschen Nachrichten — Doppelklick auf Wörter für Definitionen
        </p>
      </div>

      {/* Articles */}
      <div className="space-y-4">
        {articles.map((article) => (
          <button
            key={article.id}
            onClick={() => navigate(`/story/${article.id}`)}
            className="w-full bg-white rounded-2xl border border-gray-100 hover:border-brand-300 p-5 text-left transition-all group hover:shadow-md active:scale-[0.99]"
          >
            <div className="space-y-3">
              {/* Category */}
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${categoryColors[article.category]}`}>
                  {article.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-brand-700 transition-colors line-clamp-2">
                {article.title}
              </h2>

              {/* Excerpt */}
              <p className="text-sm text-gray-600 line-clamp-2">
                {article.excerpt}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {article.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime} Min.
                </span>
                <span>{new Date(article.date).toLocaleDateString('de-DE')}</span>
              </div>
            </div>

            <div className="flex items-center justify-end mt-3 text-brand-600 group-hover:text-brand-700">
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
