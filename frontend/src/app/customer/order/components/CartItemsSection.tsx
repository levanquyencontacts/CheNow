"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil, ShoppingBag, Trash2 } from "lucide-react";
import { FALLBACK_PRODUCT_IMAGE } from "@/common/mocks/customerMenu";
import { resolveProductImageUrl } from "@/common/utils/media";
import type { CustomerCartItem } from "@/services/types/apiType";
import { formatPrice, isValidCartItemId } from "../orderUtils";
import { QuantityStepper } from "./QuantityStepper";

type CartItemsSectionProps = {
  cart: CustomerCartItem[];
  isDeletingSelected?: boolean;
  isError?: boolean;
  isLoading?: boolean;
  onDeleteSelected: () => void;
  onEdit: (item: CustomerCartItem) => void;
  onQuantityChange: (key: string, quantity: number) => void;
  onRetry?: () => void;
  onToggle: (id: number) => void;
  onToggleAll: () => void;
  selectedIds: number[];
};

export function CartItemsSection({
  cart,
  isDeletingSelected = false,
  isError = false,
  isLoading = false,
  onDeleteSelected,
  onEdit,
  onQuantityChange,
  onRetry,
  onToggle,
  onToggleAll,
  selectedIds,
}: CartItemsSectionProps) {
  const selectableIds = cart
    .map((item) => item.id)
    .filter(isValidCartItemId);
  const selectedCount = selectedIds.length;
  const allSelected =
    selectableIds.length > 0 && selectedCount === selectableIds.length;

  return (
    <div className="rounded-2xl border border-[#eadfd4] bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="text-primary" size={20} />
          <h2 className="text-lg font-bold text-charcoal-black">Giỏ hàng</h2>
        </div>
        {cart.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-charcoal-black">
              <input
                checked={allSelected}
                className="h-4 w-4 accent-primary"
                onChange={onToggleAll}
                type="checkbox"
              />
              Chọn tất cả ({cart.length} món)
            </label>
            <button
              className="text-sm font-bold text-error disabled:opacity-40"
              disabled={selectedCount === 0 || isDeletingSelected}
              onClick={onDeleteSelected}
              type="button"
            >
              {isDeletingSelected ? "Đang xóa..." : "Xóa đã chọn"}
            </button>
          </div>
        )}
      </div>
      <div className="space-y-3">
        {isLoading ? (
          <div className="rounded-xl border border-dashed border-[#d8cbbf] p-6 text-center text-sm text-on-surface-variant">
            Đang tải giỏ hàng...
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-error/30 bg-error/5 p-5 text-center">
            <p className="text-sm font-semibold text-error">
              Không thể tải giỏ hàng.
            </p>
            {onRetry && (
              <button
                className="mt-3 rounded-lg border border-error/30 px-3 py-2 text-sm font-bold text-error"
                onClick={onRetry}
                type="button"
              >
                Thử lại
              </button>
            )}
          </div>
        ) : cart.length > 0 ? (
          cart.map((item) => {
            const canSelect = isValidCartItemId(item.id);
            const selected = canSelect && selectedIds.includes(item.id);

            return (
              <div
                className="rounded-2xl border border-[#eadfd4] bg-[#fffaf5] p-4"
                key={item.key}
              >
                <div className="flex gap-4">
                  <input
                    checked={selected}
                    className="mt-2 h-4 w-4 shrink-0 accent-primary"
                    disabled={!canSelect}
                    onChange={() => {
                      if (canSelect) onToggle(item.id);
                    }}
                    type="checkbox"
                  />
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-tea-wash">
                    <Image
                      alt={item.product.name}
                      className="object-cover"
                      fill
                      sizes="96px"
                      src={resolveProductImageUrl(
                        item.product.image,
                        FALLBACK_PRODUCT_IMAGE,
                      )}
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold leading-tight text-charcoal-black">
                          {item.product.name}
                        </h3>
                        <p className="mt-1 text-xs text-on-surface-variant">
                          Size {item.size}
                        </p>
                        {item.toppings.length > 0 && (
                          <p className="mt-1 text-xs text-on-surface-variant">
                            Topping:{" "}
                            {item.toppings
                              .map((topping) => topping.name)
                              .join(", ")}
                          </p>
                        )}
                        {item.note && (
                          <p className="mt-1 text-xs text-on-surface-variant">
                            Ghi chú: {item.note}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary transition-colors hover:bg-emerald/10"
                          onClick={() => onEdit(item)}
                          type="button"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="text-error"
                          onClick={() => onQuantityChange(item.key, 0)}
                          type="button"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(item.linePrice * item.quantity)}
                      </span>
                      <QuantityStepper
                        onChange={(value) => onQuantityChange(item.key, value)}
                        value={item.quantity}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-[#d8cbbf] p-8 text-center text-on-surface-variant">
            <ShoppingBag className="mx-auto mb-3 opacity-60" size={42} />
            <p className="font-semibold">Chưa có món nào trong giỏ.</p>
            <Link
              className="mt-3 inline-flex font-bold text-primary"
              href="/customer/menu"
            >
              Thêm món từ thực đơn
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
