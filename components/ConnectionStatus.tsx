import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Activity, CheckCircle, XCircle, RefreshCw } from 'lucide-react-native';
import { testBackendConnection, testTRPCConnection, type ConnectionTestResult } from '@/lib/connection-test';

interface ConnectionStatusProps {
  showDetails?: boolean;
}

export function ConnectionStatus({ showDetails = false }: ConnectionStatusProps) {
  const [backendTest, setBackendTest] = useState<ConnectionTestResult | null>(null);
  const [trpcTest, setTRPCTest] = useState<ConnectionTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const runTests = async () => {
    setIsLoading(true);
    try {
      console.log('[ConnectionStatus] Running connection tests...');
      
      const [backendResult, trpcResult] = await Promise.all([
        testBackendConnection(),
        testTRPCConnection()
      ]);
      
      setBackendTest(backendResult);
      setTRPCTest(trpcResult);
      setLastUpdate(new Date().toLocaleTimeString());
      
      console.log('[ConnectionStatus] Backend test result:', backendResult);
      console.log('[ConnectionStatus] tRPC test result:', trpcResult);
    } catch (error) {
      console.error('[ConnectionStatus] Test error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (test: ConnectionTestResult | null) => {
    if (!test) return <Activity color="#f59e0b" size={16} />;
    if (test.success) return <CheckCircle color="#22c55e" size={16} />;
    return <XCircle color="#ef4444" size={16} />;
  };

  const getStatusColor = (test: ConnectionTestResult | null) => {
    if (!test) return '#f59e0b';
    if (test.success) return '#22c55e';
    return '#ef4444';
  };

  const getStatusText = (test: ConnectionTestResult | null) => {
    if (!test) return 'Testing...';
    if (test.success) return 'Connected';
    return 'Failed';
  };

  const overallStatus = backendTest && trpcTest && backendTest.success && trpcTest.success;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {getStatusIcon(overallStatus ? { success: true } as ConnectionTestResult : null)}
          <Text style={styles.title}>Connection Status</Text>
          <Pressable 
            style={[styles.refreshButton, isLoading && styles.refreshButtonLoading]}
            onPress={runTests}
            disabled={isLoading}
          >
            <RefreshCw 
              color="#94a3b8" 
              size={14} 
              style={isLoading ? styles.spinning : undefined}
            />
          </Pressable>
        </View>
        {lastUpdate && (
          <Text style={styles.lastUpdate}>Last checked: {lastUpdate}</Text>
        )}
      </View>

      <View style={styles.statusGrid}>
        <View style={styles.statusItem}>
          {getStatusIcon(backendTest)}
          <Text style={[styles.statusLabel, { color: getStatusColor(backendTest) }]}>
            Backend API
          </Text>
          <Text style={styles.statusValue}>{getStatusText(backendTest)}</Text>
          {backendTest?.details.responseTime && (
            <Text style={styles.responseTime}>{backendTest.details.responseTime}ms</Text>
          )}
        </View>

        <View style={styles.statusItem}>
          {getStatusIcon(trpcTest)}
          <Text style={[styles.statusLabel, { color: getStatusColor(trpcTest) }]}>
            tRPC API
          </Text>
          <Text style={styles.statusValue}>{getStatusText(trpcTest)}</Text>
          {trpcTest?.details.responseTime && (
            <Text style={styles.responseTime}>{trpcTest.details.responseTime}ms</Text>
          )}
        </View>
      </View>

      {showDetails && (backendTest || trpcTest) && (
        <View style={styles.details}>
          {backendTest && (
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Backend Details:</Text>
              <Text style={styles.detailText}>URL: {backendTest.details.endpoint}</Text>
              {backendTest.details.status && (
                <Text style={styles.detailText}>
                  Status: {backendTest.details.status} {backendTest.details.statusText}
                </Text>
              )}
              {backendTest.error && (
                <Text style={[styles.detailText, { color: '#ef4444' }]}>
                  Error: {backendTest.error}
                </Text>
              )}
            </View>
          )}

          {trpcTest && (
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>tRPC Details:</Text>
              <Text style={styles.detailText}>URL: {trpcTest.details.endpoint}</Text>
              {trpcTest.details.status && (
                <Text style={styles.detailText}>
                  Status: {trpcTest.details.status} {trpcTest.details.statusText}
                </Text>
              )}
              {trpcTest.error && (
                <Text style={[styles.detailText, { color: '#ef4444' }]}>
                  Error: {trpcTest.error}
                </Text>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111315',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
    flex: 1,
  },
  refreshButton: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#1f2937',
  },
  refreshButtonLoading: {
    opacity: 0.5,
  },
  spinning: {
    // Note: React Native doesn't support CSS animations directly
    // This would need to be implemented with Animated API for actual spinning
  },
  lastUpdate: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  statusGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  statusValue: {
    color: '#cbd5e1',
    fontSize: 11,
  },
  responseTime: {
    color: '#64748b',
    fontSize: 10,
  },
  details: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    gap: 12,
  },
  detailSection: {
    gap: 4,
  },
  detailTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600' as const,
  },
  detailText: {
    color: '#94a3b8',
    fontSize: 11,
    fontFamily: 'monospace',
  },
});

export default ConnectionStatus;