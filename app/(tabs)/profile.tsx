import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, Settings, LogOut, ChevronRight, Globe, Activity, Music, ShieldAlert, Smartphone, Car, UserPlus, type LucideIcon } from "lucide-react-native";
import { router, type Href } from "expo-router";
import { useUser } from "@/contexts/UserContext";

type MenuItem = {
  key: string;
  title: string;
  icon: LucideIcon;
  danger?: boolean;
  primary?: boolean;
};

export default function ProfileScreen() {
  const { profile, isLoading, isInitialized, signOut } = useUser();
  
  console.log('[ProfileScreen] profile:', profile);
  console.log('[ProfileScreen] isLoading:', isLoading);
  console.log('[ProfileScreen] isInitialized:', isInitialized);

  const signedInItems = useMemo<MenuItem[]>(
    () => [
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

  const guestItems = useMemo<MenuItem[]>(
    () => [
      { key: "signin", title: "Sign in", icon: UserPlus, primary: true },
      { key: "data", title: "Data Saver", icon: Activity },
      { key: "languages", title: "Languages", icon: Globe },
      { key: "playback", title: "Playback", icon: Music },
      { key: "explicit", title: "Explicit Content", icon: ShieldAlert },
      { key: "devices", title: "Devices", icon: Smartphone },
      { key: "car", title: "Car", icon: Car },
      { key: "settings", title: "Settings", icon: Settings },
    ],
    []
  );

  const items = profile ? signedInItems : guestItems;

  // Show loading while initializing
  if (!isInitialized || isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]} testID="profile-loading">
        <Text style={styles.header}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const onPress = (key: string) => {
    console.log('[ProfileScreen] onPress called with key:', key);
    
    if (key === "signin") {
      router.push('/auth' as Href);
      return;
    }
    
    if (key === "logout") {
      console.log('[ProfileScreen] logout pressed, showing alert');
      Alert.alert("Sign out", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        { text: "Sign out", style: "destructive", onPress: async () => { 
          console.log('[ProfileScreen] sign out confirmed');
          try { 
            console.log('[ProfileScreen] calling signOut...');
            await signOut(); 
            console.log('[ProfileScreen] signOut completed successfully');
          } catch (e) { 
            console.error('[ProfileScreen] signOut error:', e); 
            if (Platform.OS === 'web') {
              console.log('Failed to sign out. Please try again.');
            } else {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          } 
        } },
      ]);
      return;
    }
    
    if (key === "account") router.push("/account" as Href);
    else router.push("/settings" as Href);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]} testID="profile-screen">
      <Text style={styles.header} testID="profile-title">Settings</Text>

      {profile ? (
        <View style={[styles.card, styles.userHeader]} testID="profile-header-card">
          <View style={styles.userRow}>
            <TouchableOpacity 
              style={styles.avatarWrap}
              onPress={() => router.push('/account' as Href)}
              activeOpacity={0.8}
              testID="profile-avatar-button"
            >
              <Image 
                source={{ uri: profile.avatarUrl || "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=200&auto=format&fit=crop" }} 
                style={styles.avatar} 
              />
            </TouchableOpacity>
            <View style={styles.userMeta}>
              <Text style={styles.userName} numberOfLines={1}>{profile.displayName}</Text>
              <TouchableOpacity onPress={() => router.push('/account' as Href)} activeOpacity={0.9} testID="btn-view-profile">
                <Text style={styles.userView}>View Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={[styles.card, styles.guestHeader]} testID="guest-header-card">
          <View style={styles.guestRow}>
            <View style={styles.guestIconWrap}>
              <User size={24} color="#9CA3AF" />
            </View>
            <View style={styles.guestMeta}>
              <Text style={styles.guestTitle}>You&apos;re browsing as a guest</Text>
              <Text style={styles.guestSubtitle}>Sign in to sync your music across devices</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.card} testID="profile-card">
        {items.map((item, idx) => {
          console.log('[ProfileScreen] rendering item:', item.key, item.title, 'danger:', item.danger, 'primary:', item.primary);
          const IconComp = item.icon;
          const isLast = idx === items.length - 1;
          const isPrimary = item.primary;
          const isDanger = item.danger;
          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.row, !isLast && styles.rowDivider, isPrimary && styles.primaryRow]}
              activeOpacity={0.8}
              onPress={() => onPress(item.key)}
              testID={`profile-item-${item.key}`}
            >
              <View style={[styles.iconWrap, isDanger ? styles.iconDanger : isPrimary ? styles.iconPrimary : null]}> 
                <IconComp size={20} color={isDanger ? "#F87171" : isPrimary ? "#FF0080" : "#6EE7B7"} />
              </View>
              <Text style={[styles.rowText, isDanger ? styles.textDanger : isPrimary ? styles.textPrimary : null]}>{item.title}</Text>
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
  iconPrimary: {
    backgroundColor: "#2A0F2A",
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
  textPrimary: {
    color: "#FF0080",
    fontWeight: "700",
  },
  primaryRow: {
    backgroundColor: "#1A1A1C",
  },
  guestHeader: {
    padding: 16,
    marginBottom: 12,
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 as unknown as number,
  },
  guestIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#1A1A1C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2A2A2C',
    borderStyle: 'dashed',
  },
  guestMeta: {
    flex: 1,
  },
  guestTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  guestSubtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 2,
  },
  meta: {
    marginTop: 16,
    color: "#9CA3AF",
    fontSize: 12,
    textAlign: "center",
  },
});
