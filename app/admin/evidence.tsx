import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Database, Search, Upload, Filter, FileText, Image, 
  File, Hash, Calendar, User, Eye, Download, Shield
} from 'lucide-react-native';

interface Evidence {
  id: string;
  name: string;
  type: 'pdf' | 'csv' | 'json' | 'image' | 'document';
  controlRun: string;
  hash: string;
  size: string;
  createdAt: string;
  owner: string;
  verified: boolean;
}

const mockEvidence: Evidence[] = [
  {
    id: 'ev-001',
    name: 'AWS CloudTrail Logs - March 2024',
    type: 'json',
    controlRun: 'AWS.S3.NoPublic',
    hash: 'sha256:a1b2c3d4...',
    size: '2.4 MB',
    createdAt: '2024-03-15T10:30:00Z',
    owner: 'DevOps Team',
    verified: true
  },
  {
    id: 'ev-002',
    name: 'SOC 2 Type II Audit Report',
    type: 'pdf',
    controlRun: 'Multiple Controls',
    hash: 'sha256:e5f6g7h8...',
    size: '15.7 MB',
    createdAt: '2024-03-14T14:22:00Z',
    owner: 'Compliance Team',
    verified: true
  },
  {
    id: 'ev-003',
    name: 'Penetration Test Results',
    type: 'pdf',
    controlRun: 'NET.Firewall.Rules',
    hash: 'sha256:i9j0k1l2...',
    size: '8.3 MB',
    createdAt: '2024-03-13T09:15:00Z',
    owner: 'Security Team',
    verified: false
  },
  {
    id: 'ev-004',
    name: 'Database Encryption Screenshots',
    type: 'image',
    controlRun: 'DB.Encryption.AtRest',
    hash: 'sha256:m3n4o5p6...',
    size: '1.2 MB',
    createdAt: '2024-03-12T16:45:00Z',
    owner: 'Database Team',
    verified: true
  },
  {
    id: 'ev-005',
    name: 'User Access Review Spreadsheet',
    type: 'csv',
    controlRun: 'IDP.MFA.Required',
    hash: 'sha256:q7r8s9t0...',
    size: '456 KB',
    createdAt: '2024-03-11T11:30:00Z',
    owner: 'HR Team',
    verified: true
  }
];

export default function EvidencePage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const getTypeIcon = (type: Evidence['type']) => {
    switch (type) {
      case 'pdf': return <FileText color="#ef4444" size={16} />;
      case 'csv': return <File color="#22c55e" size={16} />;
      case 'json': return <File color="#3b82f6" size={16} />;
      case 'image': return <Image color="#f59e0b" size={16} />;
      case 'document': return <FileText color="#8b5cf6" size={16} />;
    }
  };

  const getTypeColor = (type: Evidence['type']) => {
    switch (type) {
      case 'pdf': return '#ef4444';
      case 'csv': return '#22c55e';
      case 'json': return '#3b82f6';
      case 'image': return '#f59e0b';
      case 'document': return '#8b5cf6';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredEvidence = mockEvidence.filter(evidence => {
    const matchesSearch = evidence.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         evidence.controlRun.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || evidence.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <AdminLayout title="Evidence Library">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} testID="evidence-page">
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <View style={styles.searchContainer}>
            <Search color="#94a3b8" size={16} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search evidence..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              testID="evidence-search"
            />
          </View>
          <Pressable style={styles.filterButton} testID="evidence-filter">
            <Filter color="#cbd5e1" size={16} />
            <Text style={styles.filterText}>Filter</Text>
          </Pressable>
          <Pressable style={styles.uploadButton} testID="upload-evidence">
            <Upload color="#22c55e" size={16} />
            <Text style={styles.uploadText}>Upload</Text>
          </Pressable>
        </View>

        {/* Type Filter Pills */}
        <View style={styles.filterPills}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.pillsContainer}>
              {['all', 'pdf', 'csv', 'json', 'image', 'document'].map((type) => (
                <Pressable
                  key={type}
                  style={[
                    styles.pill,
                    selectedType === type && styles.pillActive
                  ]}
                  onPress={() => setSelectedType(type)}
                  testID={`type-filter-${type}`}
                >
                  <Text style={[
                    styles.pillText,
                    selectedType === type && styles.pillTextActive
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Evidence Summary */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <Database color="#3b82f6" size={18} />
            <Text style={styles.cardTitle}>Evidence Overview</Text>
          </View>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: '#3b82f6' }]}>1,247</Text>
              <Text style={styles.summaryLabel}>Total Items</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: '#22c55e' }]}>1,198</Text>
              <Text style={styles.summaryLabel}>Verified</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: '#f59e0b' }]}>49</Text>
              <Text style={styles.summaryLabel}>Pending</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: '#8b5cf6' }]}>2.4 GB</Text>
              <Text style={styles.summaryLabel}>Total Size</Text>
            </View>
          </View>
        </View>

        {/* Evidence Grid */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <FileText color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Evidence Items ({filteredEvidence.length})</Text>
          </View>
          
          {filteredEvidence.map((evidence) => (
            <View key={evidence.id} style={styles.evidenceRow}>
              <View style={styles.evidenceMain}>
                <View style={styles.evidenceHeader}>
                  <View style={styles.evidenceInfo}>
                    {getTypeIcon(evidence.type)}
                    <Text style={styles.evidenceName}>{evidence.name}</Text>
                    {evidence.verified && (
                      <Shield color="#22c55e" size={14} />
                    )}
                  </View>
                  <View style={[styles.typeBadge, { backgroundColor: getTypeColor(evidence.type) + '20', borderColor: getTypeColor(evidence.type) }]}>
                    <Text style={[styles.typeText, { color: getTypeColor(evidence.type) }]}>
                      {evidence.type.toUpperCase()}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.evidenceDetails}>
                  <View style={styles.detailRow}>
                    <Shield color="#94a3b8" size={12} />
                    <Text style={styles.detailText}>Control: {evidence.controlRun}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Hash color="#94a3b8" size={12} />
                    <Text style={styles.detailText}>Hash: {evidence.hash}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <User color="#94a3b8" size={12} />
                    <Text style={styles.detailText}>Owner: {evidence.owner}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Calendar color="#94a3b8" size={12} />
                    <Text style={styles.detailText}>
                      {formatDate(evidence.createdAt)} • {evidence.size}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.evidenceActions}>
                <Pressable style={styles.actionButton} testID={`preview-evidence-${evidence.id}`}>
                  <Eye color="#3b82f6" size={14} />
                </Pressable>
                <Pressable style={styles.actionButton} testID={`download-evidence-${evidence.id}`}>
                  <Download color="#22c55e" size={14} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* Hash Verification */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <Hash color="#f59e0b" size={18} />
            <Text style={styles.cardTitle}>Hash Verification</Text>
          </View>
          <Text style={styles.verificationText}>
            All evidence items are cryptographically hashed to ensure integrity. 
            Verified items have been validated against their original hash values.
          </Text>
          <View style={styles.verificationStats}>
            <View style={styles.verificationItem}>
              <View style={[styles.verificationDot, { backgroundColor: '#22c55e' }]} />
              <Text style={styles.verificationLabel}>Verified: 1,198 items</Text>
            </View>
            <View style={styles.verificationItem}>
              <View style={[styles.verificationDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.verificationLabel}>Pending: 49 items</Text>
            </View>
          </View>
        </View>

        {/* Bulk Actions */}
        <View style={styles.bulkActions}>
          <Pressable style={[styles.bulkButton, { backgroundColor: '#22c55e' }]} testID="verify-all">
            <Shield color="#fff" size={16} />
            <Text style={styles.bulkButtonText}>Verify All</Text>
          </Pressable>
          <Pressable style={[styles.bulkButton, { backgroundColor: '#3b82f6' }]} testID="generate-link">
            <FileText color="#fff" size={16} />
            <Text style={styles.bulkButtonText}>Generate Link</Text>
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
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  filterText: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  uploadText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  filterPills: {
    marginBottom: 16,
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
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  summaryLabel: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 4,
  },
  evidenceRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  evidenceMain: {
    flex: 1,
  },
  evidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  evidenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  evidenceName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500' as const,
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  evidenceDetails: {
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
  evidenceActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#1f2937',
  },
  verificationText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  verificationStats: {
    gap: 8,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verificationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  verificationLabel: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  bulkActions: {
    flexDirection: 'row',
    gap: 12,
  },
  bulkButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  bulkButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
});