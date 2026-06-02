import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'oficio_settings';
const DEFAULTS = {
  theme: 'dark',       // 'dark' | 'light'
  fontSize: 'md',      // 'sm' | 'md' | 'lg'
  highContrast: false,
  reduceMotion: false,
};

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function applyToHtml(s) {
  const el = document.documentElement;
  el.setAttribute('data-theme', s.theme);
  el.setAttribute('data-font-size', s.fontSize);
  if (s.highContrast) el.setAttribute('data-high-contrast', '1');
  else el.removeAttribute('data-high-contrast');
  if (s.reduceMotion) el.setAttribute('data-reduce-motion', '1');
  else el.removeAttribute('data-reduce-motion');
}

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(readStored);

  useEffect(() => {
    applyToHtml(settings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const update = (patch) => setSettings((prev) => ({ ...prev, ...patch }));
  const reset = () => setSettings(DEFAULTS);

  return (
    <SettingsContext.Provider value={{ settings, update, reset }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings precisa estar dentro de <SettingsProvider>');
  return ctx;
}
