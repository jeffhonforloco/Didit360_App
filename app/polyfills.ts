import { Platform } from 'react-native';

if (typeof (globalThis as any).__LOG_BUFFER === 'undefined') {
  (globalThis as any).__LOG_BUFFER = [] as { level: 'log' | 'warn' | 'error'; ts: number; args: unknown[] }[];
}

const wrapConsole = (level: 'log' | 'warn' | 'error') => {
  const original = console[level].bind(console);
  console[level] = (...args: unknown[]) => {
    try {
      (globalThis as any).__LOG_BUFFER.push({ level, ts: Date.now(), args });
      if ((globalThis as any).__LOG_BUFFER.length > 1000) {
        (globalThis as any).__LOG_BUFFER.shift();
      }
    } catch {}
    original(...args as []);
  };
};

wrapConsole('log');
wrapConsole('warn');
wrapConsole('error');

if (Platform.OS === 'web') {
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
}
