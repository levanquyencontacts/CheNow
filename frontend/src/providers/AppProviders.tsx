"use client";

import * as React from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { GlobalModalManager } from "@/modals/GlobalModalManager";
import store from "@/services/store";
import { I18nProvider } from "./I18nProvider";
import { ModalProvider } from "./ModalProvider";
import { QueryProvider } from "./QueryProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryProvider>
        <I18nProvider>
          <ModalProvider>
            {children}
            <GlobalModalManager />
          </ModalProvider>
        </I18nProvider>
        <ToastContainer position="top-right" />
      </QueryProvider>
    </Provider>
  );
}
