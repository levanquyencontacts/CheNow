"use client";

import type { ElementType } from "react";
import { type ModalType, useModal } from "@/providers";
import { AccountModal } from "./AccountModal";

const modalComponents: Partial<Record<ModalType, ElementType>> = {
  ACCOUNT: AccountModal,
};

export function GlobalModalManager() {
  const { modalProps, modalType } = useModal();

  if (!modalType) {
    return null;
  }

  const SpecificModal = modalComponents[modalType];

  if (!SpecificModal) {
    return null;
  }

  return <SpecificModal {...modalProps} />;
}
