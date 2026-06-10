"use client";

import type { ElementType } from "react";
import { type ModalType, useModal } from "@/providers";
import { AccountModal } from "./AccountModal";
import { CategoryModal } from "./CategoryModal";
import { DeleteProductModal } from "./DeleteProductModal";
import { ToppingModal } from "./ToppingModal";

const modalComponents: Partial<Record<ModalType, ElementType>> = {
  ACCOUNT: AccountModal,
  CATEGORY: CategoryModal,
  DELETE_PRODUCT: DeleteProductModal,
  TOPPING: ToppingModal,
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
