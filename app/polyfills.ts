import { Platform } from 'react-native';

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
