import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'amoled'

export type AccentColor = 
  | 'green'    // Tachiyomi default
  | 'blue'
  | 'red'
  | 'purple'
  | 'orange'
  | 'pink'

interface ThemeState {
  theme: Theme
  accentColor: AccentColor
  setTheme: (theme: Theme) => void
  setAccentColor: (color: AccentColor) => void
  toggleTheme: () => void
}

const accentColorMap: Record<AccentColor, string> = {
  green: '#4CAF50',
  blue: '#2196F3',
  red: '#F44336',
  purple: '#9C27B0',
  orange: '#FF9800',
  pink: '#E91E63',
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark', // Default to dark mode (like Tachiyomi)
      accentColor: 'green',

      setTheme: (theme) => {
        set({ theme })
        document.documentElement.setAttribute('data-theme', theme)
      },

      setAccentColor: (color) => {
        set({ accentColor: color })
        // Update CSS variable for primary color
        document.documentElement.style.setProperty(
          '--color-primary',
          accentColorMap[color]
        )
      },

      toggleTheme: () => {
        const { theme } = get()
        const themeOrder: Theme[] = ['light', 'dark', 'amoled']
        const currentIndex = themeOrder.indexOf(theme)
        const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length]
        set({ theme: nextTheme })
        document.documentElement.setAttribute('data-theme', nextTheme)
      },
    }),
    {
      name: 'omni-theme-storage',
    }
  )
)

