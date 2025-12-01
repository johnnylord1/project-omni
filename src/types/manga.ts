// Core Manga Entity
export interface Manga {
  id: string                    // Unique identifier (sourceId + mangaId)
  sourceId: string              // Which source this manga comes from
  url: string                   // Source-specific URL
  title: string
  author?: string
  artist?: string
  description?: string
  genre?: string[]
  status?: MangaStatus
  cover?: string                // Cover image URL
  thumbnailUrl?: string         // Smaller version for grids
  
  // Library management
  favorite: boolean
  inLibrary: boolean
  categories: string[]          // Category IDs
  
  // Metadata
  lastFetchedAt?: number        // Timestamp of last sync
  lastReadAt?: number           // Timestamp of last read
  unreadCount?: number          // Number of unread chapters
  
  // Custom fields
  customCover?: string          // User-uploaded custom cover
  customTitle?: string          // User-defined custom title
}

export enum MangaStatus {
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  HIATUS = 'hiatus',
  CANCELLED = 'cancelled',
  UNKNOWN = 'unknown',
}

// Chapter Entity
export interface Chapter {
  id: string                    // Unique identifier (sourceId + mangaId + chapterId)
  mangaId: string               // Foreign key to Manga
  sourceId: string
  url: string                   // Source-specific chapter URL
  
  name: string                  // Chapter title
  chapterNumber?: number        // Numerical chapter number
  volumeNumber?: number         // Volume number
  scanlator?: string            // Scanlation group
  
  // Reading progress
  read: boolean
  bookmark: boolean
  lastPageRead: number          // Last page index (0-based)
  pagesCount?: number           // Total pages in chapter
  
  // Metadata
  dateUpload?: number           // Upload timestamp from source
  dateFetch?: number            // When we fetched this data
  downloadedPath?: string       // Local path if downloaded
}

// Reading History Entry
export interface History {
  id?: number                   // Auto-incremented primary key
  mangaId: string               // Foreign key to Manga
  chapterId: string             // Foreign key to Chapter
  lastReadAt: number            // Timestamp
  pagesRead?: number            // How many pages were read
}

// Category Entity (for organizing library)
export interface Category {
  id: string                    // Unique identifier
  name: string                  // Display name
  order: number                 // Sort order
  flags?: CategoryFlags         // Behavior flags
}

export interface CategoryFlags {
  downloadNewChapters?: boolean
  includeInUpdate?: boolean
  includeInGlobalUpdate?: boolean
}

// Source Entity (Extensions/Sources)
export interface Source {
  id: string                    // Unique source identifier
  name: string                  // Display name
  lang: string                  // Language code (en, es, pt, etc)
  version: string               // Source version
  icon?: string                 // Source icon URL
  
  // Capabilities
  supportsLatest: boolean
  supportsSearch: boolean
  
  // Metadata
  enabled: boolean
  installedAt: number
  lastUsedAt?: number
}

// Download Entity (for offline reading)
export interface Download {
  id?: number                   // Auto-incremented
  mangaId: string
  chapterId: string
  status: DownloadStatus
  progress: number              // 0-100
  downloadedPages: number
  totalPages: number
  downloadedAt?: number
  localPath?: string
}

export enum DownloadStatus {
  QUEUED = 'queued',
  DOWNLOADING = 'downloading',
  DOWNLOADED = 'downloaded',
  ERROR = 'error',
  PAUSED = 'paused',
}

