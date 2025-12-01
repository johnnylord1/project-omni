import { db } from './schema'
import type { Manga, Chapter } from '../types/manga'
import { MangaStatus } from '../types/manga'

/**
 * Seeds the database with mock data for testing
 * This will be removed in production - only for Phase 2 demonstration
 */
export async function seedMockData() {
  // Check if data already exists
  const count = await db.manga.count()
  if (count > 0) {
    console.log('Mock data already exists, skipping seed')
    return
  }

  console.log('Seeding mock data...')

  // Mock Manga Data - NOT in library by default
  const mockManga: Manga[] = [
    {
      id: 'mangadex-1',
      sourceId: 'mangadex',
      url: 'https://mangadex.org/title/1',
      title: 'One Piece',
      author: 'Oda Eiichiro',
      artist: 'Oda Eiichiro',
      description: 'The story follows the adventures of Monkey D. Luffy, a boy whose body gained the properties of rubber after unintentionally eating a Devil Fruit.',
      genre: ['Action', 'Adventure', 'Comedy', 'Fantasy'],
      status: MangaStatus.ONGOING,
      cover: 'https://placehold.co/400x600/FF5722/white?text=One+Piece',
      favorite: false,
      inLibrary: false,
      categories: [],
      unreadCount: 0,
    },
    {
      id: 'mangadex-2',
      sourceId: 'mangadex',
      url: 'https://mangadex.org/title/2',
      title: 'Attack on Titan',
      author: 'Isayama Hajime',
      artist: 'Isayama Hajime',
      description: 'Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called titans.',
      genre: ['Action', 'Drama', 'Fantasy', 'Mystery'],
      status: MangaStatus.COMPLETED,
      cover: 'https://placehold.co/400x600/795548/white?text=Attack+on+Titan',
      favorite: false,
      inLibrary: false,
      categories: [],
      unreadCount: 0,
    },
    {
      id: 'mangadex-3',
      sourceId: 'mangadex',
      url: 'https://mangadex.org/title/3',
      title: 'Jujutsu Kaisen',
      author: 'Akutami Gege',
      artist: 'Akutami Gege',
      description: 'Hidden in plain sight, an age-old conflict rages on. Supernatural monsters known as "Curses" terrorize humanity from the shadows.',
      genre: ['Action', 'Supernatural', 'School Life'],
      status: MangaStatus.ONGOING,
      cover: 'https://placehold.co/400x600/9C27B0/white?text=Jujutsu+Kaisen',
      favorite: false,
      inLibrary: false,
      categories: [],
      unreadCount: 0,
    },
    {
      id: 'mangadex-4',
      sourceId: 'mangadex',
      url: 'https://mangadex.org/title/4',
      title: 'Chainsaw Man',
      author: 'Fujimoto Tatsuki',
      artist: 'Fujimoto Tatsuki',
      description: 'Denji is a young boy who works as a Devil Hunter with the help of Pochita, a dog-like devil with chainsaw abilities.',
      genre: ['Action', 'Comedy', 'Horror', 'Supernatural'],
      status: MangaStatus.COMPLETED,
      cover: 'https://placehold.co/400x600/E91E63/white?text=Chainsaw+Man',
      favorite: false,
      inLibrary: false,
      categories: [],
      unreadCount: 0,
    },
    {
      id: 'mangadex-5',
      sourceId: 'mangadex',
      url: 'https://mangadex.org/title/5',
      title: 'My Hero Academia',
      author: 'Horikoshi Kouhei',
      artist: 'Horikoshi Kouhei',
      description: 'In a world where people with superpowers are the norm, Izuku Midoriya has dreams of one day becoming a Hero despite being bullied for not having a Quirk.',
      genre: ['Action', 'School Life', 'Superhero'],
      status: MangaStatus.ONGOING,
      cover: 'https://placehold.co/400x600/4CAF50/white?text=My+Hero+Academia',
      favorite: false,
      inLibrary: false,
      categories: [],
      unreadCount: 0,
    },
    {
      id: 'mangadex-6',
      sourceId: 'mangadex',
      url: 'https://mangadex.org/title/6',
      title: 'Demon Slayer',
      author: 'Gotouge Koyoharu',
      artist: 'Gotouge Koyoharu',
      description: 'Since ancient times, rumors have abounded of man-eating demons lurking in the woods. Tanjiro Kamado lives in the mountains with his family.',
      genre: ['Action', 'Historical', 'Supernatural'],
      status: MangaStatus.COMPLETED,
      cover: 'https://placehold.co/400x600/00BCD4/white?text=Demon+Slayer',
      favorite: false,
      inLibrary: false,
      categories: [],
      unreadCount: 0,
    },
  ]

  // Add data to database (no chapters - they'll be fetched from source when user adds manga)
  await db.manga.bulkAdd(mockManga)

  console.log('Mock data seeded successfully!')
  console.log(`Added ${mockManga.length} manga (not in library yet)`)
}

/**
 * Clears all mock data from the database
 */
export async function clearMockData() {
  await db.clearAll()
  console.log('All mock data cleared')
}

