import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { trpc } from '@/lib/trpc';
import { CheckCircle, XCircle, Loader } from 'lucide-react-native';

interface ConnectionTestResult {
  status: 'testing' | 'success' | 'error';
  message: string;
  details?: any;
}

export function AdminConnectionTest() {
  const [testResult, setTestResult] = useState<ConnectionTestResult>({
    status: 'testing',
    message: 'Testing connection...'
  });

  // Test basic tRPC connection
  const hiQuery = trpc.example.hiQuery.useQuery(
    { name: 'Admin Connection Test' },
    { 
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true
    }
  );

  // Test admin dashboard connection
  const statsQuery = trpc.admin.dashboard.getStats.useQuery(undefined, {
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });

  useEffect(() => {
    if (hiQuery.isLoading || statsQuery.isLoading) {
      setTestResult({
        status: 'testing',
        message: 'Testing connections...'
      });
    } else if (hiQuery.error || statsQuery.error) {
      setTestResult({
        status: 'error',
        message: 'Connection failed',
        details: {
          hiQuery: hiQuery.error?.message,
          statsQuery: statsQuery.error?.message
        }
      });
    } else if (hiQuery.data && statsQuery.data) {
      setTestResult({
        status: 'success',
        message: 'All connections successful',
        details: {
          hiQuery: hiQuery.data,
          statsQuery: 'Dashboard stats loaded'
        }
      });
    }
  }, [hiQuery.isLoading, hiQuery.error, hiQuery.data, statsQuery.isLoading, statsQuery.error, statsQuery.data]);

  const getStatusIcon = () => {
    switch (testResult.status) {
      case 'testing':
        return <Loader size={16} color="#3b82f6" />;
      case 'success':
        return <CheckCircle size={16} color="#22c55e" />;
      case 'error':
        return <XCircle size={16} color="#ef4444" />;
    }
  };

  const getStatusColor = () => {
    switch (testResult.status) {
      case 'testing':
        return '#3b82f6';
      case 'success':
        return '#22c55e';
      case 'error':
        return '#ef4444';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {getStatusIcon()}
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {testResult.message}
        </Text>
      </View>
      
      {testResult.details && (
        <View style={styles.details}>
          <Text style={styles.detailsTitle}>Connection Details:</Text>
          <Text style={styles.detailsText}>
            Basic Query: {hiQuery.data ? '✅ Connected' : '❌ Failed'}
          </Text>
          <Text style={styles.detailsText}>
            Admin Dashboard: {statsQuery.data ? '✅ Connected' : '❌ Failed'}
          </Text>
        </View>
      )}

      <TouchableOpacity 
        style={styles.retryButton}
        onPress={() => {
          hiQuery.refetch();
          statsQuery.refetch();
        }}
      >
        <Text style={styles.retryButtonText}>Retry Connection</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  details: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
