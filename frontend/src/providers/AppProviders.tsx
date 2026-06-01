"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { GlobalModalManager } from "@/modals/GlobalModalManager";
import store from "@/services/store";
import { I18nProvider } from "./I18nProvider";
import { ModalProvider } from "./ModalProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <ModalProvider>
            {children}
            <GlobalModalManager />
          </ModalProvider>
        </I18nProvider>
        <ToastContainer position="top-right" />
      </QueryClientProvider>
    </Provider>
  );
}
