import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

declare global {
  interface Window {
    bioAppMounted?: () => void;
    bioShowError?: (msg: string, details?: string) => void;
  }
}

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(<App />);

    // Trigger loader completion if present
    if (typeof window.bioAppMounted === 'function') {
      window.bioAppMounted();
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Fatal initialization error in BIO-CI Lab:', err);
    if (typeof window.bioShowError === 'function') {
      window.bioShowError('React root render failure', errorMessage);
    }
  }
} else {
  console.error('Fatal: #root element not found.');
  if (typeof window.bioShowError === 'function') {
    window.bioShowError('Fatal: #root container missing from DOM');
  }
}
