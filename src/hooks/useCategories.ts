import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import type { Category } from '../types/manga'

/**
 * Hook to fetch all categories
 */
export function useCategories() {
  const categories = useLiveQuery(
    () => db.categories.orderBy('order').toArray(),
    []
  )

  return {
    categories: categories ?? [],
    isLoading: categories === undefined,
  }
}

/**
 * Hook to get a single category
 */
export function useCategory(categoryId: string | undefined) {
  const category = useLiveQuery(
    () => categoryId ? db.categories.get(categoryId) : undefined,
    [categoryId]
  )

  return {
    category,
    isLoading: category === undefined && categoryId !== undefined,
  }
}

/**
 * Hook for category CRUD operations
 */
export function useCategoryActions() {
  const createCategory = async (category: Omit<Category, 'id'>) => {
    const id = `category-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    await db.categories.add({
      ...category,
      id,
    })
    return id
  }

  const updateCategory = async (categoryId: string, updates: Partial<Category>) => {
    const category = await db.categories.get(categoryId)
    if (category) {
      await db.categories.put({
        ...category,
        ...updates,
      })
    }
  }

  const deleteCategory = async (categoryId: string) => {
    // Remove category from all manga
    const mangaInCategory = await db.manga
      .filter(m => m.categories.includes(categoryId))
      .toArray()
    
    const updates = mangaInCategory.map(manga => ({
      ...manga,
      categories: manga.categories.filter(c => c !== categoryId),
    }))
    
    await db.manga.bulkPut(updates)
    
    // Delete the category
    await db.categories.delete(categoryId)
  }

  const reorderCategories = async (categoryIds: string[]) => {
    const categories = await db.categories.bulkGet(categoryIds)
    const updates = categories
      .filter((c): c is Category => c !== undefined)
      .map((cat, index) => ({
        ...cat,
        order: index,
      }))
    
    await db.categories.bulkPut(updates)
  }

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
  }
}

