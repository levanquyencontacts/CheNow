"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { routes } from "@/common/utils/constant";
import {
  loadCartCheckoutIds,
  loadDirectCheckoutItem,
  saveCartCheckoutIds,
  saveCheckoutMode,
  type DirectCheckoutSnapshot,
} from "@/common/utils/checkoutSession";
import { useAddressesQuery } from "@/services/controllers/addresses/AddressesQueries";
import {
  useCheckoutCartMutation,
  useCustomerCartQuery,
} from "@/services/controllers/cart/CartQueries";
import { useCreateDirectOrderMutation } from "@/services/controllers/orders/OrdersQueries";
import type { CustomerCartItem, PaymentMethod } from "@/services/types/apiType";
import { DeliveryAddressSection } from "../order/components/DeliveryAddressSection";
import { DeliveryNoteSection } from "../order/components/DeliveryNoteSection";
import { OrderPageHeader } from "../order/components/OrderPageHeader";
import { OrderSummaryCard } from "../order/components/OrderSummaryCard";
import { PaymentMethodSection } from "../order/components/PaymentMethodSection";
import { SelectedProductsSection } from "../order/components/SelectedProductsSection";
import { getDeliveryFee, isValidCartItemId } from "../order/orderUtils";

function toCartDisplayItems(items: CustomerCartItem[]) {
  return items.map((item) => ({
    image: item.product.image,
    key: item.key,
    name: item.product.name,
    note: item.note,
    quantity: item.quantity,
    size: item.size,
    toppings: item.toppings.map((topping) => topping.name),
    total: item.linePrice * item.quantity,
  }));
}

function toDirectDisplayItems(item: DirectCheckoutSnapshot) {
  return [
    {
      image: item.image,
      key: `direct-${item.productId}`,
      name: item.productName,
      note: item.note,
      quantity: item.quantity,
      size: item.sizeLabel,
      toppings: item.toppings.map((topping) => topping.name),
      total: item.unitPrice * item.quantity,
    },
  ];
}

function CustomerCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDirectMode = searchParams.get("mode") === "direct";
  const staleIdsToastShown = useRef(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [orderNote, setOrderNote] = useState("");
  const [directItem, setDirectItem] = useState<DirectCheckoutSnapshot | null>(
    null,
  );
  const [selectedCartIds, setSelectedCartIds] = useState<number[]>([]);
  const addressesQuery = useAddressesQuery();
  const cartQuery = useCustomerCartQuery({ enabled: !isDirectMode });
  const checkoutCartMutation = useCheckoutCartMutation();
  const createDirectOrderMutation = useCreateDirectOrderMutation();
  const cart = useMemo(
    () => cartQuery.data?.items ?? [],
    [cartQuery.data?.items],
  );
  const addresses = useMemo(
    () => addressesQuery.data ?? [],
    [addressesQuery.data],
  );

  useEffect(() => {
    if (isDirectMode) {
      const item = loadDirectCheckoutItem();
      if (!item) {
        router.replace(routes.CUSTOMER_MENU);
        return;
      }

      saveCheckoutMode("direct");
      setDirectItem(item);
      return;
    }

    const storedIds = loadCartCheckoutIds();
    if (storedIds.length === 0) {
      router.replace(routes.CUSTOMER_CART);
      return;
    }
    if (cartQuery.isLoading) return;
    if (cartQuery.isError) return;

    const availableIds = new Set(
      cart.map((item) => item.id).filter(isValidCartItemId),
    );
    const validIds = storedIds.filter((id) => availableIds.has(id));

    if (validIds.length < storedIds.length && !staleIdsToastShown.current) {
      staleIdsToastShown.current = true;
      toast.info("Một số món đã chọn không còn trong giỏ.");
      saveCartCheckoutIds(validIds);
    }

    if (validIds.length === 0) {
      router.replace(routes.CUSTOMER_CART);
      return;
    }

    saveCheckoutMode("cart");
    setSelectedCartIds(validIds);
  }, [
    cart,
    cartQuery.isError,
    cartQuery.isLoading,
    isDirectMode,
    router,
  ]);

  const selectedAddress =
    addresses.find((address) => address.id === selectedAddressId) ??
    addresses.find((address) => address.isDefault) ??
    null;
  const selectedCartItems = cart.filter(
    (item) =>
      isValidCartItemId(item.id) && selectedCartIds.includes(item.id),
  );
  const displayItems = isDirectMode
    ? directItem
      ? toDirectDisplayItems(directItem)
      : []
    : toCartDisplayItems(selectedCartItems);
  const subtotal = isDirectMode
    ? directItem
      ? directItem.unitPrice * directItem.quantity
      : 0
    : selectedCartItems.reduce(
        (sum, item) => sum + item.linePrice * item.quantity,
        0,
      );
  const deliveryFee = getDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;
  const isPending = isDirectMode
    ? createDirectOrderMutation.isPending
    : checkoutCartMutation.isPending;
  const hasValidCartItems = selectedCartItems.every(
    (item) =>
      isValidCartItemId(item.id) &&
      Number.isInteger(Number(item.categorySizeId)),
  );
  const cannotConfirmReason = isDirectMode
    ? !directItem
      ? "Không tìm thấy món đặt ngay."
      : addressesQuery.isLoading
        ? "Đang tải địa chỉ giao hàng."
        : !selectedAddress
          ? "Vui lòng thêm và chọn một địa chỉ giao hàng hợp lệ."
          : undefined
    : cartQuery.isLoading
      ? "Đang tải giỏ hàng."
      : cartQuery.isError
        ? "Không thể tải giỏ hàng."
        : addressesQuery.isLoading
          ? "Đang tải địa chỉ giao hàng."
          : !selectedAddress
            ? "Vui lòng thêm và chọn một địa chỉ giao hàng hợp lệ."
            : selectedCartItems.length === 0
              ? "Không còn món hợp lệ để thanh toán."
              : !hasValidCartItems
                ? "Có món trong giỏ thiếu mã, hãy tải lại giỏ hàng."
                : undefined;
  const isConfirmDisabled = Boolean(cannotConfirmReason) || isPending;

  const confirmCartCheckout = async () => {
    if (!selectedAddress || isConfirmDisabled) return;

    const cartItemIds = selectedCartItems.map((item) => item.id);
    if (
      cartItemIds.length === 0 ||
      cartItemIds.some((id) => !isValidCartItemId(id))
    ) {
      return;
    }

    const trimmedNote = orderNote.trim();

    try {
      const order = await checkoutCartMutation.mutateAsync({
        addressId: selectedAddress.id,
        cartItemIds,
        ...(trimmedNote ? { note: trimmedNote } : {}),
        orderType: "delivery",
        paymentMethod,
        shippingFee: deliveryFee,
      });

      router.push(routes.CUSTOMER_ORDER_DETAIL(order.id));
    } catch {
      // Stay on checkout. Mutation hook shows the API error and refetches cart.
    }
  };

  const confirmDirectOrder = async () => {
    if (!selectedAddress || !directItem || isConfirmDisabled) return;

    const trimmedNote = directItem.note?.trim();

    try {
      const order = await createDirectOrderMutation.mutateAsync({
        addressId: selectedAddress.id,
        categorySizeId: directItem.categorySizeId,
        ...(trimmedNote ? { note: trimmedNote } : {}),
        orderType: "delivery",
        paymentMethod,
        productId: directItem.productId,
        quantity: directItem.quantity,
        shippingFee: deliveryFee,
        ...(directItem.toppingIds.length > 0
          ? { toppingIds: directItem.toppingIds }
          : {}),
      });

      router.push(routes.CUSTOMER_ORDER_DETAIL(order.id));
    } catch {
      // Stay on checkout. Mutation hook shows the API error without touching cart.
    }
  };

  return (
    <div className="min-h-screen bg-cream-white pt-16 text-on-surface">
      <OrderPageHeader
        href={isDirectMode ? routes.CUSTOMER_MENU : routes.CUSTOMER_CART}
        label={isDirectMode ? "Quay lại thực đơn" : "Quay lại giỏ hàng"}
      />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
            Thanh toán
          </p>
          <h1 className="text-3xl font-black text-charcoal-black md:text-4xl">
            Hoàn tất đơn hàng
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
            Kiểm tra lại món đã chọn, chọn địa chỉ giao hàng và phương thức
            thanh toán.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="space-y-6">
            <SelectedProductsSection items={displayItems} />
            <DeliveryAddressSection
              addresses={addresses}
              isError={addressesQuery.isError}
              isLoading={addressesQuery.isLoading}
              onRetry={() => {
                void addressesQuery.refetch();
              }}
              onSelectAddress={setSelectedAddressId}
              selectedAddressId={selectedAddress?.id ?? null}
            />
            <PaymentMethodSection
              onChange={setPaymentMethod}
              paymentMethod={paymentMethod}
            />
            {!isDirectMode && (
              <DeliveryNoteSection note={orderNote} onChange={setOrderNote} />
            )}
          </section>

          <OrderSummaryCard
            deliveryFee={deliveryFee}
            disabled={isConfirmDisabled}
            disabledReason={cannotConfirmReason}
            isPending={isPending}
            onConfirm={() => {
              void (isDirectMode ? confirmDirectOrder() : confirmCartCheckout());
            }}
            subtotal={subtotal}
            total={total}
          />
        </div>
      </main>
    </div>
  );
}

export default function CustomerCheckoutRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream-white pt-28 text-on-surface">
          <p className="px-6 text-sm text-on-surface-variant">
            Đang tải trang thanh toán...
          </p>
        </div>
      }
    >
      <CustomerCheckoutPage />
    </Suspense>
  );
}
