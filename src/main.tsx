import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept and suppress benign sandbox-related WebSocket or connection failures to prevent noisy Unhandled Rejections and Vite error overlays
if (typeof window !== 'undefined') {
  const isBenignError = (message: string) => {
    return (
      message.includes('WebSocket') ||
      message.includes('websocket') ||
      message.includes('WS') ||
      message.includes('vite') ||
      message.includes('closed without opened')
    );
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || String(event.reason || '');
    if (isBenignError(reason)) {
      console.warn('⚡ Suppressed benign developer WebSocket/HMR network error:', reason);
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    if (isBenignError(msg)) {
      console.warn('⚡ Suppressed benign developer WebSocket/HMR network alert:', msg);
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
