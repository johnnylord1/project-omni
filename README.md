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
- [ ] **Phase 2:** Local Database (Dexie)
- [ ] **Phase 3:** Source Engine
- [ ] **Phase 4:** UI Implementation (Library & Browse)
- [ ] **Phase 5:** Readers (Manga & Novel)
- [ ] **Phase 6:** Settings & Advanced Features

## 📄 License

MIT License - Open Source

---

**Status:** Phase 1 Complete ✅

