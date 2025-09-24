import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Platform } from 'react-native';
import { ArrowLeft, Mic, Car, Smartphone, Volume2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';

export default function VoiceAssistantSettings() {
  const insets = useSafeAreaInsets();
  const { settings, updateSetting } = useUser();
  
  const [voiceAssistantEnabled, setVoiceAssistantEnabled] = useState(true);
  const [carIntegration, setCarIntegration] = useState(false);
  const [handsFreeMode, setHandsFreeMode] = useState(true);
  const [voiceCommands, setVoiceCommands] = useState(true);
  const [wakeWordEnabled, setWakeWordEnabled] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState(true);
  
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
        <Text style={styles.title}>Voice Assistant & Apps</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Mic size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Voice Assistant</Text>
              <Text style={styles.settingsItemSubtext}>Enable voice control for music playback</Text>
            </View>
          </View>
          <Switch
            value={voiceAssistantEnabled}
            onValueChange={setVoiceAssistantEnabled}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={voiceAssistantEnabled ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Car size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Car Integration</Text>
              <Text style={styles.settingsItemSubtext}>Connect with Android Auto and CarPlay</Text>
            </View>
          </View>
          <Switch
            value={carIntegration}
            onValueChange={setCarIntegration}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={carIntegration ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Smartphone size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Hands-Free Mode</Text>
              <Text style={styles.settingsItemSubtext}>Control music without touching your device</Text>
            </View>
          </View>
          <Switch
            value={handsFreeMode}
            onValueChange={setHandsFreeMode}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={handsFreeMode ? '#FFF' : '#FFF'}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Voice Commands</Text>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Volume2 size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Voice Commands</Text>
              <Text style={styles.settingsItemSubtext}>"Play", "Pause", "Next", "Previous", "Volume up"</Text>
            </View>
          </View>
          <Switch
            value={voiceCommands}
            onValueChange={setVoiceCommands}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={voiceCommands ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Mic size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Wake Word</Text>
              <Text style={styles.settingsItemSubtext}>Say "Hey Music" to activate voice control</Text>
            </View>
          </View>
          <Switch
            value={wakeWordEnabled}
            onValueChange={setWakeWordEnabled}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={wakeWordEnabled ? '#FFF' : '#FFF'}
          />
        </View>
        
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Volume2 size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Voice Feedback</Text>
              <Text style={styles.settingsItemSubtext}>Hear confirmations for voice commands</Text>
            </View>
          </View>
          <Switch
            value={voiceFeedback}
            onValueChange={setVoiceFeedback}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={voiceFeedback ? '#FFF' : '#FFF'}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Supported Commands</Text>
        
        <View style={styles.commandsList}>
          <Text style={styles.commandText}>• "Play [song/artist/album name]"</Text>
          <Text style={styles.commandText}>• "Pause" / "Resume"</Text>
          <Text style={styles.commandText}>• "Next song" / "Previous song"</Text>
          <Text style={styles.commandText}>• "Volume up" / "Volume down"</Text>
          <Text style={styles.commandText}>• "Shuffle on" / "Shuffle off"</Text>
          <Text style={styles.commandText}>• "Repeat on" / "Repeat off"</Text>
          <Text style={styles.commandText}>• "What's playing?"</Text>
          <Text style={styles.commandText}>• "Add to favorites"</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.testButton}
          onPress={() => showFeatureAlert('Voice Test', 'Say "Hey Music, play some jazz" to test voice recognition.')}
          activeOpacity={0.8}
        >
          <Text style={styles.testButtonText}>Test Voice Recognition</Text>
        </TouchableOpacity>
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
  commandsList: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  commandText: {
    fontSize: 14,
    color: '#CCC',
    marginBottom: 8,
    lineHeight: 20,
  },
  testButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 16,
  },
  testButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
});