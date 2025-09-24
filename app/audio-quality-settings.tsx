import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, Switch } from 'react-native';
import { ArrowLeft, Wifi, Smartphone, Volume2, ChevronRight, Waves, Link as LinkIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import SliderCompat from '@/components/SliderCompat';

type AudioQuality = 'low' | 'normal' | 'high' | 'lossless';

export default function AudioQualitySettings() {
  const insets = useSafeAreaInsets();
  const { settings, updateSetting } = useUser();
  
  const [wifiStreamingQuality, setWifiStreamingQuality] = useState<AudioQuality>('high');
  const [mobileStreamingQuality, setMobileStreamingQuality] = useState<AudioQuality>('normal');
  const [autoAdjustQuality, setAutoAdjustQuality] = useState(true);

  const crossfadeEnabled = useMemo(() => (settings?.crossfadeSeconds ?? 0) > 0, [settings?.crossfadeSeconds]);
  const crossfadeSeconds = settings?.crossfadeSeconds ?? 0;
  const gapless = settings?.gaplessPlayback ?? true;
  
  const qualityOptions: { value: AudioQuality; label: string; description: string }[] = [
    { value: 'low', label: 'Low (96 kbps)', description: 'Uses less data, lower quality' },
    { value: 'normal', label: 'Normal (160 kbps)', description: 'Good balance of quality and data usage' },
    { value: 'high', label: 'High (320 kbps)', description: 'Best quality, uses more data' },
    { value: 'lossless', label: 'Lossless (FLAC)', description: 'Studio quality, requires premium' },
  ];
  
  const showQualitySelector = (type: 'wifi' | 'mobile') => {
    const currentQuality = type === 'wifi' ? wifiStreamingQuality : mobileStreamingQuality;
    const setQuality = type === 'wifi' ? setWifiStreamingQuality : setMobileStreamingQuality;
    
    if (Platform.OS === 'web') {
      console.log(`${type} quality selector opened`);
      return;
    }
    
    const options = qualityOptions.map(option => ({
      text: option.label,
      onPress: () => setQuality(option.value),
      style: (option.value === currentQuality ? 'default' : 'cancel') as 'default' | 'cancel' | 'destructive',
    }));
    
    Alert.alert(
      `${type === 'wifi' ? 'WiFi' : 'Mobile'} Streaming Quality`,
      'Choose your preferred audio quality',
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
        <Text style={styles.title}>Audio Quality</Text>
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
                {qualityOptions.find(q => q.value === wifiStreamingQuality)?.label}
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
                {qualityOptions.find(q => q.value === mobileStreamingQuality)?.label}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => {
            setAutoAdjustQuality(!autoAdjustQuality);
            if (Platform.OS !== 'web') {
              Alert.alert(
                'Auto-adjust Quality',
                autoAdjustQuality 
                  ? 'Auto-adjust quality has been disabled' 
                  : 'Auto-adjust quality has been enabled'
              );
            }
          }}
          activeOpacity={0.8}
        >
          <View style={styles.itemContent}>
            <Volume2 size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Auto-adjust Quality</Text>
              <Text style={styles.settingsItemSubtext}>
                {autoAdjustQuality ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Playback</Text>

        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <Waves size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Crossfade</Text>
              <Text style={styles.settingsItemSubtext}>{crossfadeEnabled ? `${crossfadeSeconds}s` : 'Off'}</Text>
            </View>
          </View>
          <Switch
            testID="toggle-crossfade"
            value={crossfadeEnabled}
            onValueChange={(v) => {
              const seconds = v ? (settings.crossfadeSeconds > 0 ? settings.crossfadeSeconds : 6) : 0;
              void updateSetting('crossfadeSeconds', seconds);
            }}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={crossfadeEnabled ? '#FFF' : '#FFF'}
          />
        </View>

        {crossfadeEnabled && (
          <View style={styles.sliderRow}>
            <Text style={styles.sliderLabel}>Duration</Text>
            <View style={styles.sliderContainer}>
              <SliderCompat
                testID="slider-crossfade"
                minimumValue={0}
                maximumValue={12}
                step={1}
                value={crossfadeSeconds}
                onValueChange={(v) => void updateSetting('crossfadeSeconds', Math.max(0, Math.min(12, Math.round(v))))}
                minimumTrackTintColor="#1DB954"
                maximumTrackTintColor="#333"
                thumbTintColor="#FFFFFF"
              />
              <Text style={styles.sliderValue}>{crossfadeSeconds}s</Text>
            </View>
          </View>
        )}

        <View style={styles.settingsItemWithSwitch}>
          <View style={styles.itemContent}>
            <LinkIcon size={20} color="#1DB954" style={styles.itemIcon} />
            <View style={styles.itemText}>
              <Text style={styles.settingsItemText}>Gapless Playback</Text>
              <Text style={styles.settingsItemSubtext}>{gapless ? 'On' : 'Off'}</Text>
            </View>
          </View>
          <Switch
            testID="toggle-gapless"
            value={gapless}
            onValueChange={(v) => void updateSetting('gaplessPlayback', v)}
            trackColor={{ false: '#333', true: '#1DB954' }}
            thumbColor={gapless ? '#FFF' : '#FFF'}
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
            Higher quality audio uses more data. Consider using lower quality on mobile data to avoid exceeding your data plan.
          </Text>
        </View>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Auto-adjust Quality</Text>
          <Text style={styles.infoText}>
            When enabled, the app will automatically adjust quality based on your connection speed to prevent buffering.
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
  sliderRow: {
    paddingVertical: 12,
    gap: 8,
  },
  sliderLabel: {
    color: '#999',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderValue: {
    color: '#FFF',
    fontSize: 14,
    width: 36,
    textAlign: 'right',
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