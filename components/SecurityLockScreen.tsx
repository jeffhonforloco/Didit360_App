import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { 
  Shield, 
  Lock, 
  Fingerprint, 
  Eye, 
  EyeOff, 
  AlertTriangle,

} from 'lucide-react-native';
import { useSecurity } from '@/contexts/SecurityContext';

interface SecurityLockScreenProps {
  onUnlock: () => void;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
  showCancel?: boolean;
}

export const SecurityLockScreen: React.FC<SecurityLockScreenProps> = ({
  onUnlock,
  onCancel,
  title = 'Unlock App',
  subtitle = 'Enter your PIN or use biometric authentication',
  showCancel = false,
}) => {
  const {
    settings,
    biometricAvailable,
    biometricType,
    failedAttempts,
    authenticate,
    verifyPin,
  } = useSecurity();

  const [pin, setPin] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [fadeAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto-trigger biometric if available and enabled
    if (biometricAvailable && settings.biometricEnabled) {
      void handleBiometricAuth();
    }
  }, []);

  const shakeScreen = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shakeAnimation]);

  const handleBiometricAuth = useCallback(async () => {
    if (!biometricAvailable) return;

    try {
      setIsAuthenticating(true);
      const success = await authenticate('biometric');
      
      if (success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onUnlock();
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        shakeScreen();
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shakeScreen();
    } finally {
      setIsAuthenticating(false);
    }
  }, [biometricAvailable, authenticate, onUnlock, shakeScreen]);

  const handlePinSubmit = useCallback(async () => {
    if (pin.length < 4) {
      Alert.alert('Invalid PIN', 'PIN must be at least 4 digits');
      return;
    }

    try {
      setIsAuthenticating(true);
      const isValid = await verifyPin(pin);
      
      if (isValid) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onUnlock();
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setPin('');
        shakeScreen();
        Alert.alert('Incorrect PIN', 'Please try again');
      }
    } catch (error) {
      console.error('PIN verification failed:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shakeScreen();
    } finally {
      setIsAuthenticating(false);
    }
  }, [pin, verifyPin, onUnlock, shakeScreen]);

  const handlePinKeyPress = useCallback((digit: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (digit === 'backspace') {
      setPin(prev => prev.slice(0, -1));
    } else if (pin.length < 6) {
      setPin(prev => prev + digit);
    }
  }, [pin]);

  const getBiometricIcon = () => {
    if (!biometricType.length) return <Fingerprint size={32} color="#fff" />;
    
    // This is a simplified mapping - in a real app you'd handle all types
    return <Fingerprint size={32} color="#fff" />;
  };

  const renderPinDots = () => {
    return (
      <View style={styles.pinDotsContainer}>
        {Array.from({ length: 6 }, (_, index) => (
          <View
            key={index}
            style={[
              styles.pinDot,
              index < pin.length && styles.pinDotFilled,
            ]}
          />
        ))}
      </View>
    );
  };

  const renderKeypad = () => {
    const keys = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', 'backspace'],
    ];

    return (
      <View style={styles.keypad}>
        {keys.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((key, keyIndex) => {
              if (key === '') {
                return <View key={keyIndex} style={styles.keypadButton} />;
              }
              
              return (
                <TouchableOpacity
                  key={keyIndex}
                  style={styles.keypadButton}
                  onPress={() => handlePinKeyPress(key)}
                  disabled={isAuthenticating}
                >
                  {key === 'backspace' ? (
                    <Text style={styles.keypadButtonText}>⌫</Text>
                  ) : (
                    <Text style={styles.keypadButtonText}>{key}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const getSecurityLevelColor = () => {
    switch (settings.securityLevel) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      case 'maximum': return '#7C3AED';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.gradient}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnimation,
              transform: [{ translateX: shakeAnimation }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Shield size={48} color="#fff" />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
            
            {/* Security Level Indicator */}
            <View style={styles.securityIndicator}>
              <View
                style={[
                  styles.securityDot,
                  { backgroundColor: getSecurityLevelColor() },
                ]}
              />
              <Text style={styles.securityText}>
                {settings.securityLevel.toUpperCase()} SECURITY
              </Text>
            </View>
          </View>

          {/* Failed Attempts Warning */}
          {failedAttempts > 0 && (
            <View style={styles.warningContainer}>
              <AlertTriangle size={20} color="#EF4444" />
              <Text style={styles.warningText}>
                {failedAttempts} failed attempt{failedAttempts > 1 ? 's' : ''}
                {settings.wipeDataAfterFailedAttempts && (
                  ` (${settings.maxFailedAttempts - failedAttempts} remaining)`
                )}
              </Text>
            </View>
          )}

          {/* Authentication Methods */}
          <View style={styles.authContainer}>
            {/* PIN Input */}
            {settings.pinEnabled && (
              <View style={styles.pinContainer}>
                {renderPinDots()}
                {renderKeypad()}
              </View>
            )}

            {/* Biometric Button */}
            {biometricAvailable && settings.biometricEnabled && (
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricAuth}
                disabled={isAuthenticating}
              >
                <BlurView intensity={20} style={styles.biometricButtonBlur}>
                  {getBiometricIcon()}
                  <Text style={styles.biometricButtonText}>
                    Use {biometricType.includes(1) ? 'Face ID' : 'Touch ID'}
                  </Text>
                </BlurView>
              </TouchableOpacity>
            )}

            {/* Manual PIN Entry (fallback) */}
            {settings.pinEnabled && !settings.biometricEnabled && (
              <View style={styles.manualPinContainer}>
                <View style={styles.pinInputContainer}>
                  <TextInput
                    style={styles.pinInput}
                    value={pin}
                    onChangeText={setPin}
                    placeholder="Enter PIN"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPin}
                    keyboardType="numeric"
                    maxLength={6}
                    onSubmitEditing={handlePinSubmit}
                  />
                  <TouchableOpacity
                    style={styles.pinToggle}
                    onPress={() => setShowPin(!showPin)}
                  >
                    {showPin ? (
                      <EyeOff size={20} color="#9CA3AF" />
                    ) : (
                      <Eye size={20} color="#9CA3AF" />
                    )}
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handlePinSubmit}
                  disabled={isAuthenticating || pin.length < 4}
                >
                  <Text style={styles.submitButtonText}>
                    {isAuthenticating ? 'Verifying...' : 'Unlock'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Cancel Button */}
          {showCancel && onCancel && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Lock size={16} color="#6B7280" />
            <Text style={styles.footerText}>
              Your data is protected with end-to-end encryption
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
  securityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  securityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  securityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  warningText: {
    fontSize: 14,
    color: '#EF4444',
    marginLeft: 8,
    fontWeight: '500',
  },
  authContainer: {
    width: '100%',
    alignItems: 'center',
  },
  pinContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  pinDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 8,
  },
  pinDotFilled: {
    backgroundColor: '#fff',
  },
  keypad: {
    alignItems: 'center',
  },
  keypadRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  keypadButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  keypadButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  biometricButton: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  biometricButtonBlur: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: 'center',
  },
  biometricButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
  },
  manualPinContainer: {
    width: '100%',
    alignItems: 'center',
  },
  pinInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  pinInput: {
    flex: 1,
    height: 56,
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  pinToggle: {
    padding: 8,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 120,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
    textAlign: 'center',
  },
});