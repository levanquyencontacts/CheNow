"use client";

import type { ElementType } from "react";
import { createElement } from "react";
import { type ModalType, useModal } from "@/providers";
import { AccountModal } from "./AccountModal";
import { CategoryModal } from "./CategoryModal";
import { DeleteProductModal } from "./DeleteProductModal";
import { DeleteProductSizeModal } from "./DeleteProductSizeModal";
import { ProductSizeModal } from "./ProductSizeModal";
import { ToppingModal } from "./ToppingModal";

const modalComponents: Partial<Record<ModalType, ElementType>> = {
  ACCOUNT: AccountModal,
  CATEGORY: CategoryModal,
  DELETE_PRODUCT: DeleteProductModal,
  DELETE_PRODUCT_SIZE: DeleteProductSizeModal,
  PRODUCT_SIZE: ProductSizeModal,
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

  return createElement(SpecificModal, modalProps);
}
