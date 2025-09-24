type Level = 'debug' | 'info' | 'warn' | 'error';

export function genId(prefix: string = 'id'): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}_${rand}`;
}

async function post(path: string, body: unknown) {
  try {
    const base = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
    if (!base) return;
    const obs = (globalThis as any).__OBS as { sessionId?: string; traceId?: string } | undefined;
    await fetch(`${base}${path}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-session-id': obs?.sessionId ?? '',
        'x-trace-id': obs?.traceId ?? '',
      },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.warn('[logger] failed to post', e);
  }
}

export function logEvent(level: Level, message: string, context?: Record<string, unknown>) {
  try {
    const route = (globalThis as any).__CURRENT_ROUTE ?? 'unknown';
    const obs = (globalThis as any).__OBS as { sessionId?: string; traceId?: string } | undefined;
    const payload = { level, message, route, sessionId: obs?.sessionId, traceId: obs?.traceId, context: context ?? {} };
    console.log(`[log:${level}] ${message}`, payload);
    void post('/api/v1/obs/events', payload);
  } catch (e) {
    console.warn('[logger] failed', e);
  }
}

export function logPerf(name: string, ms: number, extra?: Record<string, unknown>) {
  logEvent('info', `perf:${name}`, { ms, ...(extra ?? {}) });
}

export function logUserAction(action: string, context?: Record<string, unknown>) {
  logEvent('info', 'ux:user_action', { action, ...(context ?? {}) });
}
