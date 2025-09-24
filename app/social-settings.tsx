import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Platform } from 'react-native';
import { ArrowLeft, Users, Share2, MessageCircle, Heart } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';

export default function SocialSettings() {
  const insets = useSafeAreaInsets();
  const { settings, updateSetting } = useUser();
  
  const [socialSession, setSocialSession] = useState(false);
  const [listeningActivity, setListeningActivity] = useState(true);
  const [shareToStories, setShareToStories] = useState(true);
  const [friendRecommendations, setFriendRecommendations] = useState(true);
  const [collaborativePlaylists, setCollaborativePlaylists] = useState(true);
  const [showRecentlyPlayed, setShowRecentlyPlayed] = useState(true);
  
  const showFeatureAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      console.log(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Social Settings</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Social Features</Text>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Users size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Social Session</Text>
              <Text style={styles.settingsItemSubtext}>Let friends see what you&apos;re listening to and add to queue</Text>
            </View>
          </View>
          <Switch
            value={socialSession}
            onValueChange={setSocialSession}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={socialSession ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <MessageCircle size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Listening Activity</Text>
              <Text style={styles.settingsItemSubtext}>Friends can see what you&apos;re listening to</Text>
            </View>
          </View>
          <Switch
            value={listeningActivity}
            onValueChange={setListeningActivity}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={listeningActivity ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Share2 size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Share to Stories</Text>
              <Text style={styles.settingsItemSubtext}>Allow sharing music to social media stories</Text>
            </View>
          </View>
          <Switch
            value={shareToStories}
            onValueChange={setShareToStories}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={shareToStories ? '#FFF' : '#FFF'}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Discovery & Recommendations</Text>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Heart size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Friend Recommendations</Text>
              <Text style={styles.settingsItemSubtext}>Get music recommendations from friends</Text>
            </View>
          </View>
          <Switch
            value={friendRecommendations}
            onValueChange={setFriendRecommendations}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={friendRecommendations ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Users size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Collaborative Playlists</Text>
              <Text style={styles.settingsItemSubtext}>Allow friends to add songs to your playlists</Text>
            </View>
          </View>
          <Switch
            value={collaborativePlaylists}
            onValueChange={setCollaborativePlaylists}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={collaborativePlaylists ? '#FFF' : '#FFF'}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Profile Visibility</Text>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <MessageCircle size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Recently Played Artists</Text>
              <Text style={styles.settingsItemSubtext}>Show recently played artists on your profile</Text>
            </View>
          </View>
          <Switch
            value={showRecentlyPlayed}
            onValueChange={setShowRecentlyPlayed}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={showRecentlyPlayed ? '#FFF' : '#FFF'}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Social Connections</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => showFeatureAlert('Find Friends', 'Connect with friends from your contacts or social media.')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Find Friends</Text>
            <Text style={styles.settingsItemSubtext}>Connect with friends from contacts</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => showFeatureAlert('Followers', 'Manage who can follow you and see your activity.')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Manage Followers</Text>
            <Text style={styles.settingsItemSubtext}>Control who can follow you</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => showFeatureAlert('Social Media', 'Connect your social media accounts for easy sharing.')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Connected Accounts</Text>
            <Text style={styles.settingsItemSubtext}>Link social media accounts</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Social Features</Text>
          <Text style={styles.infoText}>
            Connect with friends to discover new music, share your favorites, and create collaborative playlists together.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  settingsItemWithSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  settingsItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    marginRight: 12,
  },
  itemText: {
    flex: 1,
  },
  settingsItemText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
  settingsItemSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
    marginTop: 32,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  infoTitle: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#CCC',
    lineHeight: 20,
  },
});