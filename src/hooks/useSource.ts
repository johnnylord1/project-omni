import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sourceManager } from '../services/SourceManager'
import { db } from '../db'
import { transformSourceManga, transformSourceChapterList, calculateUnreadCount } from '../services/transformers'
import type { SourceManga } from '../types/source'

/**
 * Hook to search manga from a source
 */
export function useSourceSearch(sourceId: string, query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['source-search', sourceId, query],
    queryFn: async () => {
      const source = sourceManager.getSource(sourceId)
      if (!source) {
        throw new Error(`Source not found: ${sourceId}`)
      }
      if (!source.supportsSearch) {
        throw new Error(`Source does not support search: ${sourceId}`)
      }
      
      return source.search(query)
    },
    enabled: enabled && query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to get manga details from a source
 */
export function useSourceManga(sourceId: string, mangaId: string) {
  return useQuery({
    queryKey: ['source-manga', sourceId, mangaId],
    queryFn: async () => {
      const source = sourceManager.getSource(sourceId)
      if (!source) {
        throw new Error(`Source not found: ${sourceId}`)
      }
      
      return source.getMangaDetails(mangaId)
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Hook to get chapters from a source
 */
export function useSourceChapters(sourceId: string, mangaId: string) {
  return useQuery({
    queryKey: ['source-chapters', sourceId, mangaId],
    queryFn: async () => {
      const source = sourceManager.getSource(sourceId)
      if (!source) {
        throw new Error(`Source not found: ${sourceId}`)
      }
      
      return source.getChapters(mangaId)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to get popular manga from a source
 */
export function useSourcePopular(sourceId: string, page: number = 1) {
  return useQuery({
    queryKey: ['source-popular', sourceId, page],
    queryFn: async () => {
      const source = sourceManager.getSource(sourceId)
      if (!source) {
        throw new Error(`Source not found: ${sourceId}`)
      }
      
      if (!source.getPopular) {
        throw new Error(`Source does not support popular: ${sourceId}`)
      }
      
      return source.getPopular(page)
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Hook to get latest updates from a source
 */
export function useSourceLatest(sourceId: string, page: number = 1) {
  return useQuery({
    queryKey: ['source-latest', sourceId, page],
    queryFn: async () => {
      const source = sourceManager.getSource(sourceId)
      if (!source) {
        throw new Error(`Source not found: ${sourceId}`)
      }
      
      if (!source.getLatestUpdates) {
        throw new Error(`Source does not support latest: ${sourceId}`)
      }
      
      return source.getLatestUpdates(page)
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent for latest)
  })
}

/**
 * Hook to add manga to library
 * Fetches manga details and chapters from source, then saves to database
 */
export function useAddToLibrary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      sourceId, 
      mangaId, 
      categories = ['default'] 
    }: { 
      sourceId: string
      mangaId: string
      categories?: string[]
    }) => {
      const source = sourceManager.getSource(sourceId)
      if (!source) {
        throw new Error(`Source not found: ${sourceId}`)
      }

      // Fetch manga details
      const sourceManga = await source.getMangaDetails(mangaId)
      
      // Fetch chapters
      const sourceChapters = await source.getChapters(mangaId)

      // Transform to database entities
      const manga = transformSourceManga(sourceManga, sourceId, {
        inLibrary: true,
        favorite: false,
        categories,
      })

      const dbMangaId = `${sourceId}-${mangaId}`
      const chapters = transformSourceChapterList(sourceChapters, sourceId, dbMangaId)

      // Calculate unread count
      manga.unreadCount = calculateUnreadCount(chapters)

      // Save to database
      await db.manga.put(manga)
      await db.chapters.bulkPut(chapters)

      return { manga, chapters }
    },
    onSuccess: () => {
      // Invalidate library queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['library'] })
    },
  })
}

/**
 * Hook to refresh manga chapters from source
 */
export function useRefreshManga() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (mangaId: string) => {
      // Get manga from database
      const manga = await db.manga.get(mangaId)
      if (!manga) {
        throw new Error(`Manga not found in library: ${mangaId}`)
      }

      const source = sourceManager.getSource(manga.sourceId)
      if (!source) {
        throw new Error(`Source not found: ${manga.sourceId}`)
      }

      // Extract source-specific manga ID
      const sourceMangaId = mangaId.replace(`${manga.sourceId}-`, '')

      // Fetch latest chapters
      const sourceChapters = await source.getChapters(sourceMangaId)
      const chapters = transformSourceChapterList(sourceChapters, manga.sourceId, mangaId)

      // Get existing chapters to preserve read status
      const existingChapters = await db.chapters.where('mangaId').equals(mangaId).toArray()
      const existingMap = new Map(existingChapters.map(ch => [ch.id, ch]))

      // Merge new chapters with existing read status
      const mergedChapters = chapters.map(newCh => {
        const existing = existingMap.get(newCh.id)
        if (existing) {
          return {
            ...newCh,
            read: existing.read,
            bookmark: existing.bookmark,
            lastPageRead: existing.lastPageRead,
          }
        }
        return newCh
      })

      // Update database
      await db.chapters.bulkPut(mergedChapters)
      
      // Update manga's last fetched timestamp and unread count
      await db.manga.update(mangaId, {
        lastFetchedAt: Date.now(),
        unreadCount: calculateUnreadCount(mergedChapters),
      })

      return mergedChapters
    },
    onSuccess: (_, mangaId) => {
      queryClient.invalidateQueries({ queryKey: ['chapters', mangaId] })
      queryClient.invalidateQueries({ queryKey: ['library'] })
    },
  })
}

