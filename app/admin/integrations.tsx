import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Zap, Search, Plus, CheckCircle, XCircle, AlertTriangle, 
  Settings, RefreshCw, Key, Shield, Database, Cloud
} from 'lucide-react-native';

interface Integration {
  id: string;
  name: string;
  category: 'cloud' | 'identity' | 'security' | 'devops' | 'monitoring' | 'productivity';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  lastSync: string;
  healthStatus: 'healthy' | 'warning' | 'error';
  description: string;
  permissions: string[];
  controlsCount: number;
}

const mockIntegrations: Integration[] = [
  {
    id: 'int-001',
    name: 'AWS',
    category: 'cloud',
    status: 'connected',
    lastSync: '2024-03-15T14:30:00Z',
    healthStatus: 'healthy',
    description: 'Amazon Web Services cloud infrastructure monitoring',
    permissions: ['CloudTrail', 'Config', 'IAM', 'S3'],
    controlsCount: 47
  },
  {
    id: 'int-002',
    name: 'Google Cloud Platform',
    category: 'cloud',
    status: 'connected',
    lastSync: '2024-03-15T14:25:00Z',
    healthStatus: 'healthy',
    description: 'Google Cloud Platform services monitoring',
    permissions: ['Cloud Logging', 'IAM', 'Security Command Center'],
    controlsCount: 32
  },
  {
    id: 'int-003',
    name: 'Microsoft Azure',
    category: 'cloud',
    status: 'error',
    lastSync: '2024-03-14T10:15:00Z',
    healthStatus: 'error',
    description: 'Microsoft Azure cloud services monitoring',
    permissions: ['Activity Log', 'Security Center', 'Key Vault'],
    controlsCount: 28
  },
  {
    id: 'int-004',
    name: 'Okta',
    category: 'identity',
    status: 'connected',
    lastSync: '2024-03-15T14:20:00Z',
    healthStatus: 'healthy',
    description: 'Identity and access management platform',
    permissions: ['Users', 'Groups', 'Applications', 'Logs'],
    controlsCount: 23
  },
  {
    id: 'int-005',
    name: 'GitHub',
    category: 'devops',
    status: 'connected',
    lastSync: '2024-03-15T14:10:00Z',
    healthStatus: 'warning',
    description: 'Source code management and DevOps platform',
    permissions: ['Repositories', 'Organizations', 'Audit Log'],
    controlsCount: 15
  },
  {
    id: 'int-006',
    name: 'Datadog',
    category: 'monitoring',
    status: 'pending',
    lastSync: 'Never',
    healthStatus: 'warning',
    description: 'Infrastructure and application monitoring',
    permissions: ['Metrics', 'Logs', 'Security Monitoring'],
    controlsCount: 0
  },
  {
    id: 'int-007',
    name: 'CrowdStrike',
    category: 'security',
    status: 'connected',
    lastSync: '2024-03-15T13:45:00Z',
    healthStatus: 'healthy',
    description: 'Endpoint detection and response platform',
    permissions: ['Detections', 'Hosts', 'Incidents'],
    controlsCount: 12
  },
  {
    id: 'int-008',
    name: 'Snyk',
    category: 'security',
    status: 'disconnected',
    lastSync: '2024-03-10T09:30:00Z',
    healthStatus: 'error',
    description: 'Application security and vulnerability management',
    permissions: ['Projects', 'Issues', 'Organizations'],
    controlsCount: 8
  }
];

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return '#22c55e';
      case 'disconnected': return '#94a3b8';
      case 'error': return '#ef4444';
      case 'pending': return '#f59e0b';
    }
  };

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return <CheckCircle color="#22c55e" size={14} />;
      case 'disconnected': return <XCircle color="#94a3b8" size={14} />;
      case 'error': return <AlertTriangle color="#ef4444" size={14} />;
      case 'pending': return <RefreshCw color="#f59e0b" size={14} />;
    }
  };

  const getHealthColor = (health: Integration['healthStatus']) => {
    switch (health) {
      case 'healthy': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
    }
  };

  const getCategoryIcon = (category: Integration['category']) => {
    switch (category) {
      case 'cloud': return <Cloud color="#3b82f6" size={16} />;
      case 'identity': return <Shield color="#8b5cf6" size={16} />;
      case 'security': return <Shield color="#ef4444" size={16} />;
      case 'devops': return <Settings color="#22c55e" size={16} />;
      case 'monitoring': return <Database color="#f59e0b" size={16} />;
      case 'productivity': return <Zap color="#6b7280" size={16} />;
    }
  };

  const getCategoryColor = (category: Integration['category']) => {
    switch (category) {
      case 'cloud': return '#3b82f6';
      case 'identity': return '#8b5cf6';
      case 'security': return '#ef4444';
      case 'devops': return '#22c55e';
      case 'monitoring': return '#f59e0b';
      case 'productivity': return '#6b7280';
    }
  };

  const formatLastSync = (lastSync: string) => {
    if (lastSync === 'Never') return 'Never';
    
    const date = new Date(lastSync);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffMinutes / 1440);
      return `${days}d ago`;
    }
  };

  const filteredIntegrations = mockIntegrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || integration.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const uniqueCategories = Array.from(new Set(mockIntegrations.map(i => i.category)));

  return (
    <AdminLayout title="Integrations Hub">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} testID="integrations-page">
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <View style={styles.searchContainer}>
            <Search color="#94a3b8" size={16} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search integrations..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              testID="integrations-search"
            />
          </View>
          <Pressable style={styles.actionButton} testID="add-integration">
            <Plus color="#22c55e" size={16} />
            <Text style={styles.actionButtonText}>Connect</Text>
          </Pressable>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterSection}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Category:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.pillsContainer}>
                <Pressable
                  style={[styles.pill, selectedCategory === 'all' && styles.pillActive]}
                  onPress={() => setSelectedCategory('all')}
                  testID="category-filter-all"
                >
                  <Text style={[styles.pillText, selectedCategory === 'all' && styles.pillTextActive]}>
                    All
                  </Text>
                </Pressable>
                {uniqueCategories.map((category) => (
                  <Pressable
                    key={category}
                    style={[styles.pill, selectedCategory === category && styles.pillActive]}
                    onPress={() => setSelectedCategory(category)}
                    testID={`category-filter-${category}`}
                  >
                    <Text style={[styles.pillText, selectedCategory === category && styles.pillTextActive]}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Status:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.pillsContainer}>
                {['all', 'connected', 'disconnected', 'error', 'pending'].map((status) => (
                  <Pressable
                    key={status}
                    style={[
                      styles.pill,
                      selectedStatus === status && styles.pillActive
                    ]}
                    onPress={() => setSelectedStatus(status)}
                    testID={`status-filter-${status}`}
                  >
                    <Text style={[
                      styles.pillText,
                      selectedStatus === status && styles.pillTextActive
                    ]}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Integrations Overview */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <Zap color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Integrations Overview</Text>
          </View>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewValue, { color: '#3b82f6' }]}>78</Text>
              <Text style={styles.overviewLabel}>Total Available</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewValue, { color: '#22c55e' }]}>23</Text>
              <Text style={styles.overviewLabel}>Connected</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewValue, { color: '#ef4444' }]}>3</Text>
              <Text style={styles.overviewLabel}>Health Issues</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewValue, { color: '#8b5cf6' }]}>165</Text>
              <Text style={styles.overviewLabel}>Active Controls</Text>
            </View>
          </View>
        </View>

        {/* Health Status Alert */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#f59e0b' }]}>
          <View style={styles.cardHeader}>
            <AlertTriangle color="#f59e0b" size={18} />
            <Text style={styles.cardTitle}>Health Issues</Text>
          </View>
          <Text style={styles.alertText}>
            3 integrations require attention. Check connection status and credentials.
          </Text>
          <View style={styles.issuesList}>
            <Text style={styles.issueItem}>• Azure: Authentication token expired</Text>
            <Text style={styles.issueItem}>• GitHub: Rate limit exceeded</Text>
            <Text style={styles.issueItem}>• Snyk: Connection timeout</Text>
          </View>
        </View>

        {/* Integrations List */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <Database color="#3b82f6" size={18} />
            <Text style={styles.cardTitle}>Connected Integrations ({filteredIntegrations.length})</Text>
          </View>
          
          {filteredIntegrations.map((integration) => (
            <View key={integration.id} style={styles.integrationRow}>
              <View style={styles.integrationMain}>
                <View style={styles.integrationHeader}>
                  <View style={styles.integrationInfo}>
                    {getCategoryIcon(integration.category)}
                    <Text style={styles.integrationName}>{integration.name}</Text>
                    <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(integration.category) + '20', borderColor: getCategoryColor(integration.category) }]}>
                      <Text style={[styles.categoryText, { color: getCategoryColor(integration.category) }]}>
                        {integration.category.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.integrationBadges}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(integration.status) + '20', borderColor: getStatusColor(integration.status) }]}>
                      {getStatusIcon(integration.status)}
                      <Text style={[styles.statusText, { color: getStatusColor(integration.status) }]}>
                        {integration.status.toUpperCase()}
                      </Text>
                    </View>
                    <View style={[styles.healthDot, { backgroundColor: getHealthColor(integration.healthStatus) }]} />
                  </View>
                </View>
                
                <Text style={styles.integrationDescription}>{integration.description}</Text>
                
                <View style={styles.integrationDetails}>
                  <View style={styles.detailRow}>
                    <Shield color="#94a3b8" size={12} />
                    <Text style={styles.detailText}>
                      {integration.controlsCount} controls • {integration.permissions.length} permissions
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <RefreshCw color="#94a3b8" size={12} />
                    <Text style={styles.detailText}>
                      Last sync: {formatLastSync(integration.lastSync)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Key color="#94a3b8" size={12} />
                    <Text style={styles.detailText}>
                      Permissions: {integration.permissions.join(', ')}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.integrationActions}>
                <Pressable style={styles.actionBtn} testID={`test-integration-${integration.id}`}>
                  <Text style={styles.actionBtnText}>Test</Text>
                </Pressable>
                <Pressable style={styles.actionBtn} testID={`configure-integration-${integration.id}`}>
                  <Settings color="#94a3b8" size={14} />
                </Pressable>
                {integration.status === 'connected' && (
                  <Pressable style={styles.actionBtn} testID={`sync-integration-${integration.id}`}>
                    <RefreshCw color="#22c55e" size={14} />
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Available Integrations */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <Plus color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Available Integrations</Text>
          </View>
          <Text style={styles.availableText}>
            Connect additional services to expand your compliance monitoring coverage.
          </Text>
          <View style={styles.availableGrid}>
            {['Jamf', 'Intune', 'GitLab', 'Jira', 'Linear', 'Confluence'].map((service) => (
              <Pressable key={service} style={styles.availableItem} testID={`connect-${service.toLowerCase()}`}>
                <Text style={styles.availableItemText}>{service}</Text>
                <Plus color="#22c55e" size={14} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable style={[styles.quickButton, { backgroundColor: '#22c55e' }]} testID="sync-all">
            <RefreshCw color="#fff" size={16} />
            <Text style={styles.quickButtonText}>Sync All</Text>
          </Pressable>
          <Pressable style={[styles.quickButton, { backgroundColor: '#f59e0b' }]} testID="rotate-credentials">
            <Key color="#fff" size={16} />
            <Text style={styles.quickButtonText}>Rotate Keys</Text>
          </Pressable>
        </View>
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  filterSection: {
    marginBottom: 16,
    gap: 12,
  },
  filterGroup: {
    gap: 8,
  },
  filterLabel: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '500' as const,
  },
  pillsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
  },
  pillActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  pillText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '500' as const,
  },
  pillTextActive: {
    color: '#fff',
  },
  card: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: '600' as const,
  },
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overviewItem: {
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  overviewLabel: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 4,
  },
  alertText: {
    color: '#cbd5e1',
    fontSize: 13,
    marginBottom: 8,
  },
  issuesList: {
    gap: 4,
  },
  issueItem: {
    color: '#f59e0b',
    fontSize: 12,
  },
  integrationRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  integrationMain: {
    flex: 1,
  },
  integrationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  integrationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  integrationName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  integrationBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  healthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  integrationDescription: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 8,
  },
  integrationDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  integrationActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#1f2937',
    gap: 4,
  },
  actionBtnText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  availableText: {
    color: '#cbd5e1',
    fontSize: 13,
    marginBottom: 12,
  },
  availableGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  availableItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
    gap: 6,
  },
  availableItemText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  quickButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
});