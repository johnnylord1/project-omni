import type { Manga } from '../types/manga'
import type { LibrarySortOption } from '../stores/useLibraryStore'

/**
 * Sort manga based on the selected sort option
 */
export function sortManga(manga: Manga[], sortBy: LibrarySortOption): Manga[] {
  const sorted = [...manga]

  switch (sortBy) {
    case 'title-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    
    case 'title-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title))
    
    case 'last-read':
      return sorted.sort((a, b) => (b.lastReadAt || 0) - (a.lastReadAt || 0))
    
    case 'unread-count':
      return sorted.sort((a, b) => (b.unreadCount || 0) - (a.unreadCount || 0))
    
    case 'date-added':
      return sorted.sort((a, b) => (b.lastFetchedAt || 0) - (a.lastFetchedAt || 0))
    
    default:
      return sorted
  }
}

/**
 * Filter manga by category
 */
export function filterByCategory(manga: Manga[], categoryId: string): Manga[] {
  if (categoryId === 'all') {
    return manga
  }
  
  if (categoryId === 'uncategorized') {
    return manga.filter(m => m.categories.length === 0)
  }

  return manga.filter(m => m.categories.includes(categoryId))
}

/**
 * Search manga by title or author
 */
export function searchManga(manga: Manga[], query: string): Manga[] {
  if (!query.trim()) {
    return manga
  }

  const lowerQuery = query.toLowerCase()
  
  return manga.filter(m => 
    m.title.toLowerCase().includes(lowerQuery) ||
    m.author?.toLowerCase().includes(lowerQuery) ||
    m.artist?.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Apply all filters and sorting to manga list
 */
export function processLibraryManga(
  manga: Manga[],
  options: {
    sortBy: LibrarySortOption
    filterCategory: string
    searchQuery: string
  }
): Manga[] {
  let processed = [...manga]

  // Filter by category
  processed = filterByCategory(processed, options.filterCategory)

  // Search filter
  processed = searchManga(processed, options.searchQuery)

  // Sort
  processed = sortManga(processed, options.sortBy)

  return processed
}

