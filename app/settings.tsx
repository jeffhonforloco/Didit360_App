import React, { useMemo, useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Switch, Alert, Platform } from "react-native";
import { useUser, useSignOut } from "@/contexts/UserContext";
import { ChevronRight, ArrowLeft, Settings as SettingsIcon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";


export default function SettingsScreen() {
  const { profile, settings, updateSetting, isLoading } = useUser();
  const signOutWithNavigation = useSignOut();
  const insets = useSafeAreaInsets();
  
  // Settings state - all hooks must be at the top
  const [dataSaver, setDataSaver] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const crossfade = useMemo(() => (settings?.crossfadeSeconds ?? 0) > 0, [settings?.crossfadeSeconds]);
  const gaplessPlayback = settings?.gaplessPlayback ?? true;
  const [allowExplicitContent, setAllowExplicitContent] = useState(false);
  const [showUnplayableSongs, setShowUnplayableSongs] = useState(false);
  const [normalizeAudio, setNormalizeAudio] = useState(true);
  const [monoAudio, setMonoAudio] = useState(false);
  const [deviceBroadcastStatus, setDeviceBroadcastStatus] = useState(false);
  const [autoPlaySimilarContent, setAutoPlaySimilarContent] = useState(true);
  const [showLocalFilesOnLock, setShowLocalFilesOnLock] = useState(false);
  const [spotifyConnectInBackground, setSpotifyConnectInBackground] = useState(true);
  const [recentlyPlayedArtists, setRecentlyPlayedArtists] = useState(true);
  
  // Redirect to auth if user is not signed in
  useEffect(() => {
    if (!isLoading && !profile) {
      console.log('[Settings] No profile found, redirecting to auth');
      router.replace('/auth');
    }
  }, [profile, isLoading]);
  
  // Show loading or return early if no profile
  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <Text style={[styles.title, { textAlign: 'center', marginTop: 50 }]}>Loading...</Text>
      </View>
    );
  }
  
  if (!profile) {
    return null; // Will redirect to auth
  }

  return (
    <View style={styles.container} testID="settings-screen">
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <SettingsIcon size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <TouchableOpacity 
          style={styles.profileSection}
          onPress={() => router.push('/(tabs)/profile')}
          activeOpacity={0.8}
          testID="btn-view-profile"
        >
          <View style={styles.profileAvatar}>
            <Image
              source={{ uri: (profile?.avatarUrl ?? 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=200&auto=format&fit=crop') }}
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile?.displayName ?? 'didit360'}</Text>
            <Text style={styles.profileSubtitle}>View Profile</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => router.push('/account')}
          activeOpacity={0.8}
        >
          <Text style={styles.settingsItemText}>Account</Text>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => router.push('/security-settings')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Security & Privacy</Text>
            <Text style={styles.settingsItemSubtext}>Manage your security settings and privacy preferences</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => router.push('/ux-settings')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>User Experience</Text>
            <Text style={styles.settingsItemSubtext}>Customize accessibility, performance, and interface settings</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Free Plan</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => router.push('/account')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Email</Text>
            <Text style={styles.settingsItemSubtext}>{profile?.email ?? 'didit360@gmail.com'}</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <View style={styles.settingsItemWithSwitch}>
          <View>
            <Text style={styles.settingsItemText}>Data saver</Text>
            <Text style={styles.settingsItemSubtext}>Sets music quality to low and disables artist canvases and album covers</Text>
          </View>
          <Switch
            value={dataSaver}
            onValueChange={setDataSaver}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={dataSaver ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View>
            <Text style={styles.settingsItemText}>Save data</Text>
            <Text style={styles.settingsItemSubtext}>Sets music quality to low and disables artist canvases and album covers</Text>
          </View>
          <Switch
            value={dataSaver}
            onValueChange={setDataSaver}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={dataSaver ? '#FFF' : '#FFF'}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Playback</Text>
        
        <View style={styles.settingsItemWithSwitch}>
          <View>
            <Text style={styles.settingsItemText}>Offline mode</Text>
            <Text style={styles.settingsItemSubtext}>When you go offline, you&apos;ll only be able to play the music and podcasts you&apos;ve downloaded</Text>
          </View>
          <Switch
            value={offlineMode}
            onValueChange={setOfflineMode}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={offlineMode ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View>
            <Text style={styles.settingsItemText}>Crossfade</Text>
            <Text style={styles.settingsItemSubtext}>Allows you to crossfade between tracks</Text>
          </View>
          <Switch
            testID="settings-toggle-crossfade"
            value={crossfade}
            onValueChange={(v) => {
              const seconds = v ? (settings.crossfadeSeconds > 0 ? settings.crossfadeSeconds : 6) : 0;
              void updateSetting('crossfadeSeconds', seconds);
            }}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={crossfade ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View>
            <Text style={styles.settingsItemText}>Gapless</Text>
            <Text style={styles.settingsItemSubtext}>Allows gapless playback</Text>
          </View>
          <Switch
            testID="settings-toggle-gapless"
            value={gaplessPlayback}
            onValueChange={(v) => void updateSetting('gaplessPlayback', v)}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={gaplessPlayback ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View>
            <Text style={styles.settingsItemText}>Allow Explicit Content</Text>
            <Text style={styles.settingsItemSubtext}>Turn on to play explicit content. This filter doesn&apos;t apply to podcasts</Text>
          </View>
          <Switch
            value={allowExplicitContent}
            onValueChange={setAllowExplicitContent}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={allowExplicitContent ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View>
            <Text style={styles.settingsItemText}>Show unplayable songs</Text>
            <Text style={styles.settingsItemSubtext}>Show songs that are unplayable</Text>
          </View>
          <Switch
            value={showUnplayableSongs}
            onValueChange={setShowUnplayableSongs}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={showUnplayableSongs ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View>
            <Text style={styles.settingsItemText}>Normalize Audio</Text>
            <Text style={styles.settingsItemSubtext}>Set the same volume level for all tracks</Text>
          </View>
          <Switch
            value={normalizeAudio}
            onValueChange={setNormalizeAudio}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={normalizeAudio ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View>
            <Text style={styles.settingsItemText}>Mono Audio</Text>
            <Text style={styles.settingsItemSubtext}>Makes left and right speakers play the same audio</Text>
          </View>
          <Switch
            value={monoAudio}
            onValueChange={setMonoAudio}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={monoAudio ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View>
            <Text style={styles.settingsItemText}>Device Broadcast Status</Text>
            <Text style={styles.settingsItemSubtext}>Let apps on this device see what you&apos;re playing</Text>
          </View>
          <Switch
            value={deviceBroadcastStatus}
            onValueChange={setDeviceBroadcastStatus}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={deviceBroadcastStatus ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View>
            <Text style={styles.settingsItemText}>Auto-play similar content</Text>
            <Text style={styles.settingsItemSubtext}>Enjoy nonstop listening. When your music ends, we&apos;ll play you something similar</Text>
          </View>
          <Switch
            value={autoPlaySimilarContent}
            onValueChange={setAutoPlaySimilarContent}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={autoPlaySimilarContent ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View>
            <Text style={styles.settingsItemText}>Show local files on lock</Text>
            <Text style={styles.settingsItemSubtext}>Display local files on lock screen and in notifications</Text>
          </View>
          <Switch
            value={showLocalFilesOnLock}
            onValueChange={setShowLocalFilesOnLock}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={showLocalFilesOnLock ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View>
            <Text style={styles.settingsItemText}>Connect in background</Text>
            <Text style={styles.settingsItemSubtext}>Control music on other devices even when the app is closed</Text>
          </View>
          <Switch
            value={spotifyConnectInBackground}
            onValueChange={setSpotifyConnectInBackground}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={spotifyConnectInBackground ? '#FFF' : '#FFF'}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Voice assistants & Apps</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => router.push('/voice-assistant-settings')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Voice Assistant & Apps</Text>
            <Text style={styles.settingsItemSubtext}>Configure voice control and app integration</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Privacy</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => router.push('/privacy-settings')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Privacy Settings</Text>
            <Text style={styles.settingsItemSubtext}>Control your data and privacy preferences</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <View style={styles.settingsItemWithSwitch}>
          <View>
            <Text style={styles.settingsItemText}>Private sessions</Text>
            <Text style={styles.settingsItemSubtext}>Hide your activity from followers and don&apos;t get recommendations based on what you play in private sessions</Text>
          </View>
          <Switch
            value={false}
            onValueChange={() => {}}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={'#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View>
            <Text style={styles.settingsItemText}>Recently played artists</Text>
            <Text style={styles.settingsItemSubtext}>Let others see artists you&apos;ve recently played on your profile</Text>
          </View>
          <Switch
            value={recentlyPlayedArtists}
            onValueChange={setRecentlyPlayedArtists}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={recentlyPlayedArtists ? '#FFF' : '#FFF'}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Social</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => router.push('/social-settings')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Social Features</Text>
            <Text style={styles.settingsItemSubtext}>Manage social sharing and connections</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Audio Quality</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => router.push('/audio-quality-settings')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Audio Quality Settings</Text>
            <Text style={styles.settingsItemSubtext}>Configure streaming and download quality</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Download</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => router.push('/download-settings')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Download Settings</Text>
            <Text style={styles.settingsItemSubtext}>Manage downloads and offline content</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Equalizer</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => router.push('/equalizer-settings')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Equalizer</Text>
            <Text style={styles.settingsItemSubtext}>Customize your audio experience</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Video Quality</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => router.push('/video-quality-settings')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Video Quality Settings</Text>
            <Text style={styles.settingsItemSubtext}>Configure video streaming quality</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Storage</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => router.push('/storage-settings')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Storage Management</Text>
            <Text style={styles.settingsItemSubtext}>Manage downloads, cache, and storage</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => router.push('/notifications')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Notifications</Text>
            <Text style={styles.settingsItemSubtext}>Manage your notifications</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Local Files</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => router.push('/local-files-settings')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Local Files</Text>
            <Text style={styles.settingsItemSubtext}>Import and manage music files on your device</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Advanced</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => router.push('/advanced-settings')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Advanced Settings</Text>
            <Text style={styles.settingsItemSubtext}>Developer options and advanced features</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Sign Out</Text>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => {
            console.log('[Settings] Sign out button pressed');
            Alert.alert(
              'Sign Out',
              'Are you sure you want to sign out?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', style: 'destructive', onPress: async () => {
                  console.log('[Settings] Sign out confirmed');
                  try {
                    await signOutWithNavigation();
                    console.log('[Settings] Sign out with navigation completed');
                  } catch (error) {
                    console.error('[Settings] Sign out error:', error);
                    // Don't show error alert, just log it - user will be navigated away anyway
                  }
                }}
              ]
            );
          }}
          activeOpacity={0.8}
          testID="logout-button"
        >
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>



      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  settingsButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    marginBottom: 20,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 16,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
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
  settingsItemWithSwitch: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
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
  storageItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  storageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  storageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  storageText: {
    fontSize: 14,
    color: '#FFF',
  },
  storageValue: {
    fontSize: 14,
    color: '#999',
  },
  logoutButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  logoutText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
});