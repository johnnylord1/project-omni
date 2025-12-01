# Project Omni

> The definitive open-source media reader (Manga, Light Novels, Anime) built with modern Web Technologies.

## 🎯 Mission

Build a cross-platform media reader that matches the functionality and polish of **TachiyomiJ2K/Mihon**, running natively on:
- **Android** (via Capacitor)
- **Windows** (via Tauri)

## 🛠️ Tech Stack

- **Core:** React 18+ (Vite) + TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v3.4+ with Material Design 3
- **State:** Zustand with persist middleware
- **Database:** Dexie (IndexedDB wrapper) - fully offline
- **Routing:** React Router v6+
- **Network:** Axios + TanStack Query v5
- **Icons:** Lucide React
- **Native:**
  - Mobile: Capacitor
  - Desktop: Tauri v2

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
/src
  /assets         # Static images
  /components     # Atomic UI components
    /ui           # Generic components
    /shared       # Project specific shared components
  /features       # Business Logic Modules
    /library      # Manga library management
    /reader       # Reader components & settings
    /browse       # Extensions & source browsing
    /settings     # App configuration
  /hooks          # Global React Hooks
  /db             # Dexie Schema & Database
  /stores         # Zustand Stores
  /services       # Core services (SourceEngine, Sync, Backup)
  /types          # TypeScript interfaces
```

## 🎨 Design System

Material Design 3 (Material You) with dynamic theming:
- **Dark Mode** (Default)
- **Light Mode**
- **AMOLED Mode** (Pure black)

All colors are CSS variables for runtime theming.

## 📋 Development Phases

- [x] **Phase 1:** Foundation & Theming System
- [x] **Phase 2:** Local Database (Dexie)
- [x] **Phase 3:** Source Engine
- [x] **Phase 4:** UI Implementation (Manga Details, Library Enhancements)
- [ ] **Phase 5:** Readers (Manga & Novel)
- [ ] **Phase 6:** Settings & Advanced Features
- [ ] **Phase 7:** Real Extensions (Dynamic TypeScript execution)

## 💾 Database Schema

**Powered by Dexie (IndexedDB)**

- **Manga:** Core manga metadata (title, cover, author, status, favorites)
- **Chapters:** Chapter list with reading progress tracking
- **History:** Reading history with timestamps
- **Categories:** Custom library organization
- **Sources:** Extension/source management
- **Downloads:** Offline reading support

All data is stored **locally** - no external backend required.

## 🔌 Source Engine

**Strategy Pattern Architecture (Paperback/Suwatte style)**

- **ISource Interface:** Common contract for all sources
- **SourceManager:** Central registry and source access
- **Mock MangaDex:** Fully functional test source with 8+ manga
- **Transformers:** Convert source data → database entities
- **React Hooks:** `useSourceSearch`, `useAddToLibrary`, `useRefreshManga`

Browse and add manga from sources to your library!

## 🔧 Available Hooks

```typescript
// Library management
useLibrary() - Fetch all library manga
useFavorites() - Fetch favorite manga
useManga(id) - Get single manga details

// Chapter operations
useChapters(mangaId) - Get chapters for a manga
useChapterActions() - Mark read/unread, update progress

// History tracking
useHistory() - Get reading history
useHistoryActions() - Clear history, remove entries

// Categories
useCategories() - Fetch all categories
useCategoryActions() - Create, update, delete categories
```

## 📄 License

MIT License - Open Source

---

**Status:** Phase 4 Complete ✅

