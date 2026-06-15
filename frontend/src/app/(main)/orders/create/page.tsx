"use client";

import cheMitImage from "@/common/assets/images/chemit.png";
import { routes } from "@/common/utils/constant";
import { Box, Button, Image, Pagination } from "@/components";
import { useCategoriesQuery } from "@/services/controllers/categories/CategoriesQueries";
import { useCategorySizesQuery } from "@/services/controllers/category-sizes/CategorySizesQueries";
import { useCreateOrderMutation } from "@/services/controllers/orders/OrdersQueries";
import { useProductsQuery } from "@/services/controllers/products/ProductsQueries";
import { useToppingsQuery } from "@/services/controllers/toppings/ToppingsQueries";
import type { RootState } from "@/services/store";
import type {
  CategorySize,
  CreateOrderItemPayload,
  PaymentMethod,
  Product,
  Topping,
} from "@/services/types/apiType";
import {
  ArrowLeft,
  Check,
  Plus,
  Save,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

type CartItem = CreateOrderItemPayload & {
  key: string;
};

const formatCurrency = (value: string | number | null | undefined) =>
  `${new Intl.NumberFormat("vi-VN").format(Number(value ?? 0))}d`;

export default function CreateOrderPage() {
  const router = useRouter();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const createOrderMutation = useCreateOrderMutation();
  const productsQuery = useProductsQuery({ limit: 200, order: "ASC" });
  const categoriesQuery = useCategoriesQuery({ limit: 200, order: "ASC" });
  const categorySizesQuery = useCategorySizesQuery({ limit: 200, order: "ASC" });
  const toppingsQuery = useToppingsQuery({ limit: 200, order: "ASC" });

  const [searchValue, setSearchValue] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number>();
  const [selectedSizeId, setSelectedSizeId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<
    Record<number, number>
  >({});
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [city, setCity] = useState("Ha Noi");
  const [district, setDistrict] = useState("Cau Giay");
  const [ward, setWard] = useState("Dich Vong");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [shippingFee, setShippingFee] = useState(15000);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const products = useMemo(
    () => productsQuery.data?.data ?? [],
    [productsQuery.data?.data],
  );
  const categorySizes = categorySizesQuery.data?.data ?? [];
  const categories = categoriesQuery.data?.data ?? [];
  const toppings = toppingsQuery.data?.data ?? [];
  const selectedProduct = products.find(
    (product) => product.id === selectedProductId,
  );
  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch = product.productName
        .toLowerCase()
        .includes(normalizedSearch);
      const matchesCategory =
        !selectedCategoryId || product.categoryId === Number(selectedCategoryId);

      return matchesSearch && matchesCategory;
    });
  }, [products, searchValue, selectedCategoryId]);
  const availableSizes = getAvailableSizes(selectedProduct, categorySizes);
  const selectedSize =
    availableSizes.find((size) => String(size.id) === selectedSizeId) ??
    availableSizes[0];
  const selectedSizeCategory = selectedProduct
    ? selectedSize?.category.find(
        (category) => category.id === selectedProduct.categoryId,
      )
    : undefined;
  const availableToppings = getAvailableToppings(selectedProduct, toppings);
  const selectedToppingItems = availableToppings
    .map((topping) => ({
      topping,
      quantity: selectedToppings[topping.id] ?? 0,
    }))
    .filter((item) => item.quantity > 0);
  const productPrice = Number(selectedProduct?.price ?? 0);
  const sizeExtraPrice = Number(selectedSizeCategory?.extraPrice ?? 0);
  const itemSubtotal =
    (productPrice + sizeExtraPrice) * quantity +
    selectedToppingItems.reduce(
      (total, item) => total + Number(item.topping.price) * item.quantity,
      0,
    );
  const subtotalAmount = cartItems.reduce(
    (total, item) => total + item.subtotal,
    0,
  );
  const totalAmount = Math.max(
    subtotalAmount + shippingFee - discountAmount,
    0,
  );
  const canAddItem =
    Boolean(selectedProduct) &&
    Boolean(selectedSize) &&
    Boolean(selectedSizeCategory) &&
    quantity > 0;
  const canCreate =
    Boolean(authUser?.id) &&
    receiverName.trim().length > 0 &&
    receiverPhone.trim().length > 0 &&
    cartItems.length > 0;

  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setSelectedSizeId("");
    setQuantity(1);
    setSelectedToppings({});
  };

  const handleAddItem = () => {
    if (!selectedProduct || !selectedSize || !selectedSizeCategory) {
      return;
    }

    const orderItemToppings = selectedToppingItems.map((item) => ({
      toppingId: item.topping.id,
      toppingName: item.topping.name,
      price: Number(item.topping.price ?? 0),
      quantity: item.quantity,
    }));

    setCartItems((current) => [
      ...current,
      {
        key: `${selectedProduct.id}-${Date.now()}`,
        productId: selectedProduct.id,
        categorySizeId: selectedSizeCategory.categorySizeId,
        productName: selectedProduct.productName,
        sizeName: selectedSize.name,
        sizeCode: selectedSize.code,
        sizeExtraPrice,
        price: productPrice,
        quantity,
        subtotal: itemSubtotal,
        orderItemToppings,
      },
    ]);
    setSelectedToppings({});
    setQuantity(1);
  };

  const handleCreateOrder = () => {
    if (!authUser?.id || !canCreate) {
      return;
    }

    createOrderMutation.mutate(
      {
        userId: authUser.id,
        subtotalAmount,
        discountAmount,
        shippingFee,
        totalAmount,
        orderType: "delivery",
        paymentMethod,
        paymentStatus: "pending",
        status: "pending",
        receiverName: receiverName.trim(),
        receiverPhone: receiverPhone.trim(),
        deliveryAddress: [deliveryAddress.trim(), ward, district, city]
          .filter(Boolean)
          .join(", "),
        note: [deliveryNote.trim(), orderNote.trim()].filter(Boolean).join(" | "),
        orderItems: cartItems.map((item) => ({
          productId: item.productId,
          categorySizeId: item.categorySizeId,
          productName: item.productName,
          sizeName: item.sizeName,
          sizeCode: item.sizeCode,
          sizeExtraPrice: item.sizeExtraPrice,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal,
          orderItemToppings: item.orderItemToppings,
        })),
      },
      {
        onSuccess: () => {
          router.push(routes.ORDERS);
        },
      },
    );
  };

  return (
    <Box className="min-h-screen bg-[#fff8f1] text-[#143d2a]">
      <Box className="sticky top-0 z-20 flex items-center justify-between border-b border-[#eadfd4] bg-[#fffaf5] px-5 py-4">
        <Box className="flex items-center gap-4">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md text-[#183d2b] hover:bg-[#f3e8de]"
            onClick={() => router.push(routes.ORDERS)}
            type="button"
          >
            <ArrowLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <Box>
            <h1 className="text-2xl font-semibold text-[#183d2b]">
              Tao don hang
            </h1>
            <p className="mt-0.5 text-sm text-[#6f665c]">
              Tao don hang moi cho khach
            </p>
          </Box>
        </Box>

        <Box className="flex gap-2">
          <Button
            className="h-10 rounded-md border-[#d8cbbf] bg-white px-4 text-xs font-semibold text-[#183d2b] shadow-none hover:bg-[#fff8f1]"
            variant="outlined"
          >
            <Save aria-hidden="true" className="h-4 w-4" />
            Luu nhap
          </Button>
          <Button
            className="h-10 rounded-md bg-[#183d2b] px-5 text-xs font-semibold text-white hover:bg-[#102f21]"
            disabled={!canCreate || createOrderMutation.isPending}
            onClick={handleCreateOrder}
          >
            <Check aria-hidden="true" className="h-4 w-4" />
            Tao don hang
          </Button>
        </Box>
      </Box>

      <Box className="grid gap-4 p-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <Box className="grid gap-4">
          <Box className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            <Section title="1. Thong tin khach hang">
              <Box className="mb-4 flex gap-5 text-sm font-semibold text-[#314032]">
                <label className="flex items-center gap-2">
                  <input
                    className="h-4 w-4 accent-[#183d2b]"
                    defaultChecked
                    name="customerMode"
                    type="radio"
                  />
                  Khach hang cu
                </label>
                <label className="flex items-center gap-2">
                  <input
                    className="h-4 w-4 accent-[#183d2b]"
                    name="customerMode"
                    type="radio"
                  />
                  Khach hang moi
                </label>
              </Box>
              <Box className="grid gap-3">
                <Field label="Ten khach hang">
                  <input
                    className={inputClass}
                    onChange={(event) => setReceiverName(event.target.value)}
                    value={receiverName}
                  />
                </Field>
                <Box className="grid gap-3 sm:grid-cols-2">
                  <Field label="So dien thoai">
                    <input
                      className={inputClass}
                      onChange={(event) => setReceiverPhone(event.target.value)}
                      value={receiverPhone}
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      className={inputClass}
                      onChange={(event) => setReceiverEmail(event.target.value)}
                      value={receiverEmail}
                    />
                  </Field>
                </Box>
                <Box className="flex items-center gap-3 rounded-md border border-[#eadfd4] bg-[#fffaf5] p-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eadfd4] text-[#6b5a49]">
                    <UserRound aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <Box className="text-sm">
                    <p className="font-bold text-[#183d2b]">
                      {receiverName || "Chua chon khach"}
                    </p>
                    <p className="text-[#314032]">{receiverPhone || "-"}</p>
                    <p className="text-[#6f665c]">{receiverEmail || "-"}</p>
                  </Box>
                </Box>
              </Box>
            </Section>

            <Section title="2. Dia chi giao hang">
              <Box className="grid gap-3 md:grid-cols-3">
                <Field label="Tinh / Thanh pho">
                  <select
                    className={inputClass}
                    onChange={(event) => setCity(event.target.value)}
                    value={city}
                  >
                    <option value="Ha Noi">Ha Noi</option>
                    <option value="TP. Ho Chi Minh">TP. Ho Chi Minh</option>
                  </select>
                </Field>
                <Field label="Quan / Huyen">
                  <select
                    className={inputClass}
                    onChange={(event) => setDistrict(event.target.value)}
                    value={district}
                  >
                    <option value="Cau Giay">Cau Giay</option>
                    <option value="Quan 1">Quan 1</option>
                    <option value="Quan 3">Quan 3</option>
                  </select>
                </Field>
                <Field label="Phuong / Xa">
                  <select
                    className={inputClass}
                    onChange={(event) => setWard(event.target.value)}
                    value={ward}
                  >
                    <option value="Dich Vong">Dich Vong</option>
                    <option value="Ben Thanh">Ben Thanh</option>
                    <option value="Vo Thi Sau">Vo Thi Sau</option>
                  </select>
                </Field>
              </Box>
              <Box className="mt-4 grid gap-3">
                <Field label="Dia chi chi tiet">
                  <input
                    className={inputClass}
                    onChange={(event) => setDeliveryAddress(event.target.value)}
                    value={deliveryAddress}
                  />
                </Field>
                <Field label="Ghi chu giao hang">
                  <input
                    className={inputClass}
                    onChange={(event) => setDeliveryNote(event.target.value)}
                    value={deliveryNote}
                  />
                </Field>
              </Box>
            </Section>
          </Box>

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
                disabled={categoriesQuery.isLoading}
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
                {productsQuery.isLoading ? (
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
                  <Pagination count={12} page={1} onChange={() => undefined} />
                </Box>
              </Box>

              <Box className="rounded-lg border border-[#eadfd4] bg-[#fffaf5] p-4">
                <Box className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-[#183d2b]">
                    Cau hinh mon
                  </h3>
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
                            (category) =>
                              category.id === selectedProduct.categoryId,
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
                                  productPrice +
                                    Number(sizeCategory?.extraPrice ?? 0),
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </Box>
                    </Box>

                    <Box>
                      <p className="mb-2 text-xs font-semibold text-[#5c554c]">
                        Chon topping
                      </p>
                      <Box className="max-h-52 overflow-y-auto rounded-md border border-[#eadfd4] bg-white">
                        {availableToppings.length === 0 ? (
                          <p className="p-3 text-xs text-[#6f665c]">
                            Khong co topping cho danh muc nay.
                          </p>
                        ) : (
                          availableToppings.map((topping) => {
                            const toppingQuantity =
                              selectedToppings[topping.id] ?? 0;

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
                                  <span className="truncate">
                                    {topping.name}
                                  </span>
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

                    <Box className="flex items-center justify-between gap-3 border-t border-[#eadfd4] pt-4">
                      <QuantityControl onChange={setQuantity} value={quantity} />
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
        </Box>

        <OrderSummary
          cartItems={cartItems}
          discountAmount={discountAmount}
          orderNote={orderNote}
          paymentMethod={paymentMethod}
          setCartItems={setCartItems}
          setDiscountAmount={setDiscountAmount}
          setOrderNote={setOrderNote}
          setPaymentMethod={setPaymentMethod}
          setShippingFee={setShippingFee}
          shippingFee={shippingFee}
          subtotalAmount={subtotalAmount}
          totalAmount={totalAmount}
        />
      </Box>
    </Box>
  );
}

const inputClass =
  "h-10 rounded-md border border-[#d8c8bd] bg-white px-3 text-sm text-[#183d2b] outline-none focus:border-[#183d2b]";

function getAvailableSizes(
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

function getAvailableToppings(
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

function Section({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-[#eadfd4] bg-white/90 p-4 shadow-[0_8px_18px_rgba(55,36,20,0.04)]">
      <h2 className="mb-4 text-base font-bold text-[#183d2b]">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-1.5 text-xs font-semibold text-[#5c554c]">
      {label}
      {children}
    </label>
  );
}

function ProductThumb({ product }: { product: Product }) {
  if (product.imageUrl) {
    return (
      <Image
        alt={product.productName}
        className="h-full w-full rounded-md object-cover"
        previewType="thumbnails"
        src={product.imageUrl}
      />
    );
  }

  return (
    <NextImage
      alt={product.productName}
      className="h-full w-full rounded-md object-cover"
      src={cheMitImage}
    />
  );
}

function QuantityControl({
  disabled = false,
  onChange,
  value,
}: {
  disabled?: boolean;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <Box className="inline-flex h-9 items-center overflow-hidden rounded-md border border-[#eadfd4] bg-white">
      <button
        className="flex h-full w-9 items-center justify-center text-[#6f665c] disabled:opacity-40"
        disabled={disabled || value <= 1}
        onClick={() => onChange(Math.max(value - 1, 1))}
        type="button"
      >
        -
      </button>
      <span className="flex h-full w-10 items-center justify-center border-x border-[#eadfd4] text-sm font-semibold text-[#183d2b]">
        {value}
      </span>
      <button
        className="flex h-full w-9 items-center justify-center text-[#6f665c] disabled:opacity-40"
        disabled={disabled}
        onClick={() => onChange(value + 1)}
        type="button"
      >
        +
      </button>
    </Box>
  );
}

function OrderSummary({
  cartItems,
  discountAmount,
  orderNote,
  paymentMethod,
  setCartItems,
  setDiscountAmount,
  setOrderNote,
  setPaymentMethod,
  setShippingFee,
  shippingFee,
  subtotalAmount,
  totalAmount,
}: {
  cartItems: CartItem[];
  discountAmount: number;
  orderNote: string;
  paymentMethod: PaymentMethod;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setDiscountAmount: (value: number) => void;
  setOrderNote: (value: string) => void;
  setPaymentMethod: (value: PaymentMethod) => void;
  setShippingFee: (value: number) => void;
  shippingFee: number;
  subtotalAmount: number;
  totalAmount: number;
}) {
  return (
    <aside className="rounded-lg border border-[#eadfd4] bg-white/90 shadow-[0_8px_18px_rgba(55,36,20,0.04)] xl:sticky xl:top-24 xl:self-start">
      <Box className="flex items-center justify-between border-b border-[#eadfd4] p-4">
        <h2 className="font-bold text-[#183d2b]">
          4. San pham trong don ({cartItems.length})
        </h2>
        <button
          className="text-xs font-semibold text-[#b12f1d]"
          onClick={() => setCartItems([])}
          type="button"
        >
          Xoa tat ca
        </button>
      </Box>

      <Box className="max-h-[420px] space-y-3 overflow-y-auto p-4">
        {cartItems.length === 0 ? (
          <Box className="rounded-md border border-dashed border-[#d8cbbf] p-6 text-center text-sm text-[#6f665c]">
            Chua co san pham nao trong don.
          </Box>
        ) : (
          cartItems.map((item) => (
            <Box
              className="rounded-md border border-[#eadfd4] bg-[#fffaf5] p-3"
              key={item.key}
            >
              <Box className="grid grid-cols-[1fr_auto] gap-3">
                <Box>
                  <p className="text-sm font-bold text-[#183d2b]">
                    {item.productName}
                  </p>
                  <p className="mt-1 text-xs text-[#6f665c]">
                    Size: {item.sizeName}
                  </p>
                  {item.orderItemToppings?.length ? (
                    <ul className="mt-2 space-y-1 text-xs text-[#314032]">
                      {item.orderItemToppings.map((topping) => (
                        <li key={topping.toppingId}>
                          {topping.toppingName} x {topping.quantity}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </Box>
                <button
                  className="text-[#b12f1d]"
                  onClick={() =>
                    setCartItems((current) =>
                      current.filter((cartItem) => cartItem.key !== item.key),
                    )
                  }
                  type="button"
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                </button>
              </Box>
              <Box className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[#315d3b]">
                  {formatCurrency(item.subtotal)}
                </span>
                <span className="text-xs font-semibold text-[#6f665c]">
                  SL: {item.quantity}
                </span>
              </Box>
            </Box>
          ))
        )}
      </Box>

      <Box className="space-y-4 border-t border-[#eadfd4] p-4">
        <SummaryLine label="Tam tinh" value={subtotalAmount} />
        <MoneyField
          label="Phi ship"
          onChange={setShippingFee}
          value={shippingFee}
        />
        <MoneyField
          label="Giam gia"
          onChange={setDiscountAmount}
          value={discountAmount}
        />
        <Box className="flex items-center justify-between border-t border-[#eadfd4] pt-4">
          <span className="text-lg font-bold text-[#183d2b]">Tong tien</span>
          <span className="text-2xl font-bold text-[#315d3b]">
            {formatCurrency(totalAmount)}
          </span>
        </Box>

        <Box>
          <p className="mb-3 text-sm font-bold text-[#183d2b]">
            Phuong thuc thanh toan
          </p>
          <Box className="grid gap-2 text-sm text-[#314032]">
            {[
              ["cash", "Tien mat (COD)"],
              ["vnpay", "Chuyen khoan"],
              ["momo", "Vi dien tu"],
            ].map(([value, label]) => (
              <label className="flex items-center gap-2" key={value}>
                <input
                  checked={paymentMethod === value}
                  className="h-4 w-4 accent-[#183d2b]"
                  onChange={() => setPaymentMethod(value as PaymentMethod)}
                  type="radio"
                />
                {label}
              </label>
            ))}
          </Box>
        </Box>

        <Field label="Trang thai don">
          <select className={inputClass} value="pending" disabled>
            <option value="pending">Pending</option>
          </select>
        </Field>

        <Field label="Ghi chu don hang">
          <textarea
            className="min-h-24 rounded-md border border-[#d8c8bd] bg-white px-3 py-2 text-sm text-[#183d2b] outline-none focus:border-[#183d2b]"
            onChange={(event) => setOrderNote(event.target.value)}
            placeholder="Ghi chu them cho don hang..."
            value={orderNote}
          />
        </Field>
      </Box>
    </aside>
  );
}

function MoneyField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <Box className="grid grid-cols-[1fr_130px_32px] items-center gap-2 text-sm">
      <span className="font-semibold text-[#314032]">{label}</span>
      <input
        className="h-9 rounded-md border border-[#d8c8bd] bg-white px-3 text-right text-sm text-[#183d2b] outline-none focus:border-[#183d2b]"
        min={0}
        onChange={(event) => onChange(Number(event.target.value))}
        type="number"
        value={value}
      />
      <span className="flex h-9 items-center justify-center rounded-md border border-[#eadfd4] bg-[#fffaf5] text-xs font-semibold text-[#183d2b]">
        d
      </span>
    </Box>
  );
}

function SummaryLine({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Box className="flex items-center justify-between text-sm font-semibold">
      <span className="text-[#314032]">{label}</span>
      <span className="text-[#183d2b]">{formatCurrency(value)}</span>
    </Box>
  );
}
