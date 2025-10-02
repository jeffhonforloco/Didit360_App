import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { PageSEO } from '@/components/SEOHead';
import { useAIBotDetection } from '@/hooks/useSEO';
import { trpc } from '@/lib/trpc';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SEOTestScreen() {
  useAIBotDetection();
  const insets = useSafeAreaInsets();
  const [userAgent, setUserAgent] = useState<string>('');
  
  const botDetection = trpc.seo.detectBot.useQuery(
    { userAgent },
    { enabled: !!userAgent }
  );

  useEffect(() => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
      setUserAgent(navigator.userAgent);
    }
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <PageSEO
        title="SEO Test - Didit360"
        description="Testing SEO implementation with meta tags, structured data, and AI bot detection"
        type="article"
        keywords={['SEO', 'testing', 'music streaming', 'Didit360']}
      />
      
      <Stack.Screen 
        options={{ 
          title: 'SEO Test',
          headerStyle: { backgroundColor: '#0B0A14' },
          headerTintColor: '#FFFFFF',
        }} 
      />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.title}>SEO Implementation Test</Text>
          <Text style={styles.description}>
            This page demonstrates the comprehensive SEO implementation including:
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ Features Implemented</Text>
          
          <View style={styles.feature}>
            <Text style={styles.featureTitle}>Meta Tags</Text>
            <Text style={styles.featureText}>
              • Title, description, keywords{'\n'}
              • Open Graph (Facebook, LinkedIn){'\n'}
              • Twitter Cards{'\n'}
              • Canonical URLs
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureTitle}>Structured Data (Schema.org)</Text>
            <Text style={styles.featureText}>
              • WebSite schema{'\n'}
              • Organization schema{'\n'}
              • WebApplication schema{'\n'}
              • MusicRecording, MusicAlbum, MusicPlaylist{'\n'}
              • Breadcrumb navigation
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureTitle}>AI Search Detection</Text>
            <Text style={styles.featureText}>
              • GPTBot (OpenAI){'\n'}
              • Google-Extended (Bard/Gemini){'\n'}
              • ClaudeBot (Anthropic){'\n'}
              • PerplexityBot{'\n'}
              • Applebot-Extended (Apple Intelligence){'\n'}
              • And 10+ more AI crawlers
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureTitle}>Files Created</Text>
            <Text style={styles.featureText}>
              • /public/robots.txt{'\n'}
              • /public/sitemap.xml{'\n'}
              • /public/manifest.json{'\n'}
              • /public/.well-known/ai-plugin.json{'\n'}
              • /public/openapi.json{'\n'}
              • /app/+html.tsx (custom HTML wrapper)
            </Text>
          </View>
        </View>

        {Platform.OS === 'web' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🤖 Bot Detection</Text>
            
            <View style={styles.detectionBox}>
              <Text style={styles.detectionLabel}>User Agent:</Text>
              <Text style={styles.detectionValue}>{userAgent || 'Loading...'}</Text>
            </View>

            {botDetection.data && (
              <View style={styles.detectionBox}>
                <Text style={styles.detectionLabel}>AI Bot Detected:</Text>
                <Text style={[
                  styles.detectionValue,
                  botDetection.data.isAI ? styles.detected : styles.notDetected
                ]}>
                  {botDetection.data.isAI ? 'YES' : 'NO'}
                </Text>
                
                {botDetection.data.isAI && (
                  <>
                    <Text style={styles.detectionLabel}>Bot Name:</Text>
                    <Text style={styles.detectionValue}>{botDetection.data.bot}</Text>
                    
                    <Text style={styles.detectionLabel}>Type:</Text>
                    <Text style={styles.detectionValue}>{botDetection.data.type}</Text>
                  </>
                )}
              </View>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 SGE Optimization</Text>
          <Text style={styles.featureText}>
            Search Generative Experience (SGE) optimizations include:{'\n\n'}
            • Rich structured data for AI understanding{'\n'}
            • Semantic HTML markup{'\n'}
            • Clear content hierarchy{'\n'}
            • AI-friendly metadata{'\n'}
            • OpenAPI specification for AI plugins
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 Testing</Text>
          <Text style={styles.featureText}>
            Test your SEO implementation:{'\n\n'}
            • Google Rich Results Test{'\n'}
            • Facebook Sharing Debugger{'\n'}
            • Twitter Card Validator{'\n'}
            • LinkedIn Post Inspector{'\n'}
            • Schema.org Validator
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            All SEO features are production-ready and optimized for search engines and AI crawlers.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0A14',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#B0B0B0',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#FF0080',
    marginBottom: 16,
  },
  feature: {
    backgroundColor: '#1A1825',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2838',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 22,
  },
  detectionBox: {
    backgroundColor: '#1A1825',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2838',
  },
  detectionLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#B0B0B0',
    marginBottom: 4,
    marginTop: 8,
  },
  detectionValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  },
  detected: {
    color: '#00FF88',
    fontWeight: '700' as const,
  },
  notDetected: {
    color: '#FF0080',
    fontWeight: '700' as const,
  },
  footer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#1A1825',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF0080',
  },
  footerText: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center' as const,
    lineHeight: 20,
  },
});
