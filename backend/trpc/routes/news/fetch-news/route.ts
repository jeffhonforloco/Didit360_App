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
    return getMockNews(input.limit, input.category);
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
      title: 'Breaking: New Music Streaming Technology Revolutionizes Industry',
      excerpt: 'A groundbreaking new technology promises to change how we experience music streaming forever. Industry experts are calling it the biggest innovation in decades.',
      content: 'A groundbreaking new technology promises to change how we experience music streaming forever. Industry experts are calling it the biggest innovation in decades. The technology uses advanced AI to create personalized listening experiences.',
      imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop',
      author: 'Sarah Johnson',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      category: 'Technology',
      url: 'https://www.didit360news.com/article/1',
      tags: ['Technology', 'Innovation'],
    },
    {
      id: '2',
      title: 'Top Artists Announce Surprise Collaboration Album',
      excerpt: 'Multiple Grammy-winning artists have announced a surprise collaboration that has fans buzzing with excitement across social media platforms.',
      content: 'Multiple Grammy-winning artists have announced a surprise collaboration that has fans buzzing with excitement across social media platforms. The album is set to drop next month.',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop',
      author: 'Michael Chen',
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      category: 'Music',
      url: 'https://www.didit360news.com/article/2',
      tags: ['Music', 'Collaboration'],
    },
    {
      id: '3',
      title: 'Music Festival Season: What to Expect This Year',
      excerpt: 'As festival season approaches, organizers reveal exciting lineups and new experiences for music lovers worldwide.',
      content: 'As festival season approaches, organizers reveal exciting lineups and new experiences for music lovers worldwide. From holographic performances to immersive VR experiences, this year promises to be unforgettable.',
      imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop',
      author: 'Emily Rodriguez',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      category: 'Events',
      url: 'https://www.didit360news.com/article/3',
      tags: ['Events', 'Festivals'],
    },
    {
      id: '4',
      title: 'Vinyl Sales Hit Record High in Digital Age',
      excerpt: 'Despite the dominance of streaming, vinyl record sales continue to surge, reaching levels not seen in decades.',
      content: 'Despite the dominance of streaming, vinyl record sales continue to surge, reaching levels not seen in decades. Collectors and audiophiles are driving the resurgence of physical media.',
      imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=800&auto=format&fit=crop',
      author: 'David Thompson',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      category: 'Industry',
      url: 'https://www.didit360news.com/article/4',
      tags: ['Industry', 'Vinyl'],
    },
    {
      id: '5',
      title: 'AI-Generated Music: The Future or a Threat?',
      excerpt: 'As AI-generated music becomes more sophisticated, the industry debates its impact on creativity and artist livelihoods.',
      content: 'As AI-generated music becomes more sophisticated, the industry debates its impact on creativity and artist livelihoods. Some see it as a tool, others as a threat to human artistry.',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
      author: 'Lisa Park',
      publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      category: 'Technology',
      url: 'https://www.didit360news.com/article/5',
      tags: ['Technology', 'AI'],
    },
    {
      id: '6',
      title: 'Behind the Scenes: How Hit Songs Are Made',
      excerpt: 'Exclusive look into the creative process of chart-topping producers and songwriters.',
      content: 'Exclusive look into the creative process of chart-topping producers and songwriters. From initial inspiration to final mastering, discover what it takes to create a hit.',
      imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop',
      author: 'James Wilson',
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      category: 'Production',
      url: 'https://www.didit360news.com/article/6',
      tags: ['Production', 'Behind the Scenes'],
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
