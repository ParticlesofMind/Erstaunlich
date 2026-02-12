import { Search, Heart, BookOpen, LogIn, LogOut, User, Brain, Newspaper, BookMarked, MessageCircle } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'

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
  const { user, signOut } = useAuthContext()

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-gray-200 bg-white px-4 py-6">
      {/* Logo */}
      <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-8 px-2 group">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">E</span>
        </div>
        <span className="text-lg font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
          Erstaunlich
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

      {/* Auth section */}
      <div className="border-t border-gray-100 pt-4 mt-2 space-y-2">
        {user ? (
          <>
            <button
              onClick={() => navigate('/settings')}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors group"
            >
              <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-brand-600" />
              </div>
              <span className="text-xs text-gray-600 truncate group-hover:text-gray-900 transition-colors">
                {user.email}
              </span>
            </button>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Abmelden
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/auth')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-600 hover:bg-brand-50 transition-all"
          >
            <LogIn className="w-5 h-5" />
            Anmelden
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-400 px-2 mt-4">
        Erstaunlich Dictionary
        <br />
        <span className="text-gray-300">v0.2.0</span>
      </div>
    </aside>
  )
}
