import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import type { Manga } from '../types/manga'

/**
 * Hook to fetch all manga in the library
 * Returns live-updating data (automatically re-renders on DB changes)
 */
export function useLibrary() {
  const manga = useLiveQuery(
    () => db.manga
      .where('inLibrary')
      .equals(1)
      .reverse()
      .sortBy('lastReadAt'),
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
    () => db.manga
      .where('favorite')
      .equals(1)
      .sortBy('title'),
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
    () => mangaId ? db.manga.get(mangaId) : undefined,
    [mangaId]
  )

  return {
    manga,
    isLoading: manga === undefined && mangaId !== undefined,
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
    const manga = await db.manga.get(mangaId)
    if (manga) {
      await db.manga.put({
        ...manga,
        inLibrary: false,
      })
    }
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

