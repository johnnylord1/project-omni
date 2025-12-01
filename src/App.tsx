import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useThemeStore } from './stores/useThemeStore'
import { initializeSources } from './services/initializeSources'
import MainLayout from './components/shared/MainLayout'

// Pages
import LibraryPage from './features/library/pages/LibraryPage'
import BrowsePage from './features/browse/pages/BrowsePage'
import HistoryPage from './features/history/pages/HistoryPage'
import MorePage from './features/more/pages/MorePage'

function App() {
  const theme = useThemeStore((state) => state.theme)

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Initialize sources on app startup
  useEffect(() => {
    initializeSources()
  }, [])

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<LibraryPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/more" element={<MorePage />} />
      </Routes>
    </MainLayout>
  )
}

export default App

