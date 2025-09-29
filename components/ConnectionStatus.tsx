import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Activity, CheckCircle, XCircle, RefreshCw } from 'lucide-react-native';
import { runFullConnectionTest, type ConnectionTestResult } from '@/lib/connection-test';

interface ConnectionStatusProps {
  showDetails?: boolean;
  onStatusChange?: (connected: boolean) => void;
}

export function ConnectionStatus({ showDetails = false, onStatusChange }: ConnectionStatusProps) {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [testResults, setTestResults] = useState<{
    backend: ConnectionTestResult;
    admin: ConnectionTestResult;
    overall: boolean;
  } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const runTest = async () => {
    setIsRefreshing(true);
    setStatus('checking');
    
    try {
      const results = await runFullConnectionTest();
      setTestResults(results);
      
      if (results.overall) {
        setStatus('connected');
        onStatusChange?.(true);
      } else {
        setStatus('error');
        onStatusChange?.(false);
      }
    } catch (error) {
      console.error('[ConnectionStatus] Test failed:', error);
      setStatus('error');
      onStatusChange?.(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    runTest();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return '#22c55e';
      case 'error': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  const getStatusIcon = () => {
    const color = getStatusColor();
    const size = 16;
    
    if (isRefreshing) {
      return <RefreshCw color={color} size={size} />;
    }
    
    switch (status) {
      case 'connected': return <CheckCircle color={color} size={size} />;
      case 'error': return <XCircle color={color} size={size} />;
      default: return <Activity color={color} size={size} />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'error': return 'Connection Error';
      default: return 'Checking...';
    }
  };

  return (
    <View style={styles.container}>
      <Pressable 
        style={[styles.statusRow, { borderColor: getStatusColor() }]} 
        onPress={runTest}
        disabled={isRefreshing}
      >
        {getStatusIcon()}
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
        {testResults && (
          <Text style={styles.latencyText}>
            {Math.max(testResults.backend.latency || 0, testResults.admin.latency || 0)}ms
          </Text>
        )}
      </Pressable>
      
      {showDetails && testResults && (
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Backend:</Text>
            <Text style={[styles.detailValue, { color: testResults.backend.success ? '#22c55e' : '#ef4444' }]}>
              {testResults.backend.success ? '✅' : '❌'} {testResults.backend.latency}ms
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Admin Panel:</Text>
            <Text style={[styles.detailValue, { color: testResults.admin.success ? '#22c55e' : '#ef4444' }]}>
              {testResults.admin.success ? '✅' : '❌'} {testResults.admin.latency}ms
            </Text>
          </View>
          {testResults.backend.backendUrl && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>URL:</Text>
              <Text style={styles.detailValue}>{testResults.backend.backendUrl}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#111315',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600' as const,
    flex: 1,
  },
  latencyText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  details: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  detailValue: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '500' as const,
  },
});
