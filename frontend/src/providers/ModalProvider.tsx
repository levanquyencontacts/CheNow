"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useState,
} from "react";

export type ModalType =
  | "ACCOUNT"
  | "CATEGORY"
  | "DELETE_PRODUCT"
  | "PRODUCT_SIZE"
  | "TOPPING";

interface ModalState {
  modalProps: Record<string, unknown>;
  modalType: ModalType | null;
}

interface ModalContextType extends ModalState {
  closeModal: () => void;
  openModal: (
    modalType: ModalType,
    modalProps?: Record<string, unknown>,
  ) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModalState>({
    modalProps: {},
    modalType: null,
  });

  const openModal = (
    modalType: ModalType,
    modalProps: Record<string, unknown> = {},
  ) => {
    setState({ modalProps, modalType });
  };

  const closeModal = () => {
    setState({ modalProps: {}, modalType: null });
  };

  return (
    <ModalContext.Provider value={{ ...state, closeModal, openModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return context;
}
