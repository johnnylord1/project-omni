// Central export point for database
export { db, OmniDatabase } from './schema'

// Re-export types for convenience
export type {
  Manga,
  Chapter,
  History,
  Category,
  Source,
  Download,
  MangaStatus,
  DownloadStatus,
  CategoryFlags,
} from '../types/manga'

