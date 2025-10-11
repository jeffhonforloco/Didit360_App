import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { simpleAudioEngine } from '@/lib/AudioEngineSimple';
import { usePlayer } from '@/contexts/PlayerContext';

export function PlayerDebugger() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const { currentTrack, isPlaying } = usePlayer();

  const updateDebugInfo = () => {
    const engineTrack = simpleAudioEngine.getCurrentTrack();
    const enginePlaying = simpleAudioEngine.getIsPlaying();
    
    setDebugInfo({
      currentTrack: currentTrack?.title || 'None',
      engineTrack: engineTrack?.title || 'None',
      isPlaying,
      enginePlaying,
      volume: simpleAudioEngine.getVolume(),
      tracksMatch: currentTrack?.id === engineTrack?.id,
      statesMatch: isPlaying === enginePlaying,
    });
  };

  useEffect(() => {
    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 1000);
    return () => clearInterval(interval);
  }, [currentTrack, isPlaying]);

  const testAudio = async () => {
    try {
      if (currentTrack) {
        console.log('[PlayerDebugger] Testing audio with track:', currentTrack.title);
        await simpleAudioEngine.loadAndPlay(currentTrack);
        console.log('[PlayerDebugger] Audio test successful');
        Alert.alert('Success', 'Audio test completed successfully');
      } else {
        Alert.alert('Error', 'No current track available');
      }
    } catch (error) {
      console.error('[PlayerDebugger] Audio test failed:', error);
      Alert.alert('Error', `Audio test failed: ${error}`);
    }
  };

  const testPlayPause = async () => {
    try {
      if (simpleAudioEngine.getIsPlaying()) {
        await simpleAudioEngine.pause();
        console.log('[PlayerDebugger] Paused audio');
      } else {
        await simpleAudioEngine.play();
        console.log('[PlayerDebugger] Played audio');
      }
    } catch (error) {
      console.error('[PlayerDebugger] Play/pause test failed:', error);
      Alert.alert('Error', `Play/pause test failed: ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Player Debug Info</Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Current Track:</Text>
        <Text style={styles.value}>{debugInfo.currentTrack}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Engine Track:</Text>
        <Text style={styles.value}>{debugInfo.engineTrack}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>UI Playing:</Text>
        <Text style={[styles.value, { color: debugInfo.isPlaying ? '#4CAF50' : '#F44336' }]}>
          {debugInfo.isPlaying ? 'Yes' : 'No'}
        </Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Engine Playing:</Text>
        <Text style={[styles.value, { color: debugInfo.enginePlaying ? '#4CAF50' : '#F44336' }]}>
          {debugInfo.enginePlaying ? 'Yes' : 'No'}
        </Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Volume:</Text>
        <Text style={styles.value}>{Math.round(debugInfo.volume * 100)}%</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Tracks Match:</Text>
        <Text style={[styles.value, { color: debugInfo.tracksMatch ? '#4CAF50' : '#F44336' }]}>
          {debugInfo.tracksMatch ? 'Yes' : 'No'}
        </Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>States Match:</Text>
        <Text style={[styles.value, { color: debugInfo.statesMatch ? '#4CAF50' : '#F44336' }]}>
          {debugInfo.statesMatch ? 'Yes' : 'No'}
        </Text>
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={testAudio}>
          <Text style={styles.buttonText}>Test Audio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={testPlayPause}>
          <Text style={styles.buttonText}>Test Play/Pause</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#CCC',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#FFF',
    flex: 1,
    textAlign: 'right',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#FF0080',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
