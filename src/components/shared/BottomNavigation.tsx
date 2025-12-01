import { useLocation, useNavigate } from 'react-router-dom'
import { Library, Compass, Clock, MoreHorizontal } from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: typeof Library
  path: string
}

const navItems: NavItem[] = [
  { id: 'library', label: 'Library', icon: Library, path: '/' },
  { id: 'browse', label: 'Browse', icon: Compass, path: '/browse' },
  { id: 'history', label: 'History', icon: Clock, path: '/history' },
  { id: 'more', label: 'More', icon: MoreHorizontal, path: '/more' },
]

function BottomNavigation() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`
                flex flex-col items-center justify-center
                min-w-[64px] h-full px-3
                relative transition-colors
                ${isActive ? 'text-primary' : 'text-on-surface-variant'}
              `}
            >
              {/* Material 3: Pill-shaped Active Indicator */}
              {isActive && (
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-8 bg-primary/20 rounded-full -z-10" />
              )}
              
              <Icon 
                size={24} 
                strokeWidth={2}
                className={isActive ? 'mb-1' : 'mb-1'}
              />
              
              {/* Show label for active item, hide for others to save space */}
              <span 
                className={`
                  text-xs font-medium transition-all
                  ${isActive ? 'opacity-100' : 'opacity-0 md:opacity-100'}
                `}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNavigation

