import { z } from "zod";
import { publicProcedure } from "../../../create-context";

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  publishedAt: string;
  category: string;
  url: string;
  tags: string[];
}

export const fetchNewsProcedure = publicProcedure
  .input(
    z.object({
      limit: z.number().optional().default(20),
      category: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    try {
      console.log('[News] Fetching news from Didit360news.com', input);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const response = await fetch('https://www.didit360news.com/feed', {
          headers: {
            'User-Agent': 'Didit360-Music-App/1.0',
          },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          console.warn(`[News] RSS feed returned status ${response.status}, using mock data`);
          return getMockNews(input.limit, input.category);
        }

        const rssText = await response.text();
        console.log('[News] RSS feed fetched, parsing...');
        const articles = parseRSSFeed(rssText, input.limit, input.category);
        
        if (articles.length === 0) {
          console.warn('[News] No articles parsed from RSS feed, using mock data');
          return getMockNews(input.limit, input.category);
        }
        
        console.log(`[News] Successfully fetched ${articles.length} articles from RSS`);
        return articles;
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          console.warn('[News] RSS feed request timed out, using mock data');
        } else {
          console.warn('[News] RSS feed fetch failed:', fetchError.message);
        }
        return getMockNews(input.limit, input.category);
      }
    } catch (error) {
      console.error('[News] Unexpected error fetching news:', error);
      return getMockNews(input.limit, input.category);
    }
  });

function parseRSSFeed(rssText: string, limit: number, category?: string): NewsArticle[] {
  const articles: NewsArticle[] = [];
  
  try {
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const items = rssText.match(itemRegex) || [];
    
    for (const item of items.slice(0, limit)) {
      const title = extractTag(item, 'title');
      const link = extractTag(item, 'link');
      const description = extractTag(item, 'description');
      const pubDate = extractTag(item, 'pubDate');
      const categoryTag = extractTag(item, 'category');
      const creator = extractTag(item, 'dc:creator') || extractTag(item, 'author');
      
      let imageUrl = extractTag(item, 'media:content', 'url');
      if (!imageUrl) {
        imageUrl = extractTag(item, 'enclosure', 'url');
      }
      if (!imageUrl) {
        const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
        imageUrl = imgMatch ? imgMatch[1] : '';
      }
      
      if (!imageUrl) {
        imageUrl = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?q=80&w=800&auto=format&fit=crop`;
      }
      
      const cleanDescription = description
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim();
      
      if (category && categoryTag.toLowerCase() !== category.toLowerCase()) {
        continue;
      }
      
      articles.push({
        id: link || `article-${Date.now()}-${Math.random()}`,
        title: title || 'Untitled',
        excerpt: cleanDescription.substring(0, 200) + (cleanDescription.length > 200 ? '...' : ''),
        content: cleanDescription,
        imageUrl,
        author: creator || 'Didit360 News',
        publishedAt: pubDate || new Date().toISOString(),
        category: categoryTag || 'General',
        url: link || 'https://www.didit360news.com',
        tags: [categoryTag].filter(Boolean),
      });
    }
  } catch (error) {
    console.error('[News] Error parsing RSS feed:', error);
  }
  
  return articles;
}

function extractTag(xml: string, tagName: string, attribute?: string): string {
  if (attribute) {
    const regex = new RegExp(`<${tagName}[^>]*${attribute}="([^"]*)"`, 'i');
    const match = xml.match(regex);
    return match ? match[1] : '';
  }
  
  const regex = new RegExp(`<${tagName}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\/${tagName}>`, 'i');
  const cdataMatch = xml.match(regex);
  if (cdataMatch) return cdataMatch[1];
  
  const simpleRegex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\/${tagName}>`, 'i');
  const match = xml.match(simpleRegex);
  return match ? match[1].trim() : '';
}

function getMockNews(limit: number, category?: string): NewsArticle[] {
  const mockArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'Taylor Swift Spotted at Secret Studio Session in LA',
      excerpt: 'Pop superstar Taylor Swift was seen entering a recording studio in Los Angeles late last night, sparking speculation about new music on the horizon.',
      content: 'Pop superstar Taylor Swift was seen entering a recording studio in Los Angeles late last night, sparking speculation about new music on the horizon. Sources close to the singer suggest she may be working on a surprise album.',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop',
      author: 'Sarah Johnson',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      category: 'Celebrity',
      url: 'https://www.didit360news.com/article/1',
      tags: ['Celebrity', 'Taylor Swift'],
    },
    {
      id: '2',
      title: 'Drake and The Weeknd Reunite for Epic Collaboration',
      excerpt: 'Two of music\'s biggest stars have announced a surprise collaboration that has fans buzzing with excitement across social media platforms.',
      content: 'Two of music\'s biggest stars have announced a surprise collaboration that has fans buzzing with excitement across social media platforms. The track is set to drop next Friday.',
      imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop',
      author: 'Michael Chen',
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      category: 'Trending News',
      url: 'https://www.didit360news.com/article/2',
      tags: ['Trending News', 'Collaboration'],
    },
    {
      id: '3',
      title: 'Grammy Awards 2025: Complete Winners List',
      excerpt: 'The biggest night in music delivered unforgettable performances and surprising wins. See the complete list of Grammy winners.',
      content: 'The biggest night in music delivered unforgettable performances and surprising wins. See the complete list of Grammy winners and the most memorable moments from the ceremony.',
      imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop',
      author: 'Emily Rodriguez',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      category: 'Entertainment',
      url: 'https://www.didit360news.com/article/3',
      tags: ['Entertainment', 'Grammy Awards'],
    },
    {
      id: '4',
      title: 'Beyoncé Announces World Tour Dates',
      excerpt: 'Queen Bey is hitting the road! The superstar has announced a massive world tour with dates across North America, Europe, and Asia.',
      content: 'Queen Bey is hitting the road! The superstar has announced a massive world tour with dates across North America, Europe, and Asia. Tickets go on sale next week.',
      imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=800&auto=format&fit=crop',
      author: 'David Thompson',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      category: 'Celebrity',
      url: 'https://www.didit360news.com/article/4',
      tags: ['Celebrity', 'Beyoncé', 'Tour'],
    },
    {
      id: '5',
      title: 'Viral TikTok Song Breaks Spotify Records',
      excerpt: 'A song that went viral on TikTok has shattered streaming records on Spotify, becoming the fastest track to reach 100 million streams.',
      content: 'A song that went viral on TikTok has shattered streaming records on Spotify, becoming the fastest track to reach 100 million streams. The artist went from unknown to superstar overnight.',
      imageUrl: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?q=80&w=800&auto=format&fit=crop',
      author: 'Lisa Park',
      publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      category: 'Trending News',
      url: 'https://www.didit360news.com/article/5',
      tags: ['Trending News', 'TikTok', 'Viral'],
    },
    {
      id: '6',
      title: 'Coachella 2025 Lineup Revealed',
      excerpt: 'The most anticipated music festival of the year has unveiled its star-studded lineup featuring headliners and surprise performances.',
      content: 'The most anticipated music festival of the year has unveiled its star-studded lineup featuring headliners and surprise performances. Festival passes sold out in minutes.',
      imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop',
      author: 'James Wilson',
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      category: 'Entertainment',
      url: 'https://www.didit360news.com/article/6',
      tags: ['Entertainment', 'Coachella', 'Festival'],
    },
    {
      id: '7',
      title: 'Ariana Grande Teases New Album on Instagram',
      excerpt: 'The pop princess has been dropping cryptic hints on social media about her upcoming seventh studio album, sending fans into a frenzy.',
      content: 'The pop princess has been dropping cryptic hints on social media about her upcoming seventh studio album, sending fans into a frenzy. Industry insiders suggest a spring release date.',
      imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=800&auto=format&fit=crop',
      author: 'Jessica Martinez',
      publishedAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
      category: 'Celebrity',
      url: 'https://www.didit360news.com/article/7',
      tags: ['Celebrity', 'Ariana Grande'],
    },
    {
      id: '8',
      title: 'BTS Members Announce Solo Projects',
      excerpt: 'The K-pop sensation\'s members are embarking on individual creative journeys while maintaining their commitment to the group.',
      content: 'The K-pop sensation\'s members are embarking on individual creative journeys while maintaining their commitment to the group. Fans can expect solo albums, acting roles, and more.',
      imageUrl: 'https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=800&auto=format&fit=crop',
      author: 'Kim Lee',
      publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      category: 'Trending News',
      url: 'https://www.didit360news.com/article/8',
      tags: ['Trending News', 'BTS', 'K-pop'],
    },
    {
      id: '9',
      title: 'MTV VMAs: Most Shocking Moments',
      excerpt: 'From surprise performances to emotional speeches, this year\'s Video Music Awards delivered unforgettable television.',
      content: 'From surprise performances to emotional speeches, this year\'s Video Music Awards delivered unforgettable television. Relive the most talked-about moments from the show.',
      imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=800&auto=format&fit=crop',
      author: 'Ryan Cooper',
      publishedAt: new Date(Date.now() - 42 * 60 * 60 * 1000).toISOString(),
      category: 'Entertainment',
      url: 'https://www.didit360news.com/article/9',
      tags: ['Entertainment', 'VMAs', 'Awards'],
    },
    {
      id: '10',
      title: 'Bad Bunny Makes History with Stadium Tour',
      excerpt: 'The Latin superstar has become the highest-grossing touring artist of the year, breaking records across the globe.',
      content: 'The Latin superstar has become the highest-grossing touring artist of the year, breaking records across the globe. His stadium shows have been selling out in minutes.',
      imageUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=800&auto=format&fit=crop',
      author: 'Carlos Ramirez',
      publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      category: 'Celebrity',
      url: 'https://www.didit360news.com/article/10',
      tags: ['Celebrity', 'Bad Bunny', 'Tour'],
    },
  ];

  let filtered = mockArticles;
  if (category) {
    filtered = mockArticles.filter(
      (article) => article.category.toLowerCase() === category.toLowerCase()
    );
  }

  return filtered.slice(0, limit);
}
