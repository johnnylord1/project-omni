// Source Interface - The contract all sources must implement
// This follows the Paperback/Suwatte architecture

export interface ISource {
  // Metadata
  id: string
  name: string
  version: string
  icon?: string
  lang: string
  
  // Capabilities
  supportsLatest: boolean
  supportsSearch: boolean
  
  // Core Methods
  getMangaDetails(mangaId: string): Promise<SourceManga>
  getChapters(mangaId: string): Promise<SourceChapter[]>
  getPageList(chapterId: string): Promise<string[]>
  
  // Search
  search(query: string, page?: number): Promise<SourceManga[]>
  
  // Optional: Latest updates
  getLatestUpdates?(page?: number): Promise<SourceManga[]>
  
  // Optional: Popular manga
  getPopular?(page?: number): Promise<SourceManga[]>
}

// Source-specific data structures (what sources return)
export interface SourceManga {
  id: string
  title: string
  cover?: string
  author?: string
  artist?: string
  description?: string
  genre?: string[]
  status?: string
  url: string
}

export interface SourceChapter {
  id: string
  mangaId: string
  name: string
  url: string
  chapterNumber?: number
  volumeNumber?: number
  scanlator?: string
  dateUpload?: number
}

// Page data
export interface Page {
  index: number
  url: string
  base64?: string  // For downloaded pages
}

// Filter system (for advanced search)
export interface FilterGroup {
  id: string
  name: string
  filters: Filter[]
}

export type Filter = 
  | TextFilter
  | SelectFilter
  | CheckboxFilter
  | SortFilter

export interface TextFilter {
  type: 'text'
  id: string
  name: string
  value: string
}

export interface SelectFilter {
  type: 'select'
  id: string
  name: string
  options: Array<{ label: string; value: string }>
  value: string
}

export interface CheckboxFilter {
  type: 'checkbox'
  id: string
  name: string
  value: boolean
}

export interface SortFilter {
  type: 'sort'
  id: string
  name: string
  options: Array<{ label: string; value: string; ascending?: boolean }>
  value: string
}

