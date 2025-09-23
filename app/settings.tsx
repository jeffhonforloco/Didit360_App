import React, { useCallback, useMemo, useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { useUser } from "@/contexts/UserContext";
import { Moon, Sun, Monitor } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { settings, updateSetting } = useUser();
  const insets = useSafeAreaInsets();

  const onToggle = useCallback((key: keyof typeof settings) => (value: boolean) => {
    void updateSetting(key as never, value as never);
  }, [updateSetting]);

  const themeOptions = useMemo(() => ([
    { key: 'light' as const, label: 'Light', Icon: Sun },
    { key: 'dark' as const, label: 'Dark', Icon: Moon },
    { key: 'system' as const, label: 'System', Icon: Monitor },
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
  rowLabel: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  themeRow: { flexDirection: "row", gap: 8 as unknown as number, marginTop: 6 },
  themeChip: { flexDirection: "row", alignItems: "center", gap: 6 as unknown as number, paddingHorizontal: 12, height: 36, borderRadius: 999, borderWidth: 1, borderColor: "#2A2A2E", backgroundColor: "#0D0D0F" },
  themeChipActive: { backgroundColor: "#FF0080", borderColor: "#FF4DA6" },
  themeChipText: { color: "#E5E7EB", fontSize: 13, fontWeight: "700" },
  themeChipTextActive: { color: "#0B0B0C" },
  helpText: { color: "#6B7280", fontSize: 12, marginTop: 8 },
});