"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, {
  LANGUAGE_STORAGE_KEY,
  normalizeLocale,
} from "@/i18n/config";

function LanguageUpdater({ children }: { children: ReactNode }) {
  useEffect(() => {
    const locale = normalizeLocale(localStorage.getItem(LANGUAGE_STORAGE_KEY));
    const currentLocale = normalizeLocale(
      i18n.resolvedLanguage ?? i18n.language,
    );

    localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;

    if (currentLocale !== locale) {
      void i18n.changeLanguage(locale);
    }

    const handleLanguageChanged = (language: string) => {
      const nextLocale = normalizeLocale(language);

      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLocale);
      document.documentElement.lang = nextLocale;
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, []);

  return <>{children}</>;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageUpdater>{children}</LanguageUpdater>
    </I18nextProvider>
  );
}
