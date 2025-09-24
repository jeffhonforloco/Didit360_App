import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Shield, Eye, Globe, Lock, FileText, Award, 
  Settings, Share, CheckCircle, AlertTriangle, Clock
} from 'lucide-react-native';

interface TrustCenterWidget {
  id: string;
  name: string;
  type: 'cert_badge' | 'pentest_summary' | 'status_page' | 'controls' | 'policies' | 'access_form';
  enabled: boolean;
  visibility: 'public' | 'private' | 'nda_required';
  description: string;
}

const mockWidgets: TrustCenterWidget[] = [
  {
    id: 'soc2-badge',
    name: 'SOC 2 Type II Certificate',
    type: 'cert_badge',
    enabled: true,
    visibility: 'public',
    description: 'Display SOC 2 Type II compliance badge'
  },
  {
    id: 'iso-badge',
    name: 'ISO 27001 Certificate',
    type: 'cert_badge',
    enabled: true,
    visibility: 'public',
    description: 'Display ISO 27001 certification badge'
  },
  {
    id: 'pentest-summary',
    name: 'Penetration Test Summary',
    type: 'pentest_summary',
    enabled: true,
    visibility: 'nda_required',
    description: 'Summary of latest penetration testing results'
  },
  {
    id: 'status-page',
    name: 'System Status',
    type: 'status_page',
    enabled: true,
    visibility: 'public',
    description: 'Real-time system status and uptime metrics'
  },
  {
    id: 'security-controls',
    name: 'Security Controls Overview',
    type: 'controls',
    enabled: false,
    visibility: 'nda_required',
    description: 'High-level overview of implemented security controls'
  },
  {
    id: 'privacy-policy',
    name: 'Privacy Policy',
    type: 'policies',
    enabled: true,
    visibility: 'public',
    description: 'Link to current privacy policy document'
  }
];

export default function TrustCenterPage() {
  const [widgets, setWidgets] = useState<TrustCenterWidget[]>(mockWidgets);
  const [ndaGateEnabled, setNdaGateEnabled] = useState<boolean>(true);
  const [linkExpiryEnabled, setLinkExpiryEnabled] = useState<boolean>(false);

  const toggleWidget = (widgetId: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, enabled: !widget.enabled }
        : widget
    ));
  };

  const updateVisibility = (widgetId: string, visibility: TrustCenterWidget['visibility']) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, visibility }
        : widget
    ));
  };

  const getVisibilityIcon = (visibility: TrustCenterWidget['visibility']) => {
    switch (visibility) {
      case 'public': return <Globe color="#22c55e" size={14} />;
      case 'private': return <Lock color="#ef4444" size={14} />;
      case 'nda_required': return <FileText color="#f59e0b" size={14} />;
    }
  };

  const getVisibilityColor = (visibility: TrustCenterWidget['visibility']) => {
    switch (visibility) {
      case 'public': return '#22c55e';
      case 'private': return '#ef4444';
      case 'nda_required': return '#f59e0b';
    }
  };

  const getTypeIcon = (type: TrustCenterWidget['type']) => {
    switch (type) {
      case 'cert_badge': return <Award color="#22c55e" size={16} />;
      case 'pentest_summary': return <Shield color="#3b82f6" size={16} />;
      case 'status_page': return <CheckCircle color="#22c55e" size={16} />;
      case 'controls': return <Settings color="#8b5cf6" size={16} />;
      case 'policies': return <FileText color="#f59e0b" size={16} />;
      case 'access_form': return <Lock color="#ef4444" size={16} />;
    }
  };

  const enabledWidgets = widgets.filter(w => w.enabled);
  const publicWidgets = enabledWidgets.filter(w => w.visibility === 'public');
  const ndaWidgets = enabledWidgets.filter(w => w.visibility === 'nda_required');

  return (
    <AdminLayout title="Trust Center Configuration">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} testID="trust-center-page">
        {/* Trust Center Status */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <Shield color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Trust Center Status</Text>
          </View>
          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <CheckCircle color="#22c55e" size={16} />
              <Text style={styles.statusLabel}>Published</Text>
              <Text style={styles.statusValue}>Live</Text>
            </View>
            <View style={styles.statusItem}>
              <Eye color="#3b82f6" size={16} />
              <Text style={styles.statusLabel}>Visitors</Text>
              <Text style={styles.statusValue}>1,247</Text>
            </View>
            <View style={styles.statusItem}>
              <Clock color="#f59e0b" size={16} />
              <Text style={styles.statusLabel}>Last Updated</Text>
              <Text style={styles.statusValue}>2h ago</Text>
            </View>
          </View>
        </View>

        {/* Global Settings */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <Settings color="#8b5cf6" size={18} />
            <Text style={styles.cardTitle}>Global Settings</Text>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>NDA Gate</Text>
              <Text style={styles.settingDescription}>
                Require NDA acceptance for sensitive content
              </Text>
            </View>
            <Switch
              value={ndaGateEnabled}
              onValueChange={setNdaGateEnabled}
              trackColor={{ false: '#374151', true: '#22c55e' }}
              thumbColor={ndaGateEnabled ? '#fff' : '#9ca3af'}
              testID="nda-gate-toggle"
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Link Expiry</Text>
              <Text style={styles.settingDescription}>
                Auto-expire shared trust center links after 30 days
              </Text>
            </View>
            <Switch
              value={linkExpiryEnabled}
              onValueChange={setLinkExpiryEnabled}
              trackColor={{ false: '#374151', true: '#22c55e' }}
              thumbColor={linkExpiryEnabled ? '#fff' : '#9ca3af'}
              testID="link-expiry-toggle"
            />
          </View>
        </View>

        {/* Widget Configuration */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <FileText color="#3b82f6" size={18} />
            <Text style={styles.cardTitle}>Trust Center Widgets</Text>
          </View>
          
          {widgets.map((widget) => (
            <View key={widget.id} style={styles.widgetRow}>
              <View style={styles.widgetMain}>
                <View style={styles.widgetHeader}>
                  <View style={styles.widgetInfo}>
                    {getTypeIcon(widget.type)}
                    <Text style={styles.widgetName}>{widget.name}</Text>
                  </View>
                  <View style={styles.widgetControls}>
                    <View style={[styles.visibilityBadge, { backgroundColor: getVisibilityColor(widget.visibility) + '20', borderColor: getVisibilityColor(widget.visibility) }]}>
                      {getVisibilityIcon(widget.visibility)}
                      <Text style={[styles.visibilityText, { color: getVisibilityColor(widget.visibility) }]}>
                        {widget.visibility.replace('_', ' ').toUpperCase()}
                      </Text>
                    </View>
                    <Switch
                      value={widget.enabled}
                      onValueChange={() => toggleWidget(widget.id)}
                      trackColor={{ false: '#374151', true: '#22c55e' }}
                      thumbColor={widget.enabled ? '#fff' : '#9ca3af'}
                      testID={`widget-toggle-${widget.id}`}
                    />
                  </View>
                </View>
                <Text style={styles.widgetDescription}>{widget.description}</Text>
                
                {widget.enabled && (
                  <View style={styles.visibilityControls}>
                    <Text style={styles.visibilityLabel}>Visibility:</Text>
                    <View style={styles.visibilityButtons}>
                      {(['public', 'nda_required', 'private'] as const).map((visibility) => (
                        <Pressable
                          key={visibility}
                          style={[
                            styles.visibilityButton,
                            widget.visibility === visibility && styles.visibilityButtonActive
                          ]}
                          onPress={() => updateVisibility(widget.id, visibility)}
                          testID={`visibility-${widget.id}-${visibility}`}
                        >
                          {getVisibilityIcon(visibility)}
                          <Text style={[
                            styles.visibilityButtonText,
                            widget.visibility === visibility && styles.visibilityButtonTextActive
                          ]}>
                            {visibility.replace('_', ' ')}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Preview Summary */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <Eye color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Trust Center Preview</Text>
          </View>
          
          <View style={styles.previewSection}>
            <Text style={styles.previewSectionTitle}>Public Content ({publicWidgets.length} items)</Text>
            {publicWidgets.map(widget => (
              <View key={widget.id} style={styles.previewItem}>
                {getTypeIcon(widget.type)}
                <Text style={styles.previewItemText}>{widget.name}</Text>
              </View>
            ))}
          </View>
          
          {ndaWidgets.length > 0 && (
            <View style={styles.previewSection}>
              <Text style={styles.previewSectionTitle}>NDA Required ({ndaWidgets.length} items)</Text>
              {ndaWidgets.map(widget => (
                <View key={widget.id} style={styles.previewItem}>
                  {getTypeIcon(widget.type)}
                  <Text style={styles.previewItemText}>{widget.name}</Text>
                  <FileText color="#f59e0b" size={12} />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable style={[styles.actionButton, { backgroundColor: '#3b82f6' }]} testID="preview-trust-center">
            <Eye color="#fff" size={16} />
            <Text style={styles.actionButtonText}>Preview</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, { backgroundColor: '#22c55e' }]} testID="publish-trust-center">
            <Globe color="#fff" size={16} />
            <Text style={styles.actionButtonText}>Publish</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, { backgroundColor: '#f59e0b' }]} testID="generate-access-token">
            <Share color="#fff" size={16} />
            <Text style={styles.actionButtonText}>Generate Link</Text>
          </Pressable>
        </View>
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
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
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
    gap: 4,
  },
  statusLabel: {
    color: '#94a3b8',
    fontSize: 11,
  },
  statusValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500' as const,
  },
  settingDescription: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  widgetRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  widgetMain: {
    gap: 8,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  widgetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  widgetName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500' as const,
  },
  widgetControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  visibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    gap: 4,
  },
  visibilityText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  widgetDescription: {
    color: '#94a3b8',
    fontSize: 12,
  },
  visibilityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  visibilityLabel: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  visibilityButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  visibilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#1f2937',
    gap: 4,
  },
  visibilityButtonActive: {
    backgroundColor: '#3b82f6',
  },
  visibilityButtonText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  visibilityButtonTextActive: {
    color: '#fff',
  },
  previewSection: {
    marginBottom: 16,
  },
  previewSectionTitle: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  previewItemText: {
    color: '#94a3b8',
    fontSize: 12,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
});