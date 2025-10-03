import React, { useMemo, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from "react-native";
import SafeImage from "@/components/SafeImage";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, Settings, LogOut, ChevronRight, Globe, Activity, Music, ShieldAlert, Smartphone, Car, Sparkles } from "lucide-react-native";
import { router, type Href } from "expo-router";
import { useUser, useSignOut } from "@/contexts/UserContext";

export default function ProfileScreen() {
  const { profile, isLoading } = useUser();
  const signOutWithNavigation = useSignOut();
  
  console.log('[ProfileScreen] profile:', profile);
  console.log('[ProfileScreen] signOutWithNavigation function:', typeof signOutWithNavigation);
  console.log('[ProfileScreen] isLoading:', isLoading);

  const items = useMemo(
    () => [
      { key: "ai-features", title: "AI Features", icon: Sparkles },
      { key: "account", title: "Account", icon: User },
      { key: "data", title: "Data Saver", icon: Activity },
      { key: "languages", title: "Languages", icon: Globe },
      { key: "playback", title: "Playback", icon: Music },
      { key: "explicit", title: "Explicit Content", icon: ShieldAlert },
      { key: "devices", title: "Devices", icon: Smartphone },
      { key: "car", title: "Car", icon: Car },
      { key: "settings", title: "Settings", icon: Settings },
      { key: "logout", title: "Sign out", icon: LogOut, danger: true },
    ],
    []
  );

  // Show sign in prompt if user is not signed in (but don't auto-redirect)
  useEffect(() => {
    console.log('[ProfileScreen] useEffect - isLoading:', isLoading, 'profile:', !!profile);
    // Don't auto-redirect to auth - let user stay on profile tab
    // They can manually tap to sign in if needed
  }, [profile, isLoading]);

  // Show loading or return early if no profile
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]} testID="profile-loading">
        <Text style={styles.header}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Show sign in screen if no profile
  if (!profile) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]} testID="profile-signed-out">
        <Text style={styles.header}>Profile</Text>
        <View style={styles.signInPrompt}>
          <Text style={styles.signInTitle}>Sign in to access your profile</Text>
          <Text style={styles.signInSubtitle}>Create an account or sign in to save your music, create playlists, and more.</Text>
          <TouchableOpacity 
            style={styles.signInButton}
            onPress={() => router.push('/auth' as Href)}
            testID="sign-in-button"
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const onPress = (key: string) => {
    console.log('[ProfileScreen] onPress called with key:', key);
    if (key === "logout") {
      console.log('[ProfileScreen] logout pressed, showing alert');
      Alert.alert("Sign out", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        { text: "Sign out", style: "destructive", onPress: async () => { 
          console.log('[ProfileScreen] sign out confirmed');
          try { 
            console.log('[ProfileScreen] calling signOutWithNavigation...');
            await signOutWithNavigation(); 
            console.log('[ProfileScreen] signOut with navigation completed successfully');
          } catch (e) { 
            console.error('[ProfileScreen] signOut error:', e); 
            // Don't show error alert, just log it - user will be navigated away anyway
          } 
        } },
      ]);
      return;
    }
    if (key === "account") router.push("/account" as Href);
    else if (key === "ai-features") router.push("/ai-features" as Href);
    else router.push("/settings" as Href);
  };

  const avatarSrc = profile?.avatarUrl || "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=200&auto=format&fit=crop";

  return (
    <SafeAreaView style={styles.container} edges={["top"]} testID="profile-screen">
      <Text style={styles.header} testID="profile-title">Settings</Text>

      <View style={[styles.card, styles.userHeader]} testID="profile-header-card">
        <View style={styles.userRow}>
          <TouchableOpacity 
            style={styles.avatarWrap}
            onPress={() => router.push('/account' as Href)}
            activeOpacity={0.8}
            testID="profile-avatar-button"
          >
            <SafeImage uri={avatarSrc} style={styles.avatar} />
          </TouchableOpacity>
          <View style={styles.userMeta}>
            <Text style={styles.userName} numberOfLines={1}>{profile.displayName}</Text>
            <TouchableOpacity onPress={() => router.push('/account' as Href)} activeOpacity={0.9} testID="btn-view-profile">
              <Text style={styles.userView}>View Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.card} testID="profile-card">
        {items.map((item, idx) => {
          console.log('[ProfileScreen] rendering item:', item.key, item.title, 'danger:', item.danger);
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
        v1.1 • {Platform.OS}
      </Text>
    </SafeAreaView>
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
  userHeader: {
    padding: 12,
    marginBottom: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 as unknown as number,
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#111113',
  },
  avatar: { width: '100%', height: '100%' },
  userMeta: { flex: 1 },
  userName: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  userView: { color: '#9CA3AF', fontSize: 12, fontWeight: '700', marginTop: 2 },
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
  signInPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  signInTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  signInSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  signInButton: {
    backgroundColor: '#FF0080',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
