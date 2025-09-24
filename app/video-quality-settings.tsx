import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Platform } from 'react-native';
import { ArrowLeft, Video, Wifi, Smartphone, Monitor, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';

type VideoQuality = 'low' | 'medium' | 'high' | 'auto';

export default function VideoQualitySettings() {
  const insets = useSafeAreaInsets();
  const { settings, updateSetting } = useUser();
  
  const [wifiVideoQuality, setWifiVideoQuality] = useState<VideoQuality>('high');
  const [mobileVideoQuality, setMobileVideoQuality] = useState<VideoQuality>('medium');
  const [autoPlayVideos, setAutoPlayVideos] = useState(true);
  const [showVideoThumbnails, setShowVideoThumbnails] = useState(true);
  const [preloadVideos, setPreloadVideos] = useState(false);
  
  const qualityOptions: { value: VideoQuality; label: string; description: string }[] = [
    { value: 'low', label: 'Low (480p)', description: 'Uses less data, lower quality' },
    { value: 'medium', label: 'Medium (720p)', description: 'Good balance of quality and data usage' },
    { value: 'high', label: 'High (1080p)', description: 'Best quality, uses more data' },
    { value: 'auto', label: 'Auto', description: 'Adjusts based on connection speed' },
  ];
  
  const showQualitySelector = (type: 'wifi' | 'mobile') => {
    const currentQuality = type === 'wifi' ? wifiVideoQuality : mobileVideoQuality;
    const setQuality = type === 'wifi' ? setWifiVideoQuality : setMobileVideoQuality;
    
    if (Platform.OS === 'web') {
      console.log(`${type} video quality selector opened`);
      return;
    }
    
    const options = qualityOptions.map(option => ({
      text: option.label,
      onPress: () => setQuality(option.value),
      style: (option.value === currentQuality ? 'default' : 'cancel') as 'default' | 'cancel' | 'destructive',
    }));
    
    Alert.alert(
      `${type === 'wifi' ? 'WiFi' : 'Mobile'} Video Quality`,
      'Choose your preferred video quality',
      [
        ...options,
        { text: 'Cancel', style: 'cancel' as const },
      ]
    );
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
        <Text style={styles.title}>Video Quality</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Streaming Quality</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => showQualitySelector('wifi')}
          activeOpacity={0.8}
        >
          <View style={styles.itemContent}>
            <Wifi size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>WiFi Streaming</Text>
              <Text style={styles.settingsItemSubtext}>
                {qualityOptions.find(q => q.value === wifiVideoQuality)?.label}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => showQualitySelector('mobile')}
          activeOpacity={0.8}
        >
          <View style={styles.itemContent}>
            <Smartphone size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Mobile Streaming</Text>
              <Text style={styles.settingsItemSubtext}>
                {qualityOptions.find(q => q.value === mobileVideoQuality)?.label}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Video Playback</Text>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Video size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Auto-play Videos</Text>
              <Text style={styles.settingsItemSubtext}>Automatically play videos when browsing</Text>
            </View>
          </View>
          <Switch
            value={autoPlayVideos}
            onValueChange={setAutoPlayVideos}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={autoPlayVideos ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Monitor size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Show Video Thumbnails</Text>
              <Text style={styles.settingsItemSubtext}>Display preview images for videos</Text>
            </View>
          </View>
          <Switch
            value={showVideoThumbnails}
            onValueChange={setShowVideoThumbnails}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={showVideoThumbnails ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Video size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Preload Videos</Text>
              <Text style={styles.settingsItemSubtext}>Buffer videos in advance for smoother playback</Text>
            </View>
          </View>
          <Switch
            value={preloadVideos}
            onValueChange={setPreloadVideos}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={preloadVideos ? '#FFF' : '#FFF'}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Quality Information</Text>
        
        <View style={styles.qualityInfo}>
          {qualityOptions.map((option) => (
            <View key={option.value} style={styles.qualityItem}>
              <Text style={styles.qualityLabel}>{option.label}</Text>
              <Text style={styles.qualityDescription}>{option.description}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Data Usage</Text>
          <Text style={styles.infoText}>
            Higher quality videos use significantly more data. Consider using lower quality on mobile data to avoid exceeding your data plan.
          </Text>
        </View>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Performance Tips</Text>
          <Text style={styles.infoText}>
            • Use Auto quality for best experience{'\n'}
            • Disable auto-play to save data{'\n'}
            • Preloading improves playback but uses more data{'\n'}
            • Lower quality on slower connections
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
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  settingsItemWithSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  qualityInfo: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  qualityItem: {
    marginBottom: 12,
  },
  qualityLabel: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
    marginBottom: 4,
  },
  qualityDescription: {
    fontSize: 14,
    color: '#999',
    lineHeight: 18,
  },
  infoBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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