import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform, View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { LibraryProvider } from "@/contexts/LibraryContext";
import { MiniPlayer } from "@/components/MiniPlayer";
import { trpc, trpcClient } from "@/lib/trpc";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const RootContainer = Platform.OS === 'web' ? View : GestureHandlerRootView;

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RootContainer style={styles.container}>
          <PlayerProvider>
            <LibraryProvider>
              <RootLayoutNav />
              <MiniPlayer />
            </LibraryProvider>
          </PlayerProvider>
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