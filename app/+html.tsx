import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';
import { generateMetaTags, generateStructuredData, generateAISearchMetadata, defaultSEO } from '@/lib/seo';

// Parse HTML string and convert to React elements to avoid hydration issues
function parseHTMLToElements(htmlString: string): React.ReactElement[] {
  const elements: React.ReactElement[] = [];
  const lines = htmlString.split('\n').filter(line => line.trim());
  let keyCounter = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Parse title tag
    if (trimmed.startsWith('<title>')) {
      const titleMatch = trimmed.match(/<title>(.*?)<\/title>/);
      if (titleMatch) {
        elements.push(<title key={`title-${keyCounter++}`}>{titleMatch[1]}</title>);
      }
      continue;
    }

    // Parse meta tags
    if (trimmed.startsWith('<meta')) {
      const attrs: Record<string, string> = {};
      const nameMatch = trimmed.match(/name=["']([^"']+)["']/);
      const propertyMatch = trimmed.match(/property=["']([^"']+)["']/);
      const contentMatch = trimmed.match(/content=["']([^"']+)["']/);
      const charsetMatch = trimmed.match(/charset=["']([^"']+)["']/);
      const httpEquivMatch = trimmed.match(/http-equiv=["']([^"']+)["']/);

      if (charsetMatch) {
        elements.push(<meta key={`meta-${keyCounter++}`} charSet={charsetMatch[1]} />);
      } else if (httpEquivMatch && contentMatch) {
        elements.push(
          <meta key={`meta-${keyCounter++}`} httpEquiv={httpEquivMatch[1]} content={contentMatch[1]} />
        );
      } else if (nameMatch && contentMatch) {
        elements.push(
          <meta key={`meta-${keyCounter++}`} name={nameMatch[1]} content={contentMatch[1]} />
        );
      } else if (propertyMatch && contentMatch) {
        elements.push(
          <meta key={`meta-${keyCounter++}`} property={propertyMatch[1]} content={contentMatch[1]} />
        );
      }
      continue;
    }

    // Parse link tags
    if (trimmed.startsWith('<link')) {
      const relMatch = trimmed.match(/rel=["']([^"']+)["']/);
      const hrefMatch = trimmed.match(/href=["']([^"']+)["']/);
      const typeMatch = trimmed.match(/type=["']([^"']+)["']/);
      
      if (relMatch && hrefMatch) {
        const linkProps: any = { key: `link-${keyCounter++}`, rel: relMatch[1], href: hrefMatch[1] };
        if (typeMatch) linkProps.type = typeMatch[1];
        elements.push(<link {...linkProps} />);
      }
      continue;
    }

    // Parse script tags (for structured data)
    if (trimmed.startsWith('<script')) {
      const scriptMatch = trimmed.match(/<script[^>]*>(.*?)<\/script>/s);
      const typeMatch = trimmed.match(/type=["']([^"']+)["']/);
      if (scriptMatch) {
        elements.push(
          <script
            key={`script-${keyCounter++}`}
            type={typeMatch ? typeMatch[1] : 'application/ld+json'}
            dangerouslySetInnerHTML={{ __html: scriptMatch[1] }}
            suppressHydrationWarning
          />
        );
      }
      continue;
    }
  }

  return elements;
}

export default function Root({ children }: PropsWithChildren) {
  const metaTags = generateMetaTags(defaultSEO);
  const structuredData = generateStructuredData(defaultSEO);
  const aiMetadata = generateAISearchMetadata();

  const parsedMetaTags = parseHTMLToElements(metaTags);
  const parsedAIMetadata = parseHTMLToElements(aiMetadata);
  const parsedStructuredData = parseHTMLToElements(structuredData);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover, user-scalable=no" />
        
        {parsedMetaTags}
        {parsedAIMetadata}
        {parsedStructuredData}
        
        <link rel="manifest" href="/manifest.json" />
        
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
