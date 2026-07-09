"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { TOPPINGS } from "@/common/mocks/customerOrder";
import type { CustomerCartItem } from "@/services/types/apiType";
import { formatPrice } from "../orderUtils";
import { OptionGroup } from "./OptionGroup";
import { QuantityStepper } from "./QuantityStepper";

type EditCartItemModalProps = {
  editingIce: string;
  editingItem: CustomerCartItem;
  editingLinePrice: number;
  editingQuantity: number;
  editingSize: CustomerCartItem["size"];
  editingSugar: string;
  editingToppings: Array<number | string>;
  onClose: () => void;
  onIceChange: (value: string) => void;
  onQuantityChange: (value: number) => void;
  onSave: () => void;
  onSizeChange: (value: CustomerCartItem["size"]) => void;
  onSugarChange: (value: string) => void;
  onToppingsChange: (value: Array<number | string>) => void;
};

export function EditCartItemModal({
  editingIce,
  editingItem,
  editingLinePrice,
  editingQuantity,
  editingSize,
  editingSugar,
  editingToppings,
  onClose,
  onIceChange,
  onQuantityChange,
  onSave,
  onSizeChange,
  onSugarChange,
  onToppingsChange,
}: EditCartItemModalProps) {
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-charcoal-black/45 px-4 py-6 backdrop-blur-sm sm:items-center">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eadfd4] bg-white p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Sửa món</p>
            <h3 className="text-xl font-bold text-charcoal-black">{editingItem.product.name}</h3>
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
                src={editingItem.product.image}
                unoptimized
              />
            </div>
            <p className="mt-3 text-sm font-bold text-primary">{formatPrice(editingLinePrice)} / món</p>
          </div>
          <div className="space-y-5">
            <OptionGroup
              active={editingSize}
              items={[
                { label: "M", value: "M", hint: "Giá gốc" },
                { label: "L", value: "L", hint: "+7.000đ" },
              ]}
              label="Size"
              onChange={(value) => onSizeChange(value as CustomerCartItem["size"])}
            />
            <OptionGroup
              active={editingSugar}
              items={["30%", "50%", "70%", "100%"].map((value) => ({ label: value, value }))}
              label="Đường"
              onChange={onSugarChange}
            />
            <OptionGroup
              active={editingIce}
              items={["Ít đá", "50%", "70%", "100%"].map((value) => ({ label: value, value }))}
              label="Đá"
              onChange={onIceChange}
            />

            <div>
              <p className="mb-2 text-sm font-bold text-charcoal-black">Topping</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {TOPPINGS.map((topping) => {
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
                      <span className="text-xs">{formatPrice(topping.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 border-t border-[#eadfd4] pt-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
              <QuantityStepper onChange={onQuantityChange} value={editingQuantity} />
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
