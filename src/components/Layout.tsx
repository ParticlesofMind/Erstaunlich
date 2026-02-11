import { Outlet } from 'react-router-dom'
import BottomTabs from './BottomTabs'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>

      {/* Mobile bottom tabs */}
      <BottomTabs />
    </div>
  )
}
