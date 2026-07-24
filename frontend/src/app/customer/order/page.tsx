"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/common/utils/constant";
import { useAddressesQuery } from "@/services/controllers/addresses/AddressesQueries";
import {
  useClearCartMutation,
  useCustomerCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "@/services/controllers/cart/CartQueries";
import { useCreateOrderMutation } from "@/services/controllers/orders/OrdersQueries";
import type { CustomerCartItem, PaymentMethod } from "@/services/types/apiType";
import { CartItemsSection } from "./components/CartItemsSection";
import { DeliveryAddressSection } from "./components/DeliveryAddressSection";
import { EditCartItemModal } from "./components/EditCartItemModal";
import { OrderPageHeader } from "./components/OrderPageHeader";
import { OrderSummaryCard } from "./components/OrderSummaryCard";
import { PaymentMethodSection } from "./components/PaymentMethodSection";

export default function CustomerOrderPage() {
  const router = useRouter();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState("");
  const [editingQuantity, setEditingQuantity] = useState(1);
  const [editingToppings, setEditingToppings] = useState<
    Array<number | string>
  >([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const addressesQuery = useAddressesQuery();
  const { data: cartResponse } = useCustomerCartQuery();
  const createOrderMutation = useCreateOrderMutation();
  const clearCartMutation = useClearCartMutation();
  const updateCartItemMutation = useUpdateCartItemMutation();
  const removeCartItemMutation = useRemoveCartItemMutation();
  const cart = useMemo(() => cartResponse?.items ?? [], [cartResponse?.items]);
  const addresses = useMemo(
    () => addressesQuery.data ?? [],
    [addressesQuery.data],
  );

  // An explicit selection wins across refetches. The default is only used
  // while the user has not selected an existing address themselves.
  const selectedAddress =
    addresses.find((address) => address.id === selectedAddressId) ??
    addresses.find((address) => address.isDefault) ??
    null;

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.linePrice * item.quantity, 0),
    [cart],
  );
  const deliveryFee = subtotal >= 120000 || subtotal === 0 ? 0 : 15000;
  const total = subtotal + deliveryFee;
  const editingItem = cart.find((item) => item.key === editingKey);
  const editingLinePrice =
    (editingItem?.product.price ?? 0) +
    (editingItem?.sizeExtraPrice ?? 0) +
    editingToppings.reduce<number>(
      (sum, id) =>
        sum +
        (editingItem?.toppings.find(
          (topping) => String(topping.id) === String(id),
        )?.price ?? 0),
      0,
    );
  const hasValidCartItems = cart.every((item) =>
    Number.isInteger(Number(item.categorySizeId)),
  );
  const cannotConfirmReason = addressesQuery.isLoading
    ? "Đang tải địa chỉ giao hàng."
    : !selectedAddress
      ? "Vui lòng thêm và chọn một địa chỉ giao hàng hợp lệ."
      : cart.length === 0
        ? "Giỏ hàng đang trống."
        : !hasValidCartItems
          ? "Có sản phẩm trong giỏ chưa đủ thông tin."
          : undefined;
  const isConfirmDisabled =
    Boolean(cannotConfirmReason) ||
    createOrderMutation.isPending ||
    clearCartMutation.isPending;

  const updateQuantity = (key: string, nextQuantity: number) => {
    const id = Number(key);
    if (!Number.isFinite(id)) return;

    if (nextQuantity <= 0) {
      removeCartItemMutation.mutate(id);
      return;
    }

    updateCartItemMutation.mutate({ id, quantity: nextQuantity });
  };

  const openEditModal = (item: CustomerCartItem) => {
    setEditingKey(item.key);
    setEditingNote(item.note ?? "");
    setEditingQuantity(item.quantity);
    setEditingToppings(item.toppings.map((topping) => topping.id));
  };

  const saveEditedItem = async () => {
    if (!editingItem?.id) return;

    await updateCartItemMutation.mutateAsync({
      categorySizeId: editingItem.categorySizeId,
      id: editingItem.id,
      note: editingNote.trim(),
      quantity: editingQuantity,
      toppingIds: editingToppings,
    });
    setEditingKey(null);
  };

  const confirmOrder = async () => {
    if (!selectedAddress || isConfirmDisabled) {
      return;
    }

    try {
      await createOrderMutation.mutateAsync({
        addressId: selectedAddress.id,
        subtotalAmount: subtotal,
        shippingFee: deliveryFee,
        totalAmount: total,
        orderType: "delivery",
        paymentMethod,
        orderItems: cart.map((item) => ({
          productId: item.product.id,
          categorySizeId: Number(item.categorySizeId),
          productName: item.product.name,
          sizeName: item.size,
          sizeCode: item.sizeCode ?? item.size,
          sizeExtraPrice: item.sizeExtraPrice ?? 0,
          price: item.product.price,
          quantity: item.quantity,
          subtotal: item.linePrice * item.quantity,
          orderItemToppings: item.toppings.map((topping) => ({
            toppingId: Number(topping.id),
            toppingName: topping.name,
            price: topping.price,
            quantity: 1,
          })),
        })),
      });

      try {
        await clearCartMutation.mutateAsync();
      } finally {
        router.push(routes.CUSTOMER_HOME);
      }
    } catch {
      // Mutation hooks surface the API error to the user.
    }
  };

  return (
    <div className="min-h-screen bg-cream-white pt-16 text-on-surface">
      <OrderPageHeader />

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
            <CartItemsSection
              cart={cart}
              onEdit={openEditModal}
              onQuantityChange={updateQuantity}
            />
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
          </section>

          <OrderSummaryCard
            deliveryFee={deliveryFee}
            disabled={isConfirmDisabled}
            disabledReason={cannotConfirmReason}
            isPending={
              createOrderMutation.isPending || clearCartMutation.isPending
            }
            onConfirm={() => {
              void confirmOrder();
            }}
            subtotal={subtotal}
            total={total}
          />
        </div>
      </main>

      {editingItem && (
        <EditCartItemModal
          editingItem={editingItem}
          editingLinePrice={editingLinePrice}
          editingNote={editingNote}
          editingQuantity={editingQuantity}
          editingToppings={editingToppings}
          onClose={() => setEditingKey(null)}
          onNoteChange={setEditingNote}
          onQuantityChange={setEditingQuantity}
          onSave={saveEditedItem}
          onToppingsChange={setEditingToppings}
        />
      )}
    </div>
  );
}
