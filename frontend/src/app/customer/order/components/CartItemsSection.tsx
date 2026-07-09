"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil, ShoppingBag, Trash2 } from "lucide-react";
import type { CustomerCartItem } from "@/services/types/apiType";
import { formatPrice } from "../orderUtils";
import { QuantityStepper } from "./QuantityStepper";

type CartItemsSectionProps = {
  cart: CustomerCartItem[];
  onEdit: (item: CustomerCartItem) => void;
  onQuantityChange: (key: string, quantity: number) => void;
};

export function CartItemsSection({ cart, onEdit, onQuantityChange }: CartItemsSectionProps) {
  return (
    <div className="rounded-2xl border border-[#eadfd4] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <ShoppingBag className="text-primary" size={20} />
        <h2 className="text-lg font-bold text-charcoal-black">Món trong giỏ</h2>
      </div>
      <div className="space-y-3">
        {cart.length > 0 ? (
          cart.map((item) => (
            <div className="rounded-2xl border border-[#eadfd4] bg-[#fffaf5] p-4" key={item.key}>
              <div className="flex gap-4">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-tea-wash">
                  <Image
                    alt={item.product.name}
                    className="object-cover"
                    fill
                    sizes="96px"
                    src={item.product.image}
                    unoptimized
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold leading-tight text-charcoal-black">{item.product.name}</h3>
                      <p className="mt-1 text-xs text-on-surface-variant">
                        Size {item.size}, đường {item.sugar}, đá {item.ice}
                      </p>
                      {item.toppings.length > 0 && (
                        <p className="mt-1 text-xs text-on-surface-variant">
                          Topping: {item.toppings.map((topping) => topping.name).join(", ")}
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
                      <button className="text-error" onClick={() => onQuantityChange(item.key, 0)} type="button">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-lg font-bold text-primary">{formatPrice(item.linePrice * item.quantity)}</span>
                    <QuantityStepper onChange={(value) => onQuantityChange(item.key, value)} value={item.quantity} />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-[#d8cbbf] p-8 text-center text-on-surface-variant">
            <ShoppingBag className="mx-auto mb-3 opacity-60" size={42} />
            <p className="font-semibold">Chưa có món nào trong giỏ.</p>
            <Link className="mt-3 inline-flex font-bold text-primary" href="/customer/menu">
              Thêm món từ thực đơn
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
