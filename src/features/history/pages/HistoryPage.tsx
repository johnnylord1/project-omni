import { Clock, Trash2 } from 'lucide-react'
import { useHistory, useHistoryActions } from '../../../hooks/useHistory'
import { formatDistanceToNow } from '../../../utils/dateUtils'

function HistoryPage() {
  const { history, isLoading } = useHistory()
  const { clearHistory } = useHistoryActions()

  const handleClearHistory = async () => {
    if (confirm('Are you sure you want to clear all reading history?')) {
      await clearHistory()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-on-surface-variant">Loading history...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-outline-variant z-10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock size={28} className="text-primary" />
            <h1 className="text-2xl font-bold text-on-surface">History</h1>
          </div>
          
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 px-4 py-2 bg-surface-variant text-on-surface-variant rounded-full text-sm font-medium hover:bg-outline-variant transition-colors"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          )}
        </div>
        
        <p className="text-sm text-on-surface-variant mt-2">
          {history.length} {history.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Clock size={64} className="text-on-surface-variant mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-on-surface mb-2">
              No reading history yet
            </h2>
            <p className="text-on-surface-variant max-w-sm">
              Your recently read manga will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant">
            {history.map((manga) => (
              <div
                key={manga.id}
                className="flex gap-4 p-4 hover:bg-surface-variant cursor-pointer transition-colors"
              >
                {/* Cover */}
                <div
                  className="w-16 h-24 rounded-lg overflow-hidden bg-surface flex-shrink-0"
                  style={{ aspectRatio: '2/3' }}
                >
                  {manga.cover ? (
                    <img
                      src={manga.cover}
                      alt={manga.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-variant" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-on-surface mb-1 line-clamp-2">
                    {manga.title}
                  </h3>
                  {manga.author && (
                    <p className="text-sm text-on-surface-variant mb-2 line-clamp-1">
                      {manga.author}
                    </p>
                  )}
                  <p className="text-xs text-on-surface-variant">
                    {manga.lastReadAt && formatDistanceToNow(manga.lastReadAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage

