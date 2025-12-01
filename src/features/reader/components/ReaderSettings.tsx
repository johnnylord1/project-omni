import { X } from 'lucide-react'
import { useReaderStore } from '../../../stores/useReaderStore'

interface ReaderSettingsProps {
  isOpen: boolean
  onClose: () => void
}

function ReaderSettings({ isOpen, onClose }: ReaderSettingsProps) {
  const {
    readingMode,
    scaleType,
    backgroundColor,
    showPageNumber,
    cropBorders,
    invertColors,
    setReadingMode,
    setScaleType,
    setBackgroundColor,
    toggleShowPageNumber,
    toggleCropBorders,
    toggleInvertColors,
  } = useReaderStore()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center md:justify-center">
      <div className="w-full md:w-96 bg-surface rounded-t-3xl md:rounded-2xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-outline-variant px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-on-surface">Reader Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-variant rounded-full transition-colors"
          >
            <X size={24} className="text-on-surface" />
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-6">
          {/* Reading Mode */}
          <div>
            <label className="text-sm font-medium text-on-surface block mb-3">Reading Mode</label>
            <div className="grid grid-cols-2 gap-2">
              {(['vertical', 'ltr', 'rtl', 'webtoon'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setReadingMode(mode)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    readingMode === mode
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-variant text-on-surface-variant hover:bg-outline-variant'
                  }`}
                >
                  {mode === 'vertical' && 'Vertical'}
                  {mode === 'ltr' && 'Left to Right'}
                  {mode === 'rtl' && 'Right to Left'}
                  {mode === 'webtoon' && 'Webtoon'}
                </button>
              ))}
            </div>
          </div>

          {/* Scale Type */}
          <div>
            <label className="text-sm font-medium text-on-surface block mb-3">Image Scaling</label>
            <div className="grid grid-cols-2 gap-2">
              {(['fit-width', 'fit-height', 'fit-screen', 'original'] as const).map((scale) => (
                <button
                  key={scale}
                  onClick={() => setScaleType(scale)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    scaleType === scale
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-variant text-on-surface-variant hover:bg-outline-variant'
                  }`}
                >
                  {scale === 'fit-width' && 'Fit Width'}
                  {scale === 'fit-height' && 'Fit Height'}
                  {scale === 'fit-screen' && 'Fit Screen'}
                  {scale === 'original' && 'Original Size'}
                </button>
              ))}
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="text-sm font-medium text-on-surface block mb-3">Background Color</label>
            <div className="flex gap-2">
              {['#000000', '#1a1a1a', '#2d2d2d', '#ffffff'].map((color) => (
                <button
                  key={color}
                  onClick={() => setBackgroundColor(color)}
                  className={`w-12 h-12 rounded-lg border-2 transition-all ${
                    backgroundColor === color
                      ? 'border-primary scale-110'
                      : 'border-outline hover:border-outline-variant'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Toggle Options */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-on-surface block">Display Options</label>
            
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <span className="text-on-surface">Show page number</span>
              <button
                onClick={toggleShowPageNumber}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  showPageNumber ? 'bg-primary' : 'bg-outline-variant'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    showPageNumber ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <span className="text-on-surface">Crop borders</span>
              <button
                onClick={toggleCropBorders}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  cropBorders ? 'bg-primary' : 'bg-outline-variant'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    cropBorders ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <span className="text-on-surface">Invert colors</span>
              <button
                onClick={toggleInvertColors}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  invertColors ? 'bg-primary' : 'bg-outline-variant'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    invertColors ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReaderSettings

