import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren, useMemo } from 'react';
import { defaultSEO } from '@/lib/seo';

export default function Root({ children }: PropsWithChildren) {
  // Use useMemo to prevent re-computation on every render
  const seo = useMemo(() => defaultSEO, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover, user-scalable=no" />
        
        {/* Essential SEO tags only - avoiding complex parsing during hydration */}
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="theme-color" content="#FF0080" />
        
        {/* Open Graph */}
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content={seo.type || 'website'} />
        <meta property="og:url" content={seo.url || ''} />
        {seo.image && <meta property="og:image" content={seo.image} />}
        {seo.siteName && <meta property="og:site_name" content={seo.siteName} />}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        {seo.image && <meta name="twitter:image" content={seo.image} />}
        
        {/* Basic links */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="canonical" href={seo.url || ''} />
        
        {/* Structured data - using suppressHydrationWarning for script */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: seo.siteName,
              url: seo.url,
              description: seo.description,
            }),
          }}
        />
        
        <ScrollViewStyleReset />
        
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} suppressHydrationWarning />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #0B0A14;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

#root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
`;
