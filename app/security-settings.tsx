import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import {
  Shield,
  Lock,
  Fingerprint,
  Smartphone,
  Clock,
  AlertTriangle,
  Download,
  Trash2,
  Settings,
  Eye,
  Activity,
  FileText,
  ChevronRight,
} from 'lucide-react-native';
import { useSecurity, SecurityLevel, AuthMethod, SessionTimeout } from '@/contexts/SecurityContext';

interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  value?: string | boolean;
  onPress?: () => void;
  showChevron?: boolean;
  danger?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  title,
  subtitle,
  value,
  onPress,
  showChevron = false,
  danger = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.settingRow, danger && styles.dangerRow]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, danger && styles.dangerText]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        )}
      </View>
      <View style={styles.settingValue}>
        {typeof value === 'boolean' ? (
          <Switch
            value={value}
            onValueChange={onPress}
            trackColor={{ false: '#374151', true: '#3B82F6' }}
            thumbColor={value ? '#fff' : '#9CA3AF'}
          />
        ) : (
          <>
            {value && (
              <Text style={[styles.valueText, danger && styles.dangerText]}>
                {value}
              </Text>
            )}
            {showChevron && (
              <ChevronRight size={20} color={danger ? '#EF4444' : '#9CA3AF'} />
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

export default function SecuritySettingsScreen() {
  const {
    settings,
    biometricAvailable,
    biometricType,
    securityEvents,
    activeSessions,
    updateSecuritySettings,
    setupPin,
    changePin,
    enableTwoFactor,
    clearSecurityEvents,
    endAllSessions,
    wipeAllData,
    exportSecurityReport,
  } = useSecurity();

  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showPinChange, setShowPinChange] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');

  const handleSecurityLevelChange = useCallback(() => {
    const levels: SecurityLevel[] = ['low', 'medium', 'high', 'maximum'];
    const currentIndex = levels.indexOf(settings.securityLevel);
    const nextLevel = levels[(currentIndex + 1) % levels.length];
    void updateSecuritySettings({ securityLevel: nextLevel });
  }, [settings.securityLevel, updateSecuritySettings]);

  const handleAuthMethodChange = useCallback(() => {
    const methods: AuthMethod[] = ['none', 'pin', 'biometric', 'both'];
    const currentIndex = methods.indexOf(settings.authMethod);
    const nextMethod = methods[(currentIndex + 1) % methods.length];
    
    if (nextMethod === 'biometric' && !biometricAvailable) {
      Alert.alert('Biometric Not Available', 'Biometric authentication is not available on this device.');
      return;
    }
    
    void updateSecuritySettings({ authMethod: nextMethod });
  }, [settings.authMethod, updateSecuritySettings, biometricAvailable]);

  const handleSessionTimeoutChange = useCallback(() => {
    const timeouts: SessionTimeout[] = ['never', '5min', '15min', '30min', '1hour', '4hours'];
    const currentIndex = timeouts.indexOf(settings.sessionTimeout);
    const nextTimeout = timeouts[(currentIndex + 1) % timeouts.length];
    void updateSecuritySettings({ sessionTimeout: nextTimeout });
  }, [settings.sessionTimeout, updateSecuritySettings]);

  const handlePinSetup = useCallback(async () => {
    if (pin.length < 4) {
      Alert.alert('Invalid PIN', 'PIN must be at least 4 digits');
      return;
    }
    if (pin !== confirmPin) {
      Alert.alert('PIN Mismatch', 'PINs do not match');
      return;
    }

    try {
      await setupPin(pin);
      setShowPinSetup(false);
      setPin('');
      setConfirmPin('');
      Alert.alert('Success', 'PIN has been set up successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to set up PIN');
    }
  }, [pin, confirmPin, setupPin]);

  const handlePinChange = useCallback(async () => {
    if (pin.length < 4) {
      Alert.alert('Invalid PIN', 'New PIN must be at least 4 digits');
      return;
    }
    if (pin !== confirmPin) {
      Alert.alert('PIN Mismatch', 'PINs do not match');
      return;
    }

    try {
      await changePin(currentPin, pin);
      setShowPinChange(false);
      setPin('');
      setConfirmPin('');
      setCurrentPin('');
      Alert.alert('Success', 'PIN has been changed successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to change PIN. Please check your current PIN.');
    }
  }, [currentPin, pin, confirmPin, changePin]);

  const handleTwoFactorSetup = useCallback(async () => {
    try {
      const backupCode = await enableTwoFactor();
      setShowTwoFactorSetup(false);
      Alert.alert(
        'Two-Factor Authentication Enabled',
        `Your backup code is: ${backupCode}\\n\\nPlease save this code in a secure location.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to enable two-factor authentication');
    }
  }, [enableTwoFactor]);

  const handleExportReport = useCallback(async () => {
    try {
      const report = await exportSecurityReport();
      Alert.alert('Security Report', 'Report generated successfully');
      console.log('Security Report:', report);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate security report');
    }
  }, [exportSecurityReport]);

  const handleWipeData = useCallback(() => {
    Alert.alert(
      'Wipe All Data',
      'This will permanently delete all app data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Wipe Data',
          style: 'destructive',
          onPress: async () => {
            await wipeAllData();
            Alert.alert('Data Wiped', 'All app data has been permanently deleted.');
          },
        },
      ]
    );
  }, [wipeAllData]);

  const getSecurityLevelColor = () => {
    switch (settings.securityLevel) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      case 'maximum': return '#7C3AED';
      default: return '#6B7280';
    }
  };

  const formatAuthMethod = (method: AuthMethod) => {
    switch (method) {
      case 'none': return 'None';
      case 'pin': return 'PIN Only';
      case 'biometric': return 'Biometric Only';
      case 'both': return 'PIN + Biometric';
      default: return 'Unknown';
    }
  };

  const formatSessionTimeout = (timeout: SessionTimeout) => {
    switch (timeout) {
      case 'never': return 'Never';
      case '5min': return '5 minutes';
      case '15min': return '15 minutes';
      case '30min': return '30 minutes';
      case '1hour': return '1 hour';
      case '4hours': return '4 hours';
      default: return 'Unknown';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Security Settings',
          headerStyle: { backgroundColor: '#111827' },
          headerTintColor: '#fff',
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Security Level */}
        <Section title="Security Level">
          <SettingRow
            icon={<Shield size={24} color={getSecurityLevelColor()} />}
            title="Security Level"
            subtitle="Adjust overall security settings"
            value={settings.securityLevel.toUpperCase()}
            onPress={handleSecurityLevelChange}
            showChevron
          />
        </Section>

        {/* Authentication */}
        <Section title="Authentication">
          <SettingRow
            icon={<Lock size={24} color="#3B82F6" />}
            title="Authentication Method"
            subtitle="How you unlock the app"
            value={formatAuthMethod(settings.authMethod)}
            onPress={handleAuthMethodChange}
            showChevron
          />
          
          {biometricAvailable && (
            <SettingRow
              icon={<Fingerprint size={24} color="#10B981" />}
              title="Biometric Authentication"
              subtitle={`${biometricType.includes(1) ? 'Face ID' : 'Touch ID'} available`}
              value={settings.biometricEnabled}
              onPress={() => updateSecuritySettings({ biometricEnabled: !settings.biometricEnabled })}
            />
          )}
          
          <SettingRow
            icon={<Smartphone size={24} color="#F59E0B" />}
            title="PIN Setup"
            subtitle={settings.pinEnabled ? 'Change your PIN' : 'Set up a PIN'}
            onPress={() => settings.pinEnabled ? setShowPinChange(true) : setShowPinSetup(true)}
            showChevron
          />
          
          <SettingRow
            icon={<Shield size={24} color="#8B5CF6" />}
            title="Two-Factor Authentication"
            subtitle={settings.twoFactorEnabled ? 'Enabled' : 'Add extra security'}
            value={settings.twoFactorEnabled}
            onPress={() => !settings.twoFactorEnabled && setShowTwoFactorSetup(true)}
          />
        </Section>

        {/* Session Management */}
        <Section title="Session Management">
          <SettingRow
            icon={<Clock size={24} color="#6B7280" />}
            title="Auto-Lock Timeout"
            subtitle="Lock app after inactivity"
            value={formatSessionTimeout(settings.sessionTimeout)}
            onPress={handleSessionTimeoutChange}
            showChevron
          />
          
          <SettingRow
            icon={<Activity size={24} color="#EF4444" />}
            title="Active Sessions"
            subtitle={`${activeSessions.length} active session${activeSessions.length !== 1 ? 's' : ''}`}
            onPress={() => endAllSessions()}
            showChevron
          />
        </Section>

        {/* Privacy & Data */}
        <Section title="Privacy & Data">
          <SettingRow
            icon={<Eye size={24} color="#9CA3AF" />}
            title="Allow Screenshots"
            subtitle="Prevent screenshots in sensitive areas"
            value={settings.allowScreenshots}
            onPress={() => updateSecuritySettings({ allowScreenshots: !settings.allowScreenshots })}
          />
          
          <SettingRow
            icon={<Settings size={24} color="#9CA3AF" />}
            title="Hide in App Switcher"
            subtitle="Hide app content when switching apps"
            value={settings.hideInAppSwitcher}
            onPress={() => updateSecuritySettings({ hideInAppSwitcher: !settings.hideInAppSwitcher })}
          />
          
          <SettingRow
            icon={<AlertTriangle size={24} color="#F59E0B" />}
            title="Wipe After Failed Attempts"
            subtitle={`Wipe data after ${settings.maxFailedAttempts} failed attempts`}
            value={settings.wipeDataAfterFailedAttempts}
            onPress={() => updateSecuritySettings({ wipeDataAfterFailedAttempts: !settings.wipeDataAfterFailedAttempts })}
          />
        </Section>

        {/* Security Events */}
        <Section title="Security Events">
          <SettingRow
            icon={<FileText size={24} color="#3B82F6" />}
            title="Security Events"
            subtitle={`${securityEvents.length} events logged`}
            showChevron
          />
          
          <SettingRow
            icon={<Download size={24} color="#10B981" />}
            title="Export Security Report"
            subtitle="Download security audit report"
            onPress={handleExportReport}
            showChevron
          />
          
          <SettingRow
            icon={<Trash2 size={24} color="#EF4444" />}
            title="Clear Security Events"
            subtitle="Remove all logged security events"
            onPress={() => clearSecurityEvents()}
            danger
          />
        </Section>

        {/* Danger Zone */}
        <Section title="Danger Zone">
          <SettingRow
            icon={<AlertTriangle size={24} color="#EF4444" />}
            title="Wipe All Data"
            subtitle="Permanently delete all app data"
            onPress={handleWipeData}
            danger
            showChevron
          />
        </Section>
      </ScrollView>

      {/* PIN Setup Modal */}
      <Modal visible={showPinSetup} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Set Up PIN</Text>
            <TouchableOpacity onPress={() => setShowPinSetup(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={setPin}
              placeholder="Enter new PIN"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
            />
            
            <TextInput
              style={styles.pinInput}
              value={confirmPin}
              onChangeText={setConfirmPin}
              placeholder="Confirm new PIN"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
            />
            
            <TouchableOpacity
              style={[styles.modalButton, (!pin || !confirmPin) && styles.modalButtonDisabled]}
              onPress={handlePinSetup}
              disabled={!pin || !confirmPin}
            >
              <Text style={styles.modalButtonText}>Set PIN</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* PIN Change Modal */}
      <Modal visible={showPinChange} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Change PIN</Text>
            <TouchableOpacity onPress={() => setShowPinChange(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <TextInput
              style={styles.pinInput}
              value={currentPin}
              onChangeText={setCurrentPin}
              placeholder="Enter current PIN"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
            />
            
            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={setPin}
              placeholder="Enter new PIN"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
            />
            
            <TextInput
              style={styles.pinInput}
              value={confirmPin}
              onChangeText={setConfirmPin}
              placeholder="Confirm new PIN"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
            />
            
            <TouchableOpacity
              style={[styles.modalButton, (!currentPin || !pin || !confirmPin) && styles.modalButtonDisabled]}
              onPress={handlePinChange}
              disabled={!currentPin || !pin || !confirmPin}
            >
              <Text style={styles.modalButtonText}>Change PIN</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Two-Factor Setup Modal */}
      <Modal visible={showTwoFactorSetup} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Enable Two-Factor Authentication</Text>
            <TouchableOpacity onPress={() => setShowTwoFactorSetup(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <Text style={styles.modalDescription}>
              Two-factor authentication adds an extra layer of security to your account.
              You'll receive a backup code that you can use to access your account.
            </Text>
            
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleTwoFactorSetup}
            >
              <Text style={styles.modalButtonText}>Enable Two-Factor Auth</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
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
    backgroundColor: '#1F2937',
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
    borderBottomColor: '#374151',
  },
  dangerRow: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
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
  dangerText: {
    color: '#EF4444',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#111827',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  modalCancel: {
    fontSize: 16,
    color: '#3B82F6',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  modalDescription: {
    fontSize: 16,
    color: '#9CA3AF',
    lineHeight: 24,
    marginBottom: 32,
    textAlign: 'center',
  },
  pinInput: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  modalButtonDisabled: {
    backgroundColor: '#374151',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});