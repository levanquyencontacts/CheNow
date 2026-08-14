"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/common/utils/constant";
import { saveCartCheckoutIds } from "@/common/utils/checkoutSession";
import {
  useCustomerCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "@/services/controllers/cart/CartQueries";
import type { CustomerCartItem } from "@/services/types/apiType";
import { CartItemsSection } from "../order/components/CartItemsSection";
import { EditCartItemModal } from "../order/components/EditCartItemModal";
import { OrderSummaryCard } from "../order/components/OrderSummaryCard";
import { getDeliveryFee, isValidCartItemId } from "../order/orderUtils";

export default function CustomerCartPage() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState("");
  const [editingQuantity, setEditingQuantity] = useState(1);
  const [editingToppings, setEditingToppings] = useState<
    Array<number | string>
  >([]);
  const didSelectAllOnLoad = useRef(false);
  const cartQuery = useCustomerCartQuery();
  const updateCartItemMutation = useUpdateCartItemMutation();
  const removeCartItemMutation = useRemoveCartItemMutation();
  const cart = useMemo(
    () => cartQuery.data?.items ?? [],
    [cartQuery.data?.items],
  );
  const selectableIds = useMemo(
    () => cart.map((item) => item.id).filter(isValidCartItemId),
    [cart],
  );

  useEffect(() => {
    setSelectedIds((current) => {
      if (!didSelectAllOnLoad.current && selectableIds.length > 0) {
        didSelectAllOnLoad.current = true;
        return selectableIds;
      }

      const valid = new Set(selectableIds);
      return current.filter((id) => valid.has(id));
    });
  }, [selectableIds]);

  const selectedItems = cart.filter(
    (item) => isValidCartItemId(item.id) && selectedIds.includes(item.id),
  );
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.linePrice * item.quantity,
    0,
  );
  const deliveryFee = getDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;
  const selectedCount = selectedIds.length;
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
  const cannotCheckoutReason = cartQuery.isLoading
    ? "Đang tải giỏ hàng."
    : cartQuery.isError
      ? "Không thể tải giỏ hàng."
      : selectedCount === 0
        ? "Chọn ít nhất một món để thanh toán."
        : undefined;

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
    if (!isValidCartItemId(editingItem?.id)) return;

    await updateCartItemMutation.mutateAsync({
      categorySizeId: editingItem.categorySizeId,
      id: editingItem.id,
      note: editingNote.trim(),
      quantity: editingQuantity,
      toppingIds: editingToppings,
    });
    setEditingKey(null);
  };

  const toggleItem = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id],
    );
  };

  const toggleAll = () => {
    setSelectedIds((current) =>
      current.length === selectableIds.length ? [] : selectableIds,
    );
  };

  const deleteSelected = async () => {
    for (const id of selectedIds) {
      try {
        await removeCartItemMutation.mutateAsync(id);
      } catch {
        // Keep going so remaining selected items can still be removed.
      }
    }
  };

  const goToCheckout = () => {
    const ids = saveCartCheckoutIds(selectedIds);
    if (ids.length === 0) return;
    router.push(routes.CUSTOMER_CHECKOUT);
  };

  return (
    <div className="min-h-screen bg-cream-white pt-28 text-on-surface">
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
            Giỏ hàng
          </p>
          <h1 className="text-3xl font-black text-charcoal-black md:text-4xl">
            Món đã thêm
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
            Chọn món muốn thanh toán, chỉnh số lượng hoặc ghi chú món trước khi
            sang bước đặt hàng.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <CartItemsSection
            cart={cart}
            isDeletingSelected={removeCartItemMutation.isPending}
            isError={cartQuery.isError}
            isLoading={cartQuery.isLoading}
            onDeleteSelected={() => {
              void deleteSelected();
            }}
            onEdit={openEditModal}
            onQuantityChange={updateQuantity}
            onRetry={() => {
              void cartQuery.refetch();
            }}
            onToggle={toggleItem}
            onToggleAll={toggleAll}
            selectedIds={selectedIds}
          />

          <OrderSummaryCard
            confirmLabel={`Thanh toán (${selectedCount})`}
            deliveryFee={deliveryFee}
            disabled={Boolean(cannotCheckoutReason)}
            disabledReason={cannotCheckoutReason}
            isPending={false}
            onConfirm={goToCheckout}
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
