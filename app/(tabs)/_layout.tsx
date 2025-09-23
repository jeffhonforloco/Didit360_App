import { Tabs } from "expo-router";
import { Home, Search, Library, Sparkles, Newspaper } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePlayer } from "@/contexts/PlayerContext";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { currentTrack } = usePlayer();
  
  const tabBarPadding = currentTrack ? 60 : 0;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF0080",
        tabBarInactiveTintColor: "#666",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0A0A0A",
          borderTopColor: "#1A1A1A",
          borderTopWidth: 1,
          paddingBottom: Platform.OS === "ios" ? insets.bottom : 10,
          paddingTop: 10,
          height: Platform.OS === "ios" ? 80 + insets.bottom + tabBarPadding : 60 + tabBarPadding,
          position: "absolute",
        },
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
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => <Library size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: "News",
          tabBarIcon: ({ color }) => <Newspaper size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ai-dj"
        options={{
          title: "AI DJ",
          tabBarIcon: ({ color }) => <Sparkles size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}