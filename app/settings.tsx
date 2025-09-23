import React, { useCallback, useMemo, useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, Image, Platform } from "react-native";
import { useUser } from "@/contexts/UserContext";
import { Moon, Sun, Monitor, Globe, SlidersHorizontal, Database, Music, Activity, RotateCcw, Palette, Trash2, ChevronRight, User as UserIcon, Shield, Fingerprint, Wifi, Info, FileDown } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Slider from "@/components/SliderCompat";
import { router } from "expo-router";
import * as LocalAuthentication from 'expo-local-authentication';
import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';


export default function SettingsScreen() {
  const { settings, updateSetting, resetSettings, clearStorage, profile } = useUser();
  const insets = useSafeAreaInsets();

  const onToggle = useCallback((key: keyof typeof settings) => (value: boolean) => {
    void updateSetting(key as never, value as never);
  }, [updateSetting]);

  const onToggleWifiOnly = useCallback((wifiOnly: boolean) => {
    void updateSetting('downloadOverCellular', !wifiOnly);
  }, [updateSetting]);

  const onToggleBiometric = useCallback(async (next: boolean) => {
    try {
      if (Platform.OS === 'web') {
        console.log('[Settings] Biometric not available on web. Toggling UI only.');
        void updateSetting('biometricLock', next);
        return;
      }
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const supported = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !enrolled || supported.length === 0) {
        console.log('[Settings] Biometric not available or not enrolled', { hasHardware, enrolled, supported });
        void updateSetting('biometricLock', false);
        return;
      }
      if (next) {
        const res = await LocalAuthentication.authenticateAsync({ promptMessage: 'Enable biometric lock' });
        if (res.success) {
          void updateSetting('biometricLock', true);
        } else {
          console.log('[Settings] Biometric auth failed', res);
        }
      } else {
        void updateSetting('biometricLock', false);
      }
    } catch (err) {
      console.error('[Settings] biometric toggle error', err);
    }
  }, [updateSetting]);

  const copyLogs = useCallback(async () => {
    try {
      const buffer = (globalThis as any).__LOG_BUFFER ?? [];
      const meta = {
        appName: Constants?.expoConfig?.name ?? 'App',
        appVersion: Constants?.expoConfig?.version ?? Constants?.nativeAppVersion ?? '0.0.0',
        appBuild: Constants?.nativeBuildVersion ?? '0',
        platform: Platform.OS,
      };
      const payload = JSON.stringify({ meta, logs: buffer }, null, 2);
      await Clipboard.setStringAsync(payload);
      setStatusMsg('Debug logs copied to clipboard');
      setTimeout(() => setStatusMsg(null), 2500);
    } catch (err) {
      console.error('[Settings] copy logs error', err);
      setStatusMsg('Failed to copy logs');
      setTimeout(() => setStatusMsg(null), 3000);
    }
  }, []);

  const themeOptions = useMemo(() => ([
    { key: 'light' as const, label: 'Light', Icon: Sun },
    { key: 'dark' as const, label: 'Dark', Icon: Moon },
    { key: 'system' as const, label: 'System', Icon: Monitor },
  ]), []);

  const accentOptions = useMemo(() => ([
    { key: '#FF0080' as const, label: 'Pink' },
    { key: '#8B5CF6' as const, label: 'Purple' },
    { key: '#3B82F6' as const, label: 'Blue' },
    { key: '#10B981' as const, label: 'Green' },
    { key: '#F59E0B' as const, label: 'Amber' },
    { key: '#EF4444' as const, label: 'Red' },
  ]), []);

  const streamOptions = useMemo(() => ([
    { key: 'low' as const, label: 'Low' },
    { key: 'normal' as const, label: 'Normal' },
    { key: 'high' as const, label: 'High' },
  ]), []);

  const downloadOptions = useMemo(() => ([
    { key: 'normal' as const, label: 'Normal' },
    { key: 'high' as const, label: 'High' },
  ]), []);

  const languageOptions = useMemo(() => ([
    { key: 'en' as const, label: 'English' },
    { key: 'fr' as const, label: 'Français' },
    { key: 'es' as const, label: 'Español' },
    { key: 'pt' as const, label: 'Português' },
  ]), []);

  const [themeLocal, setThemeLocal] = useState<'light' | 'dark' | 'system'>(settings.theme);
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState<boolean>(false);

  const onSelectTheme = useCallback((t: 'light' | 'dark' | 'system') => {
    const safe = t ?? 'system';
    setThemeLocal(safe);
    void updateSetting('theme', safe);
  }, [updateSetting]);

  const handleClear = useCallback(async () => {
    if (isClearing) return;
    try {
      setIsClearing(true);
      await clearStorage();
      setConfirmVisible(false);
      setStatusMsg('Cache and app storage cleared');
      if (Platform.OS !== 'web') {
        console.log('[Settings] Cleared storage on native device');
      } else {
        console.log('[Settings] Cleared storage on web');
      }
      setTimeout(() => setStatusMsg(null), 2500);
    } catch (err) {
      console.error('[Settings] clearStorage error', err);
      setStatusMsg('Failed to clear storage. Please try again.');
      setTimeout(() => setStatusMsg(null), 3000);
    } finally {
      setIsClearing(false);
    }
  }, [clearStorage, isClearing]);

  return (
    <View style={[styles.container, { paddingTop: Math.max(16, insets.top), paddingBottom: Math.max(12, insets.bottom) }]} testID="settings-screen">
      <Text style={styles.title}>Settings</Text>

      <View style={[styles.card, styles.userHeader]} testID="settings-user-header">
        <View style={styles.userRow}>
          <View style={styles.userAvatarWrap}>
            <Image
              source={{ uri: (profile?.avatarUrl ?? 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=200&auto=format&fit=crop') }}
              style={styles.userAvatar}
            />
          </View>
          <View style={styles.userMeta}>
            <Text style={styles.userName} numberOfLines={1}>{profile?.displayName ?? 'didit360'}</Text>
            <Text style={styles.userSubtitle} numberOfLines={1}>{profile?.email ?? 'View Profile'}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.userQuickAction}
          onPress={() => router.push('/(tabs)/profile')}
          activeOpacity={0.9}
          testID="btn-view-profile"
          accessibilityRole="button"
          accessibilityLabel="View Profile"
        >
          <View style={styles.userQuickLeft}>
            <UserIcon color="#E5E7EB" size={18} />
            <Text style={styles.userQuickLabel}>View Profile</Text>
          </View>
          <ChevronRight color="#6B7280" size={18} />
        </TouchableOpacity>
      </View>

      <View style={styles.card} testID="card-playback">
        <Text style={styles.cardTitle}>Playback</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Autoplay</Text>
          <Switch value={settings.autoplay} onValueChange={onToggle("autoplay")} />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>High quality streaming</Text>
          <Switch value={settings.highQualityStreaming} onValueChange={onToggle("highQualityStreaming")} />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Allow explicit content</Text>
          <Switch value={settings.explicitContent} onValueChange={onToggle("explicitContent")} />
        </View>
        <View style={[styles.row, styles.rowTaller]}>
          <View style={styles.rowLeftInline}>
            <Music color="#9CA3AF" size={16} />
            <Text style={styles.rowLabel}>Crossfade</Text>
          </View>
          <View style={styles.sliderWrap}>
            <Slider
              testID="slider-crossfade"
              minimumValue={0}
              maximumValue={12}
              step={1}
              value={settings.crossfadeSeconds}
              onValueChange={(v: number) => void updateSetting('crossfadeSeconds', Math.max(0, Math.min(12, v)))}
              minimumTrackTintColor={settings.accentColor}
              maximumTrackTintColor="#2A2A2E"
              thumbTintColor={settings.accentColor}
              style={styles.slider}
            />
            <Text style={styles.sliderValue}>{settings.crossfadeSeconds}s</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Gapless playback</Text>
          <Switch value={settings.gaplessPlayback} onValueChange={onToggle('gaplessPlayback')} />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Normalize volume</Text>
          <Switch value={settings.normalizeVolume} onValueChange={onToggle('normalizeVolume')} />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Show lyrics</Text>
          <Switch value={settings.showLyrics} onValueChange={onToggle("showLyrics")} />
        </View>
      </View>

      <View style={styles.card} testID="card-quality">
        <Text style={styles.cardTitle}>Quality</Text>
        <View style={styles.row}>
          <View style={styles.rowLeftInline}>
            <Activity color="#9CA3AF" size={16} />
            <Text style={styles.rowLabel}>Data saver</Text>
          </View>
          <Switch value={settings.dataSaver} onValueChange={onToggle('dataSaver')} />
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SlidersHorizontal color="#9CA3AF" size={16} />
            <Text style={styles.sectionTitle}>Streaming quality</Text>
          </View>
          <View style={styles.themeRow}>
            {streamOptions.map(({ key, label }) => {
              const selected = settings.streamQuality === key;
              return (
                <TouchableOpacity
                  key={key}
                  testID={`stream-${key}`}
                  style={[styles.themeChip, selected ? styles.themeChipActive : undefined]}
                  onPress={() => void updateSetting('streamQuality', key)}
                  activeOpacity={0.9}
                  accessibilityRole="button"
                  accessibilityLabel={`Set streaming ${label}`}
                >
                  <Text style={[styles.themeChipText, selected ? styles.themeChipTextActive : undefined]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Database color="#9CA3AF" size={16} />
            <Text style={styles.sectionTitle}>Download quality</Text>
          </View>
          <View style={styles.themeRow}>
            {downloadOptions.map(({ key, label }) => {
              const selected = settings.downloadQuality === key;
              return (
                <TouchableOpacity
                  key={key}
                  testID={`download-${key}`}
                  style={[styles.themeChip, selected ? styles.themeChipActive : undefined]}
                  onPress={() => void updateSetting('downloadQuality', key)}
                  activeOpacity={0.9}
                  accessibilityRole="button"
                  accessibilityLabel={`Set download ${label}`}
                >
                  <Text style={[styles.themeChipText, selected ? styles.themeChipTextActive : undefined]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.card} testID="card-connectivity">
        <Text style={styles.cardTitle}>Connectivity & Data</Text>
        <View style={styles.row}>
          <View style={styles.rowLeftInline}>
            <Wifi color="#9CA3AF" size={16} />
            <Text style={styles.rowLabel}>Downloads: Wi‑Fi only</Text>
          </View>
          <Switch value={!settings.downloadOverCellular} onValueChange={onToggleWifiOnly} />
        </View>
        <View style={[styles.row, styles.rowTaller]}>
          <View style={styles.rowLeftInline}>
            <Activity color="#9CA3AF" size={16} />
            <Text style={styles.rowLabel}>Cellular limit</Text>
          </View>
          <View style={styles.sliderWrap}>
            <Slider
              testID="slider-cellular-limit"
              minimumValue={50}
              maximumValue={5000}
              step={50}
              value={settings.cellularDataLimitMB}
              onValueChange={(v: number) => void updateSetting('cellularDataLimitMB', Math.max(50, Math.min(5000, v)))}
              minimumTrackTintColor={settings.accentColor}
              maximumTrackTintColor="#2A2A2E"
              thumbTintColor={settings.accentColor}
              style={styles.slider}
            />
            <Text style={styles.sliderValue}>{settings.cellularDataLimitMB}MB</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Notifications</Text>
          <Switch value={settings.notifications} onValueChange={onToggle("notifications")} />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Connect to devices</Text>
          <Switch value={settings.connectToDevices} onValueChange={onToggle("connectToDevices")} />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Show local device only</Text>
          <Switch value={settings.showLocalDeviceOnly} onValueChange={onToggle("showLocalDeviceOnly")} />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Car mode</Text>
          <Switch value={settings.carMode} onValueChange={onToggle("carMode")} />
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Globe color="#9CA3AF" size={16} />
            <Text style={styles.sectionTitle}>Language</Text>
          </View>
          <View style={styles.themeRow}>
            {languageOptions.map(({ key, label }) => {
              const selected = settings.language === key;
              return (
                <TouchableOpacity
                  key={key}
                  testID={`lang-${key}`}
                  style={[styles.themeChip, selected ? styles.themeChipActive : undefined]}
                  onPress={() => void updateSetting('language', key)}
                  activeOpacity={0.9}
                  accessibilityRole="button"
                  accessibilityLabel={`Set language ${label}`}
                >
                  <Text style={[styles.themeChipText, selected ? styles.themeChipTextActive : undefined]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.card} testID="card-privacy">
        <Text style={styles.cardTitle}>Privacy & Security</Text>
        <View style={styles.row}>
          <View style={styles.rowLeftInline}>
            <Shield color="#9CA3AF" size={16} />
            <Text style={styles.rowLabel}>Share anonymous analytics</Text>
          </View>
          <Switch value={settings.analytics} onValueChange={onToggle('analytics')} />
        </View>
        <View style={styles.row}>
          <View style={styles.rowLeftInline}>
            <Fingerprint color="#9CA3AF" size={16} />
            <Text style={styles.rowLabel}>Biometric lock</Text>
          </View>
          <Switch value={settings.biometricLock} onValueChange={onToggleBiometric} />
        </View>
      </View>

      <View style={styles.card} testID="card-appearance">
        <Text style={styles.cardTitle}>Appearance</Text>
        <View style={styles.themeRow}>
          {themeOptions.map(({ key, label, Icon }) => {
            const selected = themeLocal === key;
            return (
              <TouchableOpacity
                key={key}
                testID={`theme-${key}`}
                style={[styles.themeChip, selected ? styles.themeChipActive : undefined]}
                onPress={() => onSelectTheme(key)}
                activeOpacity={0.9}
                accessibilityRole="button"
                accessibilityLabel={`Set theme ${label}`}
              >
                <Icon color={selected ? "#0B0B0C" : "#E5E7EB"} size={18} />
                <Text style={[styles.themeChipText, selected ? styles.themeChipTextActive : undefined]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Palette color="#9CA3AF" size={16} />
            <Text style={styles.sectionTitle}>Accent color</Text>
          </View>
          <View style={styles.themeRow}>
            {accentOptions.map(({ key, label }) => {
              const selected = settings.accentColor === key;
              return (
                <TouchableOpacity
                  key={key}
                  testID={`accent-${label.toLowerCase()}`}
                  style={[styles.colorSwatch, selected ? [{ borderColor: key }, styles.colorSwatchActive] : undefined]}
                  onPress={() => void updateSetting('accentColor', key)}
                  activeOpacity={0.9}
                  accessibilityRole="button"
                  accessibilityLabel={`Set accent ${label}`}
                >
                  <View style={[styles.colorDot, { backgroundColor: key }]} />
                  <Text style={styles.colorLabel}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <Text style={styles.helpText}>Theme applies to supported screens. Full theming can be added later.</Text>
      </View>

      <View style={styles.card} testID="card-about">
        <Text style={styles.cardTitle}>About</Text>
        <View style={styles.row}>
          <View style={styles.rowLeftInline}>
            <Info color="#9CA3AF" size={16} />
            <Text style={styles.rowLabel}>App</Text>
          </View>
          <Text style={styles.rowLabel}>{Constants?.expoConfig?.name ?? 'App'} {Constants?.expoConfig?.version ?? Constants?.nativeAppVersion ?? ''}</Text>
        </View>
        <TouchableOpacity
          testID="btn-copy-logs"
          style={styles.secondaryButton}
          onPress={copyLogs}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Copy debug logs"
        >
          <FileDown color="#E5E7EB" size={18} />
          <Text style={styles.secondaryButtonText}>Copy debug logs</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, styles.footerCard]} testID="card-actions">
        <TouchableOpacity
          testID="btn-reset-settings"
          style={[styles.primaryButton, { backgroundColor: settings.accentColor }]}
          onPress={() => void resetSettings()}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Reset settings to defaults"
        >
          <RotateCcw color="#0B0B0C" size={18} />
          <Text style={styles.primaryButtonText}>Reset to defaults</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="btn-clear-storage"
          style={styles.secondaryButton}
          onPress={() => setConfirmVisible(true)}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Clear cache and storage"
        >
          <Trash2 color="#E5E7EB" size={18} />
          <Text style={styles.secondaryButtonText}>Clear cache & storage</Text>
        </TouchableOpacity>
      </View>

      {confirmVisible ? (
        <View style={styles.modalOverlay} testID="confirm-modal">
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Clear cache & storage?</Text>
            <Text style={styles.modalBody}>This will remove offline data, preferences, and account session from this device.</Text>
            <View style={styles.modalRow}>
              <TouchableOpacity
                testID="btn-cancel-clear"
                style={[styles.modalButton, styles.modalBtnCancel]}
                onPress={() => setConfirmVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="btn-confirm-clear"
                style={[styles.modalButton, styles.modalBtnDanger]}
                onPress={handleClear}
                disabled={isClearing}
                accessibilityRole="button"
                accessibilityLabel="Confirm clear storage"
              >
                <Text style={styles.modalBtnDangerText}>{isClearing ? 'Clearing…' : 'Clear'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}

      {statusMsg ? (
        <View style={styles.toast} testID="toast-status">
          <Text style={styles.toastText}>{statusMsg}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0B0C", paddingHorizontal: 16 },
  title: { color: "#FFF", fontSize: 22, fontWeight: "800", marginBottom: 16 },
  card: { backgroundColor: "#111113", borderRadius: 14, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: "#1F1F22" },
  cardTitle: { color: "#9CA3AF", fontSize: 12, fontWeight: "800", marginBottom: 8, letterSpacing: 0.6 },
  row: { height: 56, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#1F1F22" },
  rowTaller: { height: 68 },
  rowLabel: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  rowLeftInline: { flexDirection: 'row', alignItems: 'center', gap: 8 as unknown as number },
  themeRow: { flexDirection: "row", flexWrap: 'wrap', gap: 8 as unknown as number, marginTop: 6 },
  themeChip: { flexDirection: "row", alignItems: "center", gap: 6 as unknown as number, paddingHorizontal: 12, height: 36, borderRadius: 999, borderWidth: 1, borderColor: "#2A2A2E", backgroundColor: "#0D0D0F" },
  themeChipActive: { backgroundColor: "#FF0080", borderColor: "#FF4DA6" },
  themeChipText: { color: "#E5E7EB", fontSize: 13, fontWeight: "700" },
  themeChipTextActive: { color: "#0B0B0C" },
  helpText: { color: "#6B7280", fontSize: 12, marginTop: 8 },
  section: { marginTop: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#1F1F22' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 as unknown as number, marginBottom: 8 },
  sectionTitle: { color: '#9CA3AF', fontSize: 12, fontWeight: '800' },
  sliderWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 as unknown as number },
  slider: { width: 160, height: 30 },
  sliderValue: { color: '#E5E7EB', fontSize: 13, fontWeight: '700', width: 34, textAlign: 'right' },
  footerCard: { alignItems: 'stretch' },
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 44, borderRadius: 12, backgroundColor: '#FF0080', gap: 8 as unknown as number, marginBottom: 10 },
  primaryButtonText: { color: '#0B0B0C', fontSize: 15, fontWeight: '800' },
  secondaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 44, borderRadius: 12, backgroundColor: '#1A1A1A', gap: 8 as unknown as number },
  secondaryButtonText: { color: '#E5E7EB', fontSize: 15, fontWeight: '800' },
  colorSwatch: { flexDirection: 'row', alignItems: 'center', gap: 8 as unknown as number, height: 36, paddingHorizontal: 10, borderRadius: 999, borderWidth: 2, borderColor: '#2A2A2E', backgroundColor: '#0D0D0F' },
  colorSwatchActive: { backgroundColor: '#0F0F12' },
  colorDot: { width: 18, height: 18, borderRadius: 9 },
  colorLabel: { color: '#E5E7EB', fontSize: 13, fontWeight: '700' },
  userHeader: { padding: 12 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12 as unknown as number, marginBottom: 4 },
  userAvatarWrap: { width: 48, height: 48, borderRadius: 10, overflow: 'hidden', backgroundColor: '#0F0F12' },
  userAvatar: { width: '100%', height: '100%' },
  userMeta: { flex: 1 },
  userName: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  userSubtitle: { color: '#9CA3AF', fontSize: 12, fontWeight: '600' },
  userQuickAction: { marginTop: 8, height: 44, borderRadius: 10, backgroundColor: '#0D0D0F', borderWidth: 1, borderColor: '#1F1F22', paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  userQuickLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 as unknown as number },
  userQuickLabel: { color: '#E5E7EB', fontSize: 14, fontWeight: '700' },
  modalOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modalCard: { width: '100%', maxWidth: 420, backgroundColor: '#111113', borderRadius: 16, borderWidth: 1, borderColor: '#26262B', padding: 16 },
  modalTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginBottom: 4 },
  modalBody: { color: '#9CA3AF', fontSize: 13, marginBottom: 12 },
  modalRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 as unknown as number },
  modalButton: { height: 40, paddingHorizontal: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  modalBtnCancel: { backgroundColor: '#1A1A1A', borderWidth: 1, borderColor: '#26262B' },
  modalBtnDanger: { backgroundColor: '#EF4444' },
  modalBtnCancelText: { color: '#E5E7EB', fontSize: 14, fontWeight: '800' },
  modalBtnDangerText: { color: '#0B0B0C', fontSize: 14, fontWeight: '800' },
  toast: { position: 'absolute', bottom: 24, left: 16, right: 16, backgroundColor: '#0F172A', borderRadius: 12, borderWidth: 1, borderColor: '#1F2937', paddingVertical: 10, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
  toastText: { color: '#E5E7EB', fontSize: 13, fontWeight: '700' },
});