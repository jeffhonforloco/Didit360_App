import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from "react-native";
import { User, Settings, LogOut, ChevronRight } from "lucide-react-native";

export default function ProfileScreen() {
  const items = useMemo(
    () => [
      { key: "account", title: "Account", icon: User },
      { key: "settings", title: "Settings", icon: Settings },
      { key: "logout", title: "Sign out", icon: LogOut, danger: true },
    ],
    []
  );

  const onPress = (key: string) => {
    if (key === "logout") {
      Alert.alert("Sign out", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        { text: "Sign out", style: "destructive", onPress: () => console.log("[Profile] Sign out pressed") },
      ]);
      return;
    }
    console.log(`[Profile] Pressed: ${key}`);
  };

  return (
    <View style={styles.container} testID="profile-screen">
      <Text style={styles.header} testID="profile-title">Profile</Text>

      <View style={styles.card} testID="profile-card">
        {items.map((item, idx) => {
          const IconComp = item.icon;
          const isLast = idx === items.length - 1;
          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.row, !isLast && styles.rowDivider]}
              activeOpacity={0.8}
              onPress={() => onPress(item.key)}
              testID={`profile-item-${item.key}`}
            >
              <View style={[styles.iconWrap, item.danger ? styles.iconDanger : null]}> 
                <IconComp size={20} color={item.danger ? "#F87171" : "#6EE7B7"} />
              </View>
              <Text style={[styles.rowText, item.danger ? styles.textDanger : null]}>{item.title}</Text>
              <ChevronRight size={18} color="#666" />
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.meta} testID="profile-meta">
        v1.1-firebase • {Platform.OS}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0C",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 14,
  },
  card: {
    backgroundColor: "#121214",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1F1F22",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12 as unknown as number,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#1F1F22",
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#0F2A22",
    alignItems: "center",
    justifyContent: "center",
  },
  iconDanger: {
    backgroundColor: "#2A0F12",
  },
  rowText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  textDanger: {
    color: "#F87171",
  },
  meta: {
    marginTop: 16,
    color: "#9CA3AF",
    fontSize: 12,
    textAlign: "center",
  },
});
