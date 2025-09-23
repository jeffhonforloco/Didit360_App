import React, { useCallback } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { useUser } from "@/contexts/UserContext";

export default function SettingsScreen() {
  const { settings, updateSetting } = useUser();

  const onToggle = useCallback((key: keyof typeof settings) => (value: boolean) => {
    void updateSetting(key, value as never);
  }, [updateSetting, settings]);

  return (
    <View style={styles.container} testID="settings-screen">
      <Text style={styles.title}>Settings</Text>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Autoplay</Text>
        <Switch value={settings.autoplay} onValueChange={onToggle("autoplay")} />
      </View>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>High quality streaming</Text>
        <Switch value={settings.highQualityStreaming} onValueChange={onToggle("highQualityStreaming")} />
      </View>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Notifications</Text>
        <Switch value={settings.notifications} onValueChange={onToggle("notifications")} />
      </View>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Download over cellular</Text>
        <Switch value={settings.downloadOverCellular} onValueChange={onToggle("downloadOverCellular")} />
      </View>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Allow explicit content</Text>
        <Switch value={settings.explicitContent} onValueChange={onToggle("explicitContent")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0B0C", paddingHorizontal: 16, paddingTop: 16 },
  title: { color: "#FFF", fontSize: 22, fontWeight: "800", marginBottom: 16 },
  row: { height: 56, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#1F1F22" },
  rowLabel: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});