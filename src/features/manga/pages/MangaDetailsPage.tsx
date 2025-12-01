import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Download, RefreshCw, MoreVertical, BookOpen, CheckCircle2, Circle, Plus, X, CheckCheck } from 'lucide-react'
import { useManga, useMangaActions } from '../../../hooks/useLibrary'
import { useChapters, useChapterActions } from '../../../hooks/useChapters'
import { useAddToLibrary, useSourceManga, useSourceChapters } from '../../../hooks/useSource'
import { formatDistanceToNow } from '../../../utils/dateUtils'
import ChapterMenu from '../components/ChapterMenu'
import type { Chapter } from '../../../types/manga'

function MangaDetailsPage() {
  const { mangaId } = useParams<{ mangaId: string }>()
  const navigate = useNavigate()
  
  // ============================================
  // UNIFIED LOGIC: Try DB first, fallback to Source
  // ============================================
  
  // Parse manga ID (format: "sourceId-originalMangaId")
  const sourceId = mangaId?.split('-')[0] || ''
  const sourceMangaId = mangaId?.replace(`${sourceId}-`, '') || ''
  
  // STEP 1: Try to get manga from DB
  const { manga: dbManga, isLoading: dbLoading } = useManga(mangaId)
  
  // STEP 2: If not in DB, fetch from source
  const needsSourceFetch = !dbLoading && !dbManga
  const { 
    data: sourceManga, 
    isLoading: sourceMangaLoading,
    error: sourceMangaError
  } = useSourceManga(sourceId, sourceMangaId, needsSourceFetch)
  
  // STEP 3: Try to get chapters from DB
  const { 
    chapters: dbChapters, 
    unreadCount: dbUnreadCount, 
    isLoading: dbChaptersLoading 
  } = useChapters(mangaId)
  
  // STEP 4: If no chapters in DB, fetch from source
  const needsSourceChapters = dbChapters.length === 0 && !dbChaptersLoading && needsSourceFetch
  const { 
    data: sourceChapters, 
    isLoading: sourceChaptersLoading 
  } = useSourceChapters(sourceId, sourceMangaId, needsSourceChapters)
  
  // ============================================
  // Combine data (DB first, source as fallback)
  // ============================================
  
  const manga = dbManga || (sourceManga ? {
    id: mangaId!,
    sourceId,
    url: sourceManga.url,
    title: sourceManga.title,
    author: sourceManga.author,
    artist: sourceManga.artist,
    description: sourceManga.description,
    genre: sourceManga.genre,
    status: sourceManga.status as any,
    cover: sourceManga.cover,
    thumbnailUrl: sourceManga.cover,
    favorite: false,
    inLibrary: false,
    categories: [],
    unreadCount: 0,
  } : undefined)
  
  // Chapters: use DB if available, otherwise source
  const chapters: Chapter[] = dbChapters.length > 0 
    ? dbChapters 
    : (sourceChapters || []).map(sc => ({
        id: `${sourceId}-${sc.id}`,
        mangaId: mangaId!,
        sourceId,
        url: sc.url,
        name: sc.name,
        chapterNumber: sc.chapterNumber,
        scanlator: sc.scanlator,
        read: false,
        bookmark: false,
        lastPageRead: 0,
        dateUpload: sc.dateUpload,
      }))
  
  const unreadCount = dbChapters.length > 0 ? dbUnreadCount : chapters.length
  const isInLibrary = !!dbManga
  
  // Loading: true if still fetching ANY required data
  const isLoading = dbLoading || (needsSourceFetch && sourceMangaLoading) || (needsSourceChapters && sourceChaptersLoading)
  
  console.log('[MangaDetailsPage] Final state:', {
    manga: manga?.title || 'N/A',
    isInLibrary,
    chapters: chapters.length,
    source: dbChapters.length > 0 ? 'DB' : 'Source'
  })
  
  // Actions
  const { toggleFavorite, removeFromLibrary } = useMangaActions()
  const { markAsRead, markAsUnread, toggleBookmark, markMultipleAsRead, markMultipleAsUnread } = useChapterActions()
  const addToLibraryMutation = useAddToLibrary()

  const handleToggleLibrary = async (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    
    if (!manga) {
      alert('Manga data not loaded')
      return
    }
    
    console.log('=== DETAILS PAGE BUTTON CLICKED ===')
    console.log('Manga ID:', manga.id)
    console.log('Title:', manga.title)
    console.log('Currently in library?', manga.inLibrary)
    
    if (manga.inLibrary) {
      // Remove from library - Tachiyomi style (no confirm, just remove)
      try {
        console.log('Calling removeFromLibrary...')
        await removeFromLibrary(manga.id)
        console.log('✅ Remove succeeded')
      } catch (error) {
        console.error('❌ Remove failed:', error)
        alert(`Failed to remove from library:\n${error}`)
      }
    } else {
      // Add to library
      const sourceId = manga.sourceId
      const sourceMangaId = manga.id.replace(`${sourceId}-`, '')
      
      console.log('Adding to library...')
      console.log('- Source ID:', sourceId)
      console.log('- Source Manga ID:', sourceMangaId)
      
      try {
        await addToLibraryMutation.mutateAsync({
          sourceId,
          mangaId: sourceMangaId,
          categories: ['default'],
        })
        console.log('✅ Add succeeded')
      } catch (error) {
        console.error('❌ Add failed:', error)
        alert(`Failed to add to library:\n${error}`)
      }
    }
    
    console.log('=== BUTTON HANDLER END ===')
  }

  const handleToggleFavorite = async () => {
    if (!mangaId || !manga?.inLibrary) return
    await toggleFavorite(mangaId)
  }

  const handleChapterClick = async (chapterId: string) => {
    // Open reader (Phase 5 - coming soon)
    alert('📖 Reader coming in Phase 5!\n\nFor now, use the 3-dot menu to mark chapters as read.')
    // TODO: Navigate to reader page
    // navigate(`/reader/${mangaId}/${chapterId}`)
  }

  const handleMarkPreviousAsRead = async (chapterIndex: number) => {
    if (!isInLibrary) {
      alert('Add manga to library first to track read progress!')
      return
    }
    const previousChapterIds = chapters.slice(chapterIndex).map(ch => ch.id)
    await markMultipleAsRead(previousChapterIds)
  }

  const handleMarkPreviousAsUnread = async (chapterIndex: number) => {
    if (!isInLibrary) {
      alert('Add manga to library first to track read progress!')
      return
    }
    const previousChapterIds = chapters.slice(chapterIndex).map(ch => ch.id)
    await markMultipleAsUnread(previousChapterIds)
  }

  const handleToggleRead = async (chapterId: string, isRead: boolean) => {
    if (!isInLibrary) {
      alert('Add manga to library first to track read progress!')
      return
    }
    if (isRead) {
      await markAsUnread(chapterId)
    } else {
      await markAsRead(chapterId)
    }
  }

  const handleToggleBookmark = async (chapterId: string) => {
    if (!isInLibrary) {
      alert('Add manga to library first to bookmark chapters!')
      return
    }
    await toggleBookmark(chapterId)
  }

  const handleMarkAllAsRead = async () => {
    if (!isInLibrary) {
      alert('Add manga to library first to track read progress!')
      return
    }
    const allChapterIds = chapters.map(ch => ch.id)
    await markMultipleAsRead(allChapterIds)
  }

  const handleMarkAllAsUnread = async () => {
    if (!isInLibrary) {
      alert('Add manga to library first to track read progress!')
      return
    }
    const allChapterIds = chapters.map(ch => ch.id)
    await markMultipleAsUnread(allChapterIds)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <div className="text-on-surface-variant">Loading manga details...</div>
      </div>
    )
  }

  if (sourceMangaError) {
    console.error('[MangaDetailsPage] Source error:', sourceMangaError)
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <BookOpen size={64} className="text-on-surface-variant mb-4 opacity-50" />
        <h2 className="text-xl font-semibold text-on-surface mb-2">Failed to load manga</h2>
        <p className="text-on-surface-variant mb-4">
          {sourceMangaError instanceof Error ? sourceMangaError.message : 'Unknown error'}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-primary text-on-primary rounded-full"
        >
          Go Back
        </button>
      </div>
    )
  }

  if (!manga) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <BookOpen size={64} className="text-on-surface-variant mb-4 opacity-50" />
        <h2 className="text-xl font-semibold text-on-surface mb-2">Manga not found</h2>
        <p className="text-on-surface-variant mb-4">
          Could not find manga in library or source
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-primary text-on-primary rounded-full"
        >
          Back to Library
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header with Back Button */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-outline-variant z-10 px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-on-surface hover:text-primary transition-colors"
        >
          <ArrowLeft size={24} />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Manga Info Section */}
        <div className="p-4 md:p-6">
          <div className="flex gap-4 mb-6">
            {/* Cover Image */}
            <div
              className="flex-shrink-0 w-32 md:w-40 rounded-xl overflow-hidden bg-surface shadow-lg"
              style={{ aspectRatio: '2/3' }}
            >
              {manga.cover ? (
                <img
                  src={manga.cover}
                  alt={manga.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-variant">
                  <BookOpen size={48} className="text-on-surface-variant" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">
                {manga.title}
              </h1>
              
              {manga.author && (
                <p className="text-on-surface-variant mb-1">
                  <span className="font-medium">Author:</span> {manga.author}
                </p>
              )}
              
              {manga.artist && manga.artist !== manga.author && (
                <p className="text-on-surface-variant mb-1">
                  <span className="font-medium">Artist:</span> {manga.artist}
                </p>
              )}

              {manga.status && (
                <p className="text-on-surface-variant mb-2">
                  <span className="font-medium">Status:</span>{' '}
                  <span className="capitalize">{manga.status}</span>
                </p>
              )}

              {/* Genre Tags */}
              {manga.genre && manga.genre.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {manga.genre.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {/* Add/Remove from Library Toggle Button */}
            <button
              onClick={(e) => handleToggleLibrary(e)}
              disabled={addToLibraryMutation.isPending}
              type="button"
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all shadow-sm ${
                manga.inLibrary
                  ? 'bg-error/20 text-error hover:bg-error/30'
                  : 'bg-primary text-on-primary hover:scale-105'
              }`}
            >
              {manga.inLibrary ? (
                <>
                  <X size={20} strokeWidth={2.5} />
                  Remove from Library
                </>
              ) : (
                <>
                  <Plus size={20} strokeWidth={2.5} />
                  Add to Library
                </>
              )}
            </button>

            {/* Favorite Button (only show when in library) */}
            {manga.inLibrary && (
              <button
                onClick={handleToggleFavorite}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                  manga.favorite
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-variant text-on-surface-variant hover:bg-primary/20'
                }`}
              >
                <Heart size={18} fill={manga.favorite ? 'currentColor' : 'none'} />
                {manga.favorite ? 'Favorited' : 'Favorite'}
              </button>
            )}

            {/* Refresh Button (only show when in library) */}
            {manga.inLibrary && (
              <button
                className="flex items-center gap-2 px-4 py-2 bg-surface-variant text-on-surface-variant rounded-full font-medium hover:bg-primary/20 transition-colors"
                title="Refresh (Coming Soon)"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
            )}
          </div>

          {/* Description */}
          {manga.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-on-surface mb-2">Description</h2>
              <p className="text-on-surface-variant leading-relaxed">
                {manga.description}
              </p>
            </div>
          )}

          {/* Chapter Count Info & Actions */}
          <div className="space-y-3 mb-4 pb-4 border-b border-outline-variant">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-on-surface">
                Chapters ({chapters.length})
              </h2>
              {unreadCount > 0 && (
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            
            {/* Bulk Actions (only show when in library) */}
            {isInLibrary && chapters.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium hover:bg-primary/30 transition-colors"
                >
                  <CheckCheck size={16} />
                  Mark all as read
                </button>
                <button
                  onClick={handleMarkAllAsUnread}
                  className="flex items-center gap-2 px-3 py-2 bg-surface-variant text-on-surface-variant rounded-full text-sm font-medium hover:bg-outline-variant transition-colors"
                >
                  <Circle size={16} />
                  Mark all as unread
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chapter List */}
        <div className="px-4 pb-4">
          {chapters.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={48} className="text-on-surface-variant mx-auto mb-3 opacity-50" />
              <p className="text-on-surface-variant">No chapters available</p>
            </div>
          ) : (
            <div className="space-y-2">
              {chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className={`flex items-center gap-2 p-3 rounded-xl transition-all ${
                    chapter.read
                      ? 'bg-surface text-on-surface-variant'
                      : 'bg-surface-variant text-on-surface shadow-sm'
                  }`}
                >
                  {/* Chapter Card (clickable) */}
                  <button
                    onClick={() => handleChapterClick(chapter.id)}
                    className="flex-1 flex items-center gap-3 text-left min-w-0 hover:bg-surface-variant/50 rounded-lg transition-colors"
                  >
                    {/* Read/Unread Icon */}
                    <div className="flex-shrink-0">
                      {chapter.read ? (
                        <CheckCircle2 size={20} className="text-primary" />
                      ) : (
                        <Circle size={20} className="text-on-surface-variant" />
                      )}
                    </div>

                    {/* Chapter Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${chapter.read ? 'opacity-70' : ''}`}>
                        {chapter.name}
                      </p>
                      {chapter.scanlator && (
                        <p className="text-sm opacity-70 truncate">{chapter.scanlator}</p>
                      )}
                    </div>

                    {/* Date */}
                    {chapter.dateUpload && (
                      <div className="flex-shrink-0 text-sm opacity-70">
                        {formatDistanceToNow(chapter.dateUpload)}
                      </div>
                    )}
                  </button>

                  {/* Chapter Menu */}
                  <ChapterMenu
                    chapterId={chapter.id}
                    isRead={chapter.read}
                    isBookmarked={chapter.bookmark}
                    onToggleRead={() => handleToggleRead(chapter.id, chapter.read)}
                    onMarkPreviousAsRead={() => handleMarkPreviousAsRead(index)}
                    onMarkPreviousAsUnread={() => handleMarkPreviousAsUnread(index)}
                    onToggleBookmark={() => handleToggleBookmark(chapter.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MangaDetailsPage

