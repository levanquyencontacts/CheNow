"use client";

import { CreditCard } from "lucide-react";
import type { PaymentMethod } from "@/services/types/apiType";

const PAYMENT_METHODS = [
  ["cash", "Tiền mặt", "Thanh toán khi nhận hàng"],
  ["vnpay", "Chuyển khoản", "Nhận mã thanh toán sau khi đặt"],
  ["momo", "Ví điện tử", "Thanh toán qua ví Momo"],
] as const;

type PaymentMethodSectionProps = {
  onChange: (paymentMethod: PaymentMethod) => void;
  paymentMethod: PaymentMethod;
};

export function PaymentMethodSection({
  onChange,
  paymentMethod,
}: PaymentMethodSectionProps) {
  return (
    <div className="rounded-2xl border border-[#eadfd4] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <CreditCard className="text-primary" size={20} />
        <h2 className="text-lg font-bold text-charcoal-black">
          Phương thức thanh toán
        </h2>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {PAYMENT_METHODS.map(([value, title, desc]) => (
          <button
            className={`rounded-2xl border p-4 text-left transition-colors ${
              paymentMethod === value
                ? "border-primary bg-emerald/10 text-primary"
                : "border-[#eadfd4] bg-white"
            }`}
            key={value}
            onClick={() => onChange(value)}
            type="button"
          >
            <span className="font-bold">{title}</span>
            <span className="mt-1 block text-xs text-on-surface-variant">
              {desc}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
