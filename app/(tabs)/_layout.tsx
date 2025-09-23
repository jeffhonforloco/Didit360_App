import { Tabs } from "expo-router";
import { Home, Search, Library, Sparkles, Newspaper, User } from "lucide-react-native";
import React, { useMemo } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePlayer } from "@/contexts/PlayerContext";
import { useUser } from "@/contexts/UserContext";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { currentTrack } = usePlayer();
  const { settings, profile } = useUser();

  const tabBarPadding = currentTrack ? 60 : 0;
  const activeTint = settings?.accentColor ?? "#FF0080";

  const tabBarStyle = useMemo(() => ({
    backgroundColor: "#0A0A0A",
    borderTopColor: "#1A1A1A",
    borderTopWidth: 1,
    paddingBottom: Platform.OS === "ios" ? insets.bottom : 10,
    paddingTop: 10,
    height: Platform.OS === "ios" ? 80 + insets.bottom + tabBarPadding : 60 + tabBarPadding,
    position: "absolute" as const,
    display: profile ? "flex" : "none",
  }), [insets.bottom, tabBarPadding, profile]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: "#666",
        headerShown: false,
        tabBarStyle,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
          href: profile ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => <Library size={24} color={color} />,
          href: profile ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: "News",
          tabBarIcon: ({ color }) => <Newspaper size={24} color={color} />,
          href: profile ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="ai-dj"
        options={{
          title: "MixMind",
          tabBarIcon: ({ color }) => <Sparkles size={24} color={color} />,
          href: profile ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
          href: profile ? undefined : null,
        }}
      />
    </Tabs>
  );
}