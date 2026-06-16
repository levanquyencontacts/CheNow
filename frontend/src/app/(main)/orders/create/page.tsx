"use client";

import { routes } from "@/common/utils/constant";
import { Box } from "@/components";
import { useCategoriesQuery } from "@/services/controllers/categories/CategoriesQueries";
import { useCategorySizesQuery } from "@/services/controllers/category-sizes/CategorySizesQueries";
import { useCreateOrderMutation } from "@/services/controllers/orders/OrdersQueries";
import { useProductsQuery } from "@/services/controllers/products/ProductsQueries";
import { useToppingsQuery } from "@/services/controllers/toppings/ToppingsQueries";
import type { RootState } from "@/services/store";
import type {
  CartItem,
  PaymentMethod,
  Product,
} from "@/services/types/apiType";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { CreateOrderHeader } from "./components/CreateOrderHeader";
import { CustomerInfoSection } from "./components/CustomerInfoSection";
import { DeliveryAddressSection } from "./components/DeliveryAddressSection";
import { OrderSummary } from "./components/OrderSummary";
import { ProductPickerSection } from "./components/ProductPickerSection";
import {
  getAvailableSizes,
  getAvailableToppings,
} from "./components/createOrderUtils";

export default function CreateOrderPage() {
  const router = useRouter();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const createOrderMutation = useCreateOrderMutation();
  const productsQuery = useProductsQuery({ limit: 200, order: "ASC" });
  const categoriesQuery = useCategoriesQuery({ limit: 200, order: "ASC" });
  const categorySizesQuery = useCategorySizesQuery({
    limit: 200,
    order: "ASC",
  });
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
        !selectedCategoryId ||
        product.categoryId === Number(selectedCategoryId);

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
        note: [deliveryNote.trim(), orderNote.trim()]
          .filter(Boolean)
          .join(" | "),
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
      <CreateOrderHeader
        canCreate={canCreate}
        isCreating={createOrderMutation.isPending}
        onCreateOrder={handleCreateOrder}
        router={router}
      />

      <Box className="grid gap-4 p-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <Box className="grid gap-4">
          <Box className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            <CustomerInfoSection
              receiverEmail={receiverEmail}
              receiverName={receiverName}
              receiverPhone={receiverPhone}
              setReceiverEmail={setReceiverEmail}
              setReceiverName={setReceiverName}
              setReceiverPhone={setReceiverPhone}
            />

            <DeliveryAddressSection
              city={city}
              deliveryAddress={deliveryAddress}
              deliveryNote={deliveryNote}
              district={district}
              setCity={setCity}
              setDeliveryAddress={setDeliveryAddress}
              setDeliveryNote={setDeliveryNote}
              setDistrict={setDistrict}
              setWard={setWard}
              ward={ward}
            />
          </Box>

          <ProductPickerSection
            availableSizes={availableSizes}
            availableToppings={availableToppings}
            canAddItem={canAddItem}
            categories={categories}
            categoriesLoading={categoriesQuery.isLoading}
            filteredProducts={filteredProducts}
            handleAddItem={handleAddItem}
            handleSelectProduct={handleSelectProduct}
            itemQuantity={quantity}
            productPrice={productPrice}
            productsLoading={productsQuery.isLoading}
            searchValue={searchValue}
            selectedCategoryId={selectedCategoryId}
            selectedProduct={selectedProduct}
            selectedProductId={selectedProductId}
            selectedSize={selectedSize}
            selectedToppings={selectedToppings}
            setItemQuantity={setQuantity}
            setSearchValue={setSearchValue}
            setSelectedCategoryId={setSelectedCategoryId}
            setSelectedProductId={setSelectedProductId}
            setSelectedSizeId={setSelectedSizeId}
            setSelectedToppings={setSelectedToppings}
          />
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
