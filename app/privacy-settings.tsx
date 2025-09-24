import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Platform } from 'react-native';
import { ArrowLeft, Shield, Eye, Users, Lock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';

export default function PrivacySettings() {
  const insets = useSafeAreaInsets();
  const { settings, updateSetting } = useUser();
  
  const [privateSession, setPrivateSession] = useState(false);
  const [dataCollection, setDataCollection] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(true);
  const [shareListeningData, setShareListeningData] = useState(false);
  const [locationTracking, setLocationTracking] = useState(false);
  const [analyticsOptOut, setAnalyticsOptOut] = useState(false);
  
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
        <Text style={styles.title}>Privacy Settings</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Listening Privacy</Text>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Eye size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Private Session</Text>
              <Text style={styles.settingsItemSubtext}>Hide your activity from followers and don&apos;t get recommendations</Text>
            </View>
          </View>
          <Switch
            value={privateSession}
            onValueChange={setPrivateSession}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={privateSession ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Users size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Share Listening Data</Text>
              <Text style={styles.settingsItemSubtext}>Allow friends to see what you&apos;re listening to</Text>
            </View>
          </View>
          <Switch
            value={shareListeningData}
            onValueChange={setShareListeningData}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={shareListeningData ? '#FFF' : '#FFF'}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Data & Analytics</Text>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Shield size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Data Collection</Text>
              <Text style={styles.settingsItemSubtext}>Allow us to collect usage data to improve the app</Text>
            </View>
          </View>
          <Switch
            value={dataCollection}
            onValueChange={setDataCollection}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={dataCollection ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Shield size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Personalized Ads</Text>
              <Text style={styles.settingsItemSubtext}>Show ads based on your listening preferences</Text>
            </View>
          </View>
          <Switch
            value={personalizedAds}
            onValueChange={setPersonalizedAds}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={personalizedAds ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Lock size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Location Tracking</Text>
              <Text style={styles.settingsItemSubtext}>Use location for local recommendations and events</Text>
            </View>
          </View>
          <Switch
            value={locationTracking}
            onValueChange={setLocationTracking}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={locationTracking ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Shield size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Analytics Opt-Out</Text>
              <Text style={styles.settingsItemSubtext}>Disable all analytics and tracking</Text>
            </View>
          </View>
          <Switch
            value={analyticsOptOut}
            onValueChange={setAnalyticsOptOut}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={analyticsOptOut ? '#FFF' : '#FFF'}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Account Privacy</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => showFeatureAlert('Blocked Users', 'Manage users you have blocked from seeing your activity.')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Blocked Users</Text>
            <Text style={styles.settingsItemSubtext}>Manage blocked users</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => showFeatureAlert('Data Export', 'Download a copy of your personal data and listening history.')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Download My Data</Text>
            <Text style={styles.settingsItemSubtext}>Export your personal data</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => showFeatureAlert('Delete Account', 'Permanently delete your account and all associated data.')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingsItemText}>Delete Account</Text>
            <Text style={styles.settingsItemSubtext}>Permanently delete your account</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Privacy Notice</Text>
          <Text style={styles.infoText}>
            We respect your privacy and are committed to protecting your personal data. 
            You can control how your data is used and shared through these settings.
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