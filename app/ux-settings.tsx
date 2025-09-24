import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import {
  Palette,
  Type,
  Zap,
  Eye,
  Smartphone,
  BarChart3,
  Settings,
  RefreshCw,
  Download,
  ChevronRight,
  Monitor,
  Volume2,
  Accessibility,
} from 'lucide-react-native';
import { useUX, Theme, AnimationSpeed, FontSize, HapticFeedback } from '@/contexts/UXContext';

interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  value?: string | boolean;
  onPress?: () => void;
  showChevron?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  title,
  subtitle,
  value,
  onPress,
  showChevron = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && (
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        )}
      </View>
      <View style={styles.settingValue}>
        {typeof value === 'boolean' ? (
          <Switch
            value={value}
            onValueChange={onPress}
            trackColor={{ false: '#374151', true: '#1DB954' }}
            thumbColor={value ? '#fff' : '#9CA3AF'}
          />
        ) : (
          <>
            {value && (
              <Text style={styles.valueText}>{value}</Text>
            )}
            {showChevron && (
              <ChevronRight size={20} color="#9CA3AF" />
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
};

export default function UXSettingsScreen() {
  const {
    accessibility,
    performance,
    ux,
    deviceInfo,
    updateAccessibilitySettings,
    updatePerformanceSettings,
    updateUXSettings,

    resetAllSettings,
    optimizeForDevice,
    exportAnalytics,
  } = useUX();

  const handleThemeChange = useCallback(() => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(ux.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    void updateUXSettings({ theme: nextTheme });
  }, [ux.theme, updateUXSettings]);

  const handleFontSizeChange = useCallback(() => {
    const sizes: FontSize[] = ['small', 'normal', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(ux.fontSize);
    const nextSize = sizes[(currentIndex + 1) % sizes.length];
    void updateUXSettings({ fontSize: nextSize });
  }, [ux.fontSize, updateUXSettings]);

  const handleAnimationSpeedChange = useCallback(() => {
    const speeds: AnimationSpeed[] = ['slow', 'normal', 'fast', 'disabled'];
    const currentIndex = speeds.indexOf(performance.animationSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    void updatePerformanceSettings({ animationSpeed: nextSpeed });
  }, [performance.animationSpeed, updatePerformanceSettings]);

  const handleHapticStrengthChange = useCallback(() => {
    const strengths: HapticFeedback[] = ['none', 'light', 'medium', 'heavy'];
    const currentIndex = strengths.indexOf(performance.hapticStrength);
    const nextStrength = strengths[(currentIndex + 1) % strengths.length];
    void updatePerformanceSettings({ hapticStrength: nextStrength });
  }, [performance.hapticStrength, updatePerformanceSettings]);

  const handleOptimizeForDevice = useCallback(async () => {
    try {
      await optimizeForDevice();
      Alert.alert('Success', 'Settings optimized for your device');
    } catch {
      Alert.alert('Error', 'Failed to optimize settings');
    }
  }, [optimizeForDevice]);

  const handleExportAnalytics = useCallback(async () => {
    try {
      const analytics = await exportAnalytics();
      Alert.alert('Analytics Exported', 'Analytics data has been generated');
      console.log('Analytics:', analytics);
    } catch {
      Alert.alert('Error', 'Failed to export analytics');
    }
  }, [exportAnalytics]);

  const handleResetSettings = useCallback(() => {
    Alert.alert(
      'Reset All Settings',
      'This will reset all UX settings to their default values. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetAllSettings();
            Alert.alert('Settings Reset', 'All settings have been reset to defaults.');
          },
        },
      ]
    );
  }, [resetAllSettings]);

  const formatTheme = (theme: Theme) => {
    switch (theme) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
      default: return 'Unknown';
    }
  };

  const formatFontSize = (size: FontSize) => {
    switch (size) {
      case 'small': return 'Small';
      case 'normal': return 'Normal';
      case 'large': return 'Large';
      case 'extra-large': return 'Extra Large';
      default: return 'Unknown';
    }
  };

  const formatAnimationSpeed = (speed: AnimationSpeed) => {
    switch (speed) {
      case 'slow': return 'Slow';
      case 'normal': return 'Normal';
      case 'fast': return 'Fast';
      case 'disabled': return 'Disabled';
      default: return 'Unknown';
    }
  };

  const formatHapticStrength = (strength: HapticFeedback) => {
    switch (strength) {
      case 'none': return 'None';
      case 'light': return 'Light';
      case 'medium': return 'Medium';
      case 'heavy': return 'Heavy';
      default: return 'Unknown';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'User Experience',
          headerStyle: { backgroundColor: '#0A0A0A' },
          headerTintColor: '#fff',
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Theme & Appearance */}
        <Section title="Theme & Appearance">
          <SettingRow
            icon={<Palette size={24} color="#3B82F6" />}
            title="Theme"
            subtitle="Choose your preferred color scheme"
            value={formatTheme(ux.theme)}
            onPress={handleThemeChange}
            showChevron
          />
          
          <SettingRow
            icon={<Type size={24} color="#10B981" />}
            title="Font Size"
            subtitle="Adjust text size for better readability"
            value={formatFontSize(ux.fontSize)}
            onPress={handleFontSizeChange}
            showChevron
          />
          
          <SettingRow
            icon={<Monitor size={24} color="#8B5CF6" />}
            title="Compact Mode"
            subtitle="Show more content in less space"
            value={ux.compactMode}
            onPress={() => updateUXSettings({ compactMode: !ux.compactMode })}
          />
        </Section>

        {/* Accessibility */}
        <Section title="Accessibility">
          <SettingRow
            icon={<Accessibility size={24} color="#F59E0B" />}
            title="High Contrast"
            subtitle="Increase contrast for better visibility"
            value={accessibility.highContrast}
            onPress={() => updateAccessibilitySettings({ highContrast: !accessibility.highContrast })}
          />
          
          <SettingRow
            icon={<Type size={24} color="#EF4444" />}
            title="Large Text"
            subtitle="Use larger text throughout the app"
            value={accessibility.largeText}
            onPress={() => updateAccessibilitySettings({ largeText: !accessibility.largeText })}
          />
          
          <SettingRow
            icon={<Eye size={24} color="#6B7280" />}
            title="Reduce Motion"
            subtitle="Minimize animations and transitions"
            value={accessibility.reduceMotion !== 'auto'}
            onPress={() => updateAccessibilitySettings({ 
              reduceMotion: accessibility.reduceMotion === 'auto' ? 'reduce' : 'auto' 
            })}
          />
          
          <SettingRow
            icon={<Settings size={24} color="#9CA3AF" />}
            title="Button Shapes"
            subtitle="Add shapes to buttons for clarity"
            value={accessibility.buttonShapes}
            onPress={() => updateAccessibilitySettings({ buttonShapes: !accessibility.buttonShapes })}
          />
        </Section>

        {/* Performance */}
        <Section title="Performance">
          <SettingRow
            icon={<Zap size={24} color="#F59E0B" />}
            title="Enable Animations"
            subtitle="Show smooth transitions and effects"
            value={performance.enableAnimations}
            onPress={() => updatePerformanceSettings({ enableAnimations: !performance.enableAnimations })}
          />
          
          <SettingRow
            icon={<BarChart3 size={24} color="#3B82F6" />}
            title="Animation Speed"
            subtitle="Control how fast animations play"
            value={formatAnimationSpeed(performance.animationSpeed)}
            onPress={handleAnimationSpeedChange}
            showChevron
          />
          
          <SettingRow
            icon={<Volume2 size={24} color="#10B981" />}
            title="Haptic Feedback"
            subtitle="Feel vibrations for interactions"
            value={performance.enableHaptics}
            onPress={() => updatePerformanceSettings({ enableHaptics: !performance.enableHaptics })}
          />
          
          <SettingRow
            icon={<Smartphone size={24} color="#8B5CF6" />}
            title="Haptic Strength"
            subtitle="Adjust vibration intensity"
            value={formatHapticStrength(performance.hapticStrength)}
            onPress={handleHapticStrengthChange}
            showChevron
          />
          
          <SettingRow
            icon={<Eye size={24} color="#EF4444" />}
            title="Enable Blur Effects"
            subtitle="Use blur for visual depth"
            value={performance.enableBlur}
            onPress={() => updatePerformanceSettings({ enableBlur: !performance.enableBlur })}
          />
          
          <SettingRow
            icon={<Settings size={24} color="#6B7280" />}
            title="Enable Shadows"
            subtitle="Add shadows to interface elements"
            value={performance.enableShadows}
            onPress={() => updatePerformanceSettings({ enableShadows: !performance.enableShadows })}
          />
        </Section>

        {/* Interaction */}
        <Section title="Interaction">
          <SettingRow
            icon={<Smartphone size={24} color="#3B82F6" />}
            title="Swipe Gestures"
            subtitle="Use swipe gestures for navigation"
            value={ux.enableSwipeGestures}
            onPress={() => updateUXSettings({ enableSwipeGestures: !ux.enableSwipeGestures })}
          />
          
          <SettingRow
            icon={<RefreshCw size={24} color="#10B981" />}
            title="Pull to Refresh"
            subtitle="Pull down to refresh content"
            value={ux.enablePullToRefresh}
            onPress={() => updateUXSettings({ enablePullToRefresh: !ux.enablePullToRefresh })}
          />
          
          <SettingRow
            icon={<Download size={24} color="#F59E0B" />}
            title="Infinite Scroll"
            subtitle="Automatically load more content"
            value={ux.enableInfiniteScroll}
            onPress={() => updateUXSettings({ enableInfiniteScroll: !ux.enableInfiniteScroll })}
          />
          
          <SettingRow
            icon={<BarChart3 size={24} color="#8B5CF6" />}
            title="Progress Indicators"
            subtitle="Show loading and progress bars"
            value={ux.showProgressIndicators}
            onPress={() => updateUXSettings({ showProgressIndicators: !ux.showProgressIndicators })}
          />
        </Section>

        {/* Device Information */}
        <Section title="Device Information">
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceInfoTitle}>Device Details</Text>
            <Text style={styles.deviceInfoText}>Platform: {deviceInfo.platform}</Text>
            <Text style={styles.deviceInfoText}>Version: {deviceInfo.version}</Text>
            <Text style={styles.deviceInfoText}>Screen: {deviceInfo.screenWidth}x{deviceInfo.screenHeight}</Text>
            <Text style={styles.deviceInfoText}>Type: {deviceInfo.isTablet ? 'Tablet' : 'Phone'}</Text>
            <Text style={styles.deviceInfoText}>Orientation: {deviceInfo.orientation}</Text>
          </View>
        </Section>

        {/* Actions */}
        <Section title="Actions">
          <SettingRow
            icon={<Zap size={24} color="#10B981" />}
            title="Optimize for Device"
            subtitle="Automatically adjust settings for best performance"
            onPress={handleOptimizeForDevice}
            showChevron
          />
          
          <SettingRow
            icon={<Download size={24} color="#3B82F6" />}
            title="Export Analytics"
            subtitle="Download usage and performance data"
            onPress={handleExportAnalytics}
            showChevron
          />
          
          <SettingRow
            icon={<RefreshCw size={24} color="#EF4444" />}
            title="Reset All Settings"
            subtitle="Restore all settings to defaults"
            onPress={handleResetSettings}
            showChevron
          />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    marginHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginRight: 8,
  },
  deviceInfo: {
    padding: 16,
  },
  deviceInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  deviceInfoText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
});