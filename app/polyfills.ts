import { Platform } from 'react-native';

// Polyfill for ReactDOM.findDOMNode removed in React 19 to keep older libs working on web
if (Platform.OS === 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ReactDOM: any = require('react-dom');
    if (ReactDOM && typeof ReactDOM.findDOMNode !== 'function') {
      ReactDOM.findDOMNode = (instance: any) => {
        try {
          if (!instance) return null;
          const node = (instance as any).nodeType ? instance : (instance as any).current ?? null;
          return node ?? null;
        } catch (e) {
          console.log('[polyfill] findDOMNode error', e);
          return null;
        }
      };
      console.log('[polyfill] Installed ReactDOM.findDOMNode shim');
    }
  } catch (e) {
    console.log('[polyfill] react-dom not available', e);
  }
}
