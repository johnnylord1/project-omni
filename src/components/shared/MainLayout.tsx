import { ReactNode } from 'react'
import BottomNavigation from './BottomNavigation'
import NavigationRail from './NavigationRail'

interface MainLayoutProps {
  children: ReactNode
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Desktop: Navigation Rail (Left Side) */}
      <aside className="hidden md:block">
        <NavigationRail />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile: Bottom Navigation */}
      <nav className="md:hidden">
        <BottomNavigation />
      </nav>
    </div>
  )
}

export default MainLayout

