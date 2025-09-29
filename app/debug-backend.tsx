import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { trpc } from '@/lib/trpc';

export default function DebugBackend() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isTestingBasic, setIsTestingBasic] = useState(false);
  const [isTestingAdmin, setIsTestingAdmin] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
  };

  // Test basic tRPC connection
  const hiQuery = trpc.example.hiQuery.useQuery(
    { name: 'Debug Test' },
    { 
      enabled: isTestingBasic,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );

  // Test admin dashboard stats
  const statsQuery = trpc.admin.dashboard.getStats.useQuery(
    undefined,
    { 
      enabled: isTestingAdmin,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
  
  // Handle query results with useEffect
  useEffect(() => {
    if (hiQuery.data) {
      addLog(`✅ Basic tRPC Success: ${hiQuery.data.hello}`);
    } else if (hiQuery.error) {
      addLog(`❌ Basic tRPC Error: ${hiQuery.error.message}`);
    }
  }, [hiQuery.data, hiQuery.error]);
  
  useEffect(() => {
    if (statsQuery.data) {
      addLog(`✅ Admin Stats Success: ${statsQuery.data.platform.activeUsers} users`);
    } else if (statsQuery.error) {
      addLog(`❌ Admin Stats Error: ${statsQuery.error.message}`);
    }
  }, [statsQuery.data, statsQuery.error]);

  const testBasicConnection = () => {
    addLog('🔄 Testing basic tRPC connection...');
    setIsTestingBasic(true);
  };

  const testAdminConnection = () => {
    addLog('🔄 Testing admin dashboard connection...');
    setIsTestingAdmin(true);
  };

  const testDirectFetch = async () => {
    addLog('🔄 Testing direct fetch to backend...');
    
    try {
      const baseUrl = typeof window !== 'undefined' && window.location 
        ? `${window.location.protocol}//${window.location.host}`
        : 'http://localhost:3000';
      
      const healthUrl = `${baseUrl}/api`;
      addLog(`📡 Fetching: ${healthUrl}`);
      
      const response = await fetch(healthUrl);
      addLog(`📊 Response status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        addLog(`✅ Health check success: ${data.message}`);
      } else {
        const errorText = await response.text();
        addLog(`❌ Health check failed: ${errorText}`);
      }
    } catch (error: any) {
      addLog(`❌ Direct fetch error: ${error.message}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  useEffect(() => {
    addLog('🚀 Debug Backend page loaded');
    
    // Get current URL info
    if (typeof window !== 'undefined') {
      addLog(`🌐 Current URL: ${window.location.href}`);
      addLog(`🏠 Base URL: ${window.location.protocol}//${window.location.host}`);
    }
    
    // Check environment variables
    if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
      addLog(`🔧 Env API URL: ${process.env.EXPO_PUBLIC_RORK_API_BASE_URL}`);
    } else {
      addLog('⚠️ No EXPO_PUBLIC_RORK_API_BASE_URL found');
    }
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Backend Debug' }} />
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={testDirectFetch}>
            <Text style={styles.buttonText}>Test Direct Fetch</Text>
          </Pressable>
          
          <Pressable style={styles.button} onPress={testBasicConnection}>
            <Text style={styles.buttonText}>Test Basic tRPC</Text>
          </Pressable>
          
          <Pressable style={styles.button} onPress={testAdminConnection}>
            <Text style={styles.buttonText}>Test Admin tRPC</Text>
          </Pressable>
          
          <Pressable style={[styles.button, styles.clearButton]} onPress={clearLogs}>
            <Text style={styles.buttonText}>Clear Logs</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.logContainer} contentContainerStyle={styles.logContent}>
          <Text style={styles.logTitle}>Debug Logs ({logs.length})</Text>
          {logs.map((log, index) => (
            <Text key={index} style={styles.logEntry}>
              {log}
            </Text>
          ))}
          {logs.length === 0 && (
            <Text style={styles.noLogs}>No logs yet. Click a test button above.</Text>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0A14',
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  clearButton: {
    backgroundColor: '#dc2626',
    borderColor: '#ef4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  logContainer: {
    flex: 1,
    backgroundColor: '#111315',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  logContent: {
    padding: 12,
  },
  logTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  logEntry: {
    color: '#e5e7eb',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
    lineHeight: 16,
  },
  noLogs: {
    color: '#6b7280',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});