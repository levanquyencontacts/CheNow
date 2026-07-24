"use client";

import Link from "next/link";
import { MapPin, Settings } from "lucide-react";
import { routes } from "@/common/utils/constant";
import type { UserAddress } from "@/services/types/apiType";

type DeliveryAddressSectionProps = {
  addresses: UserAddress[];
  isError: boolean;
  isLoading: boolean;
  onRetry: () => void;
  selectedAddressId: number | null;
  onSelectAddress: (addressId: number) => void;
};

export function DeliveryAddressSection({
  addresses,
  isError,
  isLoading,
  onRetry,
  selectedAddressId,
  onSelectAddress,
}: DeliveryAddressSectionProps) {
  return (
    <div className="rounded-2xl border border-[#eadfd4] bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="text-primary" size={20} />
          <h2 className="text-lg font-bold text-charcoal-black">
            Chọn địa chỉ giao hàng
          </h2>
        </div>
        <Link
          className="flex items-center gap-2 rounded-xl border border-[#eadfd4] px-3 py-2 text-sm font-bold text-primary transition-colors hover:bg-emerald/10"
          href={routes.CUSTOMER_ADDRESSES}
        >
          <Settings size={15} />
          Quản lý địa chỉ
        </Link>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-dashed border-[#d8cbbf] p-6 text-center text-sm text-on-surface-variant">
          Đang tải địa chỉ...
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-error/30 bg-error/5 p-5 text-center">
          <p className="text-sm font-semibold text-error">
            Không thể tải danh sách địa chỉ.
          </p>
          <button
            className="mt-3 rounded-lg border border-error/30 px-3 py-2 text-sm font-bold text-error"
            onClick={onRetry}
            type="button"
          >
            Thử lại
          </button>
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#d8cbbf] p-6 text-center">
          <p className="font-bold text-charcoal-black">
            Bạn chưa có địa chỉ giao hàng
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Hãy thêm địa chỉ trong trang quản lý trước khi xác nhận đơn.
          </p>
          <Link
            className="mt-4 inline-flex rounded-xl bg-amber px-4 py-2 text-sm font-black text-charcoal-black"
            href={routes.CUSTOMER_ADDRESSES}
          >
            Đi đến trang địa chỉ
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {addresses.map((address) => {
            const active = selectedAddressId === address.id;

            return (
              <button
                aria-pressed={active}
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  active
                    ? "border-primary bg-emerald/10"
                    : "border-[#eadfd4] bg-white hover:bg-[#fffaf5]"
                }`}
                key={address.id}
                onClick={() => onSelectAddress(address.id)}
                type="button"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold text-charcoal-black">
                    {address.label}
                  </span>
                  {address.isDefault && (
                    <span className="rounded-full bg-amber px-2 py-1 text-[10px] font-black text-charcoal-black">
                      Mặc định
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm font-semibold text-[#315d3b]">
                  {address.receiverName} · {address.receiverPhone}
                </p>
                <p className="mt-1 text-sm leading-5 text-on-surface-variant">
                  {address.fullAddress}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
