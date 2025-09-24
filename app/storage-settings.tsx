import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Platform } from 'react-native';
import { ArrowLeft, HardDrive, Trash2, FolderOpen, Database, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';

export default function StorageSettings() {
  const insets = useSafeAreaInsets();
  const { settings, updateSetting } = useUser();
  
  const [autoCleanup, setAutoCleanup] = useState(true);
  const [cacheLimit, setCacheLimit] = useState(2); // GB
  const [offlineStorage, setOfflineStorage] = useState(true);
  
  const clearCache = () => {
    if (Platform.OS === 'web') {
      console.log('Cache cleared');
    } else {
      Alert.alert(
        'Clear Cache',
        'This will clear all cached data including album covers, thumbnails, and temporary files.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Clear', 
            style: 'destructive', 
            onPress: () => Alert.alert('Success', 'Cache cleared successfully!')
          },
        ]
      );
    }
  };
  
  const clearDownloads = () => {
    if (Platform.OS === 'web') {
      console.log('Downloads cleared');
    } else {
      Alert.alert(
        'Clear Downloads',
        'This will remove all downloaded music from your device. You can re-download them later.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Clear All', 
            style: 'destructive', 
            onPress: () => Alert.alert('Success', 'All downloads cleared!')
          },
        ]
      );
    }
  };
  
  const manageLocalFiles = () => {
    if (Platform.OS === 'web') {
      console.log('Local files manager opened');
    } else {
      Alert.alert('Local Files', 'This feature allows you to import and manage music files stored on your device.');
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
        <Text style={styles.title}>Storage Management</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Storage Overview</Text>
        
        <View style={styles.storageOverview}>
          <View style={styles.storageChart}>
            <View style={styles.chartContainer}>
              <View style={[styles.chartSegment, { flex: 2.4, backgroundColor: '#1DB954' }]} />
              <View style={[styles.chartSegment, { flex: 1.8, backgroundColor: '#FF6B6B' }]} />
              <View style={[styles.chartSegment, { flex: 0.8, backgroundColor: '#4ECDC4' }]} />
              <View style={[styles.chartSegment, { flex: 15, backgroundColor: '#333' }]} />
            </View>
          </View>
          
          <View style={styles.storageDetails}>
            <View style={styles.storageRow}>
              <View style={styles.storageIndicator}>
                <View style={[styles.storageDot, { backgroundColor: '#1DB954' }]} />
                <Text style={styles.storageText}>Downloaded Music</Text>
              </View>
              <Text style={styles.storageValue}>2.4 GB</Text>
            </View>
            <View style={styles.storageRow}>
              <View style={styles.storageIndicator}>
                <View style={[styles.storageDot, { backgroundColor: '#FF6B6B' }]} />
                <Text style={styles.storageText}>Cache & Thumbnails</Text>
              </View>
              <Text style={styles.storageValue}>1.8 GB</Text>
            </View>
            <View style={styles.storageRow}>
              <View style={styles.storageIndicator}>
                <View style={[styles.storageDot, { backgroundColor: '#4ECDC4' }]} />
                <Text style={styles.storageText}>Local Files</Text>
              </View>
              <Text style={styles.storageValue}>0.8 GB</Text>
            </View>
            <View style={styles.storageRow}>
              <View style={styles.storageIndicator}>
                <View style={[styles.storageDot, { backgroundColor: '#333' }]} />
                <Text style={styles.storageText}>Available Space</Text>
              </View>
              <Text style={styles.storageValue}>15.0 GB</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Storage Settings</Text>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Database size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Auto Cleanup</Text>
              <Text style={styles.settingsItemSubtext}>Automatically remove old cache and temporary files</Text>
            </View>
          </View>
          <Switch
            value={autoCleanup}
            onValueChange={setAutoCleanup}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={autoCleanup ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <HardDrive size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Offline Storage</Text>
              <Text style={styles.settingsItemSubtext}>Allow storing music for offline playback</Text>
            </View>
          </View>
          <Switch
            value={offlineStorage}
            onValueChange={setOfflineStorage}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={offlineStorage ? '#FFF' : '#FFF'}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => {
            if (Platform.OS === 'web') {
              console.log('Cache limit selector opened');
            } else {
              Alert.alert('Cache Limit', `Current limit: ${cacheLimit} GB`);
            }
          }}
          activeOpacity={0.8}
        >
          <View style={styles.itemContent}>
            <Database size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Cache Limit</Text>
              <Text style={styles.settingsItemSubtext}>{cacheLimit} GB maximum</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Storage Actions</Text>
        
        <TouchableOpacity 
          style={styles.actionItem}
          onPress={clearCache}
          activeOpacity={0.8}
        >
          <View style={styles.itemContent}>
            <Trash2 size={20} color="#FF6B6B" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.actionItemText}>Clear Cache</Text>
              <Text style={styles.settingsItemSubtext}>Remove cached images and temporary files</Text>
            </View>
          </View>
          <Text style={styles.actionValue}>1.8 GB</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionItem}
          onPress={clearDownloads}
          activeOpacity={0.8}
        >
          <View style={styles.itemContent}>
            <Trash2 size={20} color="#FF6B6B" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.actionItemText}>Clear Downloads</Text>
              <Text style={styles.settingsItemSubtext}>Remove all downloaded music</Text>
            </View>
          </View>
          <Text style={styles.actionValue}>2.4 GB</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionItem}
          onPress={manageLocalFiles}
          activeOpacity={0.8}
        >
          <View style={styles.itemContent}>
            <FolderOpen size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Manage Local Files</Text>
              <Text style={styles.settingsItemSubtext}>Import and organize music files</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Storage Tips</Text>
          <Text style={styles.infoText}>
            • Enable auto cleanup to maintain optimal performance{'\n'}
            • Clear cache regularly to free up space{'\n'}
            • Downloaded music is available offline{'\n'}
            • Local files can be imported from your device
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
  actionItem: {
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
  actionItemText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  settingsItemSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    lineHeight: 18,
  },
  actionValue: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
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
  storageOverview: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  storageChart: {
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  chartSegment: {
    height: '100%',
  },
  storageDetails: {
    gap: 8,
  },
  storageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontWeight: '600',
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