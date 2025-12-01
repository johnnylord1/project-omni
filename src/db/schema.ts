import Dexie, { Table } from 'dexie'
import type {
  Manga,
  Chapter,
  History,
  Category,
  Source,
  Download,
} from '../types/manga'

// Database Class
export class OmniDatabase extends Dexie {
  // Tables
  manga!: Table<Manga, string>
  chapters!: Table<Chapter, string>
  history!: Table<History, number>
  categories!: Table<Category, string>
  sources!: Table<Source, string>
  downloads!: Table<Download, number>

  constructor() {
    super('OmniDatabase')
    
    // Schema Definition
    // Version 1: Initial schema
    this.version(1).stores({
      // Manga table
      // Primary key: id
      // Indexes: sourceId, favorite, inLibrary, lastReadAt
      manga: 'id, sourceId, favorite, inLibrary, lastReadAt, title',
      
      // Chapters table
      // Primary key: id
      // Indexes: mangaId (for querying chapters of a manga), read status
      chapters: 'id, mangaId, sourceId, read, bookmark, chapterNumber',
      
      // History table
      // Primary key: auto-incremented id
      // Indexes: mangaId, chapterId, lastReadAt (for chronological queries)
      history: '++id, mangaId, chapterId, lastReadAt',
      
      // Categories table
      // Primary key: id
      // Indexes: order (for sorting)
      categories: 'id, name, order',
      
      // Sources table
      // Primary key: id
      // Indexes: enabled, lang
      sources: 'id, name, lang, enabled, lastUsedAt',
      
      // Downloads table
      // Primary key: auto-incremented id
      // Indexes: mangaId, chapterId, status
      downloads: '++id, mangaId, chapterId, status',
    })
  }
  
  // Helper method to clear all data (for debugging/reset)
  async clearAll() {
    await this.manga.clear()
    await this.chapters.clear()
    await this.history.clear()
    await this.categories.clear()
    await this.sources.clear()
    await this.downloads.clear()
  }
  
  // Initialize default categories
  async initializeDefaults() {
    const categoryCount = await this.categories.count()
    
    if (categoryCount === 0) {
      // Create default categories
      await this.categories.bulkAdd([
        {
          id: 'default',
          name: 'Default',
          order: 0,
          flags: {
            downloadNewChapters: false,
            includeInUpdate: true,
            includeInGlobalUpdate: true,
          },
        },
        {
          id: 'reading',
          name: 'Reading',
          order: 1,
          flags: {
            downloadNewChapters: false,
            includeInUpdate: true,
            includeInGlobalUpdate: true,
          },
        },
        {
          id: 'completed',
          name: 'Completed',
          order: 2,
          flags: {
            downloadNewChapters: false,
            includeInUpdate: false,
            includeInGlobalUpdate: true,
          },
        },
        {
          id: 'plan-to-read',
          name: 'Plan to Read',
          order: 3,
          flags: {
            downloadNewChapters: false,
            includeInUpdate: false,
            includeInGlobalUpdate: false,
          },
        },
      ])
    }
  }
}

// Create and export the database instance
export const db = new OmniDatabase()

// Initialize defaults on first load
db.on('ready', () => {
  return db.initializeDefaults()
})

