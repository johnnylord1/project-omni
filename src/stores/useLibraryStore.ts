import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type LibrarySortOption = 
  | 'title-asc'
  | 'title-desc'
  | 'last-read'
  | 'unread-count'
  | 'date-added'

export type LibraryViewMode = 'grid' | 'list'

interface LibraryState {
  sortBy: LibrarySortOption
  filterCategory: string | 'all'
  searchQuery: string
  viewMode: LibraryViewMode
  
  setSortBy: (sortBy: LibrarySortOption) => void
  setFilterCategory: (category: string) => void
  setSearchQuery: (query: string) => void
  setViewMode: (mode: LibraryViewMode) => void
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      sortBy: 'last-read',
      filterCategory: 'all',
      searchQuery: '',
      viewMode: 'grid',

      setSortBy: (sortBy) => set({ sortBy }),
      setFilterCategory: (filterCategory) => set({ filterCategory }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setViewMode: (viewMode) => set({ viewMode }),
    }),
    {
      name: 'omni-library-storage',
    }
  )
)

