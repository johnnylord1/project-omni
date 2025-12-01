import { useState, useRef, useEffect } from 'react'
import { MoreVertical, CheckCheck, Circle, ExternalLink, Download, Share2, Filter } from 'lucide-react'

interface MangaOptionsMenuProps {
  isInLibrary: boolean
  onMarkAllAsRead: () => void
  onMarkAllAsUnread: () => void
  onOpenWebView: () => void
  mangaUrl?: string
}

function MangaOptionsMenu({
  isInLibrary,
  onMarkAllAsRead,
  onMarkAllAsUnread,
  onOpenWebView,
  mangaUrl,
}: MangaOptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleAction = (action: () => void) => {
    action()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* 3-dot button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="p-2 hover:bg-surface-variant rounded-full transition-colors"
        title="More options"
      >
        <MoreVertical size={24} className="text-on-surface" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-surface rounded-xl shadow-lg border border-outline-variant z-50 py-2">
          {/* Mark All as Read (only when in library) */}
          {isInLibrary && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAction(onMarkAllAsRead)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-variant transition-colors text-left"
              >
                <CheckCheck size={18} className="text-primary" />
                <span className="text-on-surface">Mark all as read</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAction(onMarkAllAsUnread)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-variant transition-colors text-left"
              >
                <Circle size={18} className="text-on-surface-variant" />
                <span className="text-on-surface">Mark all as unread</span>
              </button>

              <div className="h-px bg-outline-variant my-2" />
            </>
          )}

          {/* Open in WebView */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAction(onOpenWebView)
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-variant transition-colors text-left"
          >
            <ExternalLink size={18} className="text-on-surface-variant" />
            <span className="text-on-surface">Open in WebView</span>
          </button>

          {/* Share (placeholder for future) */}
          <button
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-variant transition-colors text-left opacity-50 cursor-not-allowed"
            disabled
          >
            <Share2 size={18} className="text-on-surface-variant" />
            <span className="text-on-surface">Share</span>
          </button>

          <div className="h-px bg-outline-variant my-2" />

          {/* Download All Chapters (placeholder) */}
          <button
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-variant transition-colors text-left opacity-50 cursor-not-allowed"
            disabled
          >
            <Download size={18} className="text-on-surface-variant" />
            <span className="text-on-surface">Download all chapters</span>
          </button>

          {/* Chapter Filters (placeholder) */}
          <button
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-variant transition-colors text-left opacity-50 cursor-not-allowed"
            disabled
          >
            <Filter size={18} className="text-on-surface-variant" />
            <span className="text-on-surface">Filter chapters</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default MangaOptionsMenu

