/**
 * Robust cross-platform storage adapter for Zustand persist middleware.
 * Ensures graceful fallback in SSR, test environments (Node / Vitest), and private browsing modes.
 */
export const safeStorage = {
  getItem: (name: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
        return window.localStorage.getItem(name);
      }
    } catch {
      // fallback
    }
    return null;
  },
  setItem: (name: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
        window.localStorage.setItem(name, value);
      }
    } catch {
      // fallback
    }
  },
  removeItem: (name: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.removeItem === 'function') {
        window.localStorage.removeItem(name);
      }
    } catch {
      // fallback
    }
  },
};
