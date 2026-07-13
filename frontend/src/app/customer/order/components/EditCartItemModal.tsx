"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { FALLBACK_PRODUCT_IMAGE } from "@/common/mocks/customerMenu";
import type { CustomerCartItem } from "@/services/types/apiType";
import { formatPrice } from "../orderUtils";
import { QuantityStepper } from "./QuantityStepper";

type EditCartItemModalProps = {
  editingItem: CustomerCartItem;
  editingLinePrice: number;
  editingNote: string;
  editingQuantity: number;
  editingToppings: Array<number | string>;
  onClose: () => void;
  onNoteChange: (value: string) => void;
  onQuantityChange: (value: number) => void;
  onSave: () => void;
  onToppingsChange: (value: Array<number | string>) => void;
};

export function EditCartItemModal({
  editingItem,
  editingLinePrice,
  editingNote,
  editingQuantity,
  editingToppings,
  onClose,
  onNoteChange,
  onQuantityChange,
  onSave,
  onToppingsChange,
}: EditCartItemModalProps) {
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-charcoal-black/45 px-4 py-6 backdrop-blur-sm sm:items-center">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eadfd4] bg-white p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Sửa món
            </p>
            <h3 className="text-xl font-bold text-charcoal-black">
              {editingItem.product.name}
            </h3>
          </div>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-6 p-5 md:grid-cols-[210px_minmax(0,1fr)]">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-tea-wash">
              <Image
                alt={editingItem.product.name}
                className="object-cover"
                fill
                sizes="210px"
                src={editingItem.product.image || FALLBACK_PRODUCT_IMAGE}
                unoptimized
              />
            </div>
            <p className="mt-3 text-sm font-bold text-primary">
              {formatPrice(editingLinePrice)} / món
            </p>
          </div>
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-sm font-bold text-charcoal-black">Size</p>
              <div className="inline-flex rounded-xl border border-primary bg-emerald/10 px-4 py-2 text-sm font-bold text-primary">
                {editingItem.size}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-bold text-charcoal-black">
                Topping
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {editingItem.toppings.map((topping) => {
                  const active = editingToppings.includes(topping.id);

                  return (
                    <button
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                        active
                          ? "border-primary bg-emerald/10 text-primary"
                          : "border-[#eadfd4] bg-white text-on-surface"
                      }`}
                      key={topping.id}
                      onClick={() =>
                        onToppingsChange(
                          active
                            ? editingToppings.filter((id) => id !== topping.id)
                            : [...editingToppings, topping.id],
                        )
                      }
                      type="button"
                    >
                      <span className="font-semibold">{topping.name}</span>
                      <span className="text-xs">
                        {formatPrice(topping.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-charcoal-black">
                Ghi chú
              </span>
              <textarea
                className="min-h-24 w-full resize-none rounded-xl border border-[#eadfd4] bg-white px-3 py-2 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/70 focus:border-primary"
                maxLength={200}
                onChange={(event) => onNoteChange(event.target.value)}
                placeholder="Ví dụ: ít ngọt, không topping, giao nhanh..."
                value={editingNote}
              />
            </label>

            <div className="grid gap-3 border-t border-[#eadfd4] pt-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
              <QuantityStepper
                onChange={onQuantityChange}
                value={editingQuantity}
              />
              <button
                className="flex h-12 items-center justify-center rounded-xl bg-amber px-5 text-sm font-black text-charcoal-black transition-transform hover:scale-[1.01] active:scale-[0.98]"
                onClick={onSave}
                type="button"
              >
                Lưu thay đổi - {formatPrice(editingLinePrice * editingQuantity)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
