import React, { useCallback, useMemo, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, Platform } from "react-native";
import { useUser } from "@/contexts/UserContext";
import { useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { Camera, ImageIcon } from 'lucide-react-native';

export default function AccountScreen() {
  const { profile, updateProfile, isLoading, changePassword } = useUser();
  const nav = useNavigation();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState<string>(profile?.displayName ?? "");
  const [email, setEmail] = useState<string>(profile?.email ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string>(profile?.avatarUrl ?? "");

  // Update local state when profile changes
  React.useEffect(() => {
    if (profile) {
      setName(profile.displayName);
      setEmail(profile.email);
      setAvatarUrl(profile.avatarUrl ?? "");
    }
  }, [profile]);
  const [saving, setSaving] = useState<boolean>(false);
  const [currentPw, setCurrentPw] = useState<string>("");
  const [newPw, setNewPw] = useState<string>("");
  const [confirmPw, setConfirmPw] = useState<string>("");
  const disabled = useMemo(() => saving || isLoading, [saving, isLoading]);

  const pickImage = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant photo library access to change your profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatarUrl(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  }, []);

  const takePhoto = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera access to take a profile picture.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatarUrl(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  }, []);

  const showImageOptions = useCallback(() => {
    if (Platform.OS === 'web') {
      // On web, only show photo library option
      pickImage();
      return;
    }

    Alert.alert(
      'Change Profile Picture',
      'Choose how you want to update your profile picture',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
      ]
    );
  }, [pickImage, takePhoto]);

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
    if ((currentPw || newPw || confirmPw)) {
      if (newPw !== confirmPw) {
        if (Platform.OS === "web") console.log("Passwords do not match");
        else Alert.alert("Validation", "New passwords do not match");
        return;
      }
      if (newPw.length < 6) {
        if (Platform.OS === "web") console.log("Password too short");
        else Alert.alert("Validation", "Password must be at least 6 characters");
        return;
      }
    }
    setSaving(true);
    try {
      await updateProfile({ displayName: n, email: e, avatarUrl: avatarUrl || null });
      if (newPw) {
        await changePassword(currentPw, newPw);
      }
      if (Platform.OS === "web") console.log("Profile saved");
      else Alert.alert("Saved", "Your account has been updated");
      // @ts-ignore
      if (typeof nav?.goBack === "function") nav.goBack();
    } catch (err) {
      console.error("[Account] save error", err);
      if (Platform.OS !== "web") Alert.alert("Error", (err as Error)?.message ?? "Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  }, [name, email, avatarUrl, updateProfile, nav, currentPw, newPw, confirmPw, changePassword]);

  const avatarSrc = avatarUrl || "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=400&auto=format&fit=crop";

  return (
    <View style={[styles.container, { paddingTop: Math.max(16, insets.top), paddingBottom: Math.max(12, insets.bottom) }]} testID="account-screen">
      <View style={styles.headerRow}>
        <TouchableOpacity 
          style={styles.avatarWrap} 
          onPress={showImageOptions}
          activeOpacity={0.8}
          testID="change-avatar-button"
        >
          <Image source={{ uri: avatarSrc }} style={styles.avatar} />
          <View style={styles.avatarOverlay}>
            <Camera size={20} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
        <View style={styles.headerMeta}>
          <Text style={styles.headerTitle} numberOfLines={1}>{name || "Your Name"}</Text>
          <Text style={styles.headerSub} numberOfLines={1}>{email || "you@example.com"}</Text>
          <TouchableOpacity 
            onPress={showImageOptions}
            style={styles.changePhotoButton}
            testID="change-photo-text-button"
          >
            <ImageIcon size={14} color="#FF0080" />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
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

        <Text style={styles.label}>Avatar URL (Optional)</Text>
        <View style={styles.avatarInputRow}>
          <TextInput
            testID="input-avatar"
            style={[styles.input, styles.avatarInput]}
            placeholder="https://... or use camera above"
            placeholderTextColor="#6B7280"
            autoCapitalize="none"
            value={avatarUrl}
            onChangeText={setAvatarUrl}
          />
          <TouchableOpacity 
            style={styles.imagePickerButton}
            onPress={showImageOptions}
            testID="avatar-picker-button"
          >
            <ImageIcon size={18} color="#FF0080" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle]}>Security</Text>
        <Text style={styles.label}>Current password</Text>
        <TextInput
          testID="input-current-password"
          style={styles.input}
          placeholder="••••••"
          placeholderTextColor="#6B7280"
          autoCapitalize="none"
          secureTextEntry
          value={currentPw}
          onChangeText={setCurrentPw}
        />

        <Text style={styles.label}>New password</Text>
        <TextInput
          testID="input-new-password"
          style={styles.input}
          placeholder="At least 6 characters"
          placeholderTextColor="#6B7280"
          autoCapitalize="none"
          secureTextEntry
          value={newPw}
          onChangeText={setNewPw}
        />

        <Text style={styles.label}>Confirm new password</Text>
        <TextInput
          testID="input-confirm-password"
          style={styles.input}
          placeholder="Re-enter new password"
          placeholderTextColor="#6B7280"
          autoCapitalize="none"
          secureTextEntry
          value={confirmPw}
          onChangeText={setConfirmPw}
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
          <Text style={styles.saveText}>{saving ? "Saving..." : "Save changes"}</Text>
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
    position: 'relative',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF0080',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0B0B0C',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  changePhotoText: {
    color: '#FF0080',
    fontSize: 12,
    fontWeight: '600',
  },
  avatarInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarInput: {
    flex: 1,
  },
  imagePickerButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#111113',
    borderWidth: 1,
    borderColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: { width: "100%", height: "100%" },
  headerMeta: { flex: 1 },
  headerTitle: { color: "#FFF", fontSize: 20, fontWeight: "800" },
  headerSub: { color: "#9CA3AF", fontSize: 13, fontWeight: "600" },
  form: { gap: 10 as unknown as number },
  sectionTitle: { color: "#E5E7EB", fontSize: 14, fontWeight: "800", marginTop: 16 },
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