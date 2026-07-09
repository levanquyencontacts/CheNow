"use client";

import { useEffect, useMemo, useState } from "react";
import { SAVED_ADDRESSES, TOPPINGS } from "@/common/mocks/customerOrder";
import { CartItemsSection } from "./components/CartItemsSection";
import { DeliveryAddressSection } from "./components/DeliveryAddressSection";
import { EditCartItemModal } from "./components/EditCartItemModal";
import { OrderPageHeader } from "./components/OrderPageHeader";
import { OrderSummaryCard } from "./components/OrderSummaryCard";
import { PaymentMethodSection } from "./components/PaymentMethodSection";
import { CART_STORAGE_KEY, readStoredCart, sizeExtra } from "./orderUtils";
import type { CustomerCartItem } from "@/services/types/apiType";

export default function CustomerOrderPage() {
  const [cart, setCart] = useState<CustomerCartItem[]>(readStoredCart);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingSize, setEditingSize] = useState<CustomerCartItem["size"]>("M");
  const [editingSugar, setEditingSugar] = useState("70%");
  const [editingIce, setEditingIce] = useState("70%");
  const [editingQuantity, setEditingQuantity] = useState(1);
  const [editingToppings, setEditingToppings] = useState<Array<number | string>>([]);
  const [selectedAddressId, setSelectedAddressId] = useState(SAVED_ADDRESSES[0].id);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.linePrice * item.quantity, 0), [cart]);
  const deliveryFee = subtotal >= 120000 || subtotal === 0 ? 0 : 15000;
  const total = subtotal + deliveryFee;
  const editingItem = cart.find((item) => item.key === editingKey);
  const editingLinePrice =
    (editingItem?.product.price ?? 0) +
    sizeExtra(editingSize) +
    editingToppings.reduce<number>(
      (sum, id) => sum + (TOPPINGS.find((topping) => topping.id === id)?.price ?? 0),
      0,
    );

  const updateQuantity = (key: string, nextQuantity: number) => {
    setCart((current) =>
      nextQuantity <= 0
        ? current.filter((item) => item.key !== key)
        : current.map((item) => (item.key === key ? { ...item, quantity: nextQuantity } : item)),
    );
  };

  const openEditModal = (item: CustomerCartItem) => {
    setEditingKey(item.key);
    setEditingSize(item.size);
    setEditingSugar(item.sugar);
    setEditingIce(item.ice);
    setEditingQuantity(item.quantity);
    setEditingToppings(item.toppings.map((topping) => topping.id));
  };

  const saveEditedItem = () => {
    if (!editingItem) return;

    const toppings = TOPPINGS.filter((topping) => editingToppings.includes(topping.id));
    const nextKey = [
      editingItem.product.id,
      editingSize,
      editingSugar,
      editingIce,
      toppings.map((topping) => topping.id).join("-"),
    ].join("|");

    const updatedItem: CustomerCartItem = {
      ...editingItem,
      key: nextKey,
      size: editingSize,
      sugar: editingSugar,
      ice: editingIce,
      toppings,
      quantity: editingQuantity,
      linePrice: editingLinePrice,
    };

    setCart((current) => {
      const withoutOriginal = current.filter((item) => item.key !== editingItem.key);
      const duplicatedItem = withoutOriginal.find((item) => item.key === nextKey);

      if (duplicatedItem) {
        return withoutOriginal.map((item) =>
          item.key === nextKey ? { ...item, quantity: item.quantity + updatedItem.quantity } : item,
        );
      }

      return [...withoutOriginal, updatedItem];
    });
    setEditingKey(null);
  };

  return (
    <div className="min-h-screen bg-cream-white text-on-surface">
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
          editingIce={editingIce}
          editingItem={editingItem}
          editingLinePrice={editingLinePrice}
          editingQuantity={editingQuantity}
          editingSize={editingSize}
          editingSugar={editingSugar}
          editingToppings={editingToppings}
          onClose={() => setEditingKey(null)}
          onIceChange={setEditingIce}
          onQuantityChange={setEditingQuantity}
          onSave={saveEditedItem}
          onSizeChange={setEditingSize}
          onSugarChange={setEditingSugar}
          onToppingsChange={setEditingToppings}
        />
      )}
    </div>
  );
}
