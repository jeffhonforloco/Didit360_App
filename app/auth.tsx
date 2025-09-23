import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { useUser } from "@/contexts/UserContext";
import { router } from "expo-router";

export default function AuthModal() {
  const { updateProfile } = useUser();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onContinueGuest = useCallback(() => {
    router.back();
  }, []);

  const onSignUp = useCallback(async () => {
    const e = email.trim();
    const n = name.trim();
    if (!e.includes("@") || e.length < 5) {
      if (Platform.OS === "web") console.log("Enter a valid email");
      else Alert.alert("Validation", "Enter a valid email");
      return;
    }
    if (!n) {
      if (Platform.OS === "web") console.log("Enter your name");
      else Alert.alert("Validation", "Enter your name");
      return;
    }
    setLoading(true);
    try {
      await updateProfile({ email: e, displayName: n });
      router.dismissAll();
    } catch (err) {
      console.error("[Auth] sign up error", err);
    } finally {
      setLoading(false);
    }
  }, [email, name, updateProfile]);

  return (
    <View style={[styles.container, { paddingTop: Math.max(16, insets.top), paddingBottom: Math.max(16, insets.bottom) }]}
      testID="auth-modal">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityRole="button" testID="close-auth">
          <X size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create your account</Text>
        <View style={{ width: 22 }} />
      </View>

      <Text style={styles.subtitle}>Sign up to continue listening without limits.</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Appleseed"
          placeholderTextColor="#6B7280"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor="#6B7280"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={onSignUp} disabled={loading} testID="signup-btn">
          <Text style={styles.primaryText}>{loading ? "Creating..." : "Sign up"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={onContinueGuest} testID="continue-guest">
          <Text style={styles.secondaryText}>Continue as guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0B0C", paddingHorizontal: 16 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  headerTitle: { color: "#FFF", fontSize: 16, fontWeight: "800" },
  subtitle: { color: "#9CA3AF", fontSize: 14, marginBottom: 16 },
  form: { gap: 10 as unknown as number },
  label: { color: "#9CA3AF", fontSize: 12, fontWeight: "700", marginTop: 6 },
  input: { height: 44, borderRadius: 10, backgroundColor: "#111113", borderWidth: 1, borderColor: "#1F2937", paddingHorizontal: 12, color: "#FFF" },
  primaryBtn: { marginTop: 16, backgroundColor: "#FF0080", height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  primaryText: { color: "#0B0B0C", fontWeight: "800", fontSize: 16 },
  secondaryBtn: { marginTop: 8, height: 44, borderRadius: 10, borderWidth: 1, borderColor: "#1F2937", alignItems: "center", justifyContent: "center" },
  secondaryText: { color: "#E5E7EB", fontWeight: "700" },
});