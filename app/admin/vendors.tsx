import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Globe, Search, Plus, AlertTriangle, CheckCircle, Clock, 
  FileText, Shield, Calendar, TrendingUp, Users
} from 'lucide-react-native';

interface Vendor {
  id: string;
  name: string;
  category: string;
  riskTier: 'low' | 'medium' | 'high' | 'critical';
  owner: string;
  status: 'active' | 'review' | 'suspended' | 'archived';
  artifactsExpiry: string;
  lastReview: string;
  dataTypes: string[];
}

const mockVendors: Vendor[] = [
  {
    id: 'v-001',
    name: 'AWS',
    category: 'Cloud Infrastructure',
    riskTier: 'low',
    owner: 'DevOps Team',
    status: 'active',
    artifactsExpiry: '2024-12-15',
    lastReview: '2024-01-15',
    dataTypes: ['Customer Data', 'System Logs', 'Backups']
  },
  {
    id: 'v-002',
    name: 'Stripe',
    category: 'Payment Processing',
    riskTier: 'medium',
    owner: 'Finance Team',
    status: 'active',
    artifactsExpiry: '2024-06-30',
    lastReview: '2024-02-01',
    dataTypes: ['Payment Data', 'Customer PII']
  },
  {
    id: 'v-003',
    name: 'SendGrid',
    category: 'Email Services',
    riskTier: 'low',
    owner: 'Marketing Team',
    status: 'active',
    artifactsExpiry: '2024-09-20',
    lastReview: '2024-03-01',
    dataTypes: ['Email Addresses', 'Marketing Data']
  },
  {
    id: 'v-004',
    name: 'DataDog',
    category: 'Monitoring',
    riskTier: 'medium',
    owner: 'DevOps Team',
    status: 'review',
    artifactsExpiry: '2024-04-15',
    lastReview: '2023-10-15',
    dataTypes: ['System Metrics', 'Application Logs']
  },
  {
    id: 'v-005',
    name: 'Acme Security',
    category: 'Security Services',
    riskTier: 'high',
    owner: 'Security Team',
    status: 'suspended',
    artifactsExpiry: '2024-03-30',
    lastReview: '2023-12-01',
    dataTypes: ['Security Logs', 'Vulnerability Data']
  }
];

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getRiskColor = (tier: Vendor['riskTier']) => {
    switch (tier) {
      case 'low': return '#22c55e';
      case 'medium': return '#f59e0b';
      case 'high': return '#f97316';
      case 'critical': return '#ef4444';
    }
  };

  const getStatusColor = (status: Vendor['status']) => {
    switch (status) {
      case 'active': return '#22c55e';
      case 'review': return '#f59e0b';
      case 'suspended': return '#ef4444';
      case 'archived': return '#94a3b8';
    }
  };

  const getStatusIcon = (status: Vendor['status']) => {
    switch (status) {
      case 'active': return <CheckCircle color="#22c55e" size={14} />;
      case 'review': return <Clock color="#f59e0b" size={14} />;
      case 'suspended': return <AlertTriangle color="#ef4444" size={14} />;
      case 'archived': return <FileText color="#94a3b8" size={14} />;
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredVendors = mockVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = selectedTier === 'all' || vendor.riskTier === selectedTier;
    const matchesStatus = selectedStatus === 'all' || vendor.status === selectedStatus;
    
    return matchesSearch && matchesTier && matchesStatus;
  });

  return (
    <AdminLayout title="Vendor Risk Management">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} testID="vendors-page">
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <View style={styles.searchContainer}>
            <Search color="#94a3b8" size={16} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search vendors..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              testID="vendors-search"
            />
          </View>
          <Pressable style={styles.addButton} testID="add-vendor">
            <Plus color="#22c55e" size={16} />
            <Text style={styles.addText}>New Vendor</Text>
          </Pressable>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Risk Tier:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.pillsContainer}>
              {['all', 'low', 'medium', 'high', 'critical'].map((tier) => (
                <Pressable
                  key={tier}
                  style={[
                    styles.pill,
                    selectedTier === tier && styles.pillActive
                  ]}
                  onPress={() => setSelectedTier(tier)}
                  testID={`tier-filter-${tier}`}
                >
                  <Text style={[
                    styles.pillText,
                    selectedTier === tier && styles.pillTextActive
                  ]}>
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Vendor Risk Overview */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <TrendingUp color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Risk Distribution</Text>
          </View>
          <View style={styles.riskGrid}>
            <View style={styles.riskItem}>
              <View style={[styles.riskDot, { backgroundColor: '#22c55e' }]} />
              <Text style={styles.riskLabel}>Low Risk</Text>
              <Text style={[styles.riskCount, { color: '#22c55e' }]}>47</Text>
            </View>
            <View style={styles.riskItem}>
              <View style={[styles.riskDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.riskLabel}>Medium Risk</Text>
              <Text style={[styles.riskCount, { color: '#f59e0b' }]}>23</Text>
            </View>
            <View style={styles.riskItem}>
              <View style={[styles.riskDot, { backgroundColor: '#f97316' }]} />
              <Text style={styles.riskLabel}>High Risk</Text>
              <Text style={[styles.riskCount, { color: '#f97316' }]}>8</Text>
            </View>
            <View style={styles.riskItem}>
              <View style={[styles.riskDot, { backgroundColor: '#ef4444' }]} />
              <Text style={styles.riskLabel}>Critical</Text>
              <Text style={[styles.riskCount, { color: '#ef4444' }]}>2</Text>
            </View>
          </View>
        </View>

        {/* Expiring Artifacts Alert */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#f59e0b' }]}>
          <View style={styles.cardHeader}>
            <AlertTriangle color="#f59e0b" size={18} />
            <Text style={styles.cardTitle}>Expiring Artifacts</Text>
          </View>
          <Text style={styles.alertText}>
            3 vendors have security artifacts expiring within 30 days. Review and request updates.
          </Text>
          <View style={styles.expiringList}>
            <Text style={styles.expiringItem}>• DataDog - SOC 2 expires Apr 15</Text>
            <Text style={styles.expiringItem}>• Acme Security - Pentest expires Mar 30</Text>
            <Text style={styles.expiringItem}>• CloudFlare - ISO cert expires Apr 8</Text>
          </View>
        </View>

        {/* Vendors List */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <Globe color="#3b82f6" size={18} />
            <Text style={styles.cardTitle}>Vendors ({filteredVendors.length})</Text>
          </View>
          
          {filteredVendors.map((vendor) => (
            <View key={vendor.id} style={styles.vendorRow}>
              <View style={styles.vendorMain}>
                <View style={styles.vendorHeader}>
                  <View style={styles.vendorInfo}>
                    <Text style={styles.vendorName}>{vendor.name}</Text>
                    <Text style={styles.vendorCategory}>{vendor.category}</Text>
                  </View>
                  <View style={styles.vendorBadges}>
                    <View style={[styles.riskBadge, { backgroundColor: getRiskColor(vendor.riskTier) + '20', borderColor: getRiskColor(vendor.riskTier) }]}>
                      <Text style={[styles.riskText, { color: getRiskColor(vendor.riskTier) }]}>
                        {vendor.riskTier.toUpperCase()}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(vendor.status) + '20', borderColor: getStatusColor(vendor.status) }]}>
                      {getStatusIcon(vendor.status)}
                      <Text style={[styles.statusText, { color: getStatusColor(vendor.status) }]}>
                        {vendor.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.vendorDetails}>
                  <View style={styles.detailRow}>
                    <Users color="#94a3b8" size={12} />
                    <Text style={styles.detailText}>Owner: {vendor.owner}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Calendar color="#94a3b8" size={12} />
                    <Text style={[
                      styles.detailText,
                      isExpiringSoon(vendor.artifactsExpiry) && { color: '#f59e0b' }
                    ]}>
                      Artifacts expire: {formatDate(vendor.artifactsExpiry)}
                      {isExpiringSoon(vendor.artifactsExpiry) && ' ⚠️'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Shield color="#94a3b8" size={12} />
                    <Text style={styles.detailText}>
                      Data types: {vendor.dataTypes.join(', ')}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Clock color="#94a3b8" size={12} />
                    <Text style={styles.detailText}>
                      Last review: {formatDate(vendor.lastReview)}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.vendorActions}>
                <Pressable style={styles.actionButton} testID={`review-vendor-${vendor.id}`}>
                  <Text style={styles.actionButtonText}>Review</Text>
                </Pressable>
                <Pressable style={styles.actionButton} testID={`request-docs-${vendor.id}`}>
                  <FileText color="#94a3b8" size={14} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable style={[styles.quickButton, { backgroundColor: '#f59e0b' }]} testID="risk-review">
            <AlertTriangle color="#fff" size={16} />
            <Text style={styles.quickButtonText}>Risk Review</Text>
          </Pressable>
          <Pressable style={[styles.quickButton, { backgroundColor: '#3b82f6' }]} testID="request-updates">
            <FileText color="#fff" size={16} />
            <Text style={styles.quickButtonText}>Request Updates</Text>
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  addText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    color: '#cbd5e1',
    fontSize: 12,
    marginBottom: 8,
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
  riskGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  riskItem: {
    alignItems: 'center',
    gap: 4,
  },
  riskDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  riskLabel: {
    color: '#94a3b8',
    fontSize: 11,
  },
  riskCount: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  alertText: {
    color: '#cbd5e1',
    fontSize: 13,
    marginBottom: 8,
  },
  expiringList: {
    gap: 4,
  },
  expiringItem: {
    color: '#f59e0b',
    fontSize: 12,
  },
  vendorRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  vendorMain: {
    flex: 1,
  },
  vendorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  vendorCategory: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  vendorBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  riskBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  riskText: {
    fontSize: 10,
    fontWeight: '600' as const,
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
  vendorDetails: {
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
  vendorActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#1f2937',
    gap: 4,
  },
  actionButtonText: {
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