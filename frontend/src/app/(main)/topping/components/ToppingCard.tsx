import { formatDate } from "@/common/utils/formatDate";
import { Box, Button, Image } from "@/components";
import { Topping } from "@/services/types/apiType";
import { Edit2, Trash2 } from "lucide-react";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "VND",
  }).format(value);

interface ToppingCardProps {
  onEdit?: (toppingId: number) => void;
  topping: Topping;
}

export function ToppingCard({ onEdit, topping }: ToppingCardProps) {
  return (
    <article className="flex min-h-72 flex-col rounded-md border border-[#eadfd4] bg-[#fffaf5] p-4 shadow-[0_10px_22px_rgba(55,36,20,0.04)]">
      <Box className="mb-3 flex aspect-[4/3] items-center justify-center rounded-sm bg-[linear-gradient(135deg,#183d2b,#d4ad8a)] text-4xl font-semibold text-white shadow-inner">
        {topping.imageUrl ? (
          <Image
            alt={topping.name}
            className="h-full w-full"
            previewType="thumbnails"
            src={topping.imageUrl}
          />
        ) : (
          topping.name.charAt(0).toUpperCase()
        )}
      </Box>

      <Box className="flex flex-1 flex-col gap-2">
        <Box className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-[#3b2014]">
            {topping.name}
          </h3>
          <span className="shrink-0 text-xs font-semibold text-[#8b4b25]">
            {formatCurrency(Number(topping.price))}
          </span>
        </Box>

        <p className="line-clamp-2 min-h-10 text-xs leading-5 text-[#5f4636]">
          {topping.description || "Không có mô tả."}
        </p>

        <Box className="flex flex-wrap gap-1.5">
          {topping.categories.length > 0 ? (
            topping.categories.map((category) => (
              <span
                className="rounded-full bg-[#f0e1d4] px-2 py-1 text-[11px] font-semibold text-[#6d4a35]"
                key={category.id}
              >
                {category.categoryName}
              </span>
            ))
          ) : (
            <span className="text-[11px] font-medium text-[#9d8b78]">
              Chưa gắn category
            </span>
          )}
        </Box>

        <span className="mt-auto text-[11px] font-medium text-[#9d8b78]">
          Cập nhật {formatDate(topping.updated_at)}
        </span>
      </Box>

      <Box className="mt-4 flex items-center justify-between">
        <Button
          aria-label={`Edit ${topping.name}`}
          className="h-8 rounded-sm px-2 text-[#183d2b] hover:bg-[#f3e8de]"
          onClick={() => onEdit?.(topping.id)}
          variant="text"
        >
          <Edit2 aria-hidden="true" className="h-3.5 w-3.5" />
        </Button>
        <Button
          aria-label={`Delete ${topping.name}`}
          className="h-8 rounded-sm px-2 text-[#c62222] hover:bg-[#ffe1dc]"
          variant="text"
        >
          <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
        </Button>
      </Box>
    </article>
  );
}
