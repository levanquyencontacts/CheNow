"use client";

import * as React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import { GlobalModalManager } from "@/modals/GlobalModalManager";
import store, { persistor } from "@/services/store";
import { I18nProvider } from "./I18nProvider";
import { ModalProvider } from "./ModalProvider";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryProvider>
          <ThemeProvider>
            <I18nProvider>
              <ModalProvider>
                {children}
                <GlobalModalManager />
              </ModalProvider>
            </I18nProvider>
          </ThemeProvider>
          <ToastContainer position="top-right" />
        </QueryProvider>
      </PersistGate>
    </Provider>
  );
}
