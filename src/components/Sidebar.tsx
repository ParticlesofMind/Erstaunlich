import { Search, Heart, BookOpen, Brain, Newspaper, BookMarked, MessageCircle } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const sections = [
  {
    title: 'Vokabular',
    links: [
      { id: '/', label: 'Suche', icon: Search },
      { id: '/favorites', label: 'Favoriten', icon: Heart },
    ],
  },
  {
    title: 'Lernen',
    links: [
      { id: '/stories', label: 'Kurzgeschichten', icon: BookOpen },
      { id: '/newspaper', label: 'Zeitungen', icon: Newspaper },
      { id: '/grammar', label: 'Grammatik', icon: BookMarked },
      { id: '/writing', label: 'Schreiben', icon: MessageCircle },
    ],
  },
  {
    title: 'Üben',
    links: [
      { id: '/vocab-test', label: 'Vokabeltest', icon: Brain },
      { id: '/grammar-test', label: 'Grammatiktest', icon: BookMarked },
    ],
  },
] as const

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-gray-200 bg-white px-4 py-6">
      {/* Logo */}
      <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-8 px-2 group">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">E</span>
        </div>
        <span className="text-lg font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
          rstaunlich
        </span>
      </button>

      {/* Nav links by section */}
      <nav className="flex-1 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-400 px-3 mb-2">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.links.map((link) => {
                const isActive = link.id === '/' ? location.pathname === '/' : location.pathname.startsWith(link.id)
                const Icon = link.icon
                return (
                  <button
                    key={link.id}
                    onClick={() => navigate(link.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Auth section moved to top menu */}
    
    </aside>
  )
}
