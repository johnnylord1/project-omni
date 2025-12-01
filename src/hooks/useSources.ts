import { useQuery } from '@tanstack/react-query'
import { useLiveQuery } from 'dexie-react-hooks'
import { sourceManager } from '../services/SourceManager'
import { db } from '../db'

/**
 * Hook to get all available sources
 */
export function useSources() {
  const sources = useQuery({
    queryKey: ['sources-available'],
    queryFn: () => sourceManager.getAllSources(),
    staleTime: Infinity, // Sources don't change often
  })

  return {
    sources: sources.data ?? [],
    isLoading: sources.isLoading,
  }
}

/**
 * Hook to get enabled sources from database
 */
export function useEnabledSources() {
  const sources = useLiveQuery(
    () => db.sources.where('enabled').equals(1 as any).toArray(),
    []
  )

  return {
    sources: sources ?? [],
    isLoading: sources === undefined,
  }
}

/**
 * Hook to get sources by language
 */
export function useSourcesByLang(lang: string) {
  const sources = useQuery({
    queryKey: ['sources-by-lang', lang],
    queryFn: () => sourceManager.getSourcesByLang(lang),
    staleTime: Infinity,
  })

  return {
    sources: sources.data ?? [],
    isLoading: sources.isLoading,
  }
}

/**
 * Hook to get a single source
 */
export function useSourceDetails(sourceId: string | undefined) {
  const source = useQuery({
    queryKey: ['source-details', sourceId],
    queryFn: () => {
      if (!sourceId) return null
      return sourceManager.getSource(sourceId) ?? null
    },
    enabled: !!sourceId,
    staleTime: Infinity,
  })

  return {
    source: source.data,
    isLoading: source.isLoading,
  }
}

/**
 * Hook for source actions
 */
export function useSourceActions() {
  const toggleSource = async (sourceId: string, enabled: boolean) => {
    await sourceManager.setSourceEnabled(sourceId, enabled)
  }

  return {
    toggleSource,
  }
}

