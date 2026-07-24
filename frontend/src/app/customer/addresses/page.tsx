"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { routes } from "@/common/utils/constant";
import {
  useAddressesQuery,
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
  useUpdateAddressMutation,
} from "@/services/controllers/addresses/AddressesQueries";
import type { RootState } from "@/services/store";
import type {
  CreateAddressPayload,
  UserAddress,
} from "@/services/types/apiType";
import { AddressFormModal } from "./components/AddressFormModal";

export default function CustomerAddressesPage() {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const addressesQuery = useAddressesQuery();
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(false);
  const createMutation = useCreateAddressMutation();
  const updateMutation = useUpdateAddressMutation();
  const deleteMutation = useDeleteAddressMutation();
  const setDefaultMutation = useSetDefaultAddressMutation();
  const addresses = addressesQuery.data ?? [];
  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    setDefaultMutation.isPending;

  const saveAddress = async (payload: CreateAddressPayload) => {
    try {
      if (editingAddress) {
        await updateMutation.mutateAsync({
          id: editingAddress.id,
          label: payload.label,
          receiverName: payload.receiverName,
          receiverPhone: payload.receiverPhone,
          fullAddress: payload.fullAddress,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      setEditingAddress(null);
      setIsCreating(false);
    } catch {
      // Keep the form open; mutation hooks surface the API error.
    }
  };

  const deleteAddress = (address: UserAddress) => {
    if (
      window.confirm(
        `Xóa địa chỉ "${address.label}"? Nếu đây là địa chỉ mặc định, hệ thống sẽ tự chọn địa chỉ mặc định mới.`,
      )
    ) {
      deleteMutation.mutate(address.id);
    }
  };

  return (
    <main className="min-h-screen bg-cream-white px-6 pb-16 pt-28 text-on-surface">
      <div className="mx-auto max-w-5xl">
        <Link
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary"
          href={routes.CUSTOMER_ORDER}
        >
          <ArrowLeft size={16} />
          Quay lại thanh toán
        </Link>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Tài khoản
            </p>
            <h1 className="mt-2 text-3xl font-black text-charcoal-black md:text-4xl">
              Địa chỉ giao hàng
            </h1>
            <p className="mt-2 text-sm text-on-surface-variant">
              Thêm và quản lý những địa chỉ bạn muốn sử dụng khi đặt hàng.
            </p>
          </div>
          <button
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
            disabled={isMutating}
            onClick={() => setIsCreating(true)}
            type="button"
          >
            <Plus size={17} />
            Thêm địa chỉ
          </button>
        </div>

        {addressesQuery.isLoading ? (
          <div className="rounded-2xl border border-dashed border-[#d8cbbf] bg-white p-10 text-center text-sm text-on-surface-variant">
            Đang tải địa chỉ...
          </div>
        ) : addressesQuery.isError ? (
          <div className="rounded-2xl border border-error/30 bg-white p-10 text-center">
            <p className="font-semibold text-error">
              Không thể tải danh sách địa chỉ.
            </p>
            <button
              className="mt-4 rounded-xl border border-error/30 px-4 py-2 text-sm font-bold text-error"
              onClick={() => {
                void addressesQuery.refetch();
              }}
              type="button"
            >
              Thử lại
            </button>
          </div>
        ) : addresses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d8cbbf] bg-white p-10 text-center">
            <MapPin className="mx-auto text-primary" size={32} />
            <h2 className="mt-4 text-lg font-black text-charcoal-black">
              Chưa có địa chỉ nào
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Địa chỉ đầu tiên bạn thêm sẽ tự trở thành mặc định.
            </p>
            <button
              className="mt-5 rounded-xl bg-amber px-4 py-3 text-sm font-black text-charcoal-black"
              onClick={() => setIsCreating(true)}
              type="button"
            >
              Thêm địa chỉ đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {addresses.map((address) => (
              <article
                className="rounded-2xl border border-[#eadfd4] bg-white p-5 shadow-sm"
                key={address.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-black text-charcoal-black">
                      {address.label}
                    </h2>
                    <p className="mt-2 text-sm font-semibold text-[#315d3b]">
                      {address.receiverName} · {address.receiverPhone}
                    </p>
                  </div>
                  {address.isDefault && (
                    <span className="rounded-full bg-amber px-2 py-1 text-[10px] font-black text-charcoal-black">
                      Mặc định
                    </span>
                  )}
                </div>
                <p className="mt-3 min-h-10 text-sm leading-5 text-on-surface-variant">
                  {address.fullAddress}
                </p>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-[#eadfd4] pt-4">
                  {!address.isDefault && (
                    <button
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-primary hover:bg-emerald/10 disabled:opacity-50"
                      disabled={isMutating}
                      onClick={() => setDefaultMutation.mutate(address.id)}
                      type="button"
                    >
                      <Star size={13} />
                      Đặt mặc định
                    </button>
                  )}
                  <button
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-on-surface-variant hover:bg-[#fffaf5] disabled:opacity-50"
                    disabled={isMutating}
                    onClick={() => setEditingAddress(address)}
                    type="button"
                  >
                    <Pencil size={13} />
                    Sửa
                  </button>
                  <button
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-error hover:bg-error/5 disabled:opacity-50"
                    disabled={isMutating}
                    onClick={() => deleteAddress(address)}
                    type="button"
                  >
                    <Trash2 size={13} />
                    Xóa
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {(isCreating || editingAddress) && (
        <AddressFormModal
          address={editingAddress}
          initialReceiverName={authUser?.fullName ?? ""}
          initialReceiverPhone={authUser?.phone ?? ""}
          isSaving={createMutation.isPending || updateMutation.isPending}
          onClose={() => {
            setEditingAddress(null);
            setIsCreating(false);
          }}
          onSave={saveAddress}
        />
      )}
    </main>
  );
}
