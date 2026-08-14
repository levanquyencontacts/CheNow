"use client";

import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { FALLBACK_PRODUCT_IMAGE } from "@/common/mocks/customerMenu";
import { resolveProductImageUrl } from "@/common/utils/media";
import { formatPrice } from "../orderUtils";

export type CheckoutDisplayItem = {
  image: string;
  key: string;
  name: string;
  note?: string;
  quantity: number;
  size: string;
  toppings: string[];
  total: number;
};

type SelectedProductsSectionProps = {
  items: CheckoutDisplayItem[];
};

export function SelectedProductsSection({
  items,
}: SelectedProductsSectionProps) {
  return (
    <div className="rounded-2xl border border-[#eadfd4] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <ShoppingBag className="text-primary" size={20} />
        <h2 className="text-lg font-bold text-charcoal-black">
          Sản phẩm đã chọn
        </h2>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            className="flex gap-4 rounded-2xl border border-[#eadfd4] bg-[#fffaf5] p-4"
            key={item.key}
          >
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-tea-wash">
              <Image
                alt={item.name}
                className="object-cover"
                fill
                sizes="80px"
                src={resolveProductImageUrl(item.image, FALLBACK_PRODUCT_IMAGE)}
                unoptimized
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold leading-tight text-charcoal-black">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-xs text-on-surface-variant">
                    Size {item.size} · x{item.quantity}
                  </p>
                  {item.toppings.length > 0 && (
                    <p className="mt-1 text-xs text-on-surface-variant">
                      Topping: {item.toppings.join(", ")}
                    </p>
                  )}
                  {item.note && (
                    <p className="mt-1 text-xs text-on-surface-variant">
                      Ghi chú món: {item.note}
                    </p>
                  )}
                </div>
                <span className="text-base font-bold text-primary">
                  {formatPrice(item.total)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
