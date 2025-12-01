# Source Engine Architecture

The Source Engine is the core system that enables Project Omni to fetch manga from various sources (MangaDex, MangaSee, custom sources, etc.).

## Overview

The engine follows the **Strategy Pattern** similar to Paperback/Suwatte, where each source implements a common interface (`ISource`), allowing the app to work with any source uniformly.

---

## Architecture Components

### 1. ISource Interface (`src/types/source.ts`)

The contract all sources must implement:

```typescript
interface ISource {
  // Metadata
  id: string
  name: string
  version: string
  lang: string
  icon?: string
  
  // Capabilities
  supportsLatest: boolean
  supportsSearch: boolean
  
  // Required Methods
  getMangaDetails(mangaId: string): Promise<SourceManga>
  getChapters(mangaId: string): Promise<SourceChapter[]>
  getPageList(chapterId: string): Promise<string[]>
  search(query: string, page?: number): Promise<SourceManga[]>
  
  // Optional Methods
  getLatestUpdates?(page?: number): Promise<SourceManga[]>
  getPopular?(page?: number): Promise<SourceManga[]>
}
```

### 2. SourceManager (`src/services/SourceManager.ts`)

Central registry for all sources:

- **Registers/unregisters sources**
- **Provides source access by ID**
- **Manages enabled/disabled state**
- **Cross-source search**

```typescript
import { sourceManager } from '@/services/SourceManager'

// Get a source
const source = sourceManager.getSource('mangadex')

// Get all sources
const all = sourceManager.getAllSources()

// Search across all sources
const results = await sourceManager.searchAllSources('one piece')
```

### 3. Transformers (`src/services/transformers.ts`)

Converts source-specific data to database entities:

```typescript
// Source data → Database entity
const manga = transformSourceManga(sourceManga, 'mangadex', {
  inLibrary: true,
  categories: ['reading']
})

const chapters = transformSourceChapterList(sourceChapters, 'mangadex', mangaId)
```

### 4. React Hooks (`src/hooks/useSource.ts`)

React Query-powered hooks for source operations:

```typescript
// Search
const { data, isLoading } = useSourceSearch('mangadex', 'one piece')

// Get manga details
const { data: manga } = useSourceManga('mangadex', 'manga-id')

// Get chapters
const { data: chapters } = useSourceChapters('mangadex', 'manga-id')

// Popular/Latest
const { data: popular } = useSourcePopular('mangadex', 1)
const { data: latest } = useSourceLatest('mangadex', 1)

// Add to library (fetches data + saves to DB)
const addToLibrary = useAddToLibrary()
await addToLibrary.mutateAsync({
  sourceId: 'mangadex',
  mangaId: 'some-id',
  categories: ['default']
})

// Refresh chapters
const refresh = useRefreshManga()
await refresh.mutateAsync(mangaId)
```

---

## Creating a New Source

### Step 1: Implement ISource

```typescript
// src/sources/MyCustomSource.ts
import type { ISource, SourceManga, SourceChapter } from '@/types/source'

export class MyCustomSource implements ISource {
  id = 'my-source'
  name = 'My Custom Source'
  version = '1.0.0'
  lang = 'en'
  supportsLatest = true
  supportsSearch = true

  async search(query: string): Promise<SourceManga[]> {
    // Implement search logic
    const response = await fetch(`https://api.example.com/search?q=${query}`)
    const data = await response.json()
    
    return data.results.map(item => ({
      id: item.id,
      title: item.title,
      cover: item.coverUrl,
      author: item.author,
      description: item.synopsis,
      url: `https://example.com/manga/${item.id}`,
    }))
  }

  async getMangaDetails(mangaId: string): Promise<SourceManga> {
    // Implement details fetching
  }

  async getChapters(mangaId: string): Promise<SourceChapter[]> {
    // Implement chapter list fetching
  }

  async getPageList(chapterId: string): Promise<string[]> {
    // Implement page URL fetching
  }

  async getPopular(page: number = 1): Promise<SourceManga[]> {
    // Implement popular manga fetching
  }

  async getLatestUpdates(page: number = 1): Promise<SourceManga[]> {
    // Implement latest updates fetching
  }
}
```

### Step 2: Register the Source

```typescript
// src/services/initializeSources.ts
import { sourceManager } from './SourceManager'
import { myCustomSource } from '../sources/MyCustomSource'

export async function initializeSources() {
  sourceManager.registerSource(myCustomSource)
}
```

---

## Mock MangaDex Source

For Phase 3, we implemented a **Mock MangaDex Source** (`src/sources/MockMangaDex.ts`) that:

- ✅ Returns 8 hardcoded popular manga
- ✅ Simulates network delays (300-500ms)
- ✅ Generates 20 chapters per manga
- ✅ Supports search (filters hardcoded data)
- ✅ Supports popular/latest tabs
- ✅ Provides realistic test data

This allows full testing without hitting real APIs.

### Mock Data Includes:
- One Piece
- Jujutsu Kaisen
- Chainsaw Man
- SPY x FAMILY
- Demon Slayer
- My Hero Academia
- Tokyo Ghoul
- Attack on Titan

---

## Data Flow

### Adding Manga to Library

```
1. User clicks "Add to Library" in Browse page
   ↓
2. useAddToLibrary() hook triggered
   ↓
3. Fetches manga details from source
   source.getMangaDetails(mangaId)
   ↓
4. Fetches chapter list from source
   source.getChapters(mangaId)
   ↓
5. Transforms source data to DB entities
   transformSourceManga() + transformSourceChapterList()
   ↓
6. Saves to IndexedDB
   db.manga.put() + db.chapters.bulkPut()
   ↓
7. UI updates automatically (React Query + Dexie live queries)
```

### Refreshing Manga

```
1. User pulls to refresh / clicks refresh button
   ↓
2. useRefreshManga() hook triggered
   ↓
3. Fetches latest chapters from source
   ↓
4. Merges with existing chapters (preserves read status)
   ↓
5. Updates unread count
   ↓
6. Saves to database
```

---

## Network Layer

Uses **Axios + TanStack Query v5**:

- ✅ Automatic caching
- ✅ Stale-while-revalidate
- ✅ Request deduplication
- ✅ Error handling
- ✅ Loading states

### Cache Strategy

```typescript
{
  search: 5 minutes stale time
  manga details: 10 minutes
  chapters: 5 minutes
  popular: 10 minutes
  latest: 2 minutes (more frequent updates)
}
```

---

## Future: Real API Integration

### MangaDex API v5 Example

```typescript
async search(query: string, page: number = 1): Promise<SourceManga[]> {
  const offset = (page - 1) * 10
  
  const response = await axios.get('https://api.mangadex.org/manga', {
    params: {
      title: query,
      limit: 10,
      offset,
      includes: ['cover_art', 'author', 'artist'],
    },
  })

  return response.data.data.map(manga => ({
    id: manga.id,
    title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
    cover: getCoverUrl(manga),
    author: getAuthorName(manga),
    description: manga.attributes.description.en,
    status: manga.attributes.status,
    url: `https://mangadex.org/title/${manga.id}`,
  }))
}
```

---

## Testing

### In Browser DevTools Console

```javascript
// Get source manager
const sm = window.__sourceManager

// Search
const source = sm.getSource('mangadex')
const results = await source.search('one piece')
console.log(results)

// Get manga details
const manga = await source.getMangaDetails('md-one-piece')
console.log(manga)

// Get chapters
const chapters = await source.getChapters('md-one-piece')
console.log(chapters)
```

---

## Security Considerations

In production with real TypeScript source files:

1. **Sandboxing:** Execute source code in isolated VM (vm2, isolated-vm)
2. **Permissions:** Limit network access, file system access
3. **Validation:** Verify source signatures
4. **Rate Limiting:** Prevent API abuse
5. **CORS Proxy:** Handle cross-origin requests

---

## Next Steps (Phase 4)

- [ ] Manga details page (cover, description, chapter list)
- [ ] Chapter selection and bulk operations
- [ ] Source installation UI (install from repository)
- [ ] Source settings page (enable/disable, configure)
- [ ] Advanced filters (genre, status, year)
- [ ] Source migration (when manga moves to new URL)

---

**Status:** Phase 3 Complete ✅  
**Next:** Phase 4 - Full UI Implementation

