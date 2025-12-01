import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import type { Chapter } from '../types/manga'

/**
 * Hook to fetch all chapters for a manga
 */
export function useChapters(mangaId: string | undefined) {
  const chapters = useLiveQuery(
    () => mangaId 
      ? db.chapters
          .where('mangaId')
          .equals(mangaId)
          .reverse()
          .sortBy('chapterNumber')
      : undefined,
    [mangaId]
  )

  const unreadCount = useLiveQuery(
    () => mangaId
      ? db.chapters
          .where('mangaId')
          .equals(mangaId)
          .and(ch => !ch.read)
          .count()
      : 0,
    [mangaId]
  )

  return {
    chapters: chapters ?? [],
    unreadCount: unreadCount ?? 0,
    isLoading: chapters === undefined,
  }
}

/**
 * Hook to get a single chapter
 */
export function useChapter(chapterId: string | undefined) {
  const chapter = useLiveQuery(
    () => chapterId ? db.chapters.get(chapterId) : undefined,
    [chapterId]
  )

  return {
    chapter,
    isLoading: chapter === undefined && chapterId !== undefined,
  }
}

/**
 * Hook for chapter CRUD operations
 */
export function useChapterActions() {
  const markAsRead = async (chapterId: string) => {
    const chapter = await db.chapters.get(chapterId)
    if (chapter) {
      await db.chapters.put({
        ...chapter,
        read: true,
        lastPageRead: chapter.pagesCount ?? 0,
      })
      
      // Add to history
      await db.history.add({
        mangaId: chapter.mangaId,
        chapterId: chapter.id,
        lastReadAt: Date.now(),
      })
      
      // Update manga's lastReadAt
      const manga = await db.manga.get(chapter.mangaId)
      if (manga) {
        await db.manga.put({
          ...manga,
          lastReadAt: Date.now(),
        })
      }
    }
  }

  const markAsUnread = async (chapterId: string) => {
    const chapter = await db.chapters.get(chapterId)
    if (chapter) {
      await db.chapters.put({
        ...chapter,
        read: false,
        lastPageRead: 0,
      })
    }
  }

  const updateProgress = async (chapterId: string, page: number) => {
    const chapter = await db.chapters.get(chapterId)
    if (chapter) {
      await db.chapters.put({
        ...chapter,
        lastPageRead: page,
      })
      
      // Update history
      await db.history.add({
        mangaId: chapter.mangaId,
        chapterId: chapter.id,
        lastReadAt: Date.now(),
        pagesRead: page,
      })
      
      // Update manga's lastReadAt
      const manga = await db.manga.get(chapter.mangaId)
      if (manga) {
        await db.manga.put({
          ...manga,
          lastReadAt: Date.now(),
        })
      }
    }
  }

  const toggleBookmark = async (chapterId: string) => {
    const chapter = await db.chapters.get(chapterId)
    if (chapter) {
      await db.chapters.put({
        ...chapter,
        bookmark: !chapter.bookmark,
      })
    }
  }

  const markMultipleAsRead = async (chapterIds: string[]) => {
    const chapters = await db.chapters.bulkGet(chapterIds)
    const updates = chapters
      .filter((ch): ch is Chapter => ch !== undefined)
      .map(ch => ({
        ...ch,
        read: true,
        lastPageRead: ch.pagesCount ?? 0,
      }))
    
    await db.chapters.bulkPut(updates)
  }

  const markMultipleAsUnread = async (chapterIds: string[]) => {
    const chapters = await db.chapters.bulkGet(chapterIds)
    const updates = chapters
      .filter((ch): ch is Chapter => ch !== undefined)
      .map(ch => ({
        ...ch,
        read: false,
        lastPageRead: 0,
      }))
    
    await db.chapters.bulkPut(updates)
  }

  return {
    markAsRead,
    markAsUnread,
    updateProgress,
    toggleBookmark,
    markMultipleAsRead,
    markMultipleAsUnread,
  }
}

