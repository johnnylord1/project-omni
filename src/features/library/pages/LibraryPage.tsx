import { useEffect, useState } from 'react'
import { Library as LibraryIcon, Plus, Search, Filter, X } from 'lucide-react'
import { useLibrary, useMangaActions } from '../../../hooks/useLibrary'
import { seedMockData, clearMockData } from '../../../db/mockData'
import MangaCard from '../../../components/shared/MangaCard'

function LibraryPage() {
  const { manga, isLoading } = useLibrary()
  const { removeFromLibrary } = useMangaActions()
  const [isSeeded, setIsSeeded] = useState(false)

  useEffect(() => {
    // Auto-seed on first load (for demo purposes)
    if (!isSeeded && !isLoading && manga.length === 0) {
      seedMockData().then(() => setIsSeeded(true))
    }
  }, [isLoading, manga.length, isSeeded])

  const handleClearData = async () => {
    await clearMockData()
    setIsSeeded(false)
  }

  const handleReseedData = async () => {
    await clearMockData()
    await seedMockData()
    setIsSeeded(true)
  }

  const handleRemoveFromLibrary = async (mangaId: string, title: string) => {
    if (confirm(`Remove "${title}" from library?`)) {
      await removeFromLibrary(mangaId)
    }
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
              <button className="p-2 rounded-full hover:bg-surface-variant transition-colors">
                <Search size={20} className="text-on-surface-variant" />
              </button>
              <button className="p-2 rounded-full hover:bg-surface-variant transition-colors">
                <Filter size={20} className="text-on-surface-variant" />
              </button>
            </div>
          </div>

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
            {manga.length} {manga.length === 1 ? 'title' : 'titles'} in library
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
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-medium">
              <Plus size={20} />
              Browse Sources
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {manga.map((item) => (
              <div key={item.id} className="relative group">
                <MangaCard
                  manga={item}
                  onClick={() => console.log('Clicked:', item.title)}
                />
                {/* Remove from Library Button - Same position as + button in Browse */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFromLibrary(item.id, item.title)
                  }}
                  className="absolute top-2 left-2 bg-error/90 backdrop-blur-sm text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                  title="Remove from Library"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LibraryPage

