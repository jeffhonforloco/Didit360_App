import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';
import { generateMetaTags, generateStructuredData, generateAISearchMetadata, defaultSEO } from '@/lib/seo';

export default function Root({ children }: PropsWithChildren) {
  const metaTags = generateMetaTags(defaultSEO);
  const structuredData = generateStructuredData(defaultSEO);
  const aiMetadata = generateAISearchMetadata();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover, user-scalable=no" />
        
        {metaTags.split('\n').map((tag, i) => (
          <div key={i} dangerouslySetInnerHTML={{ __html: tag }} />
        ))}
        
        {aiMetadata.split('\n').map((tag, i) => (
          <div key={`ai-${i}`} dangerouslySetInnerHTML={{ __html: tag }} />
        ))}
        
        <div dangerouslySetInnerHTML={{ __html: structuredData }} />
        
        <link rel="manifest" href="/manifest.json" />
        
        <ScrollViewStyleReset />
        
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
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
