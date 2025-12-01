import { useState, useRef, useEffect } from 'react'
import { MoreVertical, CheckCircle2, Circle, BookmarkPlus, Download } from 'lucide-react'

interface ChapterMenuProps {
  chapterId: string
  isRead: boolean
  isBookmarked: boolean
  onToggleRead: () => void
  onMarkPreviousAsRead: () => void
  onMarkPreviousAsUnread: () => void
  onToggleBookmark: () => void
}

function ChapterMenu({
  chapterId,
  isRead,
  isBookmarked,
  onToggleRead,
  onMarkPreviousAsRead,
  onMarkPreviousAsUnread,
  onToggleBookmark,
}: ChapterMenuProps) {
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

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  const handleAction = (action: () => void) => {
    action()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* 3-dot button */}
      <button
        onClick={handleMenuClick}
        className="p-2 hover:bg-surface-variant rounded-full transition-colors"
        title="Chapter options"
      >
        <MoreVertical size={18} className="text-on-surface-variant" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-surface rounded-xl shadow-lg border border-outline-variant z-50 py-2">
          {/* Toggle Read/Unread */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAction(onToggleRead)
            }}
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface-variant transition-colors text-left"
          >
            {isRead ? (
              <>
                <Circle size={18} className="text-on-surface-variant" />
                <span className="text-on-surface">Mark as unread</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={18} className="text-primary" />
                <span className="text-on-surface">Mark as read</span>
              </>
            )}
          </button>

          {/* Bookmark */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAction(onToggleBookmark)
            }}
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface-variant transition-colors text-left"
          >
            <BookmarkPlus size={18} className={isBookmarked ? 'text-primary' : 'text-on-surface-variant'} />
            <span className="text-on-surface">
              {isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            </span>
          </button>

          <div className="h-px bg-outline-variant my-2" />

          {/* Mark previous as read */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAction(onMarkPreviousAsRead)
            }}
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface-variant transition-colors text-left"
          >
            <CheckCircle2 size={18} className="text-on-surface-variant" />
            <span className="text-on-surface text-sm">Mark previous as read</span>
          </button>

          {/* Mark previous as unread */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAction(onMarkPreviousAsUnread)
            }}
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface-variant transition-colors text-left"
          >
            <Circle size={18} className="text-on-surface-variant" />
            <span className="text-on-surface text-sm">Mark previous as unread</span>
          </button>

          <div className="h-px bg-outline-variant my-2" />

          {/* Download (placeholder for Phase 6) */}
          <button
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface-variant transition-colors text-left opacity-50 cursor-not-allowed"
            disabled
          >
            <Download size={18} className="text-on-surface-variant" />
            <span className="text-on-surface text-sm">Download</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default ChapterMenu

