import { User, LogOut, Settings, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import { useState, useRef, useEffect } from 'react'

export default function TopMenu() {
  const navigate = useNavigate()
  const { user, signOut } = useAuthContext()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  if (!user) return null

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        {/* Left side - Mobile menu button or empty space */}
        <div className="flex-1">
          {/* Could add breadcrumbs or page title here later */}
        </div>

        {/* Right side - Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
              <User className="w-4 h-4 text-brand-600" />
            </div>
            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors hidden sm:block">
              {user.email?.split('@')[0]}
            </span>
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-xs text-gray-500">Angemeldet als</p>
                <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
              </div>
              
              <button
                onClick={() => {
                  navigate('/settings')
                  setIsDropdownOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Einstellungen
              </button>
              
              <div className="border-t border-gray-100 my-1" />
              
              <button
                onClick={() => {
                  signOut()
                  setIsDropdownOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Abmelden
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
