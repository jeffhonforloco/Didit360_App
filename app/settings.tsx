import React, { useCallback, useMemo, useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { useUser } from "@/contexts/UserContext";
import { Moon, Sun, Monitor, Globe, SlidersHorizontal, Database, Music, Activity, RotateCcw } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";

export default function SettingsScreen() {
  const { settings, updateSetting, resetSettings } = useUser();
  const insets = useSafeAreaInsets();

  const onToggle = useCallback((key: keyof typeof settings) => (value: boolean) => {
    void updateSetting(key as never, value as never);
  }, [updateSetting]);

  const themeOptions = useMemo(() => ([
    { key: 'light' as const, label: 'Light', Icon: Sun },
    { key: 'dark' as const, label: 'Dark', Icon: Moon },
    { key: 'system' as const, label: 'System', Icon: Monitor },
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

  const onSelectTheme = useCallback((t: 'light' | 'dark' | 'system') => {
    const safe = t ?? 'system';
    setThemeLocal(safe);
    void updateSetting('theme', safe);
  }, [updateSetting]);

  return (
    <View style={[styles.container, { paddingTop: Math.max(16, insets.top), paddingBottom: Math.max(12, insets.bottom) }]} testID="settings-screen">
      <Text style={styles.title}>Settings</Text>

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
              minimumTrackTintColor="#FF0080"
              maximumTrackTintColor="#2A2A2E"
              thumbTintColor="#FF4DA6"
              style={styles.slider}
            />
            <Text style={styles.sliderValue}>{settings.crossfadeSeconds}s</Text>
          </View>
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
        <Text style={styles.cardTitle}>Connectivity</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Download over cellular</Text>
          <Switch value={settings.downloadOverCellular} onValueChange={onToggle("downloadOverCellular")} />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Notifications</Text>
          <Switch value={settings.notifications} onValueChange={onToggle("notifications")} />
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
        <Text style={styles.cardTitle}>Privacy</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Share anonymous analytics</Text>
          <Switch value={settings.analytics} onValueChange={onToggle('analytics')} />
        </View>
      </View>

      <View style={[styles.card, styles.footerCard]} testID="card-actions">
        <TouchableOpacity
          testID="btn-reset-settings"
          style={styles.primaryButton}
          onPress={() => void resetSettings()}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Reset settings to defaults"
        >
          <RotateCcw color="#0B0B0C" size={18} />
          <Text style={styles.primaryButtonText}>Reset to defaults</Text>
        </TouchableOpacity>
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
        <Text style={styles.helpText}>Theme applies to supported screens. Full theming can be added later.</Text>
      </View>
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
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 44, borderRadius: 12, backgroundColor: '#FF0080', gap: 8 as unknown as number },
  primaryButtonText: { color: '#0B0B0C', fontSize: 15, fontWeight: '800' },
});