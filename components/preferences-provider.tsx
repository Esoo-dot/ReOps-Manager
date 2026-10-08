'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { Language } from '@/lib/workspace/config';

const THEME_KEY = 'fieldwise-theme';
const LANGUAGE_KEY = 'fieldwise-language';

type Preferences = {
  dark: boolean;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (language: Language) => void;
};

const PreferencesContext = createContext<Preferences | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(() => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'ar';
    try { return localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'ar'; } catch { return 'ar'; }
  });

  const toggleTheme = useCallback(() => {
    setDark(current => {
      const next = !current;
      document.documentElement.classList.toggle('dark', next);
      document.documentElement.style.colorScheme = next ? 'dark' : 'light';
      try { localStorage.setItem(THEME_KEY, next ? 'dark' : 'light'); } catch { /* optional preference */ }
      return next;
    });
  }, []);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    try { localStorage.setItem(LANGUAGE_KEY, next); } catch { /* optional preference */ }
  }, []);

  return <PreferencesContext.Provider value={{ dark, toggleTheme, language, setLanguage }}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used inside PreferencesProvider');
  return context;
}

export const themeInitScript = `(function(){try{var s=localStorage.getItem('${THEME_KEY}');var d=s?s==='dark':false;var e=document.documentElement;e.classList.toggle('dark',d);e.style.colorScheme=d?'dark':'light';}catch(_){}})();`;
