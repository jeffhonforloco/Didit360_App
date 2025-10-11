import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { trpc } from '@/lib/trpc';

export function AuthDebugger() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Unknown');
  const [testResult, setTestResult] = useState<string>('Not tested');

  const testConnection = async () => {
    try {
      setConnectionStatus('Testing...');
      console.log('[AuthDebugger] Testing tRPC connection...');
      
      // Test basic connection
      const result = await trpc.health.check.query();
      console.log('[AuthDebugger] Health check result:', result);
      setConnectionStatus('Connected ✅');
      setTestResult('Health check passed');
    } catch (error) {
      console.error('[AuthDebugger] Connection test failed:', error);
      setConnectionStatus('Failed ❌');
      setTestResult(`Error: ${error}`);
    }
  };

  const testSignup = async () => {
    try {
      console.log('[AuthDebugger] Testing signup...');
      const result = await trpc.auth.signup.mutate({
        email: 'test@example.com',
        password: 'testpass123',
        displayName: 'Test User',
      });
      console.log('[AuthDebugger] Signup result:', result);
      Alert.alert('Success', 'Signup test passed');
    } catch (error) {
      console.error('[AuthDebugger] Signup test failed:', error);
      Alert.alert('Error', `Signup failed: ${error}`);
    }
  };

  const testSignin = async () => {
    try {
      console.log('[AuthDebugger] Testing signin...');
      const result = await trpc.auth.signin.mutate({
        email: 'test@example.com',
        password: 'testpass123',
      });
      console.log('[AuthDebugger] Signin result:', result);
      Alert.alert('Success', 'Signin test passed');
    } catch (error) {
      console.error('[AuthDebugger] Signin test failed:', error);
      Alert.alert('Error', `Signin failed: ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auth Debug Info</Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Connection:</Text>
        <Text style={styles.value}>{connectionStatus}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Test Result:</Text>
        <Text style={styles.value}>{testResult}</Text>
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={testConnection}>
          <Text style={styles.buttonText}>Test Connection</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={testSignup}>
          <Text style={styles.buttonText}>Test Signup</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={testSignin}>
          <Text style={styles.buttonText}>Test Signin</Text>
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
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#FF0080',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    margin: 2,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
});
