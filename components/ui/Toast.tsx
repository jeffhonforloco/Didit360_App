import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import createContextHook from '@nkzw/create-context-hook';
import { XCircle, Info, AlertTriangle, CheckCircle2 } from 'lucide-react-native';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  timeoutMs?: number;
}

interface ToastState {
  toasts: ToastItem[];
  show: (toast: Omit<ToastItem, 'id'> & { id?: string }) => string;
  hide: (id: string) => void;
  clearAll: () => void;
}

export const [ToastProvider, useToast] = createContextHook<ToastState>(() => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const show = React.useCallback((toast: Omit<ToastItem, 'id'> & { id?: string }) => {
    const id = toast.id ?? `${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
    const item: ToastItem = { id, type: toast.type, title: toast.title, message: toast.message, timeoutMs: toast.timeoutMs ?? 4500 };
    setToasts(prev => [...prev, item]);
    return id;
  }, []);

  React.useEffect(() => {
    (globalThis as any).__TOAST = { show };
  }, [show]);

  const hide = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  const value = React.useMemo<ToastState>(() => ({ toasts, show, hide, clearAll }), [toasts, show, hide, clearAll]);
  return value;
});

const iconByType: Record<ToastType, React.ComponentType<{ size?: number; color?: string }>> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

function ToastCard({ item, onHide }: { item: ToastItem; onHide: (id: string) => void }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: Platform.OS !== 'web', easing: Easing.out(Easing.cubic) }),
      Animated.timing(translate, { toValue: 0, duration: 180, useNativeDriver: Platform.OS !== 'web', easing: Easing.out(Easing.cubic) }),
    ]).start();

    const t = setTimeout(() => {
      onHide(item.id);
    }, item.timeoutMs ?? 4500);
    return () => clearTimeout(t);
  }, [item.id, item.timeoutMs, onHide, opacity, translate]);

  const Icon = useMemo(() => iconByType[item.type], [item.type]);
  const bg = useMemo(() => ({
    info: '#1f2937',
    success: '#065f46',
    warning: '#92400e',
    error: '#7f1d1d',
  }[item.type]), [item.type]);
  const border = useMemo(() => ({
    info: '#60a5fa',
    success: '#34d399',
    warning: '#f59e0b',
    error: '#f87171',
  }[item.type]), [item.type]);

  return (
    <Animated.View style={[styles.toast, { opacity, transform: [{ translateY: translate }], backgroundColor: bg, borderColor: border }]} testID={`toast-${item.id}`}>
      <View style={styles.row}>
        <Icon size={18} color={border} />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          {item.message ? <Text style={styles.message} numberOfLines={2}>{item.message}</Text> : null}
        </View>
        <Pressable onPress={() => onHide(item.id)} hitSlop={8} testID={`toast-close-${item.id}`}>
          <XCircle size={18} color={border} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

export function ToastViewport() {
  const { toasts, hide } = useToast();
  return (
    <View pointerEvents="box-none" style={styles.viewport}>
      {toasts.map(t => (
        <ToastCard key={t.id} item={t} onHide={hide} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    zIndex: 9999,
    gap: 8,
  },
  toast: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontWeight: '600' as const,
  },
  message: {
    color: '#e5e7eb',
    fontSize: 12,
    marginTop: 2,
  },
});
