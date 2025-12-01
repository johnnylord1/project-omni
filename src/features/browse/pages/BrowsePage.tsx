import { useState } from 'react'
import { Compass, Search, TrendingUp, Clock as ClockIcon, Plus } from 'lucide-react'
import { useSources } from '../../../hooks/useSources'
import { useSourcePopular, useSourceLatest, useSourceSearch, useAddToLibrary } from '../../../hooks/useSource'
import MangaCard from '../../../components/shared/MangaCard'
import { transformSourceManga } from '../../../services/transformers'

type BrowseTab = 'popular' | 'latest' | 'search'

function BrowsePage() {
  const { sources, isLoading: sourcesLoading } = useSources()
  const [selectedSourceId, setSelectedSourceId] = useState<string>('')
  const [activeTab, setActiveTab] = useState<BrowseTab>('popular')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const addToLibrary = useAddToLibrary()

  // Select first source by default
  const sourceId = selectedSourceId || sources[0]?.id || ''
  const source = sources.find(s => s.id === sourceId)

  // Fetch data based on active tab
  const { data: popularManga, isLoading: popularLoading } = useSourcePopular(sourceId, 1)
  const { data: latestManga, isLoading: latestLoading } = useSourceLatest(sourceId, 1)
  const { data: searchResults, isLoading: searchLoading } = useSourceSearch(
    sourceId,
    searchQuery,
    activeTab === 'search' && searchQuery.length > 0
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim())
      setActiveTab('search')
    }
  }

  const handleAddToLibrary = async (sourceMangaId: string) => {
    if (!sourceId) return
    
    try {
      const result = await addToLibrary.mutateAsync({
        sourceId,
        mangaId: sourceMangaId,
        categories: ['default'],
      })
      alert(`✅ "${result.manga.title}" added to library!\n\nGo to Library tab to see it.`)
    } catch (error) {
      console.error('Failed to add to library:', error)
      alert(`❌ Failed to add to library: ${error}`)
    }
  }

  // Determine which data to show
  let displayData = activeTab === 'popular' ? popularManga : 
                   activeTab === 'latest' ? latestManga : 
                   searchResults
  let isDataLoading = activeTab === 'popular' ? popularLoading :
                      activeTab === 'latest' ? latestLoading :
                      searchLoading

  if (sourcesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-on-surface-variant">Loading sources...</div>
      </div>
    )
  }

  if (sources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Compass size={64} className="text-on-surface-variant mb-4 opacity-50" />
        <h2 className="text-xl font-semibold text-on-surface mb-2">No sources available</h2>
        <p className="text-on-surface-variant">Install sources to browse manga.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-outline-variant z-10">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Compass size={28} className="text-primary" />
            <h1 className="text-2xl font-bold text-on-surface">Browse</h1>
          </div>

          {/* Source Selector */}
          <div className="mb-4">
            <select
              value={sourceId}
              onChange={(e) => setSelectedSourceId(e.target.value)}
              className="w-full px-4 py-2 bg-surface text-on-surface rounded-xl border border-outline focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sources.map((src) => (
                <option key={src.id} value={src.id}>
                  {src.name} ({src.lang.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search manga..."
                className="w-full pl-10 pr-4 py-2 bg-surface text-on-surface rounded-xl border border-outline focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </form>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('popular')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'popular'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-variant text-on-surface-variant'
              }`}
            >
              <TrendingUp size={16} />
              Popular
            </button>
            <button
              onClick={() => setActiveTab('latest')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'latest'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-variant text-on-surface-variant'
              }`}
            >
              <ClockIcon size={16} />
              Latest
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isDataLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-on-surface-variant">Loading...</div>
          </div>
        ) : displayData && displayData.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {displayData.map((sourceManga) => {
              const manga = transformSourceManga(sourceManga, sourceId)
              return (
                <div key={sourceManga.id} className="relative group">
                  <MangaCard
                    manga={manga}
                    onClick={() => console.log('View details:', sourceManga.title)}
                  />
                  {/* Add to Library Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToLibrary(sourceManga.id)
                    }}
                    disabled={addToLibrary.isPending}
                    className="absolute top-2 left-2 bg-primary/90 backdrop-blur-sm text-on-primary rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    title="Add to Library"
                  >
                    <Plus size={20} strokeWidth={2.5} />
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Search size={48} className="text-on-surface-variant mb-3 opacity-50" />
            <p className="text-on-surface-variant">
              {activeTab === 'search' ? 'No results found' : 'No manga available'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BrowsePage

