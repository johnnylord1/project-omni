import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { useManga } from '../../../hooks/useLibrary'
import { useChapters, useChapterActions } from '../../../hooks/useChapters'
import { sourceManager } from '../../../services/SourceManager'
import { useReaderStore } from '../../../stores/useReaderStore'
import ReaderSettings from '../components/ReaderSettings'

function MangaReaderPage() {
  const { mangaId, chapterId } = useParams<{ mangaId: string; chapterId: string }>()
  const navigate = useNavigate()
  
  const { manga } = useManga(mangaId)
  const { chapters } = useChapters(mangaId)
  const { updateProgress, markAsRead } = useChapterActions()
  
  const [pages, setPages] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Reader settings
  const { showPageNumber, backgroundColor, invertColors } = useReaderStore()

  // Find current chapter
  const currentChapter = chapters.find(ch => ch.id === chapterId)
  const currentChapterIndex = chapters.findIndex(ch => ch.id === chapterId)
  const hasNextChapter = currentChapterIndex < chapters.length - 1
  const hasPrevChapter = currentChapterIndex > 0

  // Scroll to page helper
  const scrollToPage = useCallback((pageIndex: number) => {
    const pageElement = document.getElementById(`page-${pageIndex}`)
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setCurrentPage(pageIndex)
    }
  }, [])

  // Fetch pages for current chapter
  useEffect(() => {
    const fetchPages = async () => {
      if (!manga || !currentChapter) return

      setIsLoading(true)
      setError(null)

      try {
        const source = sourceManager.getSource(manga.sourceId)
        if (!source) {
          throw new Error('Source not found')
        }

        // Extract source-specific chapter ID
        const sourceChapterId = currentChapter.id.replace(`${manga.sourceId}-`, '')
        const pageUrls = await source.getPageList(sourceChapterId)
        
        setPages(pageUrls)
        
        // Resume from last read page
        const startPage = currentChapter.lastPageRead > 0 ? currentChapter.lastPageRead : 0
        setCurrentPage(startPage)
        
        setIsLoading(false)
        
        // Scroll to the resume page after a short delay
        setTimeout(() => {
          scrollToPage(startPage)
        }, 100)
      } catch (err) {
        console.error('Failed to fetch pages:', err)
        setError(err instanceof Error ? err.message : 'Failed to load pages')
        setIsLoading(false)
      }
    }

    fetchPages()
  }, [manga, currentChapter, scrollToPage])

  // Save progress when page changes
  useEffect(() => {
    if (!chapterId || pages.length === 0) return

    const saveProgress = async () => {
      await updateProgress(chapterId, currentPage)

      // Mark as read if on last page
      if (currentPage >= pages.length - 1) {
        await markAsRead(chapterId)
      }
    }

    const timer = setTimeout(saveProgress, 1000)
    return () => clearTimeout(timer)
  }, [chapterId, currentPage, pages.length, updateProgress, markAsRead])

  // Navigation handlers
  const goToNextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      scrollToPage(currentPage + 1)
    } else if (hasNextChapter) {
      // Go to next chapter
      const nextChapter = chapters[currentChapterIndex + 1]
      navigate(`/reader/${mangaId}/${nextChapter.id}`)
    }
  }, [currentPage, pages.length, hasNextChapter, chapters, currentChapterIndex, mangaId, navigate, scrollToPage])

  const goToPrevPage = useCallback(() => {
    if (currentPage > 0) {
      scrollToPage(currentPage - 1)
    } else if (hasPrevChapter) {
      // Go to previous chapter
      const prevChapter = chapters[currentChapterIndex - 1]
      navigate(`/reader/${mangaId}/${prevChapter.id}`)
    }
  }, [currentPage, hasPrevChapter, chapters, currentChapterIndex, mangaId, navigate, scrollToPage])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goToNextPage()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goToPrevPage()
      } else if (e.key === 'Escape') {
        navigate(-1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToNextPage, goToPrevPage, navigate])

  // Tap zones for navigation
  const handleTapZone = (zone: 'left' | 'center' | 'right') => {
    if (zone === 'left') {
      goToPrevPage()
    } else if (zone === 'right') {
      goToNextPage()
    } else {
      setShowControls(!showControls)
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-semibold text-on-surface mb-2">Failed to load chapter</h2>
        <p className="text-on-surface-variant mb-6">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-primary text-on-primary rounded-full font-medium"
        >
          Go Back
        </button>
      </div>
    )
  }

  if (!currentChapter) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-semibold text-on-surface mb-2">Chapter not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-primary text-on-primary rounded-full font-medium"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div 
      className="fixed inset-0 flex flex-col"
      style={{ backgroundColor }}
    >
      {/* Top Bar (Collapsible) */}
      {showControls && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent z-20 p-4">
          <div className="flex items-center justify-between text-white">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <ArrowLeft size={24} />
              <span className="font-medium hidden sm:inline">Back</span>
            </button>

            <div className="flex-1 text-center px-4">
              <p className="font-semibold truncate">{manga?.title}</p>
              <p className="text-sm text-white/70">{currentChapter.name}</p>
            </div>

            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Settings size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Reader Area - Vertical Scroll (Webtoon Mode) */}
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth"
        id="reader-container"
      >
        <div className="max-w-4xl mx-auto">
          {pages.map((pageUrl, index) => (
            <div
              key={index}
              id={`page-${index}`}
              className="relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const width = rect.width
                
                if (x < width * 0.3) {
                  handleTapZone('left')
                } else if (x > width * 0.7) {
                  handleTapZone('right')
                } else {
                  handleTapZone('center')
                }
              }}
            >
              <img
                src={pageUrl}
                alt={`Page ${index + 1}`}
                className={`w-full h-auto block ${invertColors ? 'invert' : ''}`}
                loading="lazy"
              />
              
              {/* Page number overlay */}
              {showControls && showPageNumber && (
                <div className="absolute bottom-2 right-2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {index + 1} / {pages.length}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation (Collapsible) */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent z-20 p-4">
          <div className="flex items-center justify-between text-white max-w-4xl mx-auto">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 0 && !hasPrevChapter}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="text-center">
              <p className="text-sm text-white/70">
                Page {currentPage + 1} of {pages.length}
              </p>
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage >= pages.length - 1 && !hasNextChapter}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Reader Settings Panel */}
      <ReaderSettings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}

export default MangaReaderPage

