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
import MangaDetailsPage from './features/manga/pages/MangaDetailsPage'
import MangaReaderPage from './features/reader/pages/MangaReaderPage'

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
    <Routes>
      {/* Reader routes - NO MainLayout (fullscreen) */}
      <Route path="/reader/:mangaId/:chapterId" element={<MangaReaderPage />} />
      
      {/* Main app routes - WITH MainLayout */}
      <Route path="*" element={
        <MainLayout>
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/more" element={<MorePage />} />
            <Route path="/manga/:mangaId" element={<MangaDetailsPage />} />
          </Routes>
        </MainLayout>
      } />
    </Routes>
  )
}

export default App

