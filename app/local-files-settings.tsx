import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Platform } from 'react-native';
import { ArrowLeft, FolderOpen, Music, Upload, Scan, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';

export default function LocalFilesSettings() {
  const insets = useSafeAreaInsets();
  const { settings, updateSetting } = useUser();
  
  const [enableLocalFiles, setEnableLocalFiles] = useState(true);
  const [autoScan, setAutoScan] = useState(false);
  const [showOnLockScreen, setShowOnLockScreen] = useState(false);
  const [includeInRecommendations, setIncludeInRecommendations] = useState(true);
  
  const scanForFiles = () => {
    if (Platform.OS === 'web') {
      console.log('Scanning for local files...');
    } else {
      Alert.alert(
        'Scan for Music',
        'This will search your device for music files and add them to your library.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Scan Now', 
            onPress: () => Alert.alert('Scanning...', 'Found 23 new music files!')
          },
        ]
      );
    }
  };
  
  const importFiles = () => {
    if (Platform.OS === 'web') {
      console.log('File import dialog opened');
    } else {
      Alert.alert('Import Files', 'Select music files from your device to import into your library.');
    }
  };
  
  const manageFolders = () => {
    if (Platform.OS === 'web') {
      console.log('Folder management opened');
    } else {
      Alert.alert('Manage Folders', 'Choose which folders to include in your music library.');
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
        <Text style={styles.title}>Local Files</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <FolderOpen size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Enable Local Files</Text>
              <Text style={styles.settingsItemSubtext}>Play music files stored on your device</Text>
            </View>
          </View>
          <Switch
            value={enableLocalFiles}
            onValueChange={setEnableLocalFiles}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={enableLocalFiles ? '#FFF' : '#FFF'}
          />
        </View>
        
        {enableLocalFiles && (
          <>
            <Text style={styles.sectionTitle}>File Management</Text>
            
            <TouchableOpacity 
              style={styles.settingsItem}
              onPress={scanForFiles}
              activeOpacity={0.8}
            >
              <View style={styles.itemContent}>
                <Scan size={20} color="#1DB954" style={styles.itemIcon} />
                <View style={styles.itemText}>
                  <Text style={styles.settingsItemText}>Scan for Music</Text>
                  <Text style={styles.settingsItemSubtext}>Search your device for music files</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingsItem}
              onPress={importFiles}
              activeOpacity={0.8}
            >
              <View style={styles.itemContent}>
                <Upload size={20} color="#1DB954" style={styles.itemIcon} />
                <View style={styles.itemText}>
                  <Text style={styles.settingsItemText}>Import Files</Text>
                  <Text style={styles.settingsItemSubtext}>Manually select files to import</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingsItem}
              onPress={manageFolders}
              activeOpacity={0.8}
            >
              <View style={styles.itemContent}>
                <FolderOpen size={20} color="#1DB954" style={styles.itemIcon} />
                <View style={styles.itemText}>
                  <Text style={styles.settingsItemText}>Manage Folders</Text>
                  <Text style={styles.settingsItemSubtext}>Choose which folders to include</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#666" />
            </TouchableOpacity>
            
            <Text style={styles.sectionTitle}>Local File Options</Text>
            
            <View style={styles.settingsItemWithSwitch}>
              <View style={styles.itemContent}>
                <Scan size={20} color="#1DB954" style={styles.itemIcon} />
                <View style={styles.itemText}>
                  <Text style={styles.settingsItemText}>Auto-scan</Text>
                  <Text style={styles.settingsItemSubtext}>Automatically scan for new files on app start</Text>
                </View>
              </View>
              <Switch
                value={autoScan}
                onValueChange={setAutoScan}
                trackColor={{ false: '#333', true: '#1DB954' }}
                thumbColor={autoScan ? '#FFF' : '#FFF'}
              />
            </View>
            
            <View style={styles.settingsItemWithSwitch}>
              <View style={styles.itemContent}>
                <Music size={20} color="#1DB954" style={styles.itemIcon} />
                <View style={styles.itemText}>
                  <Text style={styles.settingsItemText}>Show on Lock Screen</Text>
                  <Text style={styles.settingsItemSubtext}>Display local files in lock screen controls</Text>
                </View>
              </View>
              <Switch
                value={showOnLockScreen}
                onValueChange={setShowOnLockScreen}
                trackColor={{ false: '#333', true: '#1DB954' }}
                thumbColor={showOnLockScreen ? '#FFF' : '#FFF'}
              />
            </View>
            
            <View style={styles.settingsItemWithSwitch}>
              <View style={styles.itemContent}>
                <Music size={20} color="#1DB954" style={styles.itemIcon} />
                <View style={styles.itemText}>
                  <Text style={styles.settingsItemText}>Include in Recommendations</Text>
                  <Text style={styles.settingsItemSubtext}>Use local files for music recommendations</Text>
                </View>
              </View>
              <Switch
                value={includeInRecommendations}
                onValueChange={setIncludeInRecommendations}
                trackColor={{ false: '#333', true: '#1DB954' }}
                thumbColor={includeInRecommendations ? '#FFF' : '#FFF'}
              />
            </View>
            
            <Text style={styles.sectionTitle}>Library Statistics</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>156</Text>
                <Text style={styles.statLabel}>Local Songs</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>23</Text>
                <Text style={styles.statLabel}>Artists</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Albums</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>2.1 GB</Text>
                <Text style={styles.statLabel}>Total Size</Text>
              </View>
            </View>
          </>
        )}
        
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Supported Formats</Text>
          <Text style={styles.infoText}>
            MP3, AAC, FLAC, WAV, OGG, M4A, WMA
          </Text>
        </View>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Local Files Tips</Text>
          <Text style={styles.infoText}>
            • Organize files in folders by artist or album{'\n'}
            • Use proper ID3 tags for better organization{'\n'}
            • Local files work offline automatically{'\n'}
            • Scan regularly to find new files
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    color: '#1DB954',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
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