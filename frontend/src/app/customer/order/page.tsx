"use client";

import { useMemo, useState } from "react";
import { SAVED_ADDRESSES } from "@/common/mocks/customerOrder";
import {
  useCustomerCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "@/services/controllers/cart/CartQueries";
import { CartItemsSection } from "./components/CartItemsSection";
import { DeliveryAddressSection } from "./components/DeliveryAddressSection";
import { EditCartItemModal } from "./components/EditCartItemModal";
import { OrderPageHeader } from "./components/OrderPageHeader";
import { OrderSummaryCard } from "./components/OrderSummaryCard";
import { PaymentMethodSection } from "./components/PaymentMethodSection";
import type { CustomerCartItem } from "@/services/types/apiType";

export default function CustomerOrderPage() {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState("");
  const [editingQuantity, setEditingQuantity] = useState(1);
  const [editingToppings, setEditingToppings] = useState<Array<number | string>>([]);
  const [selectedAddressId, setSelectedAddressId] = useState(SAVED_ADDRESSES[0].id);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const { data: cartResponse } = useCustomerCartQuery();
  const updateCartItemMutation = useUpdateCartItemMutation();
  const removeCartItemMutation = useRemoveCartItemMutation();
  const cart = useMemo(() => cartResponse?.items ?? [], [cartResponse?.items]);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.linePrice * item.quantity, 0), [cart]);
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

  return (
    <div className="min-h-screen bg-cream-white pt-16 text-on-surface">
      <OrderPageHeader />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">Thanh toán</p>
          <h1 className="text-3xl font-black text-charcoal-black md:text-4xl">Hoàn tất đơn hàng</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
            Kiểm tra lại món đã chọn, chọn địa chỉ giao hàng và phương thức thanh toán.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="space-y-6">
            <CartItemsSection cart={cart} onEdit={openEditModal} onQuantityChange={updateQuantity} />
            <DeliveryAddressSection onSelectAddress={setSelectedAddressId} selectedAddressId={selectedAddressId} />
            <PaymentMethodSection onChange={setPaymentMethod} paymentMethod={paymentMethod} />
          </section>

          <OrderSummaryCard deliveryFee={deliveryFee} disabled={cart.length === 0} subtotal={subtotal} total={total} />
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
