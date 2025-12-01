import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import type { Manga } from '../types/manga'

/**
 * Hook to fetch all manga in the library
 * Returns live-updating data (automatically re-renders on DB changes)
 */
export function useLibrary() {
  const manga = useLiveQuery(
    async () => {
      const allManga = await db.manga.toArray()
      const libraryManga = allManga.filter(m => m.inLibrary === true)
      console.log('[useLibrary] Library count:', libraryManga.length)
      return libraryManga.sort((a, b) => (b.lastReadAt || 0) - (a.lastReadAt || 0))
    },
    []
  )

  return {
    manga: manga ?? [],
    isLoading: manga === undefined,
  }
}

/**
 * Hook to fetch favorite manga
 */
export function useFavorites() {
  const manga = useLiveQuery(
    async () => {
      const allManga = await db.manga.toArray()
      return allManga
        .filter(m => m.favorite)
        .sort((a, b) => a.title.localeCompare(b.title))
    },
    []
  )

  return {
    manga: manga ?? [],
    isLoading: manga === undefined,
  }
}

/**
 * Hook to fetch manga by category
 */
export function useMangaByCategory(categoryId: string) {
  const manga = useLiveQuery(
    () => db.manga
      .filter(m => m.categories.includes(categoryId))
      .toArray(),
    [categoryId]
  )

  return {
    manga: manga ?? [],
    isLoading: manga === undefined,
  }
}

/**
 * Hook to get a single manga by ID
 */
export function useManga(mangaId: string | undefined) {
  const manga = useLiveQuery(
    async () => {
      if (!mangaId) return null // Use null to indicate "no query"
      console.log('[useManga] Querying DB for:', mangaId)
      const result = await db.manga.get(mangaId)
      console.log('[useManga] Query result:', result ? result.title : 'NOT IN DATABASE')
      return result || null // Return null if not found (instead of undefined)
    },
    [mangaId]
  )

  // useLiveQuery returns undefined while loading
  // null means query completed but not found
  // object means found
  const isLoading = manga === undefined

  return {
    manga: manga === null ? undefined : manga,
    isLoading,
  }
}

/**
 * Hook for manga CRUD operations
 */
export function useMangaActions() {
  const addToLibrary = async (manga: Manga) => {
    await db.manga.put({
      ...manga,
      inLibrary: true,
    })
  }

  const removeFromLibrary = async (mangaId: string) => {
    console.log('[removeFromLibrary] Called with ID:', mangaId)
    
    const manga = await db.manga.get(mangaId)
    console.log('[removeFromLibrary] Found manga:', manga ? manga.title : 'NOT FOUND')
    
    if (!manga) {
      console.error('[removeFromLibrary] Manga not found in database!')
      throw new Error(`Manga not found: ${mangaId}`)
    }
    
    console.log('[removeFromLibrary] Before update - inLibrary:', manga.inLibrary)
    
    await db.manga.put({
      ...manga,
      inLibrary: false,
      favorite: false, // Also unfavorite when removing
    })
    
    console.log('[removeFromLibrary] After update - checking...')
    
    // Verify the update
    const updated = await db.manga.get(mangaId)
    console.log('[removeFromLibrary] Verified - inLibrary:', updated?.inLibrary)
    
    if (updated?.inLibrary) {
      console.error('[removeFromLibrary] UPDATE FAILED - manga still in library!')
      throw new Error('Failed to update manga')
    }
    
    console.log('[removeFromLibrary] ✅ Successfully removed from library')
  }

  const toggleFavorite = async (mangaId: string) => {
    const manga = await db.manga.get(mangaId)
    if (manga) {
      await db.manga.put({
        ...manga,
        favorite: !manga.favorite,
      })
    }
  }

  const updateManga = async (mangaId: string, updates: Partial<Manga>) => {
    const manga = await db.manga.get(mangaId)
    if (manga) {
      await db.manga.put({
        ...manga,
        ...updates,
      })
    }
  }

  const deleteManga = async (mangaId: string) => {
    // Delete manga and all associated chapters and history
    await db.manga.delete(mangaId)
    await db.chapters.where('mangaId').equals(mangaId).delete()
    await db.history.where('mangaId').equals(mangaId).delete()
  }

  return {
    addToLibrary,
    removeFromLibrary,
    toggleFavorite,
    updateManga,
    deleteManga,
  }
}

