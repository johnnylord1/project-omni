import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'

/**
 * Hook to fetch reading history
 * Returns manga with their last read timestamp
 */
export function useHistory(limit: number = 50) {
  const history = useLiveQuery(async () => {
    // Get recent history entries
    const entries = await db.history
      .orderBy('lastReadAt')
      .reverse()
      .limit(limit)
      .toArray()
    
    // Get unique manga IDs
    const mangaIds = [...new Set(entries.map(h => h.mangaId))]
    
    // Fetch manga details
    const mangaList = await db.manga.bulkGet(mangaIds)
    
    // Combine manga with last read timestamp
    return mangaList
      .filter(m => m !== undefined)
      .map(manga => {
        const lastEntry = entries.find(h => h.mangaId === manga!.id)
        return {
          ...manga!,
          lastReadAt: lastEntry?.lastReadAt ?? 0,
        }
      })
      .sort((a, b) => b.lastReadAt - a.lastReadAt)
  }, [limit])

  return {
    history: history ?? [],
    isLoading: history === undefined,
  }
}

/**
 * Hook to get history for a specific manga
 */
export function useMangaHistory(mangaId: string | undefined) {
  const history = useLiveQuery(
    () => mangaId
      ? db.history
          .where('mangaId')
          .equals(mangaId)
          .reverse()
          .sortBy('lastReadAt')
      : undefined,
    [mangaId]
  )

  return {
    history: history ?? [],
    isLoading: history === undefined,
  }
}

/**
 * Hook for history operations
 */
export function useHistoryActions() {
  const clearHistory = async () => {
    await db.history.clear()
  }

  const clearMangaHistory = async (mangaId: string) => {
    await db.history.where('mangaId').equals(mangaId).delete()
  }

  const removeHistoryEntry = async (historyId: number) => {
    await db.history.delete(historyId)
  }

  return {
    clearHistory,
    clearMangaHistory,
    removeHistoryEntry,
  }
}

