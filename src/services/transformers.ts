import type { SourceManga, SourceChapter } from '../types/source'
import type { Manga, Chapter } from '../types/manga'
import { MangaStatus } from '../types/manga'

/**
 * Transform source manga data to database manga entity
 */
export function transformSourceManga(
  sourceManga: SourceManga,
  sourceId: string,
  options?: {
    inLibrary?: boolean
    favorite?: boolean
    categories?: string[]
  }
): Manga {
  return {
    id: `${sourceId}-${sourceManga.id}`,
    sourceId,
    url: sourceManga.url,
    title: sourceManga.title,
    author: sourceManga.author,
    artist: sourceManga.artist,
    description: sourceManga.description,
    genre: sourceManga.genre,
    status: parseStatus(sourceManga.status),
    cover: sourceManga.cover,
    thumbnailUrl: sourceManga.cover, // Use same for now
    
    // Library settings
    favorite: options?.favorite ?? false,
    inLibrary: options?.inLibrary ?? false,
    categories: options?.categories ?? ['default'],
    
    // Metadata
    lastFetchedAt: Date.now(),
    unreadCount: 0,
  }
}

/**
 * Transform source chapter data to database chapter entity
 */
export function transformSourceChapter(
  sourceChapter: SourceChapter,
  sourceId: string,
  mangaId: string
): Chapter {
  return {
    id: `${sourceId}-${sourceChapter.id}`,
    mangaId,
    sourceId,
    url: sourceChapter.url,
    name: sourceChapter.name,
    chapterNumber: sourceChapter.chapterNumber,
    volumeNumber: sourceChapter.volumeNumber,
    scanlator: sourceChapter.scanlator,
    
    // Reading progress
    read: false,
    bookmark: false,
    lastPageRead: 0,
    pagesCount: undefined,
    
    // Metadata
    dateUpload: sourceChapter.dateUpload,
    dateFetch: Date.now(),
  }
}

/**
 * Parse status string to MangaStatus enum
 */
function parseStatus(status?: string): MangaStatus {
  if (!status) return MangaStatus.UNKNOWN

  const normalized = status.toLowerCase()
  
  if (normalized.includes('ongoing') || normalized.includes('publishing')) {
    return MangaStatus.ONGOING
  }
  if (normalized.includes('completed') || normalized.includes('finished')) {
    return MangaStatus.COMPLETED
  }
  if (normalized.includes('hiatus')) {
    return MangaStatus.HIATUS
  }
  if (normalized.includes('cancelled') || normalized.includes('canceled')) {
    return MangaStatus.CANCELLED
  }
  
  return MangaStatus.UNKNOWN
}

/**
 * Calculate unread count for a manga based on its chapters
 */
export function calculateUnreadCount(chapters: Chapter[]): number {
  return chapters.filter(ch => !ch.read).length
}

/**
 * Batch transform multiple source manga
 */
export function transformSourceMangaList(
  sourceMangaList: SourceManga[],
  sourceId: string,
  options?: {
    inLibrary?: boolean
    favorite?: boolean
    categories?: string[]
  }
): Manga[] {
  return sourceMangaList.map(sm => transformSourceManga(sm, sourceId, options))
}

/**
 * Batch transform multiple source chapters
 */
export function transformSourceChapterList(
  sourceChapterList: SourceChapter[],
  sourceId: string,
  mangaId: string
): Chapter[] {
  return sourceChapterList.map(sc => transformSourceChapter(sc, sourceId, mangaId))
}

