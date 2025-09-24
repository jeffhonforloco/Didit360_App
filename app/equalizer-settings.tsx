import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Platform } from 'react-native';
import { ArrowLeft, Volume2, Music, Headphones } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import SliderCompat from '@/components/SliderCompat';

type EQPreset = 'off' | 'rock' | 'pop' | 'jazz' | 'classical' | 'electronic' | 'hip-hop' | 'custom';

export default function EqualizerSettings() {
  const insets = useSafeAreaInsets();
  const { settings, updateSetting } = useUser();
  
  const [equalizerEnabled, setEqualizerEnabled] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<EQPreset>('off');
  const [bassBoost, setBassBoost] = useState(0);
  const [virtualizer, setVirtualizer] = useState(0);
  
  // EQ band frequencies (Hz) and their current values (dB)
  const [eqBands, setEqBands] = useState([
    { frequency: '60Hz', value: 0 },
    { frequency: '170Hz', value: 0 },
    { frequency: '310Hz', value: 0 },
    { frequency: '600Hz', value: 0 },
    { frequency: '1kHz', value: 0 },
    { frequency: '3kHz', value: 0 },
    { frequency: '6kHz', value: 0 },
    { frequency: '12kHz', value: 0 },
    { frequency: '14kHz', value: 0 },
    { frequency: '16kHz', value: 0 },
  ]);
  
  const presets: { value: EQPreset; label: string; description: string }[] = [
    { value: 'off', label: 'Off', description: 'No equalization' },
    { value: 'rock', label: 'Rock', description: 'Enhanced bass and treble' },
    { value: 'pop', label: 'Pop', description: 'Balanced with vocal emphasis' },
    { value: 'jazz', label: 'Jazz', description: 'Warm mids and smooth highs' },
    { value: 'classical', label: 'Classical', description: 'Natural and detailed' },
    { value: 'electronic', label: 'Electronic', description: 'Deep bass and crisp highs' },
    { value: 'hip-hop', label: 'Hip-Hop', description: 'Heavy bass emphasis' },
    { value: 'custom', label: 'Custom', description: 'Your personalized settings' },
  ];
  
  const applyPreset = (preset: EQPreset) => {
    setSelectedPreset(preset);
    
    // Apply preset EQ curves
    const presetValues: Record<EQPreset, number[]> = {
      'off': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      'rock': [3, 2, -1, -2, 1, 2, 3, 4, 4, 3],
      'pop': [1, 2, 3, 2, 0, -1, 1, 2, 2, 1],
      'jazz': [2, 1, 0, 1, 2, 1, 0, 1, 2, 1],
      'classical': [0, 0, 0, 0, 0, 0, -1, -1, -1, -2],
      'electronic': [4, 3, 1, 0, -1, 1, 2, 3, 4, 4],
      'hip-hop': [5, 4, 2, 1, 0, -1, 1, 2, 3, 3],
      'custom': eqBands.map(band => band.value),
    };
    
    const newValues = presetValues[preset];
    setEqBands(eqBands.map((band, index) => ({
      ...band,
      value: newValues[index],
    })));
  };
  
  const updateEQBand = (index: number, value: number) => {
    const newBands = [...eqBands];
    newBands[index].value = value;
    setEqBands(newBands);
    setSelectedPreset('custom');
  };
  
  const resetEqualizer = () => {
    if (Platform.OS === 'web') {
      console.log('Equalizer reset');
    } else {
      Alert.alert(
        'Reset Equalizer',
        'This will reset all equalizer settings to default.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Reset', 
            style: 'destructive', 
            onPress: () => applyPreset('off')
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
        <Text style={styles.title}>Equalizer</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Volume2 size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Equalizer</Text>
              <Text style={styles.settingsItemSubtext}>Customize your audio experience</Text>
            </View>
          </View>
          <Switch
            value={equalizerEnabled}
            onValueChange={setEqualizerEnabled}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={equalizerEnabled ? '#FFF' : '#FFF'}
          />
        </View>
        
        {equalizerEnabled && (
          <>
            <Text style={styles.sectionTitle}>Presets</Text>
            
            <View style={styles.presetsGrid}>
              {presets.map((preset) => (
                <TouchableOpacity
                  key={preset.value}
                  style={[
                    styles.presetButton,
                    selectedPreset === preset.value && styles.presetButtonActive
                  ]}
                  onPress={() => applyPreset(preset.value)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.presetButtonText,
                    selectedPreset === preset.value && styles.presetButtonTextActive
                  ]}>
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.sectionTitle}>Manual Adjustment</Text>
            
            <View style={styles.equalizerContainer}>
              <View style={styles.eqBands}>
                {eqBands.map((band, index) => (
                  <View key={band.frequency} style={styles.eqBand}>
                    <Text style={styles.eqValue}>
                      {band.value > 0 ? '+' : ''}{band.value}dB
                    </Text>
                    <View style={styles.sliderContainer}>
                      <SliderCompat
                        style={styles.verticalSlider}
                        value={band.value}
                        minimumValue={-12}
                        maximumValue={12}
                        step={1}
                        onValueChange={(value: number) => updateEQBand(index, value)}
                        minimumTrackTintColor="#1DB954"
                        maximumTrackTintColor="#333"
                        thumbTintColor="#FFF"
                      />
                    </View>
                    <Text style={styles.eqFrequency}>{band.frequency}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Audio Effects</Text>
            
            <View style={styles.effectContainer}>
              <View style={styles.effectItem}>
                <View style={styles.itemContent}>
                  <Music size={20} color="#1DB954" style={styles.itemIcon} />
                  <View style={styles.itemText}>
                    <Text style={styles.settingsItemText}>Bass Boost</Text>
                    <Text style={styles.settingsItemSubtext}>{bassBoost}%</Text>
                  </View>
                </View>
                <View style={styles.effectSlider}>
                  <SliderCompat
                    style={styles.slider}
                    value={bassBoost}
                    minimumValue={0}
                    maximumValue={100}
                    step={10}
                    onValueChange={setBassBoost}
                    minimumTrackTintColor="#1DB954"
                    maximumTrackTintColor="#333"
                    thumbTintColor="#FFF"
                  />
                </View>
              </View>
              
              <View style={styles.effectItem}>
                <View style={styles.itemContent}>
                  <Headphones size={20} color="#1DB954" style={styles.itemIcon} />
                  <View style={styles.itemText}>
                    <Text style={styles.settingsItemText}>Virtualizer</Text>
                    <Text style={styles.settingsItemSubtext}>{virtualizer}%</Text>
                  </View>
                </View>
                <View style={styles.effectSlider}>
                  <SliderCompat
                    style={styles.slider}
                    value={virtualizer}
                    minimumValue={0}
                    maximumValue={100}
                    step={10}
                    onValueChange={setVirtualizer}
                    minimumTrackTintColor="#1DB954"
                    maximumTrackTintColor="#333"
                    thumbTintColor="#FFF"
                  />
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={resetEqualizer}
              activeOpacity={0.8}
            >
              <Text style={styles.resetButtonText}>Reset to Default</Text>
            </TouchableOpacity>
          </>
        )}
        
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Equalizer Tips</Text>
          <Text style={styles.infoText}>
            • Use presets for quick setup{'\n'}
            • Boost frequencies you want to emphasize{'\n'}
            • Cut frequencies to reduce harshness{'\n'}
            • Small adjustments often work best
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
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  presetButton: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  presetButtonActive: {
    backgroundColor: '#1DB954',
    borderColor: '#1DB954',
  },
  presetButtonText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '500',
  },
  presetButtonTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  equalizerContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  eqBands: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 200,
  },
  eqBand: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },
  eqValue: {
    fontSize: 12,
    color: '#1DB954',
    fontWeight: '600',
    marginBottom: 8,
    minHeight: 16,
  },
  sliderContainer: {
    flex: 1,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalSlider: {
    width: 150,
    height: 30,
    transform: [{ rotate: '-90deg' }],
  },
  eqFrequency: {
    fontSize: 10,
    color: '#999',
    marginTop: 8,
    transform: [{ rotate: '-45deg' }],
  },
  effectContainer: {
    marginBottom: 24,
  },
  effectItem: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  effectSlider: {
    marginTop: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  resetButton: {
    backgroundColor: '#333',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 24,
  },
  resetButtonText: {
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