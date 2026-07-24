"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type {
  CreateAddressPayload,
  UserAddress,
} from "@/services/types/apiType";

export function AddressFormModal({
  address,
  initialReceiverName,
  initialReceiverPhone,
  isSaving,
  onClose,
  onSave,
}: {
  address: UserAddress | null;
  initialReceiverName: string;
  initialReceiverPhone: string;
  isSaving: boolean;
  onClose: () => void;
  onSave: (payload: CreateAddressPayload) => Promise<void>;
}) {
  const [label, setLabel] = useState(address?.label ?? "");
  const [receiverName, setReceiverName] = useState(
    address?.receiverName ?? initialReceiverName,
  );
  const [receiverPhone, setReceiverPhone] = useState(
    address?.receiverPhone ?? initialReceiverPhone,
  );
  const [fullAddress, setFullAddress] = useState(address?.fullAddress ?? "");
  const [isDefault, setIsDefault] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSave({
      label: label.trim(),
      receiverName: receiverName.trim(),
      receiverPhone: receiverPhone.trim(),
      fullAddress: fullAddress.trim(),
      isDefault: address ? undefined : isDefault,
    });
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-charcoal-black/45 p-4 backdrop-blur-sm sm:items-center">
      <form
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onSubmit={submit}
      >
        <div className="flex items-center justify-between border-b border-[#eadfd4] p-5">
          <h2 className="text-lg font-black text-charcoal-black">
            {address ? "Sửa địa chỉ" : "Thêm địa chỉ"}
          </h2>
          <button
            aria-label="Đóng"
            className="rounded-full bg-surface-container p-2"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 p-5">
          <AddressField
            label="Nhãn địa chỉ"
            maxLength={50}
            onChange={setLabel}
            placeholder="Ví dụ: Nhà riêng"
            value={label}
          />
          <AddressField
            label="Tên người nhận"
            maxLength={100}
            minLength={2}
            onChange={setReceiverName}
            placeholder="Nguyễn Văn A"
            value={receiverName}
          />
          <AddressField
            label="Số điện thoại"
            maxLength={20}
            minLength={9}
            onChange={setReceiverPhone}
            pattern="\+?[0-9][0-9 .-]{7,18}[0-9]"
            placeholder="0900 000 000"
            value={receiverPhone}
          />
          <label>
            <span className="mb-2 block text-sm font-bold text-charcoal-black">
              Địa chỉ đầy đủ
            </span>
            <textarea
              className="min-h-24 w-full rounded-xl border border-[#eadfd4] px-3 py-2 text-sm outline-none focus:border-primary"
              maxLength={500}
              minLength={5}
              onChange={(event) => setFullAddress(event.target.value)}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
              required
              value={fullAddress}
            />
          </label>
          {!address && (
            <label className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant">
              <input
                checked={isDefault}
                className="h-4 w-4 accent-primary"
                onChange={(event) => setIsDefault(event.target.checked)}
                type="checkbox"
              />
              Đặt làm địa chỉ mặc định
            </label>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-[#eadfd4] p-5">
          <button
            className="rounded-xl border border-[#eadfd4] px-4 py-2 text-sm font-bold"
            disabled={isSaving}
            onClick={onClose}
            type="button"
          >
            Hủy
          </button>
          <button
            className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? "Đang lưu..." : "Lưu địa chỉ"}
          </button>
        </div>
      </form>
    </div>
  );
}

function AddressField({
  label,
  onChange,
  value,
  ...inputProps
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
} & Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  "maxLength" | "minLength" | "pattern" | "placeholder"
>) {
  return (
    <label>
      <span className="mb-2 block text-sm font-bold text-charcoal-black">
        {label}
      </span>
      <input
        {...inputProps}
        className="h-11 w-full rounded-xl border border-[#eadfd4] px-3 text-sm outline-none focus:border-primary"
        onChange={(event) => onChange(event.target.value)}
        required
        value={value}
      />
    </label>
  );
}
