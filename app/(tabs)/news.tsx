import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Platform, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ExternalLink, Newspaper, Download, X } from "lucide-react-native";
import * as WebBrowser from "expo-web-browser";
import { useFocusEffect } from "@react-navigation/native";

const NEWS_APP_URL = "https://didit360.news";
const NEWS_STORE_IOS = "https://apps.apple.com/app/id0000000000";
const NEWS_STORE_ANDROID = "https://play.google.com/store/apps/details?id=com.didit360.news";

export default function NewsScreen() {
  const [promptVisible, setPromptVisible] = useState<boolean>(true);
  const [autoOpened, setAutoOpened] = useState<boolean>(false);

  const openNews = useCallback(async () => {
    try {
      const result = await WebBrowser.openBrowserAsync(NEWS_APP_URL);
      console.log("[News] WebBrowser result", result);
    } catch (e) {
      console.error("[News] open error", e);
    }
  }, []);

  const openStore = useCallback(async () => {
    try {
      const url = Platform.select({ ios: NEWS_STORE_IOS, android: NEWS_STORE_ANDROID, default: NEWS_APP_URL }) ?? NEWS_APP_URL;
      const can = await Linking.canOpenURL(url);
      if (can) await Linking.openURL(url);
      else await WebBrowser.openBrowserAsync(url);
    } catch (e) {
      console.error("[News] store open error", e);
      await WebBrowser.openBrowserAsync(NEWS_APP_URL);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (!autoOpened) {
        setAutoOpened(true);
        openNews();
        setPromptVisible(true);
      }
      return () => {};
    }, [autoOpened, openNews])
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.hero}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop" }}
          style={styles.heroImage}
        />
        <View style={styles.overlay} />
        <View style={styles.heroContent}>
          <Newspaper size={40} color="#FFFFFF" />
          <Text style={styles.title}>Didit360 News</Text>
          <Text style={styles.subtitle}>The latest drops, features, and industry stories</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Open Didit360 News</Text>
        <Text style={styles.cardText}>You are leaving the app. Continue to Didit360 News web app or download the dedicated News app for the best experience.</Text>

        <TouchableOpacity testID="open-news" style={styles.primaryBtn} onPress={openNews} activeOpacity={0.9}>
          <ExternalLink size={18} color="#0B0B0C" />
          <Text style={styles.primaryBtnText}>Continue to News</Text>
        </TouchableOpacity>

        <TouchableOpacity testID="download-news" style={styles.secondaryBtn} onPress={openStore} activeOpacity={0.9}>
          <Download size={18} color="#FFFFFF" />
          <Text style={styles.secondaryBtnText}>Download News App</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={styles.muted}>Tip: Enable notifications in the News app to never miss major updates.</Text>
      </View>

      {promptVisible && (
        <View style={styles.modalBackdrop} testID="news-download-prompt">
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Get Didit360 News</Text>
              <TouchableOpacity accessibilityRole="button" onPress={() => setPromptVisible(false)} style={styles.closeBtn}>
                <X size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>For the best experience, download the dedicated News app.</Text>
            <TouchableOpacity style={styles.modalPrimary} onPress={openStore} activeOpacity={0.9}>
              <Download size={18} color="#0B0B0C" />
              <Text style={styles.modalPrimaryText}>Download the App</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalSecondary} onPress={() => setPromptVisible(false)}>
              <Text style={styles.modalSecondaryText}>Not now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  hero: {
    height: 220,
    margin: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  heroContent: {
    position: "absolute",
    left: 16,
    bottom: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 8,
  },
  subtitle: {
    color: "#D1D5DB",
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: "#111113",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  cardText: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 14,
  },
  primaryBtn: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "#6EE7B7",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  primaryBtnText: {
    color: "#0B0B0C",
    fontWeight: "800",
    marginLeft: 8,
    fontSize: 15,
  },
  secondaryBtn: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
  },
  secondaryBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 15,
  },
  info: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  muted: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  modalBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#111113",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
  },
  modalText: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 12,
  },
  modalPrimary: {
    height: 46,
    borderRadius: 10,
    backgroundColor: "#6EE7B7",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  modalPrimaryText: {
    color: "#0B0B0C",
    fontWeight: "800",
    marginLeft: 8,
    fontSize: 15,
  },
  modalSecondary: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  modalSecondaryText: {
    color: "#9CA3AF",
    fontWeight: "700",
  },
});