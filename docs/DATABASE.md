# Database Architecture

Project Omni uses **Dexie.js** (IndexedDB wrapper) for offline-first local storage.

## Schema Overview

### Manga Table
Stores core manga information.

```typescript
interface Manga {
  id: string              // Primary key (sourceId + mangaId)
  sourceId: string        // Source identifier
  url: string             // Source-specific URL
  title: string
  author?: string
  artist?: string
  description?: string
  genre?: string[]
  status?: MangaStatus
  cover?: string
  
  // Library management
  favorite: boolean
  inLibrary: boolean
  categories: string[]    // Array of category IDs
  
  // Metadata
  lastReadAt?: number
  unreadCount?: number
}
```

**Indexes:** `id`, `sourceId`, `favorite`, `inLibrary`, `lastReadAt`, `title`

---

### Chapter Table
Stores chapter metadata and reading progress.

```typescript
interface Chapter {
  id: string              // Primary key (sourceId + mangaId + chapterId)
  mangaId: string         // Foreign key to Manga
  sourceId: string
  url: string
  name: string
  chapterNumber?: number
  scanlator?: string
  
  // Reading progress
  read: boolean
  bookmark: boolean
  lastPageRead: number    // 0-based index
  pagesCount?: number
  
  dateUpload?: number
}
```

**Indexes:** `id`, `mangaId`, `sourceId`, `read`, `bookmark`, `chapterNumber`

---

### History Table
Tracks reading history for each manga/chapter.

```typescript
interface History {
  id?: number             // Auto-incremented primary key
  mangaId: string
  chapterId: string
  lastReadAt: number      // Timestamp
  pagesRead?: number
}
```

**Indexes:** `++id`, `mangaId`, `chapterId`, `lastReadAt`

---

### Category Table
Organizes library into custom categories.

```typescript
interface Category {
  id: string              // Primary key
  name: string
  order: number           // Sort order
  flags?: CategoryFlags
}

interface CategoryFlags {
  downloadNewChapters?: boolean
  includeInUpdate?: boolean
  includeInGlobalUpdate?: boolean
}
```

**Indexes:** `id`, `name`, `order`

**Default Categories:**
- Default
- Reading
- Completed
- Plan to Read

---

## React Hooks

### Library Hooks

```typescript
// Get all manga in library
const { manga, isLoading } = useLibrary()

// Get favorite manga
const { manga, isLoading } = useFavorites()

// Get manga by category
const { manga, isLoading } = useMangaByCategory('reading')

// Get single manga
const { manga, isLoading } = useManga(mangaId)

// Actions
const { 
  addToLibrary,
  removeFromLibrary,
  toggleFavorite,
  updateManga,
  deleteManga 
} = useMangaActions()
```

### Chapter Hooks

```typescript
// Get chapters for a manga
const { chapters, unreadCount, isLoading } = useChapters(mangaId)

// Get single chapter
const { chapter, isLoading } = useChapter(chapterId)

// Actions
const {
  markAsRead,
  markAsUnread,
  updateProgress,
  toggleBookmark,
  markMultipleAsRead,
  markMultipleAsUnread
} = useChapterActions()
```

### History Hooks

```typescript
// Get reading history
const { history, isLoading } = useHistory(50) // limit 50

// Get history for specific manga
const { history, isLoading } = useMangaHistory(mangaId)

// Actions
const {
  clearHistory,
  clearMangaHistory,
  removeHistoryEntry
} = useHistoryActions()
```

### Category Hooks

```typescript
// Get all categories
const { categories, isLoading } = useCategories()

// Get single category
const { category, isLoading } = useCategory(categoryId)

// Actions
const {
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories
} = useCategoryActions()
```

---

## Usage Examples

### Adding Manga to Library

```typescript
import { useMangaActions } from '@/hooks/useLibrary'

function AddToLibraryButton({ manga }) {
  const { addToLibrary } = useMangaActions()
  
  const handleAdd = async () => {
    await addToLibrary({
      ...manga,
      inLibrary: true,
      favorite: false,
      categories: ['default']
    })
  }
  
  return <button onClick={handleAdd}>Add to Library</button>
}
```

### Marking Chapter as Read

```typescript
import { useChapterActions } from '@/hooks/useChapters'

function ChapterRow({ chapter }) {
  const { markAsRead } = useChapterActions()
  
  const handleMarkRead = async () => {
    await markAsRead(chapter.id)
  }
  
  return (
    <div onClick={handleMarkRead}>
      {chapter.name} {chapter.read && '✓'}
    </div>
  )
}
```

### Displaying Library

```typescript
import { useLibrary } from '@/hooks/useLibrary'

function LibraryPage() {
  const { manga, isLoading } = useLibrary()
  
  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      {manga.map(m => (
        <MangaCard key={m.id} manga={m} />
      ))}
    </div>
  )
}
```

---

## Database Utilities

### Clear All Data

```typescript
import { db } from '@/db'

await db.clearAll()
```

### Initialize Defaults

```typescript
// Automatically runs on database initialization
// Creates default categories if none exist
await db.initializeDefaults()
```

### Mock Data (Development Only)

```typescript
import { seedMockData, clearMockData } from '@/db/mockData'

// Seed demo manga
await seedMockData()

// Clear demo data
await clearMockData()
```

---

## Performance Considerations

1. **Indexes:** All frequently queried fields are indexed for fast lookups
2. **Compound Queries:** Use `where().equals()` for indexed field filtering
3. **Bulk Operations:** Use `bulkAdd()`, `bulkPut()`, `bulkGet()` for multiple records
4. **Live Queries:** `useLiveQuery()` automatically updates on DB changes (use sparingly)

---

## Migration Strategy

When schema changes are needed:

```typescript
// In schema.ts
this.version(2).stores({
  manga: 'id, sourceId, favorite, inLibrary, lastReadAt, title, newField',
  // Add new indexes or tables
})

// Upgrade existing data
this.version(2).upgrade(tx => {
  return tx.manga.toCollection().modify(manga => {
    manga.newField = 'default value'
  })
})
```

---

**Next:** Phase 3 will implement the Source Engine that populates this database with real manga data.

