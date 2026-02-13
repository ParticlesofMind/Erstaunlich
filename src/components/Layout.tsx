import { Outlet } from 'react-router-dom'
import BottomTabs from './BottomTabs'
import Sidebar from './Sidebar'
import TopMenu from './TopMenu'

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top menu */}
        <TopMenu />
        
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom tabs */}
      <BottomTabs />
    </div>
  )
}
