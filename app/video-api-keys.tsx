import React, { useEffect, useMemo, useState } from 'react';
import { Stack } from 'expo-router';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { palette, spacing } from '@/constants/tokens';
import { useSecrets } from '@/contexts/SecretsContext';

interface KeysForm {
  muxTokenId: string;
  muxTokenSecret: string;
  cfAccountId: string;
  cfToken: string;
}

export default function VideoApiKeysScreen() {
  const { getSecret, setSecret, hasSecureStorage } = useSecrets();
  const [form, setForm] = useState<KeysForm>({ muxTokenId: '', muxTokenSecret: '', cfAccountId: '', cfToken: '' });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [muxId, muxSecret, cfAcc, cfTok] = await Promise.all([
          getSecret('mux.token_id'),
          getSecret('mux.token_secret'),
          getSecret('cf.account_id'),
          getSecret('cf.api_token'),
        ]);
        if (isMounted) {
          setForm({
            muxTokenId: muxId ?? '',
            muxTokenSecret: muxSecret ?? '',
            cfAccountId: cfAcc ?? '',
            cfToken: cfTok ?? '',
          });
        }
      } catch (e) {
        console.error('[VideoApiKeys] load failed', e);
      }
    })();
    return () => { isMounted = false; };
  }, [getSecret]);

  const canSave = useMemo(() => {
    return (
      (form.muxTokenId.length > 0 && form.muxTokenSecret.length > 0) ||
      (form.cfAccountId.length > 0 && form.cfToken.length > 0)
    );
  }, [form]);

  const onSave = async () => {
    if (!canSave) return;
    setLoading(true);
    try {
      if (form.muxTokenId && form.muxTokenSecret) {
        await setSecret('mux.token_id', form.muxTokenId, 'video');
        await setSecret('mux.token_secret', form.muxTokenSecret, 'video');
      }
      if (form.cfAccountId && form.cfToken) {
        await setSecret('cf.account_id', form.cfAccountId, 'video');
        await setSecret('cf.api_token', form.cfToken, 'video');
      }
      Alert.alert('Saved', hasSecureStorage ? 'Stored securely on device' : 'Stored locally (web)');
    } catch (e) {
      Alert.alert('Failed', (e as Error)?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Video API Keys' }} />
      <View style={styles.card}>
        <Text style={styles.caption}>Mux</Text>
        <TextField
          testID="mux-token-id"
          placeholder="MUX Token ID"
          autoCapitalize="none"
          value={form.muxTokenId}
          onChangeText={(t) => setForm(prev => ({ ...prev, muxTokenId: t }))}
        />
        <TextField
          testID="mux-token-secret"
          placeholder="MUX Token Secret"
          autoCapitalize="none"
          secureTextEntry
          value={form.muxTokenSecret}
          onChangeText={(t) => setForm(prev => ({ ...prev, muxTokenSecret: t }))}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.caption}>Cloudflare Stream</Text>
        <TextField
          testID="cf-account-id"
          placeholder="Cloudflare Account ID"
          autoCapitalize="none"
          value={form.cfAccountId}
          onChangeText={(t) => setForm(prev => ({ ...prev, cfAccountId: t }))}
        />
        <TextField
          testID="cf-token"
          placeholder="Cloudflare API Token"
          autoCapitalize="none"
          secureTextEntry
          value={form.cfToken}
          onChangeText={(t) => setForm(prev => ({ ...prev, cfToken: t }))}
        />
      </View>

      <Button title={loading ? 'Saving...' : 'Save Keys'} onPress={onSave} disabled={!canSave || loading} fullWidth />

      <Text style={styles.note}>
        {Platform.OS === 'web' ? 'On web, keys are stored in local storage for demo only. Do not use in production.' : 'Keys are stored in the system secure enclave (Keychain/Keystore) when available.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xxl, gap: spacing.xxl },
  card: { gap: spacing.md, backgroundColor: palette.dark.card, padding: spacing.lg, borderRadius: 14, borderColor: palette.dark.border, borderWidth: 1 },
  caption: { color: palette.dark.text, opacity: 0.7, fontWeight: '600' as const },
  note: { color: palette.dark.textMuted, fontSize: 12 }
});
