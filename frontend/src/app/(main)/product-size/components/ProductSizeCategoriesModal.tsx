"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Box, Button } from "@/components";
import { CategorySizeCategory } from "@/services/types/apiType";
import { X } from "lucide-react";
import { ProductSizeCategoryRow } from "./ProductSizeCategoryRow";

interface ProductSizeCategoriesModalProps {
  categories: CategorySizeCategory[];
  onClose: () => void;
  sizeName: string;
}

export function ProductSizeCategoriesModal({
  categories,
  onClose,
  sizeName,
}: ProductSizeCategoriesModalProps) {
  const [portalNode, setPortalNode] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = document.createElement("div");
    node.setAttribute("id", "product-size-categories-modal");
    document.body.appendChild(node);
    queueMicrotask(() => setPortalNode(node));

    return () => {
      document.body.removeChild(node);
    };
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!portalNode) {
    return null;
  }

  return createPortal(
    <Box
      className="fixed inset-0 z-1900 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <Box
        className="w-full max-w-md overflow-hidden rounded-lg border border-[#ded8ce] bg-[#fff8f1] shadow-[0_18px_40px_rgba(24,33,24,0.22)]"
        onClick={(event) => event.stopPropagation()}
      >
        <Box className="flex items-start justify-between gap-3 border-b border-[#ded8ce] px-4 py-3">
          <Box className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-[#183d2b]">
              Danh muc ap dung
            </h2>
            <p className="mt-0.5 truncate text-xs text-[#6c6258]">
              {sizeName}
            </p>
          </Box>
          <Button
            aria-label="Close categories"
            className="h-8 rounded-md px-2 text-[#183d2b] hover:bg-[#f3e8de]"
            onClick={onClose}
            type="button"
            variant="text"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </Button>
        </Box>

        <Box className="grid grid-cols-[1fr_auto] border-b border-[#ded8ce] bg-[#f5f2ea] px-4 py-2 text-[10px] font-semibold uppercase text-[#6b5d4e]">
          <span>Danh muc</span>
          <span>Gia them</span>
        </Box>

        <Box className="max-h-80 overflow-y-auto divide-y divide-[#ded8ce] bg-white/72">
          {categories.map((category, index) => (
            <ProductSizeCategoryRow
              category={category}
              index={index}
              key={`${category.id}-${index}`}
            />
          ))}
        </Box>
      </Box>
    </Box>,
    portalNode,
  );
}
