import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Platform } from 'react-native';
import { ArrowLeft, Download, Wifi, Smartphone, HardDrive, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';

type DownloadQuality = 'normal' | 'high' | 'lossless';

export default function DownloadSettings() {
  const insets = useSafeAreaInsets();
  const { settings, updateSetting } = useUser();
  
  const [downloadQuality, setDownloadQuality] = useState<DownloadQuality>('high');
  const [downloadOverCellular, setDownloadOverCellular] = useState(false);
  const [autoDownload, setAutoDownload] = useState(false);
  const [removeAfterListening, setRemoveAfterListening] = useState(false);
  const [downloadOnlyWhenCharging, setDownloadOnlyWhenCharging] = useState(false);
  
  const qualityOptions: { value: DownloadQuality; label: string; description: string }[] = [
    { value: 'normal', label: 'Normal (160 kbps)', description: 'Good quality, smaller file size' },
    { value: 'high', label: 'High (320 kbps)', description: 'Best quality, larger file size' },
    { value: 'lossless', label: 'Lossless (FLAC)', description: 'Studio quality, very large files' },
  ];
  
  const showQualitySelector = () => {
    if (Platform.OS === 'web') {
      console.log('Download quality selector opened');
      return;
    }
    
    const options = qualityOptions.map(option => ({
      text: option.label,
      onPress: () => setDownloadQuality(option.value),
      style: (option.value === downloadQuality ? 'default' : 'cancel') as 'default' | 'cancel' | 'destructive',
    }));
    
    Alert.alert(
      'Download Quality',
      'Choose your preferred download quality',
      [
        ...options,
        { text: 'Cancel', style: 'cancel' as const },
      ]
    );
  };
  
  const clearDownloads = () => {
    if (Platform.OS === 'web') {
      console.log('Downloads cleared');
      return;
    }
    
    Alert.alert(
      'Clear Downloads',
      'This will remove all downloaded music from your device. You can re-download them later.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive', 
          onPress: () => Alert.alert('Success', 'All downloads have been cleared.')
        },
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
        <Text style={styles.title}>Download Settings</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Download Quality</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={showQualitySelector}
          activeOpacity={0.8}
        >
          <View style={styles.itemContent}>
            <Download size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Download Quality</Text>
              <Text style={styles.settingsItemSubtext}>
                {qualityOptions.find(q => q.value === downloadQuality)?.label}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Download Options</Text>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Smartphone size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Download using mobile data</Text>
              <Text style={styles.settingsItemSubtext}>Allow downloads when not connected to WiFi</Text>
            </View>
          </View>
          <Switch
            value={downloadOverCellular}
            onValueChange={setDownloadOverCellular}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={downloadOverCellular ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Download size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Auto-download</Text>
              <Text style={styles.settingsItemSubtext}>Automatically download liked songs and playlists</Text>
            </View>
          </View>
          <Switch
            value={autoDownload}
            onValueChange={setAutoDownload}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={autoDownload ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <HardDrive size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Remove after listening</Text>
              <Text style={styles.settingsItemSubtext}>Automatically remove downloads after playing</Text>
            </View>
          </View>
          <Switch
            value={removeAfterListening}
            onValueChange={setRemoveAfterListening}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={removeAfterListening ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Wifi size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Download only when charging</Text>
              <Text style={styles.settingsItemSubtext}>Preserve battery by downloading only when plugged in</Text>
            </View>
          </View>
          <Switch
            value={downloadOnlyWhenCharging}
            onValueChange={setDownloadOnlyWhenCharging}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={downloadOnlyWhenCharging ? '#FFF' : '#FFF'}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Storage Management</Text>
        
        <View style={styles.storageInfo}>
          <View style={styles.storageRow}>
            <Text style={styles.storageLabel}>Downloaded Music</Text>
            <Text style={styles.storageValue}>2.4 GB</Text>
          </View>
          <View style={styles.storageRow}>
            <Text style={styles.storageLabel}>Available Space</Text>
            <Text style={styles.storageValue}>15.2 GB</Text>
          </View>
          <View style={styles.storageRow}>
            <Text style={styles.storageLabel}>Total Downloads</Text>
            <Text style={styles.storageValue}>156 songs</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={clearDownloads}
          activeOpacity={0.8}
        >
          <Text style={styles.clearButtonText}>Clear All Downloads</Text>
        </TouchableOpacity>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Download Tips</Text>
          <Text style={styles.infoText}>
            • Higher quality downloads take more storage space{'\n'}
            • Downloads are only available while subscribed{'\n'}
            • Use WiFi to avoid data charges{'\n'}
            • Downloaded music works offline
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
  storageInfo: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  storageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  storageLabel: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
  storageValue: {
    fontSize: 16,
    color: '#1DB954',
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 24,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
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