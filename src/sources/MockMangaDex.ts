import type { ISource, SourceManga, SourceChapter } from '../types/source'

/**
 * Mock MangaDex Source
 * Simulates a real MangaDex source with fake data for testing
 * In production, this would make real API calls to mangadex.org
 */
export class MockMangaDexSource implements ISource {
  id = 'mangadex'
  name = 'MangaDex'
  version = '1.0.0'
  lang = 'en'
  icon = 'https://mangadex.org/favicon.ico'
  supportsLatest = true
  supportsSearch = true

  // Mock database of manga
  private mockManga: SourceManga[] = [
    {
      id: 'md-one-piece',
      title: 'One Piece',
      cover: 'https://placehold.co/400x600/FF5722/white?text=One+Piece',
      author: 'Oda Eiichiro',
      artist: 'Oda Eiichiro',
      description: 'Gol D. Roger was known as the "Pirate King," the strongest and most infamous being to have sailed the Grand Line. The capture and execution of Roger by the World Government brought a change throughout the world. His last words before his death revealed the existence of the greatest treasure in the world, One Piece. It was this revelation that brought about the Grand Age of Pirates, men who dreamed of finding One Piece—which promises an unlimited amount of riches and fame—and quite possibly the pinnacle of glory and the title of the Pirate King.',
      genre: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy'],
      status: 'ongoing',
      url: 'https://mangadex.org/title/a1c7c817-4e59-43b7-9365-09675a149a6f',
    },
    {
      id: 'md-jujutsu-kaisen',
      title: 'Jujutsu Kaisen',
      cover: 'https://placehold.co/400x600/9C27B0/white?text=Jujutsu+Kaisen',
      author: 'Akutami Gege',
      artist: 'Akutami Gege',
      description: 'Hidden in plain sight, an age-old conflict rages on. Supernatural monsters known as "Curses" terrorize humanity from the shadows, and powerful humans known as "Jujutsu" sorcerers use mystical arts to exterminate them. When high school student Yuuji Itadori finds a dried-up finger of the legendary Curse Sukuna Ryoumen, he suddenly finds himself joining this bloody conflict.',
      genre: ['Action', 'Supernatural', 'School Life', 'Shounen'],
      status: 'ongoing',
      url: 'https://mangadex.org/title/0b18e6e4-c429-4d5a-b56c-7cf9b3a430f3',
    },
    {
      id: 'md-chainsaw-man',
      title: 'Chainsaw Man',
      cover: 'https://placehold.co/400x600/E91E63/white?text=Chainsaw+Man',
      author: 'Fujimoto Tatsuki',
      artist: 'Fujimoto Tatsuki',
      description: 'Denji is a young boy who works as a Devil Hunter with the "Chainsaw Devil" Pochita. One day, as he was living his miserable life trying to pay off the debt he inherited from his parents, he got betrayed and killed. As he was losing his consciousness, he made a deal with Pochita, and got resurrected as the "Chainsaw Man": the owner of the Devil\'s heart.',
      genre: ['Action', 'Comedy', 'Horror', 'Supernatural', 'Shounen'],
      status: 'completed',
      url: 'https://mangadex.org/title/a96676e5-8ae2-425e-b549-7f15dd34a6d8',
    },
    {
      id: 'md-spy-family',
      title: 'SPY x FAMILY',
      cover: 'https://placehold.co/400x600/2196F3/white?text=SPY+x+FAMILY',
      author: 'Endou Tatsuya',
      artist: 'Endou Tatsuya',
      description: 'Everyone has a part of themselves they cannot show to anyone else. At a time when all nations of the world were involved in a fierce war of information happening behind closed doors, Ostania and Westalis had been in a state of cold war against one another for decades. The Westalis Intelligence Services\' Eastern-Focused Division (WISE) sends their most talented spy, "Twilight," on a top-secret mission to investigate the movements of Donovan Desmond, the chairman of Ostania\'s National Unity Party, who is threatening peace efforts between the two nations.',
      genre: ['Action', 'Comedy', 'Slice of Life', 'Shounen'],
      status: 'ongoing',
      url: 'https://mangadex.org/title/0e2c6f98-6d8a-4749-b1e4-1a92e7a5f4c1',
    },
    {
      id: 'md-demon-slayer',
      title: 'Demon Slayer: Kimetsu no Yaiba',
      cover: 'https://placehold.co/400x600/00BCD4/white?text=Demon+Slayer',
      author: 'Gotouge Koyoharu',
      artist: 'Gotouge Koyoharu',
      description: 'Since ancient times, rumors have abounded of man-eating demons lurking in the woods. Because of this, the local townsfolk never venture outside at night. Legend has it that a demon slayer also roams the night, hunting down these bloodthirsty demons. Ever since the death of his father, Tanjirou has taken it upon himself to support his mother and five siblings. Although their lives may be hardened by tragedy, they\'ve found happiness. But that ephemeral warmth is shattered one day when Tanjirou finds his family slaughtered and the lone survivor, his sister Nezuko, turned into a demon.',
      genre: ['Action', 'Historical', 'Supernatural', 'Shounen'],
      status: 'completed',
      url: 'https://mangadex.org/title/9b0d9c7e-7c9a-4e7e-9e0a-7e9c7e9c7e9c',
    },
    {
      id: 'md-my-hero-academia',
      title: 'My Hero Academia',
      cover: 'https://placehold.co/400x600/4CAF50/white?text=My+Hero+Academia',
      author: 'Horikoshi Kouhei',
      artist: 'Horikoshi Kouhei',
      description: 'One day, a four-year-old boy came to a sudden realization: the world is not fair. Eighty percent of the world\'s population wield special abilities, known as "quirks," which have given many the power to make their childhood dreams of becoming a superhero a reality. Unfortunately, Izuku Midoriya was one of the few born without a quirk, suffering from discrimination because of it. Yet, he does not give up on his dream of becoming a hero.',
      genre: ['Action', 'School Life', 'Superhero', 'Shounen'],
      status: 'ongoing',
      url: 'https://mangadex.org/title/4c4b2d8e-f2d3-4d9e-9b3a-3e2c8f8d9e0a',
    },
    {
      id: 'md-tokyo-ghoul',
      title: 'Tokyo Ghoul',
      cover: 'https://placehold.co/400x600/607D8B/white?text=Tokyo+Ghoul',
      author: 'Ishida Sui',
      artist: 'Ishida Sui',
      description: 'Shy Ken Kaneki is thrilled to go on a date with the beautiful Rize. But it turns out that she\'s only interested in his body—eating it, that is. When a morally questionable rescue transforms him into the first half-human half-Ghoul hybrid, Ken is drawn into the dark and violent world of Ghouls, which exists alongside our own.',
      genre: ['Action', 'Horror', 'Psychological', 'Supernatural', 'Seinen'],
      status: 'completed',
      url: 'https://mangadex.org/title/tokyo-ghoul',
    },
    {
      id: 'md-attack-on-titan',
      title: 'Attack on Titan',
      cover: 'https://placehold.co/400x600/795548/white?text=Attack+on+Titan',
      author: 'Isayama Hajime',
      artist: 'Isayama Hajime',
      description: 'Hundreds of years ago, horrifying creatures which resembled humans appeared. These mindless, towering giants, called "Titans," proved to be an existential threat, as they preyed on whatever humans they could find in order to satisfy a seemingly unending appetite. Unable to effectively combat the Titans, mankind was forced to barricade themselves within large walls surrounding what may very well be humanity\'s last safe haven in the world.',
      genre: ['Action', 'Drama', 'Fantasy', 'Mystery', 'Shounen'],
      status: 'completed',
      url: 'https://mangadex.org/title/304ceac3-8cdb-4fe7-acf7-2b6ff7a60613',
    },
  ]

  /**
   * Simulate API delay
   */
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Search for manga
   */
  async search(query: string, page: number = 1): Promise<SourceManga[]> {
    await this.delay(300) // Simulate network delay

    const lowerQuery = query.toLowerCase()
    const results = this.mockManga.filter(manga => 
      manga.title.toLowerCase().includes(lowerQuery) ||
      manga.author?.toLowerCase().includes(lowerQuery) ||
      manga.description?.toLowerCase().includes(lowerQuery)
    )

    // Simulate pagination (10 per page)
    const start = (page - 1) * 10
    const end = start + 10
    
    return results.slice(start, end)
  }

  /**
   * Get manga details
   */
  async getMangaDetails(mangaId: string): Promise<SourceManga> {
    console.log('[MockMangaDex] getMangaDetails called with:', mangaId)
    console.log('[MockMangaDex] Available manga IDs:', this.mockManga.map(m => m.id))
    
    await this.delay(200)

    const manga = this.mockManga.find(m => m.id === mangaId)
    if (!manga) {
      console.error('[MockMangaDex] Manga not found:', mangaId)
      throw new Error(`Manga not found in MockMangaDex: ${mangaId}`)
    }

    console.log('[MockMangaDex] Found manga:', manga.title)
    return manga
  }

  /**
   * Get chapter list for a manga
   */
  async getChapters(mangaId: string): Promise<SourceChapter[]> {
    await this.delay(400)

    // Generate mock chapters (20 chapters for demo)
    const chapters: SourceChapter[] = []
    const chapterCount = 20

    for (let i = chapterCount; i >= 1; i--) {
      chapters.push({
        id: `${mangaId}-ch-${i}`,
        mangaId: mangaId,
        name: `Chapter ${i}`,
        url: `https://mangadex.org/chapter/${mangaId}-${i}`,
        chapterNumber: i,
        scanlator: 'Scanlation Group',
        dateUpload: Date.now() - (chapterCount - i) * 86400000, // 1 day apart
      })
    }

    return chapters
  }

  /**
   * Get page URLs for a chapter
   */
  async getPageList(chapterId: string): Promise<string[]> {
    console.log('[MockMangaDex] getPageList called for:', chapterId)
    await this.delay(300)

    // Generate mock page URLs using placeholder service (15 pages per chapter)
    const pages: string[] = []
    const colors = ['FF5722', '9C27B0', '2196F3', '4CAF50', 'FF9800', 'E91E63']
    
    for (let i = 1; i <= 15; i++) {
      const color = colors[i % colors.length]
      pages.push(`https://placehold.co/800x1200/${color}/white?text=Page+${i}`)
    }

    console.log('[MockMangaDex] Generated', pages.length, 'pages')
    return pages
  }

  /**
   * Get latest manga updates
   */
  async getLatestUpdates(page: number = 1): Promise<SourceManga[]> {
    await this.delay(400)

    // Return all manga sorted by "latest" (just reverse for demo)
    const start = (page - 1) * 10
    const end = start + 10
    
    return [...this.mockManga].reverse().slice(start, end)
  }

  /**
   * Get popular manga
   */
  async getPopular(page: number = 1): Promise<SourceManga[]> {
    await this.delay(400)

    const start = (page - 1) * 10
    const end = start + 10
    
    return this.mockManga.slice(start, end)
  }
}

// Export singleton instance
export const mockMangaDexSource = new MockMangaDexSource()

