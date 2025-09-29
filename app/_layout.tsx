import "./polyfills";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform, View, StyleSheet, Image } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { LibraryProvider } from "@/contexts/LibraryContext";
import { UserProvider } from "@/contexts/UserContext";
import { SearchContext as SearchProvider } from "@/contexts/SearchContext";
import { MixMindProvider } from "@/contexts/MixMindContext";
import { SecurityProvider } from "@/contexts/SecurityContext";
import { UXProvider } from "@/contexts/UXContext";
import { SecretsProvider } from "@/contexts/SecretsContext";
import { DJInstinctProvider } from "@/contexts/DJInstinctContext";
import { MiniPlayer } from "@/components/MiniPlayer";
import { ToastProvider, ToastViewport } from "@/components/ui/Toast";
import { trpc, trpcClient } from "@/lib/trpc";
import ErrorBoundary from "@/components/ErrorBoundary";
import { OfflineProvider } from "@/contexts/OfflineContext";
import { logEvent, logPerf, genId } from "@/lib/logger";

SplashScreen.preventAutoHideAsync();

// SafeImage guard to prevent empty URI errors
function installImageGuard() {
  if (Platform.OS === 'web') return; // Skip on web as it handles empty URIs differently
  
  // @ts-ignore
  const originalSetNativeProps = Image.prototype.setNativeProps;
  
  // @ts-ignore
  Image.prototype.setNativeProps = function (props: any) {
    try {
      // @ts-ignore
      const source = this.props?.source;
      const uri = (source && typeof source === 'object' && 'uri' in source) ? source.uri : undefined;
      
      if (typeof uri === 'string' && uri.trim() === '') {
        console.warn(
          '[SafeImageGuard] Empty source.uri detected on <Image />. ' +
          'Use SafeImage component instead or provide a valid URI.'
        );
        // Replace empty URI with a safe fallback
        if (props.source && typeof props.source === 'object' && 'uri' in props.source) {
          props.source = { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' };
        }
      }
    } catch (error) {
      console.warn('[SafeImageGuard] Error in image guard:', error);
    }
    
    // @ts-ignore
    return originalSetNativeProps?.call(this, props);
  };
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const message = (error as Error)?.message ?? String(error);
      logEvent('error', 'react-query:query_error', { key: query.queryKey as unknown as string[], message });
      try {
        const toast = (globalThis as any).__TOAST as { show?: (t: { type: 'error' | 'info' | 'success' | 'warning'; title: string; message?: string }) => void } | undefined;
        toast?.show?.({ type: 'error', title: 'Request failed', message });
      } catch {}
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      const message = (error as Error)?.message ?? String(error);
      logEvent('error', 'react-query:mutation_error', { key: mutation.options.mutationKey as unknown as string[] | undefined, message });
      try {
        const toast = (globalThis as any).__TOAST as { show?: (t: { type: 'error' | 'info' | 'success' | 'warning'; title: string; message?: string }) => void } | undefined;
        toast?.show?.({ type: 'error', title: 'Action failed', message });
      } catch {}
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="account" options={{ title: "Account" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="auth" options={{ presentation: "modal", headerShown: false, animation: "slide_from_bottom" }} />
      <Stack.Screen 
        name="player" 
        options={{ 
          presentation: "modal",
          headerShown: false,
          animation: "slide_from_bottom"
        }} 
      />
      <Stack.Screen 
        name="ai-dj-setup" 
        options={{ 
          presentation: "modal",
          headerShown: false,
          animation: "slide_from_bottom"
        }} 
      />
      <Stack.Screen 
        name="lyrics" 
        options={{ 
          presentation: "modal",
          headerShown: false,
          animation: "fade"
        }} 
      />
      <Stack.Screen name="security-settings" options={{ title: "Security Settings" }} />
      <Stack.Screen name="ux-settings" options={{ title: "User Experience" }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
      <Stack.Screen 
        name="dj-instinct" 
        options={{ 
          presentation: "modal",
          headerShown: false,
          animation: "slide_from_bottom"
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  const pathname = usePathname();
  const [isReady, setIsReady] = React.useState(false);
  
  // Install image guard on app start
  useEffect(() => {
    if (__DEV__) {
      installImageGuard();
    }
  }, []);
  
  // Initialize app
  useEffect(() => {
    const initApp = async () => {
      try {
        console.log('[RootLayout] Initializing app...');
        // Add a small delay to ensure everything is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsReady(true);
        console.log('[RootLayout] App ready');
      } catch (error) {
        console.error('[RootLayout] Init error:', error);
        setIsReady(true); // Still show the app even if there's an error
      }
    };
    
    initApp();
  }, []);
  
  useEffect(() => {
    try {
      (globalThis as any).__CURRENT_ROUTE = pathname;
    } catch (e) {
      console.log('[RootLayout] pathname error', e);
    }
  }, [pathname]);

  useEffect(() => {
    try {
      const sessionId = genId('sess');
      const traceId = genId('trace');
      (globalThis as any).__OBS = { sessionId, traceId };
    } catch (e) {
      console.log('[RootLayout] session init error', e);
    }
  }, []);

  useEffect(() => {
    try {
      const t0 = Date.now();
      SplashScreen.hideAsync().finally(() => {
        try {
          const ms = Date.now() - t0;
          logPerf('splash_hide', ms);
        } catch (e) {
          console.log('[RootLayout] splash perf error', e);
        }
      });
    } catch (e) {
      console.log('[RootLayout] splash hide error', e);
    }
  }, []);

  const RootContainer = Platform.OS === 'web' ? View : GestureHandlerRootView;

  // Show loading screen while initializing
  if (!isReady) {
    return (
      <View style={[styles.container, styles.loading]}>
        <View style={styles.loadingContent}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.loadingIcon}
            resizeMode="contain"
          />
          <View style={styles.loadingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RootContainer style={styles.container}>
          <ErrorBoundary>
            <UserProvider>
              <SecurityProvider>
                <UXProvider>
                  <SearchProvider>
                    <MixMindProvider>
                      <OfflineProvider>
                        <PlayerProvider>
                          <DJInstinctProvider>
                            <LibraryProvider>
                              <ToastProvider>
                                <SecretsProvider>
                                  <RootLayoutNav />
                                  <MiniPlayer />
                                  <ToastViewport />
                                </SecretsProvider>
                              </ToastProvider>
                            </LibraryProvider>
                          </DJInstinctProvider>
                        </PlayerProvider>
                      </OfflineProvider>
                    </MixMindProvider>
                  </SearchProvider>
                </UXProvider>
              </SecurityProvider>
            </UserProvider>
          </ErrorBoundary>
        </RootContainer>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    backgroundColor: '#0B0A14',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingIcon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0080',
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
});