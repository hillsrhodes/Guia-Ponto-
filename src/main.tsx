/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Foolproof safe fetch interceptor on window to prevent extension requests.js TypeError
try {
  const nativeFetch = window.fetch;
  let currentFetch = nativeFetch;
  try {
    Object.defineProperty(window, 'fetch', {
      get: () => currentFetch,
      set: (newValue) => {
        try {
          if (typeof newValue === 'function') {
            currentFetch = newValue;
          }
        } catch (err) {
          // Swallow assignment errors from extensions
        }
      },
      configurable: true,
      enumerable: true,
    });
  } catch (defineErr) {
    // Fallback if property is non-configurable on Window prototype
  }
} catch (e) {}

// Global error suppression for browser extensions co-opting window.onerror
window.onerror = (msg, url, line, col, error) => {
  const urlStr = String(url || '');
  const msgStr = String(msg || '');
  const stackStr = error && error.stack ? String(error.stack) : '';
  if (urlStr.includes('chrome-extension://') || msgStr.includes('chrome-extension://') || stackStr.includes('chrome-extension://') || msgStr.includes('Cannot set property fetch')) {
    return true; // Suppress extension errors from failing the app
  }
  return false;
};

window.addEventListener('error', (event) => {
  const filename = String(event.filename || '');
  const message = String(event.message || '');
  if (filename.includes('chrome-extension://') || message.includes('chrome-extension://') || message.includes('Cannot set property fetch')) {
    event.preventDefault();
    event.stopPropagation();
  }
}, true);

window.addEventListener('unhandledrejection', (event) => {
  const reasonStr = String(event.reason || '');
  const stackStr = event.reason && typeof event.reason.stack === 'string' ? event.reason.stack : '';
  if (reasonStr.includes('chrome-extension://') || stackStr.includes('chrome-extension://') || reasonStr.includes('Cannot set property fetch')) {
    event.preventDefault();
    event.stopPropagation();
  }
}, true);

createRoot(document.getElementById('root')!).render(<App />);
