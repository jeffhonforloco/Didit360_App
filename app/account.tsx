import React, { useCallback, useMemo, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, Platform } from "react-native";
import { useUser } from "@/contexts/UserContext";
import { useNavigation } from "expo-router";

export default function AccountScreen() {
  const { profile, updateProfile, isLoading } = useUser();
  const nav = useNavigation();

  const initialName = profile?.displayName ?? "";
  const initialEmail = profile?.email ?? "";
  const initialAvatar = profile?.avatarUrl ?? "";

  const [name, setName] = useState<string>(initialName);
  const [email, setEmail] = useState<string>(initialEmail);
  const [avatarUrl, setAvatarUrl] = useState<string>(initialAvatar ?? "");
  const [saving, setSaving] = useState<boolean>(false);
  const disabled = useMemo(() => saving || isLoading, [saving, isLoading]);

  const onSave = useCallback(async () => {
    const n = name.trim();
    const e = email.trim();
    if (!n) {
      if (Platform.OS === "web") console.log("Display name required");
      else Alert.alert("Validation", "Display name is required");
      return;
    }
    if (!e || !e.includes("@") || e.length < 5) {
      if (Platform.OS === "web") console.log("Email invalid");
      else Alert.alert("Validation", "Please provide a valid email");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ displayName: n, email: e, avatarUrl: avatarUrl || null });
      if (Platform.OS === "web") console.log("Profile saved");
      else Alert.alert("Saved", "Your profile has been updated");
      // go back if available
      // @ts-ignore
      if (typeof nav?.goBack === "function") nav.goBack();
    } catch (err) {
      console.error("[Account] save error", err);
      if (Platform.OS !== "web") Alert.alert("Error", "Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  }, [name, email, avatarUrl, updateProfile, nav]);

  const avatarSrc = avatarUrl || "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=400&auto=format&fit=crop";

  return (
    <View style={styles.container} testID="account-screen">
      <View style={styles.headerRow}>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: avatarSrc }} style={styles.avatar} />
        </View>
        <View style={styles.headerMeta}>
          <Text style={styles.headerTitle} numberOfLines={1}>{name || "Your Name"}</Text>
          <Text style={styles.headerSub} numberOfLines={1}>{email || "you@example.com"}</Text>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Display name</Text>
        <TextInput
          testID="input-name"
          style={styles.input}
          placeholder="John Appleseed"
          placeholderTextColor="#6B7280"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          testID="input-email"
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor="#6B7280"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Avatar URL</Text>
        <TextInput
          testID="input-avatar"
          style={styles.input}
          placeholder="https://..."
          placeholderTextColor="#6B7280"
          autoCapitalize="none"
          value={avatarUrl}
          onChangeText={setAvatarUrl}
        />

        <TouchableOpacity
          testID="save-profile"
          style={[styles.saveBtn, disabled ? styles.saveBtnDisabled : undefined]}
          onPress={onSave}
          activeOpacity={0.9}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Save profile"
        >
          <Text style={styles.saveText}>{saving ? "Saving..." : "Save"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0C",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12 as unknown as number,
    marginBottom: 18,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#111113",
  },
  avatar: { width: "100%", height: "100%" },
  headerMeta: { flex: 1 },
  headerTitle: { color: "#FFF", fontSize: 20, fontWeight: "800" },
  headerSub: { color: "#9CA3AF", fontSize: 13, fontWeight: "600" },
  form: { gap: 10 as unknown as number },
  label: { color: "#9CA3AF", fontSize: 12, fontWeight: "700", marginTop: 8 },
  input: {
    height: 44,
    borderRadius: 10,
    backgroundColor: "#111113",
    borderWidth: 1,
    borderColor: "#1F2937",
    paddingHorizontal: 12,
    color: "#FFF",
  },
  saveBtn: {
    marginTop: 16,
    backgroundColor: "#FF0080",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveText: { color: "#0B0B0C", fontWeight: "800", fontSize: 16 },
});