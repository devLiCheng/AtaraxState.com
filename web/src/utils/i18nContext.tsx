'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'zh' | 'en';

interface I18nContextType {
  language: Language;
  t: (key: string) => string;
  changeLanguage: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{
  initialLang: Language;
  translations: any;
  children: React.ReactNode;
}> = ({ initialLang, translations, children }) => {
  const [language, setLanguage] = useState<Language>(initialLang);
  const [currentTranslations, setCurrentTranslations] = useState(translations);

  // Helper to fetch translations dynamically if changed
  const changeLanguage = async (newLang: Language) => {
    setLanguage(newLang);
    // Write cookie so server knows preference on next load
    document.cookie = `lang=${newLang}; path=/; max-age=31536000`;
    
    // Dynamically fetch client-side translations (or reload page to let SSR do it)
    window.location.reload();
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value = currentTranslations;
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        return key; // Fallback to key itself
      }
    }
    return typeof value === 'string' ? value : key;
  };

  return (
    <I18nContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
