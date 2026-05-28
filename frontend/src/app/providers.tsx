"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import i18n, { LANGUAGE_STORAGE_KEY, normalizeLocale } from "@/i18n/config";
import store from "@/services/store";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());

  React.useEffect(() => {
    const locale = normalizeLocale(localStorage.getItem(LANGUAGE_STORAGE_KEY));

    if (i18n.language !== locale) {
      void i18n.changeLanguage(locale);
    }
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ToastContainer position="top-right" />
      </QueryClientProvider>
    </Provider>
  );
}
