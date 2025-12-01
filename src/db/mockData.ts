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

  // Mock Manga Data
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
      cover: 'https://uploads.mangadex.org/covers/a1c7c817-4e59-43b7-9365-09675a149a6f/cover.jpg',
      favorite: true,
      inLibrary: true,
      categories: ['reading'],
      lastReadAt: Date.now() - 3600000, // 1 hour ago
      unreadCount: 5,
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
      cover: 'https://uploads.mangadex.org/covers/304ceac3-8cdb-4fe7-acf7-2b6ff7a60613/cover.jpg',
      favorite: true,
      inLibrary: true,
      categories: ['completed'],
      lastReadAt: Date.now() - 86400000, // 1 day ago
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
      cover: 'https://uploads.mangadex.org/covers/0b18e6e4-c429-4d5a-b56c-7cf9b3a430f3/cover.jpg',
      favorite: false,
      inLibrary: true,
      categories: ['reading'],
      lastReadAt: Date.now() - 7200000, // 2 hours ago
      unreadCount: 12,
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
      cover: 'https://uploads.mangadex.org/covers/a96676e5-8ae2-425e-b549-7f15dd34a6d8/cover.jpg',
      favorite: true,
      inLibrary: true,
      categories: ['completed'],
      lastReadAt: Date.now() - 172800000, // 2 days ago
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
      cover: 'https://uploads.mangadex.org/covers/4c4b2d8e-f2d3-4d9e-9b3a-3e2c8f8d9e0a/cover.jpg',
      favorite: false,
      inLibrary: true,
      categories: ['reading'],
      lastReadAt: Date.now() - 259200000, // 3 days ago
      unreadCount: 8,
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
      cover: 'https://uploads.mangadex.org/covers/9b0d9c7e-7c9a-4e7e-9e0a-7e9c7e9c7e9c/cover.jpg',
      favorite: false,
      inLibrary: true,
      categories: ['plan-to-read'],
      unreadCount: 205,
    },
  ]

  // Mock Chapters for One Piece (first 10 chapters)
  const mockChapters: Chapter[] = []
  for (let i = 1; i <= 10; i++) {
    mockChapters.push({
      id: `mangadex-1-ch-${i}`,
      mangaId: 'mangadex-1',
      sourceId: 'mangadex',
      url: `https://mangadex.org/chapter/${i}`,
      name: `Chapter ${i}: ${getChapterTitle(i)}`,
      chapterNumber: i,
      scanlator: 'MangaStream',
      read: i <= 5,
      bookmark: false,
      lastPageRead: i <= 5 ? 20 : 0,
      pagesCount: 20,
      dateUpload: Date.now() - (10 - i) * 86400000,
      dateFetch: Date.now(),
    })
  }

  // Add data to database
  await db.manga.bulkAdd(mockManga)
  await db.chapters.bulkAdd(mockChapters)

  console.log('Mock data seeded successfully!')
  console.log(`Added ${mockManga.length} manga and ${mockChapters.length} chapters`)
}

// Helper function for chapter titles
function getChapterTitle(num: number): string {
  const titles = [
    'Romance Dawn',
    'That Man "Straw Hat Luffy"',
    'Introducing "Pirate Hunter Roronoa Zoro"',
    'The Great Swordsman Appears',
    'The King of the Pirates and the Master Swordsman',
    'The First Person',
    'Friends',
    'Nami',
    'The Honorable Liar Captain Usopp',
    'The Weirdest Guy Ever',
  ]
  return titles[num - 1] || `Chapter ${num}`
}

/**
 * Clears all mock data from the database
 */
export async function clearMockData() {
  await db.clearAll()
  console.log('All mock data cleared')
}

