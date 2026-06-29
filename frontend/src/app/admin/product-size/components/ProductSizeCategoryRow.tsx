import { Box } from "@/components";
import { CategorySizeCategory } from "@/services/types/apiType";

const categoryStyles = [
  "border-[#f5d5a8] bg-[#fff4df] text-[#9a5a14]",
  "border-[#bfe8d6] bg-[#e9f8f0] text-[#17724a]",
  "border-[#d8cef8] bg-[#f1edff] text-[#6043b2]",
  "border-[#f1c9d6] bg-[#fff0f5] text-[#9f3158]",
];

const formatExtraPrice = (value: string | number) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount === 0) {
    return "+0d";
  }

  return `+${new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)}d`;
};

function categoryBadgeClass(index: number) {
  return categoryStyles[index % categoryStyles.length];
}

interface ProductSizeCategoryRowProps {
  category: CategorySizeCategory;
  index: number;
}

export function ProductSizeCategoryRow({
  category,
  index,
}: ProductSizeCategoryRowProps) {
  return (
    <Box className="grid grid-cols-[1fr_auto] items-center gap-2 px-3 py-1.5">
      <span
        className={`w-fit rounded-full border px-2 py-0.5 text-[11px] font-semibold ${categoryBadgeClass(index)}`}
      >
        {category.categoryName}
      </span>
      <span className="text-[11px] font-semibold text-[#173728]">
        {formatExtraPrice(category.extraPrice)}
      </span>
    </Box>
  );
}
