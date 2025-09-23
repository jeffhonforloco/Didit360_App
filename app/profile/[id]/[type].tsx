import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Search,
  MoreHorizontal,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";

type TabType = 'Followers' | 'Following';

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  followers: number;
  isFollowing: boolean;
}

export default function FollowersScreen() {
  const { id, type } = useLocalSearchParams<{ id?: string; type?: string }>();
  const [activeTab, setActiveTab] = useState<TabType>((type as TabType) || 'Followers');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock users data
  const followers: User[] = [
    {
      id: '1',
      name: 'GeneralBase',
      username: '@generalbase',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      followers: 8829,
      isFollowing: false,
    },
    {
      id: '2',
      name: 'EssenceVital',
      username: '@essencevital',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
      followers: 4152,
      isFollowing: false,
    },
    {
      id: '3',
      name: 'MafiaContent',
      username: '@mafiacontent',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      followers: 4600,
      isFollowing: true,
    },
    {
      id: '4',
      name: 'ReportDown',
      username: '@reportdown',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      followers: 9359,
      isFollowing: false,
    },
    {
      id: '5',
      name: 'CrawlerSporty',
      username: '@crawlersporty',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      followers: 5560,
      isFollowing: true,
    },
    {
      id: '6',
      name: 'CandyWisdom',
      username: '@candywisdom',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      followers: 9462,
      isFollowing: false,
    },
    {
      id: '7',
      name: 'AmericaWarm',
      username: '@americawarm',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      followers: 1148,
      isFollowing: false,
    },
  ];

  const following: User[] = followers.slice(0, 5);

  const getCurrentData = () => {
    return activeTab === 'Followers' ? followers : following;
  };

  const filteredUsers = getCurrentData().filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFollow = (userId: string) => {
    // In real app, this would make API call
    console.log('Toggle follow for user:', userId);
  };

  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity 
      style={styles.userItem}
      onPress={() => router.push(`/profile/${item.id}`)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.userFollowers} numberOfLines={1}>
          {item.followers.toLocaleString()} Followers
        </Text>
      </View>
      <TouchableOpacity 
        style={[
          styles.followButton, 
          item.isFollowing && styles.followingButton
        ]}
        onPress={() => toggleFollow(item.id)}
      >
        <Text style={[
          styles.followButtonText,
          item.isFollowing && styles.followingButtonText
        ]}>
          {item.isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Search size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MoreHorizontal size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Followers' && styles.activeTab]}
            onPress={() => setActiveTab('Followers')}
          >
            <Text style={[styles.tabText, activeTab === 'Followers' && styles.activeTabText]}>
              Followers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Following' && styles.activeTab]}
            onPress={() => setActiveTab('Following')}
          >
            <Text style={[styles.tabText, activeTab === 'Following' && styles.activeTabText]}>
              Following
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          style={styles.usersList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.usersContent}
        />
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
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#E91E63",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
  },
  activeTabText: {
    color: "#E91E63",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFF",
  },
  usersList: {
    flex: 1,
  },
  usersContent: {
    paddingBottom: 120,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  userFollowers: {
    fontSize: 14,
    color: "#999",
  },
  followButton: {
    backgroundColor: "#E91E63",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followingButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E91E63",
  },
  followButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  followingButtonText: {
    color: "#E91E63",
  },
});