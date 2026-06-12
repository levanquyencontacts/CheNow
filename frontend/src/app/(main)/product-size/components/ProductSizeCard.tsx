import { Box, Button } from "@/components";
import { CategorySize } from "@/services/types/apiType";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { ProductSizeCategoriesModal } from "./ProductSizeCategoriesModal";
import { ProductSizeCategoryRow } from "./ProductSizeCategoryRow";

interface ProductSizeCardProps {
  onDelete: (sizeId: number, sizeName?: string) => void;
  onEdit: (sizeId: number) => void;
  size: CategorySize;
}

export function ProductSizeCard({
  onDelete,
  onEdit,
  size,
}: ProductSizeCardProps) {
  const categories = size.category ?? [];
  const visibleCategories = categories.slice(0, 5);
  const hiddenCategoryCount = Math.max(
    categories.length - visibleCategories.length,
    0,
  );
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);

  return (
    <>
      <article className="overflow-hidden rounded-lg border border-[#ded8ce] bg-white shadow-[0_6px_14px_rgba(47,35,22,0.04)]">
      <Box className="flex items-start justify-between gap-2 border-b border-[#ded8ce] px-3 py-2.5">
        <Box className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-[#183d2b]">
            {size.name}
          </h2>
          <p className="mt-0.5 text-[11px] font-medium text-[#6c6258]">
            Ma: {size.code}
          </p>
        </Box>

        <span className="shrink-0 rounded-full bg-[#dff4c9] px-2 py-0.5 text-[10px] font-semibold text-[#358b3d]">
          Dang dung
        </span>
      </Box>

      <Box className="grid grid-cols-[1fr_auto] border-b border-[#ded8ce] bg-[#f5f2ea] px-3 py-1.5 text-[10px] font-semibold uppercase text-[#6b5d4e]">
        <span>Danh muc</span>
        <span>Gia them</span>
      </Box>

      <Box className="min-h-20 divide-y divide-[#ded8ce]">
        {categories.length ? (
          visibleCategories.map((category, index) => (
            <ProductSizeCategoryRow
              category={category}
              index={index}
              key={`${size.id}-${category.id}`}
            />
          ))
        ) : (
          <Box className="px-3 py-3 text-xs text-[#8b8175]">
            Chua gan danh muc.
          </Box>
        )}
        {hiddenCategoryCount > 0 ? (
          <Box className="px-3 py-2">
            <button
              className="text-xs font-semibold text-[#183d2b] underline-offset-2 hover:underline"
              onClick={() => setIsCategoriesModalOpen(true)}
              type="button"
            >
              Xem them {hiddenCategoryCount} danh muc
            </button>
          </Box>
        ) : null}
      </Box>

      <Box className="flex items-center justify-end gap-2 px-3 py-2.5">
        <Button
          className="h-7 rounded-md border border-[#cfc8bd] px-2.5 text-xs font-semibold text-[#183d2b] hover:bg-[#f6efe8]"
          onClick={() => onEdit(size.id)}
          variant="text"
        >
          <Pencil aria-hidden="true" className="h-3 w-3" />
          Sua
        </Button>
        <Button
          aria-label={`Delete ${size.name}`}
          className="h-7 rounded-md border border-[#cfc8bd] px-2 text-[#183d2b] hover:bg-[#f6efe8]"
          onClick={() => onDelete(size.id, size.name)}
          variant="text"
        >
          <Trash2 aria-hidden="true" className="h-3 w-3" />
        </Button>
      </Box>
      </article>

      {isCategoriesModalOpen ? (
        <ProductSizeCategoriesModal
          categories={categories}
          onClose={() => setIsCategoriesModalOpen(false)}
          sizeName={size.name}
        />
      ) : null}
    </>
  );
}
