"use client";

import { MapPin } from "lucide-react";
import { SAVED_ADDRESSES } from "@/common/mocks/customerOrder";

type DeliveryAddressSectionProps = {
  selectedAddressId: string;
  onSelectAddress: (addressId: string) => void;
};

export function DeliveryAddressSection({ selectedAddressId, onSelectAddress }: DeliveryAddressSectionProps) {
  return (
    <div className="rounded-2xl border border-[#eadfd4] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <MapPin className="text-primary" size={20} />
        <h2 className="text-lg font-bold text-charcoal-black">Chọn địa chỉ giao hàng</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {SAVED_ADDRESSES.map((address) => {
          const active = selectedAddressId === address.id;

          return (
            <button
              className={`rounded-2xl border p-4 text-left transition-colors ${
                active ? "border-primary bg-emerald/10" : "border-[#eadfd4] bg-white hover:bg-[#fffaf5]"
              }`}
              key={address.id}
              onClick={() => onSelectAddress(address.id)}
              type="button"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-charcoal-black">{address.label}</span>
                {address.isDefault && (
                  <span className="rounded-full bg-amber px-2 py-1 text-[10px] font-black text-charcoal-black">
                    Mặc định
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold text-[#315d3b]">
                {address.receiver} · {address.phone}
              </p>
              <p className="mt-1 text-sm leading-5 text-on-surface-variant">{address.address}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

