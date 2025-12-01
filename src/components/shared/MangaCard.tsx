import { Heart, BookOpen } from 'lucide-react'
import type { Manga } from '../../types/manga'

interface MangaCardProps {
  manga: Manga
  onClick?: () => void
}

function MangaCard({ manga, onClick }: MangaCardProps) {
  return (
    <div
      className="relative group cursor-pointer rounded-xl overflow-hidden bg-surface-variant transition-transform hover:scale-105"
      onClick={onClick}
      style={{ aspectRatio: '2/3' }}
    >
      {/* Cover Image */}
      <div className="w-full h-full bg-surface-variant">
        {manga.cover ? (
          <img
            src={manga.cover}
            alt={manga.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
            <BookOpen size={48} />
          </div>
        )}
      </div>

      {/* Gradient Overlay for Text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 group-hover:opacity-90 transition-opacity" />

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
          {manga.title}
        </h3>
        {manga.author && (
          <p className="text-white/70 text-xs line-clamp-1">
            {manga.author}
          </p>
        )}
      </div>

      {/* Badges */}
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        {/* Favorite Badge */}
        {manga.favorite && (
          <div className="bg-primary rounded-full p-1.5">
            <Heart size={14} fill="currentColor" className="text-on-primary" />
          </div>
        )}
      </div>

      {/* Unread Badge */}
      {manga.unreadCount !== undefined && manga.unreadCount > 0 && (
        <div className="absolute top-2 right-2 bg-primary text-on-primary rounded-full px-2 py-1 text-xs font-bold min-w-[24px] text-center">
          {manga.unreadCount > 99 ? '99+' : manga.unreadCount}
        </div>
      )}
    </div>
  )
}

export default MangaCard

