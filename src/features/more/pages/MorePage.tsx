import { useThemeStore } from '../../../stores/useThemeStore'

function MorePage() {
  const { theme, setTheme } = useThemeStore()

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-on-surface">More</h1>
      
      {/* Theme Switcher Demo */}
      <div className="bg-surface rounded-xl p-4 surface-elevation-1 max-w-md">
        <h2 className="text-lg font-semibold mb-3 text-on-surface">Theme Settings</h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setTheme('light')}
            className={`
              px-4 py-2 rounded-full transition-all
              ${theme === 'light' 
                ? 'bg-primary text-on-primary' 
                : 'bg-surface-variant text-on-surface-variant'
              }
            `}
          >
            Light
          </button>
          
          <button
            onClick={() => setTheme('dark')}
            className={`
              px-4 py-2 rounded-full transition-all
              ${theme === 'dark' 
                ? 'bg-primary text-on-primary' 
                : 'bg-surface-variant text-on-surface-variant'
              }
            `}
          >
            Dark
          </button>
          
          <button
            onClick={() => setTheme('amoled')}
            className={`
              px-4 py-2 rounded-full transition-all
              ${theme === 'amoled' 
                ? 'bg-primary text-on-primary' 
                : 'bg-surface-variant text-on-surface-variant'
              }
            `}
          >
            AMOLED
          </button>
        </div>
        
        <p className="text-sm text-on-surface-variant mt-4">
          Current theme: <span className="font-semibold">{theme}</span>
        </p>
      </div>
      
      <p className="text-on-surface-variant mt-6">
        Settings, downloads, tracking, and more features coming in Phase 6.
      </p>
    </div>
  )
}

export default MorePage

