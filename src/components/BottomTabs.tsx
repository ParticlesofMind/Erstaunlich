import { Home, Search, Heart, BookOpen, Settings } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { id: '/', label: 'Home', icon: Home },
  { id: '/search', label: 'Suche', icon: Search },
  { id: '/stories', label: 'Lesen', icon: BookOpen },
  { id: '/favorites', label: 'Favoriten', icon: Heart },
  { id: '/settings', label: 'Mehr', icon: Settings },
] as const

export default function BottomTabs() {
  const location = useLocation()
  const navigate = useNavigate()

  const activeTab = tabs.find((t) => {
    if (t.id === '/') return location.pathname === '/'
    return location.pathname.startsWith(t.id)
  })?.id || '/'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-gray-200/60 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
