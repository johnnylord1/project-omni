import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ReadingMode = 'vertical' | 'ltr' | 'rtl' | 'webtoon'
export type ScaleType = 'fit-width' | 'fit-height' | 'fit-screen' | 'original'

interface ReaderState {
  // Reading preferences
  readingMode: ReadingMode
  scaleType: ScaleType
  backgroundColor: string
  
  // Display options
  showPageNumber: boolean
  showTapZones: boolean
  
  // Navigation
  tapToScroll: boolean
  volumeKeysNavigation: boolean
  
  // Image settings
  cropBorders: boolean
  invertColors: boolean
  
  // Actions
  setReadingMode: (mode: ReadingMode) => void
  setScaleType: (type: ScaleType) => void
  setBackgroundColor: (color: string) => void
  toggleShowPageNumber: () => void
  toggleShowTapZones: () => void
  toggleTapToScroll: () => void
  toggleCropBorders: () => void
  toggleInvertColors: () => void
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set) => ({
      // Defaults (like Tachiyomi)
      readingMode: 'vertical',
      scaleType: 'fit-width',
      backgroundColor: '#000000',
      
      showPageNumber: true,
      showTapZones: false,
      
      tapToScroll: true,
      volumeKeysNavigation: true,
      
      cropBorders: false,
      invertColors: false,

      // Actions
      setReadingMode: (mode) => set({ readingMode: mode }),
      setScaleType: (type) => set({ scaleType: type }),
      setBackgroundColor: (color) => set({ backgroundColor: color }),
      toggleShowPageNumber: () => set((state) => ({ showPageNumber: !state.showPageNumber })),
      toggleShowTapZones: () => set((state) => ({ showTapZones: !state.showTapZones })),
      toggleTapToScroll: () => set((state) => ({ tapToScroll: !state.tapToScroll })),
      toggleCropBorders: () => set((state) => ({ cropBorders: !state.cropBorders })),
      toggleInvertColors: () => set((state) => ({ invertColors: !state.invertColors })),
    }),
    {
      name: 'omni-reader-storage',
    }
  )
)

