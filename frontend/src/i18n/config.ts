"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import vi from "./locales/vi.json";

export type Locale = "vi" | "en";

export const DEFAULT_LOCALE: Locale = "vi";
export const LANGUAGE_STORAGE_KEY = "language";

export const LANGUAGE_OPTIONS: Array<{ label: string; value: Locale }> = [
  { label: "VI", value: "vi" },
  { label: "EN", value: "en" },
];

export function normalizeLocale(value: string | null | undefined): Locale {
  return value === "en" || value === "vi" ? value : DEFAULT_LOCALE;
}

function getInitialLocale() {
  return DEFAULT_LOCALE;
}

function getDocumentLang(locale: Locale) {
  return locale;
}

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    fallbackLng: DEFAULT_LOCALE,
    interpolation: {
      escapeValue: false,
    },
    lng: getInitialLocale(),
    resources: {
      en: {
        translation: en,
      },
      vi: {
        translation: vi,
      },
    },
  });

  i18next.on("languageChanged", (language) => {
    if (typeof window === "undefined") {
      return;
    }

    const locale = normalizeLocale(language);

    localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
    document.documentElement.lang = getDocumentLang(locale);
  });
}

export default i18next;
