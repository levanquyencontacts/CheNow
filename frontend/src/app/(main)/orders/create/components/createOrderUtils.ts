import type {
  CategorySize,
  Product,
  Topping,
} from "@/services/types/apiType";

export const inputClass =
  "h-10 rounded-md border border-[#d8c8bd] bg-white px-3 text-sm text-[#183d2b] outline-none focus:border-[#183d2b]";

export const formatCurrency = (value: string | number | null | undefined) =>
  `${new Intl.NumberFormat("vi-VN").format(Number(value ?? 0))}d`;

export function getAvailableSizes(
  selectedProduct: Product | undefined,
  categorySizes: CategorySize[],
) {
  return selectedProduct
    ? categorySizes.filter((size) =>
        size.category.some(
          (category) => category.id === selectedProduct.categoryId,
        ),
      )
    : [];
}

export function getAvailableToppings(
  selectedProduct: Product | undefined,
  toppings: Topping[],
) {
  return selectedProduct
    ? toppings.filter((topping) =>
        topping.categories.some(
          (category) => category.id === selectedProduct.categoryId,
        ),
      )
    : [];
}
