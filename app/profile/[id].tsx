import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  MoreHorizontal,
  Search,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { allTracks } from "@/data/mockData";

type TabType = 'Playlists' | 'Albums' | 'Songs';

export default function ProfileScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('Playlists');
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock profile data
  const profile = {
    id: id || '1',
    name: 'Jenny Wilson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
    followers: 9489,
    following: 2475,
    playlists: [
      {
        id: '1',
        title: 'Ryan Jones - Pain',
        artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
      },
      {
        id: '2', 
        title: 'Anja Scarmach - Shades of Love',
        artwork: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200&h=200&fit=crop',
      },
    ]
  };

  const tabs: TabType[] = ['Playlists', 'Albums', 'Songs'];

  const renderPlaylist = ({ item }: { item: typeof profile.playlists[0] }) => (
    <TouchableOpacity 
      style={styles.playlistCard}
      onPress={() => router.push(`/playlist/${item.id}`)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.artwork }} style={styles.playlistArtwork} />
      <Text style={styles.playlistTitle} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Playlists':
        return (
          <View style={styles.playlistsGrid}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Playlists</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={profile.playlists}
              renderItem={renderPlaylist}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.playlistRow}
              scrollEnabled={false}
              contentContainerStyle={styles.playlistsList}
            />
          </View>
        );
      case 'Albums':
        return (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No albums yet</Text>
          </View>
        );
      case 'Songs':
        return (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No songs yet</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/search')}>
            <Search size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MoreHorizontal size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            <Text style={styles.name}>{profile.name}</Text>
            
            <TouchableOpacity 
              style={[styles.followButton, isFollowing && styles.followingButton]}
              onPress={() => setIsFollowing(!isFollowing)}
            >
              <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>

            <View style={styles.stats}>
              <TouchableOpacity 
                style={styles.statItem}
                onPress={() => router.push(`/profile/${id}/followers`)}
              >
                <Text style={styles.statNumber}>{profile.followers.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.statItem}
                onPress={() => router.push(`/profile/${id}/following`)}
              >
                <Text style={styles.statNumber}>{profile.following.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </TouchableOpacity>
            </View>
          </View>

          {renderTabContent()}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  profileHeader: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 16,
  },
  followButton: {
    backgroundColor: "#E91E63",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 24,
  },
  followingButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E91E63",
  },
  followButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  followingButtonText: {
    color: "#E91E63",
  },
  stats: {
    flexDirection: "row",
    gap: 40,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#999",
  },
  playlistsGrid: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  seeAllText: {
    fontSize: 14,
    color: "#E91E63",
    fontWeight: "600",
  },
  playlistsList: {
    gap: 16,
  },
  playlistRow: {
    justifyContent: "space-between",
  },
  playlistCard: {
    width: "48%",
    marginBottom: 16,
  },
  playlistArtwork: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 8,
  },
  playlistTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    textAlign: "left",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});