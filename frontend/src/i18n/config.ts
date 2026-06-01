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

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    fallbackLng: DEFAULT_LOCALE,
    interpolation: {
      escapeValue: false,
    },
    lng: DEFAULT_LOCALE,
    resources: {
      en: {
        translation: en,
      },
      vi: {
        translation: vi,
      },
    },
  });
}

export default i18next;
