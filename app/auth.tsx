import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { useUser } from "@/contexts/UserContext";
import { router } from "expo-router";

type AuthMode = 'signup' | 'signin';

export default function AuthModal() {
  const { updateProfile, profile, isLoading } = useUser();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<AuthMode>('signup');
  
  console.log('[AuthModal] Rendered - profile:', profile, 'isLoading:', isLoading);

  const onContinueGuest = useCallback(() => {
    router.back();
  }, []);

  const onSignUp = useCallback(async () => {
    const e = email.trim();
    const n = name.trim();
    const p = password.trim();
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
    if (!p || p.length < 6) {
      if (Platform.OS === "web") console.log("Password must be at least 6 characters");
      else Alert.alert("Validation", "Password must be at least 6 characters");
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
  }, [email, name, password, updateProfile]);

  const onSignIn = useCallback(async () => {
    const e = email.trim();
    const p = password.trim();
    if (!e.includes("@") || e.length < 5) {
      if (Platform.OS === "web") console.log("Enter a valid email");
      else Alert.alert("Validation", "Enter a valid email");
      return;
    }
    if (!p) {
      if (Platform.OS === "web") console.log("Enter your password");
      else Alert.alert("Validation", "Enter your password");
      return;
    }
    setLoading(true);
    try {
      // For demo purposes, we'll just sign them in with the email
      // In a real app, you'd validate credentials against your backend
      await updateProfile({ email: e, displayName: e.split('@')[0] });
      router.dismissAll();
    } catch (err) {
      console.error("[Auth] sign in error", err);
    } finally {
      setLoading(false);
    }
  }, [email, password, updateProfile]);

  return (
    <View style={[styles.container, { paddingTop: Math.max(16, insets.top), paddingBottom: Math.max(16, insets.bottom) }]}
      testID="auth-modal">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityRole="button" testID="close-auth">
          <X size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</Text>
        <View style={styles.spacer} />
      </View>

      <Text style={styles.subtitle}>{mode === 'signup' ? 'Sign up to continue listening without limits.' : 'Sign in to access your music library.'}</Text>

      <View style={styles.form}>
        {mode === 'signup' && (
          <>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Appleseed"
              placeholderTextColor="#6B7280"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </>
        )}
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
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#6B7280"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity 
          style={styles.primaryBtn} 
          onPress={mode === 'signup' ? onSignUp : onSignIn} 
          disabled={loading} 
          testID={mode === 'signup' ? "signup-btn" : "signin-btn"}
        >
          <Text style={styles.primaryText}>
            {loading ? (mode === 'signup' ? "Creating..." : "Signing in...") : (mode === 'signup' ? "Sign up" : "Sign in")}
          </Text>
        </TouchableOpacity>

        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>
            {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
          </Text>
          <TouchableOpacity onPress={() => setMode(mode === 'signup' ? 'signin' : 'signup')} testID="switch-mode">
            <Text style={styles.switchLink}>{mode === 'signup' ? 'Sign in' : 'Sign up'}</Text>
          </TouchableOpacity>
        </View>

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
  switchContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 16, gap: 4 },
  switchText: { color: "#9CA3AF", fontSize: 14 },
  switchLink: { color: "#FF0080", fontSize: 14, fontWeight: "700" },
  spacer: { width: 22 },
});