import type { ISource } from '../types/source'
import { db } from '../db'

/**
 * SourceManager - Central registry for all manga sources
 * Manages source installation, activation, and access
 */
class SourceManager {
  private sources: Map<string, ISource> = new Map()
  private initialized: boolean = false

  /**
   * Initialize the source manager
   * Loads installed sources from database and registers them
   */
  async initialize() {
    if (this.initialized) return

    // Load installed sources from database
    const installedSources = await db.sources.toArray()
    
    console.log('SourceManager: Initialized with', installedSources.length, 'sources')
    this.initialized = true
  }

  /**
   * Register a source (makes it available for use)
   */
  registerSource(source: ISource) {
    this.sources.set(source.id, source)
    console.log(`SourceManager: Registered source "${source.name}" (${source.id})`)
    
    // Save to database if not already there
    db.sources.get(source.id).then(existing => {
      if (!existing) {
        db.sources.add({
          id: source.id,
          name: source.name,
          lang: source.lang,
          version: source.version,
          icon: source.icon,
          supportsLatest: source.supportsLatest,
          supportsSearch: source.supportsSearch,
          enabled: true,
          installedAt: Date.now(),
        })
      }
    })
  }

  /**
   * Unregister a source
   */
  unregisterSource(sourceId: string) {
    this.sources.delete(sourceId)
    console.log(`SourceManager: Unregistered source ${sourceId}`)
  }

  /**
   * Get a source by ID
   */
  getSource(sourceId: string): ISource | undefined {
    return this.sources.get(sourceId)
  }

  /**
   * Get all registered sources
   */
  getAllSources(): ISource[] {
    return Array.from(this.sources.values())
  }

  /**
   * Get sources by language
   */
  getSourcesByLang(lang: string): ISource[] {
    return this.getAllSources().filter(s => s.lang === lang)
  }

  /**
   * Get enabled sources
   */
  async getEnabledSources(): Promise<ISource[]> {
    const enabledInDb = await db.sources.where('enabled').equals(1).toArray()
    const enabledIds = new Set(enabledInDb.map(s => s.id))
    
    return this.getAllSources().filter(s => enabledIds.has(s.id))
  }

  /**
   * Enable/disable a source
   */
  async setSourceEnabled(sourceId: string, enabled: boolean) {
    const dbSource = await db.sources.get(sourceId)
    if (dbSource) {
      await db.sources.put({
        ...dbSource,
        enabled,
      })
    }
  }

  /**
   * Search across all enabled sources
   */
  async searchAllSources(query: string, lang?: string): Promise<Array<{ sourceId: string; results: any[] }>> {
    const sources = lang 
      ? this.getSourcesByLang(lang) 
      : await this.getEnabledSources()

    const searchPromises = sources.map(async (source) => {
      if (!source.supportsSearch) return { sourceId: source.id, results: [] }
      
      try {
        const results = await source.search(query)
        return { sourceId: source.id, results }
      } catch (error) {
        console.error(`Search failed for source ${source.id}:`, error)
        return { sourceId: source.id, results: [] }
      }
    })

    return Promise.all(searchPromises)
  }
}

// Singleton instance
export const sourceManager = new SourceManager()

// Initialize on module load
sourceManager.initialize()

