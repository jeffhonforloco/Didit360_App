export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'music.song' | 'music.album' | 'music.playlist' | 'profile' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  audio?: string;
  video?: string;
  locale?: string;
  siteName?: string;
}

export const defaultSEO: SEOConfig = {
  title: 'Didit360 - Your Ultimate Music Streaming Experience',
  description: 'Stream millions of songs, discover new artists, create playlists, and enjoy personalized music recommendations with Didit360. Your music, your way.',
  keywords: [
    'music streaming',
    'online music',
    'music player',
    'playlists',
    'songs',
    'albums',
    'artists',
    'podcasts',
    'audiobooks',
    'AI DJ',
    'music discovery',
    'personalized music',
    'Didit360'
  ],
  image: 'https://rork.com/didit360-og.png',
  url: 'https://rork.com',
  type: 'website',
  locale: 'en_US',
  siteName: 'Didit360',
};

export function generateMetaTags(config: Partial<SEOConfig> = {}): string {
  const seo = { ...defaultSEO, ...config };
  
  const tags: string[] = [];
  
  tags.push(`<title>${escapeHtml(seo.title)}</title>`);
  tags.push(`<meta name="description" content="${escapeHtml(seo.description)}" />`);
  
  if (seo.keywords && seo.keywords.length > 0) {
    tags.push(`<meta name="keywords" content="${escapeHtml(seo.keywords.join(', '))}" />`);
  }
  
  tags.push(`<meta name="author" content="${escapeHtml(seo.author || 'Didit360')}" />`);
  tags.push(`<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`);
  tags.push(`<meta name="googlebot" content="index, follow" />`);
  tags.push(`<meta name="bingbot" content="index, follow" />`);
  
  tags.push(`<meta property="og:title" content="${escapeHtml(seo.title)}" />`);
  tags.push(`<meta property="og:description" content="${escapeHtml(seo.description)}" />`);
  tags.push(`<meta property="og:type" content="${seo.type}" />`);
  tags.push(`<meta property="og:url" content="${escapeHtml(seo.url || '')}" />`);
  tags.push(`<meta property="og:image" content="${escapeHtml(seo.image || '')}" />`);
  tags.push(`<meta property="og:image:width" content="1200" />`);
  tags.push(`<meta property="og:image:height" content="630" />`);
  tags.push(`<meta property="og:image:alt" content="${escapeHtml(seo.title)}" />`);
  tags.push(`<meta property="og:site_name" content="${escapeHtml(seo.siteName || 'Didit360')}" />`);
  tags.push(`<meta property="og:locale" content="${seo.locale}" />`);
  
  if (seo.audio) {
    tags.push(`<meta property="og:audio" content="${escapeHtml(seo.audio)}" />`);
    tags.push(`<meta property="og:audio:type" content="audio/mpeg" />`);
  }
  
  if (seo.video) {
    tags.push(`<meta property="og:video" content="${escapeHtml(seo.video)}" />`);
    tags.push(`<meta property="og:video:type" content="video/mp4" />`);
  }
  
  if (seo.publishedTime) {
    tags.push(`<meta property="article:published_time" content="${seo.publishedTime}" />`);
  }
  
  if (seo.modifiedTime) {
    tags.push(`<meta property="article:modified_time" content="${seo.modifiedTime}" />`);
  }
  
  if (seo.section) {
    tags.push(`<meta property="article:section" content="${escapeHtml(seo.section)}" />`);
  }
  
  if (seo.tags && seo.tags.length > 0) {
    seo.tags.forEach(tag => {
      tags.push(`<meta property="article:tag" content="${escapeHtml(tag)}" />`);
    });
  }
  
  tags.push(`<meta name="twitter:card" content="summary_large_image" />`);
  tags.push(`<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`);
  tags.push(`<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`);
  tags.push(`<meta name="twitter:image" content="${escapeHtml(seo.image || '')}" />`);
  tags.push(`<meta name="twitter:image:alt" content="${escapeHtml(seo.title)}" />`);
  tags.push(`<meta name="twitter:site" content="@didit360" />`);
  tags.push(`<meta name="twitter:creator" content="@didit360" />`);
  
  if (seo.audio) {
    tags.push(`<meta name="twitter:player" content="${escapeHtml(seo.audio)}" />`);
    tags.push(`<meta name="twitter:player:width" content="480" />`);
    tags.push(`<meta name="twitter:player:height" content="480" />`);
  }
  
  tags.push(`<link rel="canonical" href="${escapeHtml(seo.url || '')}" />`);
  tags.push(`<link rel="icon" type="image/png" href="/favicon.png" />`);
  tags.push(`<link rel="apple-touch-icon" href="/icon.png" />`);
  
  tags.push(`<meta name="theme-color" content="#FF0080" />`);
  tags.push(`<meta name="apple-mobile-web-app-capable" content="yes" />`);
  tags.push(`<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />`);
  tags.push(`<meta name="apple-mobile-web-app-title" content="Didit360" />`);
  tags.push(`<meta name="application-name" content="Didit360" />`);
  tags.push(`<meta name="mobile-web-app-capable" content="yes" />`);
  
  return tags.join('\n    ');
}

export function generateStructuredData(config: Partial<SEOConfig> = {}): string {
  const seo = { ...defaultSEO, ...config };
  
  const structuredData: any = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${seo.url}/#website`,
        'url': seo.url,
        'name': seo.siteName,
        'description': seo.description,
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': `${seo.url}/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        },
        'inLanguage': 'en-US'
      },
      {
        '@type': 'Organization',
        '@id': `${seo.url}/#organization`,
        'name': seo.siteName,
        'url': seo.url,
        'logo': {
          '@type': 'ImageObject',
          'url': seo.image,
          'width': 512,
          'height': 512
        },
        'sameAs': [
          'https://twitter.com/didit360',
          'https://facebook.com/didit360',
          'https://instagram.com/didit360',
          'https://youtube.com/didit360'
        ]
      },
      {
        '@type': 'WebApplication',
        'name': seo.siteName,
        'url': seo.url,
        'description': seo.description,
        'applicationCategory': 'MultimediaApplication',
        'operatingSystem': 'iOS, Android, Web',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.8',
          'ratingCount': '15000',
          'bestRating': '5',
          'worstRating': '1'
        }
      }
    ]
  };
  
  if (seo.type === 'music.song') {
    structuredData['@graph'].push({
      '@type': 'MusicRecording',
      'name': seo.title,
      'description': seo.description,
      'url': seo.url,
      'image': seo.image,
      'inLanguage': 'en-US'
    });
  } else if (seo.type === 'music.album') {
    structuredData['@graph'].push({
      '@type': 'MusicAlbum',
      'name': seo.title,
      'description': seo.description,
      'url': seo.url,
      'image': seo.image,
      'inLanguage': 'en-US'
    });
  } else if (seo.type === 'music.playlist') {
    structuredData['@graph'].push({
      '@type': 'MusicPlaylist',
      'name': seo.title,
      'description': seo.description,
      'url': seo.url,
      'image': seo.image,
      'inLanguage': 'en-US'
    });
  } else if (seo.type === 'profile') {
    structuredData['@graph'].push({
      '@type': 'Person',
      'name': seo.title,
      'description': seo.description,
      'url': seo.url,
      'image': seo.image
    });
  } else if (seo.type === 'article') {
    structuredData['@graph'].push({
      '@type': 'Article',
      'headline': seo.title,
      'description': seo.description,
      'url': seo.url,
      'image': seo.image,
      'datePublished': seo.publishedTime,
      'dateModified': seo.modifiedTime,
      'author': {
        '@type': 'Organization',
        'name': seo.siteName
      },
      'publisher': {
        '@type': 'Organization',
        'name': seo.siteName,
        'logo': {
          '@type': 'ImageObject',
          'url': seo.image
        }
      }
    });
  }
  
  return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`;
}

export function generateBreadcrumbStructuredData(breadcrumbs: { name: string; url: string }[]): string {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': crumb.name,
      'item': crumb.url
    }))
  };
  
  return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`;
}

export function detectAISearchBot(userAgent: string): {
  isAI: boolean;
  bot?: string;
  type?: 'search' | 'crawler' | 'assistant';
} {
  const aiPatterns = [
    { pattern: /GPTBot/i, bot: 'OpenAI GPTBot', type: 'search' as const },
    { pattern: /ChatGPT-User/i, bot: 'ChatGPT', type: 'assistant' as const },
    { pattern: /Google-Extended/i, bot: 'Google Bard/Gemini', type: 'search' as const },
    { pattern: /anthropic-ai/i, bot: 'Anthropic Claude', type: 'assistant' as const },
    { pattern: /ClaudeBot/i, bot: 'Claude Bot', type: 'crawler' as const },
    { pattern: /cohere-ai/i, bot: 'Cohere', type: 'search' as const },
    { pattern: /PerplexityBot/i, bot: 'Perplexity', type: 'search' as const },
    { pattern: /YouBot/i, bot: 'You.com', type: 'search' as const },
    { pattern: /Applebot-Extended/i, bot: 'Apple Intelligence', type: 'search' as const },
    { pattern: /FacebookBot/i, bot: 'Meta AI', type: 'crawler' as const },
    { pattern: /Diffbot/i, bot: 'Diffbot', type: 'crawler' as const },
    { pattern: /Bytespider/i, bot: 'ByteDance', type: 'crawler' as const },
    { pattern: /CCBot/i, bot: 'Common Crawl', type: 'crawler' as const },
    { pattern: /omgili/i, bot: 'Omgili', type: 'crawler' as const },
    { pattern: /PetalBot/i, bot: 'Huawei PetalBot', type: 'crawler' as const },
  ];
  
  for (const { pattern, bot, type } of aiPatterns) {
    if (pattern.test(userAgent)) {
      return { isAI: true, bot, type };
    }
  }
  
  return { isAI: false };
}

export function generateAISearchMetadata(): string {
  const tags: string[] = [];
  
  tags.push(`<meta name="ai-content-declaration" content="This is a music streaming platform. Content is user-generated and licensed." />`);
  tags.push(`<meta name="ai:purpose" content="Music streaming, discovery, and personalized recommendations" />`);
  tags.push(`<meta name="ai:category" content="Entertainment, Music, Audio" />`);
  tags.push(`<meta name="ai:features" content="Music streaming, Playlists, AI DJ, Podcasts, Audiobooks, Live performances" />`);
  
  return tags.join('\n    ');
}

export function generateRobotsTxt(options: {
  allowAI?: boolean;
  allowCrawlers?: boolean;
  sitemapUrl?: string;
} = {}): string {
  const { allowAI = true, allowCrawlers = true, sitemapUrl = 'https://rork.com/sitemap.xml' } = options;
  
  const lines: string[] = [];
  
  lines.push('# Didit360 Robots.txt');
  lines.push('');
  
  if (allowCrawlers) {
    lines.push('User-agent: *');
    lines.push('Allow: /');
    lines.push('Disallow: /admin/');
    lines.push('Disallow: /api/');
    lines.push('Disallow: /debug-backend');
    lines.push('');
  }
  
  if (allowAI) {
    lines.push('# AI Search Bots');
    lines.push('User-agent: GPTBot');
    lines.push('Allow: /');
    lines.push('');
    lines.push('User-agent: ChatGPT-User');
    lines.push('Allow: /');
    lines.push('');
    lines.push('User-agent: Google-Extended');
    lines.push('Allow: /');
    lines.push('');
    lines.push('User-agent: ClaudeBot');
    lines.push('Allow: /');
    lines.push('');
    lines.push('User-agent: PerplexityBot');
    lines.push('Allow: /');
    lines.push('');
    lines.push('User-agent: Applebot-Extended');
    lines.push('Allow: /');
    lines.push('');
  } else {
    lines.push('# Block AI Search Bots');
    lines.push('User-agent: GPTBot');
    lines.push('Disallow: /');
    lines.push('');
    lines.push('User-agent: ChatGPT-User');
    lines.push('Disallow: /');
    lines.push('');
    lines.push('User-agent: Google-Extended');
    lines.push('Disallow: /');
    lines.push('');
    lines.push('User-agent: ClaudeBot');
    lines.push('Disallow: /');
    lines.push('');
    lines.push('User-agent: PerplexityBot');
    lines.push('Disallow: /');
    lines.push('');
    lines.push('User-agent: Applebot-Extended');
    lines.push('Disallow: /');
    lines.push('');
  }
  
  lines.push('# Crawl-delay');
  lines.push('Crawl-delay: 1');
  lines.push('');
  
  if (sitemapUrl) {
    lines.push(`Sitemap: ${sitemapUrl}`);
  }
  
  return lines.join('\n');
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m] || m);
}
