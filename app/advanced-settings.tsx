import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Platform } from 'react-native';
import { ArrowLeft, Settings, Database, Shield, Zap, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';

export default function AdvancedSettings() {
  const insets = useSafeAreaInsets();
  const { settings, updateSetting } = useUser();
  
  const [developerMode, setDeveloperMode] = useState(false);
  const [debugLogging, setDebugLogging] = useState(false);
  const [experimentalFeatures, setExperimentalFeatures] = useState(false);
  const [hardwareAcceleration, setHardwareAcceleration] = useState(true);
  const [backgroundProcessing, setBackgroundProcessing] = useState(true);
  
  const resetAllSettings = () => {
    if (Platform.OS === 'web') {
      console.log('All settings reset');
    } else {
      Alert.alert(
        'Reset All Settings',
        'This will reset all app settings to their default values. This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Reset All', 
            style: 'destructive', 
            onPress: () => Alert.alert('Success', 'All settings have been reset to default values.')
          },
        ]
      );
    }
  };
  
  const exportSettings = () => {
    if (Platform.OS === 'web') {
      console.log('Settings exported');
    } else {
      Alert.alert('Export Settings', 'Your settings have been exported to a backup file.');
    }
  };
  
  const importSettings = () => {
    if (Platform.OS === 'web') {
      console.log('Settings import dialog opened');
    } else {
      Alert.alert('Import Settings', 'Select a settings backup file to restore your preferences.');
    }
  };
  
  const clearAllData = () => {
    if (Platform.OS === 'web') {
      console.log('All data cleared');
    } else {
      Alert.alert(
        'Clear All Data',
        'This will permanently delete all app data including downloads, cache, and settings. This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Clear All', 
            style: 'destructive', 
            onPress: () => Alert.alert('Warning', 'Are you absolutely sure? This will delete everything!', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete Everything', style: 'destructive', onPress: () => Alert.alert('Success', 'All data has been cleared.') }
            ])
          },
        ]
      );
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
        <Text style={styles.title}>Advanced Settings</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Performance</Text>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Zap size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Hardware Acceleration</Text>
              <Text style={styles.settingsItemSubtext}>Use GPU for better performance</Text>
            </View>
          </View>
          <Switch
            value={hardwareAcceleration}
            onValueChange={setHardwareAcceleration}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={hardwareAcceleration ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Database size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Background Processing</Text>
              <Text style={styles.settingsItemSubtext}>Allow background tasks for better experience</Text>
            </View>
          </View>
          <Switch
            value={backgroundProcessing}
            onValueChange={setBackgroundProcessing}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={backgroundProcessing ? '#FFF' : '#FFF'}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Developer Options</Text>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Settings size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Developer Mode</Text>
              <Text style={styles.settingsItemSubtext}>Enable advanced debugging features</Text>
            </View>
          </View>
          <Switch
            value={developerMode}
            onValueChange={setDeveloperMode}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={developerMode ? '#FFF' : '#FFF'}
          />
        </View>
        
        {developerMode && (
          <>
            <View style={styles.settingsItemWithSwitch}>
              <View style={styles.itemContent}>
                <Database size={20} color="#1DB954" style={styles.itemIcon} />
                <View style={styles.itemText}>
                  <Text style={styles.settingsItemText}>Debug Logging</Text>
                  <Text style={styles.settingsItemSubtext}>Enable detailed logging for troubleshooting</Text>
                </View>
              </View>
              <Switch
                value={debugLogging}
                onValueChange={setDebugLogging}
                trackColor={{ false: '#333', true: '#1DB954' }}
                thumbColor={debugLogging ? '#FFF' : '#FFF'}
              />
            </View>
            
            <View style={styles.settingsItemWithSwitch}>
              <View style={styles.itemContent}>
                <Zap size={20} color="#1DB954" style={styles.itemIcon} />
                <View style={styles.itemText}>
                  <Text style={styles.settingsItemText}>Experimental Features</Text>
                  <Text style={styles.settingsItemSubtext}>Enable beta features (may be unstable)</Text>
                </View>
              </View>
              <Switch
                value={experimentalFeatures}
                onValueChange={setExperimentalFeatures}
                trackColor={{ false: '#333', true: '#1DB954' }}
                thumbColor={experimentalFeatures ? '#FFF' : '#FFF'}
              />
            </View>
          </>
        )}
        
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={exportSettings}
          activeOpacity={0.8}
        >
          <View style={styles.itemContent}>
            <Database size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Export Settings</Text>
              <Text style={styles.settingsItemSubtext}>Create a backup of your preferences</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={importSettings}
          activeOpacity={0.8}
        >
          <View style={styles.itemContent}>
            <Database size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Import Settings</Text>
              <Text style={styles.settingsItemSubtext}>Restore preferences from backup</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Reset Options</Text>
        
        <TouchableOpacity 
          style={styles.dangerItem}
          onPress={resetAllSettings}
          activeOpacity={0.8}
        >
          <View style={styles.itemContent}>
            <Settings size={20} color="#FF6B6B" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.dangerItemText}>Reset All Settings</Text>
              <Text style={styles.settingsItemSubtext}>Restore all settings to default values</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.dangerItem}
          onPress={clearAllData}
          activeOpacity={0.8}
        >
          <View style={styles.itemContent}>
            <Shield size={20} color="#FF6B6B" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.dangerItemText}>Clear All Data</Text>
              <Text style={styles.settingsItemSubtext}>Permanently delete all app data</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>App Information</Text>
          <View style={styles.appInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version:</Text>
              <Text style={styles.infoValue}>2.1.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Build:</Text>
              <Text style={styles.infoValue}>2024.01.15</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Platform:</Text>
              <Text style={styles.infoValue}>{Platform.OS}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>⚠️ Warning</Text>
          <Text style={styles.warningText}>
            Advanced settings can affect app performance and stability. Only modify these settings if you understand their impact.
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
  dangerItem: {
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
  dangerItemText: {
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
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
    marginBottom: 12,
  },
  appInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
  },
  infoValue: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '500',
  },
  warningBox: {
    backgroundColor: '#2A1A00',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FF8C00',
  },
  warningTitle: {
    fontSize: 16,
    color: '#FF8C00',
    fontWeight: '600',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#FFB366',
    lineHeight: 20,
  },
});