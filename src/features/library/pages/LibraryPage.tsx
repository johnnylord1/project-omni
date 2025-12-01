import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Library as LibraryIcon, Plus, Search, Filter, X, SortAsc, Grid3x3, List } from 'lucide-react'
import { useLibrary, useMangaActions } from '../../../hooks/useLibrary'
import { useCategories } from '../../../hooks/useCategories'
import { useLibraryStore } from '../../../stores/useLibraryStore'
import { processLibraryManga } from '../../../utils/libraryUtils'
import { seedMockData, clearMockData } from '../../../db/mockData'
import MangaCard from '../../../components/shared/MangaCard'

function LibraryPage() {
  const navigate = useNavigate()
  const { manga, isLoading } = useLibrary()
  const { categories } = useCategories()
  const { removeFromLibrary } = useMangaActions()
  const [isSeeded, setIsSeeded] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  // Library preferences from store
  const { 
    sortBy, 
    filterCategory, 
    searchQuery, 
    viewMode,
    setSortBy, 
    setFilterCategory, 
    setSearchQuery,
    setViewMode
  } = useLibraryStore()
  
  // Local search input (debounced)
  const [searchInput, setSearchInput] = useState(searchQuery)
  
  // Apply filters, search, and sorting
  const processedManga = useMemo(() => {
    return processLibraryManga(manga, {
      sortBy,
      filterCategory,
      searchQuery,
    })
  }, [manga, sortBy, filterCategory, searchQuery])

  useEffect(() => {
    // Auto-seed on first load (for demo purposes)
    if (!isSeeded && !isLoading && manga.length === 0) {
      seedMockData().then(() => setIsSeeded(true))
    }
  }, [isLoading, manga.length, isSeeded])
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput, setSearchQuery])

  const handleClearData = async () => {
    await clearMockData()
    setIsSeeded(false)
  }

  const handleReseedData = async () => {
    await clearMockData()
    await seedMockData()
    setIsSeeded(true)
  }

  const handleRemoveFromLibrary = async (mangaId: string, title: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    console.log('=== LIBRARY X BUTTON CLICKED ===')
    console.log('Manga ID:', mangaId)
    console.log('Title:', title)
    
    // Tachiyomi doesn't use confirm for X button - just remove directly
    try {
      console.log('Calling removeFromLibrary...')
      await removeFromLibrary(mangaId)
      console.log('✅ Successfully removed:', mangaId)
    } catch (error) {
      console.error('❌ Failed to remove from library:', error)
      alert(`Failed to remove "${title}":\n${error}`)
    }
    
    console.log('=== LIBRARY REMOVE END ===')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-on-surface-variant">Loading library...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-outline-variant z-10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <LibraryIcon size={28} className="text-primary" />
              <h1 className="text-2xl font-bold text-on-surface">Library</h1>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-full transition-colors ${
                  showFilters ? 'bg-primary text-on-primary' : 'hover:bg-surface-variant text-on-surface-variant'
                }`}
              >
                <Filter size={20} />
              </button>
              <button 
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant"
              >
                {viewMode === 'grid' ? <List size={20} /> : <Grid3x3 size={20} />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search library..."
              className="w-full pl-10 pr-10 py-2 bg-surface text-on-surface rounded-xl border border-outline focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput('')
                  setSearchQuery('')
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Filters Panel (Collapsible) */}
          {showFilters && (
            <div className="mb-4 p-4 bg-surface rounded-xl border border-outline-variant space-y-3">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium text-on-surface mb-2 block">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-background text-on-surface rounded-lg border border-outline focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Categories</option>
                  <option value="uncategorized">Uncategorized</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <label className="text-sm font-medium text-on-surface mb-2 block">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 bg-background text-on-surface rounded-lg border border-outline focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="last-read">Last Read</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                  <option value="unread-count">Unread Count</option>
                  <option value="date-added">Date Added</option>
                </select>
              </div>
            </div>
          )}

          {/* Demo Controls - Remove in production */}
          <div className="flex gap-2 mb-2">
            <button
              onClick={handleReseedData}
              className="px-3 py-1.5 bg-primary text-on-primary rounded-full text-sm font-medium"
            >
              Reseed Demo Data
            </button>
            <button
              onClick={handleClearData}
              className="px-3 py-1.5 bg-surface-variant text-on-surface-variant rounded-full text-sm font-medium"
            >
              Clear Data
            </button>
          </div>

          <p className="text-sm text-on-surface-variant">
            Showing {processedManga.length} of {manga.length} {manga.length === 1 ? 'title' : 'titles'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {manga.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <LibraryIcon size={64} className="text-on-surface-variant mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-on-surface mb-2">
              Your library is empty
            </h2>
            <p className="text-on-surface-variant mb-6 max-w-sm">
              Add manga to your library to start reading. Browse sources to discover new series.
            </p>
            <button 
              onClick={() => navigate('/browse')}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-medium"
            >
              <Plus size={20} />
              Browse Sources
            </button>
          </div>
        ) : processedManga.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Search size={64} className="text-on-surface-variant mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-on-surface mb-2">
              No manga found
            </h2>
            <p className="text-on-surface-variant mb-6 max-w-sm">
              No manga match your current filters or search query.
            </p>
            <button 
              onClick={() => {
                setSearchInput('')
                setSearchQuery('')
                setFilterCategory('all')
              }}
              className="px-6 py-2 bg-surface-variant text-on-surface rounded-full font-medium"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
              : 'space-y-2'
          }>
            {processedManga.map((item) => (
              <div key={item.id} className={viewMode === 'grid' ? 'relative group' : 'relative group'}>
                {viewMode === 'grid' ? (
                  <>
                    <MangaCard
                      manga={item}
                      onClick={() => navigate(`/manga/${item.id}`)}
                    />
                    {/* Remove from Library Button */}
                    <button
                      onClick={(e) => handleRemoveFromLibrary(item.id, item.title, e)}
                      className="absolute top-2 left-2 bg-error/90 backdrop-blur-sm text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg z-10"
                      title="Remove from Library"
                    >
                      <X size={20} strokeWidth={2.5} />
                    </button>
                  </>
                ) : (
                  /* List View */
                  <div className="flex items-center gap-4 p-3 bg-surface rounded-xl hover:bg-surface-variant transition-colors">
                    <div 
                      className="w-16 h-24 rounded-lg overflow-hidden bg-surface-variant flex-shrink-0 cursor-pointer"
                      onClick={() => navigate(`/manga/${item.id}`)}
                    >
                      {item.cover ? (
                        <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <LibraryIcon size={24} className="text-on-surface-variant" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/manga/${item.id}`)}>
                      <h3 className="font-semibold text-on-surface truncate">{item.title}</h3>
                      {item.author && (
                        <p className="text-sm text-on-surface-variant truncate">{item.author}</p>
                      )}
                      {item.unreadCount !== undefined && item.unreadCount > 0 && (
                        <p className="text-sm text-primary font-medium mt-1">
                          {item.unreadCount} unread
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleRemoveFromLibrary(item.id, item.title, e)}
                      className="p-2 rounded-full hover:bg-error/20 text-on-surface-variant hover:text-error transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LibraryPage

