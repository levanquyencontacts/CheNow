import api from "@/services/apiServices";
import type {
  CreateAddressPayload,
  UpdateAddressPayload,
  UserAddress,
} from "@/services/types/apiType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const addressesQueryKey = ["customer-addresses"] as const;

const sortAddresses = (addresses: UserAddress[]) =>
  [...addresses].sort(
    (left, right) =>
      Number(right.isDefault) - Number(left.isDefault) || left.id - right.id,
  );

export const useAddressesQuery = () =>
  useQuery({
    queryKey: addressesQueryKey,
    queryFn: () => api.addresses.getAddresses(),
  });

export const useCreateAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAddressPayload) =>
      api.addresses.createAddress(payload),
    onSuccess: (created) => {
      queryClient.setQueryData<UserAddress[]>(
        addressesQueryKey,
        (current = []) =>
          sortAddresses([
            ...current.map((address) =>
              created.isDefault ? { ...address, isDefault: false } : address,
            ),
            created,
          ]),
      );
      void queryClient.invalidateQueries({ queryKey: addressesQueryKey });
      toast.success("Đã thêm địa chỉ.");
    },
    onError: () => {
      toast.error("Không thể thêm địa chỉ.");
    },
  });
};

export const useUpdateAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAddressPayload) =>
      api.addresses.updateAddress(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData<UserAddress[]>(
        addressesQueryKey,
        (current = []) =>
          sortAddresses(
            current.map((address) =>
              address.id === updated.id ? updated : address,
            ),
          ),
      );
      void queryClient.invalidateQueries({ queryKey: addressesQueryKey });
      toast.success("Đã cập nhật địa chỉ.");
    },
    onError: () => {
      toast.error("Không thể cập nhật địa chỉ.");
    },
  });
};

export const useDeleteAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.addresses.deleteAddress(id),
    onSuccess: (result, deletedId) => {
      queryClient.setQueryData<UserAddress[]>(
        addressesQueryKey,
        (current = []) =>
          sortAddresses(
            current
              .filter((address) => address.id !== deletedId)
              .map((address) => ({
                ...address,
                isDefault:
                  result.defaultAddressId === null
                    ? address.isDefault
                    : address.id === result.defaultAddressId,
              })),
          ),
      );
      void queryClient.invalidateQueries({ queryKey: addressesQueryKey });
      toast.success("Đã xóa địa chỉ.");
    },
    onError: () => {
      toast.error("Không thể xóa địa chỉ.");
    },
  });
};

export const useSetDefaultAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.addresses.setDefaultAddress(id),
    onSuccess: (updated) => {
      queryClient.setQueryData<UserAddress[]>(
        addressesQueryKey,
        (current = []) =>
          sortAddresses(
            current.map((address) => ({
              ...address,
              isDefault: address.id === updated.id,
            })),
          ),
      );
      void queryClient.invalidateQueries({ queryKey: addressesQueryKey });
      toast.success("Đã đặt làm địa chỉ mặc định.");
    },
    onError: () => {
      toast.error("Không thể đặt địa chỉ mặc định.");
    },
  });
};
