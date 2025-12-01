import { sourceManager } from './SourceManager'
import { mockMangaDexSource } from '../sources/MockMangaDex'

/**
 * Initialize and register all available sources
 * This runs on app startup
 */
export async function initializeSources() {
  console.log('Initializing sources...')

  // Register the mock MangaDex source
  sourceManager.registerSource(mockMangaDexSource)

  // In production, you would:
  // 1. Load sources from a sources directory
  // 2. Parse source TypeScript files
  // 3. Execute them in a sandboxed environment
  // 4. Register each valid source

  // For now, we just register our mock source
  console.log('Sources initialized:', sourceManager.getAllSources().length)
}

