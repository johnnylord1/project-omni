import { useState, useEffect, useCallback, useRef } from 'react'
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
  
  // Use ref to track current page without causing re-renders
  const currentPageRef = useRef(0)
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Reader settings
  const { showPageNumber, backgroundColor, invertColors, readingMode } = useReaderStore()

  // Find current chapter
  const currentChapterIndex = chapters.findIndex(ch => ch.id === chapterId)
  const currentChapter = chapters[currentChapterIndex]

  // Load pages for current chapter ONLY
  useEffect(() => {
    const fetchPages = async () => {
      if (!manga || !chapterId) return

      console.log('[Reader] Loading chapter:', chapterId)
      setIsLoading(true)
      setError(null)
      setPages([])

      try {
        const source = sourceManager.getSource(manga.sourceId)
        if (!source) throw new Error('Source not found')

        const sourceChapterId = chapterId.replace(`${manga.sourceId}-`, '')
        const pageUrls = await source.getPageList(sourceChapterId)
        
        console.log('[Reader] Loaded', pageUrls.length, 'pages')
        setPages(pageUrls)
        
        // Set starting page
        const startPage = (currentChapter?.lastPageRead || 0)
        setCurrentPage(startPage)
        currentPageRef.current = startPage
        
        setIsLoading(false)
        
        // Scroll to resume page (vertical mode only)
        if (readingMode === 'vertical' || readingMode === 'webtoon') {
          setTimeout(() => {
            const el = document.getElementById(`page-${startPage}`)
            el?.scrollIntoView({ behavior: 'auto', block: 'start' })
          }, 100)
        }
      } catch (err) {
        console.error('[Reader] Failed:', err)
        setError(err instanceof Error ? err.message : 'Failed to load')
        setIsLoading(false)
      }
    }

    fetchPages()
  }, [chapterId, manga?.sourceId, readingMode])

  // Save progress using ref (doesn't cause re-renders)
  const saveProgress = useCallback((page: number) => {
    if (!chapterId || pages.length === 0) return

    // Clear existing timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    // Debounce save
    saveTimerRef.current = setTimeout(async () => {
      console.log('[Reader] Saving progress: page', page)
      await updateProgress(chapterId, page)

      // Mark as read if last page
      if (page >= pages.length - 1) {
        console.log('[Reader] Marking as read')
        await markAsRead(chapterId)
      }
    }, 2000)
  }, [chapterId, pages.length, updateProgress, markAsRead])

  // Track scroll position in vertical mode (using ref to avoid loops)
  useEffect(() => {
    if (readingMode !== 'vertical' && readingMode !== 'webtoon') return
    if (pages.length === 0) return

    const container = document.getElementById('reader-container')
    if (!container) return

    let scrollTimer: NodeJS.Timeout | null = null

    const handleScroll = () => {
      if (scrollTimer) clearTimeout(scrollTimer)
      
      scrollTimer = setTimeout(() => {
        // Find centered page
        const scrollTop = container.scrollTop
        const centerY = scrollTop + (window.innerHeight / 2)

        // Check each page
        for (let i = 0; i < pages.length; i++) {
          const el = document.getElementById(`page-${i}`)
          if (el) {
            const top = el.offsetTop
            const bottom = top + el.clientHeight
            
            if (centerY >= top && centerY <= bottom) {
              if (currentPageRef.current !== i) {
                console.log('[Reader] Page:', i + 1, '/', pages.length)
                currentPageRef.current = i
                setCurrentPage(i) // Update UI
                saveProgress(i) // Save progress
              }
              break
            }
          }
        }
      }, 100) // Small debounce
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      if (scrollTimer) clearTimeout(scrollTimer)
      container.removeEventListener('scroll', handleScroll)
    }
  }, [pages.length, readingMode, saveProgress])

  // Update ref when page changes via buttons
  useEffect(() => {
    currentPageRef.current = currentPage
    saveProgress(currentPage)
  }, [currentPage, saveProgress])

  // Navigation
  const goToNext = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1)
    } else {
      // Next chapter
      const nextIdx = currentChapterIndex - 1
      if (nextIdx >= 0) {
        navigate(`/reader/${mangaId}/${chapters[nextIdx].id}`)
      }
    }
  }, [currentPage, pages.length, currentChapterIndex, chapters, mangaId, navigate])

  const goToPrev = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1)
    } else {
      // Previous chapter
      const prevIdx = currentChapterIndex + 1
      if (prevIdx < chapters.length) {
        navigate(`/reader/${mangaId}/${chapters[prevIdx].id}`)
      }
    }
  }, [currentPage, currentChapterIndex, chapters, mangaId, navigate])

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToNext()
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToPrev()
      else if (e.key === 'Escape') navigate(`/manga/${mangaId}`)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goToNext, goToPrev, navigate, mangaId])

  // Tap zones
  const handleTap = useCallback((zone: 'left' | 'center' | 'right') => {
    if (zone === 'center') {
      setShowControls(prev => !prev)
    } else if (readingMode === 'rtl') {
      zone === 'left' ? goToNext() : goToPrev()
    } else {
      zone === 'left' ? goToPrev() : goToNext()
    }
  }, [readingMode, goToNext, goToPrev])

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-white">Loading chapter...</p>
        </div>
      </div>
    )
  }

  if (error || !currentChapter || pages.length === 0) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center p-8" style={{ backgroundColor }}>
        <h2 className="text-xl font-semibold text-white mb-4">{error || 'Chapter not found'}</h2>
        <button
          onClick={() => navigate(`/manga/${mangaId}`)}
          className="px-6 py-3 bg-primary text-on-primary rounded-full font-medium"
        >
          Back to Manga
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex flex-col" style={{ backgroundColor }}>
      {/* Top Bar */}
      {showControls && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 to-transparent z-30 p-4">
          <div className="flex items-center justify-between text-white">
            <button
              onClick={() => navigate(`/manga/${mangaId}`)}
              className="flex items-center gap-2 hover:text-primary transition-colors p-2"
            >
              <ArrowLeft size={24} />
              <span className="font-medium hidden sm:inline">Back</span>
            </button>

            <div className="flex-1 text-center px-4">
              <p className="font-semibold truncate">{manga?.title}</p>
              <p className="text-sm text-white/70">
                {currentChapter.name}
                {readingMode !== 'vertical' && (
                  <span className="ml-2 px-2 py-0.5 bg-primary/30 rounded text-xs uppercase">
                    {readingMode}
                  </span>
                )}
              </p>
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

      {/* Reader Area */}
      {(readingMode === 'vertical' || readingMode === 'webtoon') ? (
        <div 
          id="reader-container"
          className="flex-1 overflow-y-auto overflow-x-hidden"
        >
          <div className={readingMode === 'webtoon' ? 'max-w-2xl mx-auto' : 'max-w-4xl mx-auto'}>
            {pages.map((url, idx) => (
              <div
                key={idx}
                id={`page-${idx}`}
                onClick={() => handleTap('center')}
              >
                <img
                  src={url}
                  alt={`Page ${idx + 1}`}
                  className={`w-full h-auto block ${invertColors ? 'invert' : ''}`}
                  loading="lazy"
                />
                {showControls && showPageNumber && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {idx + 1} / {pages.length}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div 
          className="flex-1 flex items-center justify-center"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const pct = x / rect.width
            handleTap(pct < 0.3 ? 'left' : pct > 0.7 ? 'right' : 'center')
          }}
        >
          <img
            src={pages[currentPage]}
            alt={`Page ${currentPage + 1}`}
            className={`max-w-full max-h-full object-contain ${invertColors ? 'invert' : ''}`}
          />
          {showControls && showPageNumber && (
            <div className="absolute bottom-8 right-8 bg-black/70 text-white px-4 py-2 rounded-full">
              {currentPage + 1} / {pages.length}
            </div>
          )}
        </div>
      )}

      {/* Bottom Bar */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent z-30 p-4">
          <div className="flex items-center justify-between text-white max-w-4xl mx-auto">
            <button
              onClick={goToPrev}
              disabled={currentPage === 0 && currentChapterIndex >= chapters.length - 1}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors disabled:opacity-30"
            >
              <ChevronLeft size={20} />
              <span className="hidden sm:inline font-medium">Previous</span>
            </button>

            <div className="text-center">
              <p className="text-base font-medium">Page {currentPage + 1} of {pages.length}</p>
              <p className="text-xs text-white/60 mt-1">{currentChapter.name}</p>
            </div>

            <button
              onClick={goToNext}
              disabled={currentPage >= pages.length - 1 && currentChapterIndex === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors disabled:opacity-30"
            >
              <span className="hidden sm:inline font-medium">Next</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      <ReaderSettings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}

export default MangaReaderPage
