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

function NavigationRail() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="h-full w-20 bg-surface border-r border-outline-variant flex flex-col items-center py-6 gap-4">
      {/* Logo/Icon Area */}
      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
        <span className="text-primary font-bold text-xl">O</span>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`
                relative flex flex-col items-center justify-center
                w-14 h-14 rounded-2xl
                transition-all
                ${isActive 
                  ? 'text-primary bg-primary/20' 
                  : 'text-on-surface-variant hover:bg-surface-variant/40'
                }
              `}
              title={item.label}
            >
              {/* Material 3: Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
              )}
              
              <Icon size={24} strokeWidth={2} />
              
              <span className="text-[10px] font-medium mt-1">
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default NavigationRail

