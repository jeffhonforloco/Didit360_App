import { Platform } from 'react-native';

// Only execute polyfills during runtime, not during build/SSR
// Check if we're in a runtime environment (not build time)
// During build/SSR, window and document are undefined
const isRuntime = typeof window !== 'undefined' && typeof document !== 'undefined';

// Fix Platform.Version issue for web (only during runtime)
if (isRuntime && Platform.OS === 'web' && !Platform.Version) {
  try {
    (Platform as any).Version = '0.0.0';
  } catch {
    // Silently fail during build
  }
}

// Initialize log buffer only if not already defined (avoid SSR issues)
if (typeof globalThis !== 'undefined' && typeof (globalThis as any).__LOG_BUFFER === 'undefined') {
  (globalThis as any).__LOG_BUFFER = [] as { level: 'log' | 'warn' | 'error'; ts: number; args: unknown[] }[];
}

// Only wrap console if we're in a client environment (not SSR or build time)
// Only execute during runtime, not during build/SSR
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Client-side web: wrap console
  const wrapConsole = (level: 'log' | 'warn' | 'error') => {
    const original = console[level].bind(console);
    console[level] = (...args: unknown[]) => {
      try {
        if (typeof globalThis !== 'undefined' && (globalThis as any).__LOG_BUFFER) {
          (globalThis as any).__LOG_BUFFER.push({ level, ts: Date.now(), args });
          if ((globalThis as any).__LOG_BUFFER.length > 1000) {
            (globalThis as any).__LOG_BUFFER.shift();
          }
        }
      } catch {}
      original(...args as []);
    };
  };

  wrapConsole('log');
  wrapConsole('warn');
  wrapConsole('error');
} else if (Platform.OS !== 'web') {
  // Native platforms: always wrap console
  const wrapConsole = (level: 'log' | 'warn' | 'error') => {
    const original = console[level].bind(console);
    console[level] = (...args: unknown[]) => {
      try {
        if (typeof globalThis !== 'undefined' && (globalThis as any).__LOG_BUFFER) {
          (globalThis as any).__LOG_BUFFER.push({ level, ts: Date.now(), args });
          if ((globalThis as any).__LOG_BUFFER.length > 1000) {
            (globalThis as any).__LOG_BUFFER.shift();
          }
        }
      } catch {}
      original(...args as []);
    };
  };

  wrapConsole('log');
  wrapConsole('warn');
  wrapConsole('error');
}

// Only install ReactDOM shim on web and after DOM is available (not during SSR)
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  // Defer this to avoid blocking hydration
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(() => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const ReactDOM: any = require('react-dom');

        const installShim = (target: any) => {
          if (!target) return false;
          if (typeof target.findDOMNode === 'function') return false;
          target.findDOMNode = (instance: any) => {
            try {
              if (!instance) return null;
              const node = (instance as any).nodeType ? instance : (instance as any).current ?? null;
              return node ?? null;
            } catch (e) {
              console.log('[polyfill] findDOMNode error', e);
              return null;
            }
          };
          return true;
        };

        let installed = false;
        installed = installShim(ReactDOM) || installed;
        installed = installShim(ReactDOM?.default) || installed;

        if (installed) {
          console.log('[polyfill] Installed ReactDOM.findDOMNode shim');
        }
      } catch (e) {
        console.log('[polyfill] react-dom not available', e);
      }
    });
  } else {
    // Fallback if requestIdleCallback is not available
    setTimeout(() => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const ReactDOM: any = require('react-dom');

        const installShim = (target: any) => {
          if (!target) return false;
          if (typeof target.findDOMNode === 'function') return false;
          target.findDOMNode = (instance: any) => {
            try {
              if (!instance) return null;
              const node = (instance as any).nodeType ? instance : (instance as any).current ?? null;
              return node ?? null;
            } catch (e) {
              console.log('[polyfill] findDOMNode error', e);
              return null;
            }
          };
          return true;
        };

        let installed = false;
        installed = installShim(ReactDOM) || installed;
        installed = installShim(ReactDOM?.default) || installed;

        if (installed) {
          console.log('[polyfill] Installed ReactDOM.findDOMNode shim');
        }
      } catch (e) {
        console.log('[polyfill] react-dom not available', e);
      }
    }, 0);
  }
}
