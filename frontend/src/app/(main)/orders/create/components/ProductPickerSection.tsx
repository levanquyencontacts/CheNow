import { Box, Button, Pagination } from "@/components";
import type {
  Category,
  CategorySize,
  Product,
  Topping,
} from "@/services/types/apiType";
import { Plus, Search, X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { QuantityControl, Section } from "./FormPrimitives";
import { ProductThumb } from "./ProductThumb";
import { formatCurrency, inputClass } from "./createOrderUtils";

export function ProductPickerSection({
  availableSizes,
  availableToppings,
  canAddItem,
  categories,
  categoriesLoading,
  filteredProducts,
  handleAddItem,
  handleSelectProduct,
  itemQuantity,
  productPrice,
  productsLoading,
  searchValue,
  selectedCategoryId,
  selectedProduct,
  selectedProductId,
  selectedSize,
  selectedToppings,
  setItemQuantity,
  setSearchValue,
  setSelectedCategoryId,
  setSelectedProductId,
  setSelectedSizeId,
  setSelectedToppings,
}: {
  availableSizes: CategorySize[];
  availableToppings: Topping[];
  canAddItem: boolean;
  categories: Category[];
  categoriesLoading: boolean;
  filteredProducts: Product[];
  handleAddItem: () => void;
  handleSelectProduct: (product: Product) => void;
  itemQuantity: number;
  productPrice: number;
  productsLoading: boolean;
  searchValue: string;
  selectedCategoryId: string;
  selectedProduct: Product | undefined;
  selectedProductId: number | undefined;
  selectedSize: CategorySize | undefined;
  selectedToppings: Record<number, number>;
  setItemQuantity: (value: number) => void;
  setSearchValue: (value: string) => void;
  setSelectedCategoryId: (value: string) => void;
  setSelectedProductId: (value: number | undefined) => void;
  setSelectedSizeId: (value: string) => void;
  setSelectedToppings: Dispatch<SetStateAction<Record<number, number>>>;
}) {
  return (
    <Section title="3. Them san pham vao don hang">
      <Box className="mb-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_auto]">
        <label className="flex h-10 items-center gap-2 rounded-md border border-[#eadfd4] bg-white px-3 text-xs text-[#8a7867]">
          <Search aria-hidden="true" className="h-4 w-4" />
          <input
            className="h-full min-w-0 flex-1 bg-transparent text-[#183d2b] outline-none placeholder:text-[#9d8b78]"
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Tim kiem san pham..."
            value={searchValue}
          />
        </label>
        <select
          className={inputClass}
          disabled={categoriesLoading}
          onChange={(event) => {
            setSelectedCategoryId(event.target.value);
            setSelectedProductId(undefined);
            setSelectedSizeId("");
            setSelectedToppings({});
          }}
          value={selectedCategoryId}
        >
          <option value="">Tat ca danh muc</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.categoryName}
            </option>
          ))}
        </select>
        <Button
          className="h-10 rounded-md border-[#d8cbbf] bg-white px-4 text-xs font-semibold text-[#183d2b] shadow-none hover:bg-[#fff8f1]"
          variant="outlined"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Them san pham khac
        </Button>
      </Box>

      <Box className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_350px]">
        <Box>
          {productsLoading ? (
            <Box className="rounded-md border border-[#eadfd4] bg-white/70 p-6 text-sm text-[#6f665c]">
              Dang tai san pham...
            </Box>
          ) : (
            <Box className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <button
                  className={[
                    "rounded-md border bg-white p-2 text-left transition hover:border-[#c2ad9d] hover:bg-[#fffaf5]",
                    selectedProductId === product.id
                      ? "border-[#183d2b] ring-2 ring-[#183d2b]/15"
                      : "border-[#eadfd4]",
                  ].join(" ")}
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  type="button"
                >
                  <Box className="mx-auto h-24 w-24 overflow-hidden rounded-md bg-[#f6eee6]">
                    <ProductThumb product={product} />
                  </Box>
                  <p className="mt-2 line-clamp-2 text-center text-xs font-semibold text-[#5c554c]">
                    {product.productName}
                  </p>
                  <p className="mt-1 text-center text-sm font-bold text-[#0f5f32]">
                    {formatCurrency(product.price)}
                  </p>
                </button>
              ))}
            </Box>
          )}
          <Box className="mt-6 flex justify-center">
            <Pagination count={12} onChange={() => undefined} page={1} />
          </Box>
        </Box>

        <Box className="rounded-lg border border-[#eadfd4] bg-[#fffaf5] p-4">
          <Box className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-[#183d2b]">Cau hinh mon</h3>
            {selectedProduct ? (
              <button
                className="text-[#6b5a49] hover:text-[#b12f1d]"
                onClick={() => setSelectedProductId(undefined)}
                type="button"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            ) : null}
          </Box>

          {selectedProduct ? (
            <Box className="grid gap-4">
              <Box className="flex gap-3">
                <Box className="h-16 w-16 overflow-hidden rounded-md border border-[#eadfd4] bg-[#f6eee6]">
                  <ProductThumb product={selectedProduct} />
                </Box>
                <Box>
                  <p className="text-sm font-bold text-[#183d2b]">
                    {selectedProduct.productName}
                  </p>
                  <p className="mt-1 text-xs text-[#6f665c]">
                    {formatCurrency(selectedProduct.price)}
                  </p>
                </Box>
              </Box>

              <Box>
                <p className="mb-2 text-xs font-semibold text-[#5c554c]">
                  Chon size
                </p>
                <Box className="grid grid-cols-3 gap-2">
                  {availableSizes.map((size) => {
                    const sizeCategory = size.category.find(
                      (category) => category.id === selectedProduct.categoryId,
                    );
                    const active =
                      String(size.id) ===
                      String(selectedSize?.id ?? availableSizes[0]?.id);

                    return (
                      <button
                        className={[
                          "rounded-md border px-3 py-2 text-xs font-semibold",
                          active
                            ? "border-[#183d2b] bg-[#eef7ef] text-[#183d2b]"
                            : "border-[#eadfd4] bg-white text-[#314032]",
                        ].join(" ")}
                        key={size.id}
                        onClick={() => setSelectedSizeId(String(size.id))}
                        type="button"
                      >
                        {size.name}
                        <span className="mt-1 block text-[11px]">
                          {formatCurrency(
                            productPrice + Number(sizeCategory?.extraPrice ?? 0),
                          )}
                        </span>
                      </button>
                    );
                  })}
                </Box>
              </Box>

              <ToppingsPicker
                availableToppings={availableToppings}
                selectedToppings={selectedToppings}
                setSelectedToppings={setSelectedToppings}
              />

              <Box className="flex items-center justify-between gap-3 border-t border-[#eadfd4] pt-4">
                <QuantityControl
                  onChange={setItemQuantity}
                  value={itemQuantity}
                />
                <Button
                  className="h-10 rounded-md bg-[#183d2b] px-5 text-xs font-semibold text-white hover:bg-[#102f21]"
                  disabled={!canAddItem}
                  onClick={handleAddItem}
                >
                  Them vao don
                </Button>
              </Box>
            </Box>
          ) : (
            <Box className="rounded-md border border-dashed border-[#d8cbbf] bg-white/70 p-6 text-center text-sm text-[#6f665c]">
              Chon san pham ben trai de cau hinh size va topping.
            </Box>
          )}
        </Box>
      </Box>
    </Section>
  );
}

function ToppingsPicker({
  availableToppings,
  selectedToppings,
  setSelectedToppings,
}: {
  availableToppings: Topping[];
  selectedToppings: Record<number, number>;
  setSelectedToppings: Dispatch<SetStateAction<Record<number, number>>>;
}) {
  return (
    <Box>
      <p className="mb-2 text-xs font-semibold text-[#5c554c]">Chon topping</p>
      <Box className="max-h-52 overflow-y-auto rounded-md border border-[#eadfd4] bg-white">
        {availableToppings.length === 0 ? (
          <p className="p-3 text-xs text-[#6f665c]">
            Khong co topping cho danh muc nay.
          </p>
        ) : (
          availableToppings.map((topping) => {
            const toppingQuantity = selectedToppings[topping.id] ?? 0;

            return (
              <Box
                className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-[#eadfd4] px-3 py-2 last:border-b-0"
                key={topping.id}
              >
                <label className="flex min-w-0 items-center gap-2 text-xs font-semibold text-[#183d2b]">
                  <input
                    checked={toppingQuantity > 0}
                    className="h-4 w-4 accent-[#183d2b]"
                    onChange={(event) =>
                      setSelectedToppings((current) => {
                        const next = { ...current };
                        if (event.target.checked) {
                          next[topping.id] = 1;
                        } else {
                          delete next[topping.id];
                        }
                        return next;
                      })
                    }
                    type="checkbox"
                  />
                  <span className="truncate">{topping.name}</span>
                  <span className="text-[#6f665c]">
                    {formatCurrency(topping.price)}
                  </span>
                </label>
                <QuantityControl
                  disabled={toppingQuantity === 0}
                  onChange={(nextQuantity) =>
                    setSelectedToppings((current) => ({
                      ...current,
                      [topping.id]: nextQuantity,
                    }))
                  }
                  value={toppingQuantity || 1}
                />
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
}
