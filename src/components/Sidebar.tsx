import { Home, Search, Heart, Settings } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const links = [
  { id: '/', label: 'Home', icon: Home },
  { id: '/search', label: 'Suche', icon: Search },
  { id: '/favorites', label: 'Favoriten', icon: Heart },
  { id: '/settings', label: 'Einstellungen', icon: Settings },
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
          Erstaunlich
        </span>
      </button>

      {/* Nav links */}
      <nav className="flex-1 space-y-1">
        {links.map((link) => {
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
      </nav>

      {/* Footer */}
      <div className="text-xs text-gray-400 px-2">
        Erstaunlich Dictionary
        <br />
        <span className="text-gray-300">v0.1.0</span>
      </div>
    </aside>
  )
}
