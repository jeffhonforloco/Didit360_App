import "./polyfills";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform, View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { LibraryProvider } from "@/contexts/LibraryContext";
import { UserProvider } from "@/contexts/UserContext";
import { SearchContext } from "@/contexts/SearchContext";
import { MixMindProvider } from "@/contexts/MixMindContext";
import { SecurityProvider } from "@/contexts/SecurityContext";
import { UXProvider } from "@/contexts/UXContext";
import { MiniPlayer } from "@/components/MiniPlayer";
import { trpc, trpcClient } from "@/lib/trpc";
import ErrorBoundary from "@/components/ErrorBoundary";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

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
      <Stack.Screen name="ux-settings" options={{ title: "UX Settings" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const pathname = usePathname();
  useEffect(() => {
    (globalThis as any).__CURRENT_ROUTE = pathname;
  }, [pathname]);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const RootContainer = Platform.OS === 'web' ? View : GestureHandlerRootView;

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RootContainer style={styles.container}>
          <ErrorBoundary>
            <UserProvider>
              <SecurityProvider>
                <UXProvider>
                  <SearchContext>
                    <MixMindProvider>
                      <PlayerProvider>
                        <LibraryProvider>
                          <RootLayoutNav />
                          <MiniPlayer />
                        </LibraryProvider>
                      </PlayerProvider>
                    </MixMindProvider>
                  </SearchContext>
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
});