import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Switch } from "react-native";
import { useUser } from "@/contexts/UserContext";
import { ChevronRight, ArrowLeft, Settings as SettingsIcon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";


export default function SettingsScreen() {
  const { profile } = useUser();
  const insets = useSafeAreaInsets();
  
  // Settings state
  const [dataSaver, setDataSaver] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [crossfade, setCrossfade] = useState(true);
  const [gaplessPlayback, setGaplessPlayback] = useState(true);
  const [allowExplicitContent, setAllowExplicitContent] = useState(false);
  const [showUnplayableSongs, setShowUnplayableSongs] = useState(false);
  const [normalizeAudio, setNormalizeAudio] = useState(true);
  const [monoAudio, setMonoAudio] = useState(false);
  const [deviceBroadcastStatus, setDeviceBroadcastStatus] = useState(false);
  const [autoPlaySimilarContent, setAutoPlaySimilarContent] = useState(true);
  const [showLocalFilesOnLock, setShowLocalFilesOnLock] = useState(false);
  const [canvas, setCanvas] = useState(true);
  const [connectToDevices, setConnectToDevices] = useState(true);
  const [showLocalDeviceOnly, setShowLocalDeviceOnly] = useState(false);
  const [spotifyConnectInBackground, setSpotifyConnectInBackground] = useState(true);
  const [socialSession, setSocialSession] = useState(false);
  const [listeningActivity, setListeningActivity] = useState(true);
  const [recentlyPlayedArtists, setRecentlyPlayedArtists] = useState(true);
  const [topArtistsAndTracks, setTopArtistsAndTracks] = useState(true);
  const [playlistsInProfile, setPlaylistsInProfile] = useState(true);
  const [removeAtDownload, setRemoveAtDownload] = useState(false);
  const [downloadUsingMobileData, setDownloadUsingMobileData] = useState(false);

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
        
        <Text style={styles.sectionTitle}>Free Plan</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => console.log('Email')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Email</Text>
            <Text style={styles.settingsItemSubtext}>didit360@gmail.com</Text>
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
            value={crossfade}
            onValueChange={setCrossfade}
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
            value={gaplessPlayback}
            onValueChange={setGaplessPlayback}
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
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => console.log('Spotify connect in background')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Spotify connect in background</Text>
            <Text style={styles.settingsItemSubtext}>Control Spotify on other devices even when the app is closed</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Voice assistants & Apps</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => console.log('Navigation & other apps')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Navigation & other apps</Text>
            <Text style={styles.settingsItemSubtext}>Let other apps control Spotify</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => console.log('Siri')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Siri</Text>
            <Text style={styles.settingsItemSubtext}>Use Siri with Spotify</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => console.log('Car thing')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Car thing</Text>
            <Text style={styles.settingsItemSubtext}>Connect and control your Car Thing</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Privacy</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => console.log('Followers & Following')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Followers & Following</Text>
            <Text style={styles.settingsItemSubtext}>Manage who can follow you</Text>
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
        
        <View style={styles.settingsItemWithSwitch}>
          <View>
            <Text style={styles.settingsItemText}>Social Session</Text>
            <Text style={styles.settingsItemSubtext}>Let friends see what you&apos;re listening to and add to the queue</Text>
          </View>
          <Switch
            value={socialSession}
            onValueChange={setSocialSession}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={socialSession ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View>
            <Text style={styles.settingsItemText}>Listening Activity</Text>
            <Text style={styles.settingsItemSubtext}>Friends can see what you&apos;re listening to</Text>
          </View>
          <Switch
            value={listeningActivity}
            onValueChange={setListeningActivity}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={listeningActivity ? '#FFF' : '#FFF'}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Audio Quality</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => console.log('Wifi Streaming')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Wifi Streaming</Text>
            <Text style={styles.settingsItemSubtext}>Automatic</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => console.log('Mobile Streaming')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Mobile Streaming</Text>
            <Text style={styles.settingsItemSubtext}>Automatic</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => console.log('Auto-adjust quality')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Auto-adjust quality</Text>
            <Text style={styles.settingsItemSubtext}>Automatic</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Download</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => console.log('Audio quality')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Audio quality</Text>
            <Text style={styles.settingsItemSubtext}>High</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <View style={styles.settingsItemWithSwitch}>
          <View>
            <Text style={styles.settingsItemText}>Download using mobile data</Text>
            <Text style={styles.settingsItemSubtext}>You can always download using Wi-Fi</Text>
          </View>
          <Switch
            value={downloadUsingMobileData}
            onValueChange={setDownloadUsingMobileData}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={downloadUsingMobileData ? '#FFF' : '#FFF'}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Equalizer</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => console.log('Equalizer')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Equalizer</Text>
            <Text style={styles.settingsItemSubtext}>Use your device&apos;s audio effects</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Video Quality</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => console.log('Wifi Streaming')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Wifi Streaming</Text>
            <Text style={styles.settingsItemSubtext}>Automatic</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => console.log('Mobile Streaming')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Mobile Streaming</Text>
            <Text style={styles.settingsItemSubtext}>Automatic</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Storage</Text>
        
        <View style={styles.storageItem}>
          <View style={styles.storageRow}>
            <View style={styles.storageIndicator}>
              <View style={[styles.storageDot, { backgroundColor: '#1DB954' }]} />
              <Text style={styles.storageText}>Cache</Text>
            </View>
            <Text style={styles.storageValue}>1.2GB</Text>
          </View>
          <View style={styles.storageRow}>
            <View style={styles.storageIndicator}>
              <View style={[styles.storageDot, { backgroundColor: '#FF6B6B' }]} />
              <Text style={styles.storageText}>Other</Text>
            </View>
            <Text style={styles.storageValue}>1.2GB</Text>
          </View>
          <View style={styles.storageRow}>
            <View style={styles.storageIndicator}>
              <View style={[styles.storageDot, { backgroundColor: '#4ECDC4' }]} />
              <Text style={styles.storageText}>Free space</Text>
            </View>
            <Text style={styles.storageValue}>1.2GB</Text>
          </View>
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View>
            <Text style={styles.settingsItemText}>Remove At Download</Text>
            <Text style={styles.settingsItemSubtext}>Save storage space on your device</Text>
          </View>
          <Switch
            value={removeAtDownload}
            onValueChange={setRemoveAtDownload}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={removeAtDownload ? '#FFF' : '#FFF'}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => console.log('Clear cache')}
          activeOpacity={0.8}
        >
          <Text style={styles.settingsItemText}>Clear cache</Text>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => console.log('Notifications')}
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
          onPress={() => console.log('Local Files')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Local Files</Text>
            <Text style={styles.settingsItemSubtext}>Play music files stored on this device</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Advanced</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => console.log('Spotify for partners preferences')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Spotify for partners preferences</Text>
            <Text style={styles.settingsItemSubtext}>Control how we share information with our business partners</Text>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Log out</Text>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => console.log('Log out')}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Log Out</Text>
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