import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { logEvent } from '@/lib/logger';
import { useToast } from '@/components/ui/Toast';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
  stack?: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '', stack: undefined };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const message = error instanceof Error ? error.message : String(error);
    return { hasError: true, message, stack: undefined };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = (error as any)?.stack ?? info?.componentStack ?? undefined;
    const route = (globalThis as any).__CURRENT_ROUTE ?? 'unknown';
    
    // Enhanced error logging for mobile debugging
    console.error('[ErrorBoundary] Render error captured', {
      message,
      stack,
      route,
      info,
      platform: Platform.OS,
      isHookError: message.includes('Hooks') || message.includes('hook'),
      isQueueError: message.includes('queue'),
    });
    
    // Check for specific React Hooks errors
    if (message.includes('Hooks') || message.includes('hook') || message.includes('queue')) {
      console.error('[ErrorBoundary] REACT HOOKS ORDER VIOLATION DETECTED!');
      console.error('[ErrorBoundary] This is likely caused by conditional hook calls or changing hook order between renders');
    }
    
    logEvent('error', 'Render error captured', { message, stack, route });
    try {
      const toast = (globalThis as any).__TOAST as { show?: (t: { type: 'error' | 'info' | 'success' | 'warning'; title: string; message?: string }) => void } | undefined;
      toast?.show?.({ type: 'error', title: 'Something went wrong', message });
    } catch {}
    this.setState({ stack });
  }

  handleRetry = () => {
    console.log('[ErrorBoundary] Retry pressed');
    this.setState({ hasError: false, message: '', stack: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container} testID="error-boundary">
          <Text style={styles.title}>Something went wrong</Text>
          <Text selectable style={styles.message} testID="error-message">{this.state.message}</Text>
          {this.state.stack ? (
            <Text selectable style={styles.stack} testID="error-stack">{this.state.stack}</Text>
          ) : null}
          <Text style={styles.meta} testID="error-route">Route: {(globalThis as any).__CURRENT_ROUTE ?? 'unknown'}</Text>
          <Pressable onPress={this.handleRetry} style={styles.button} testID="error-retry">
            <Text style={styles.buttonText}>Try again</Text>
          </Pressable>
          {Platform.OS === 'web' ? (
            <Text style={styles.hint}>Open DevTools console for full stack trace.</Text>
          ) : null}
        </View>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#0b0b10',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  message: {
    color: '#ff8a80',
    fontSize: 14,
    textAlign: 'center' as const,
    marginBottom: 8,
  },
  stack: {
    color: '#9aa0a6',
    fontSize: 12,
  },
  meta: {
    color: '#9aa0a6',
    marginTop: 8,
    fontSize: 12,
  },
  button: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#4f46e5',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600' as const,
  },
  hint: {
    marginTop: 8,
    color: '#9aa0a6',
    fontSize: 12,
  },
});
