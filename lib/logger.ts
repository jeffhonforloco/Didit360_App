type Level = 'debug' | 'info' | 'warn' | 'error';

async function post(path: string, body: unknown) {
  try {
    const base = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
    if (!base) return;
    await fetch(`${base}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.warn('[logger] failed to post', e);
  }
}

export function logEvent(level: Level, message: string, context?: Record<string, unknown>) {
  try {
    const payload = { level, message, context: context ?? {} };
    console.log(`[log:${level}] ${message}`, context ?? {});
    // Fire-and-forget; backend may ignore if not configured
    void post('/api/v1/obs/events', payload);
  } catch (e) {
    console.warn('[logger] failed', e);
  }
}

export function logPerf(name: string, ms: number, extra?: Record<string, unknown>) {
  logEvent('info', `perf:${name}`, { ms, ...(extra ?? {}) });
}
