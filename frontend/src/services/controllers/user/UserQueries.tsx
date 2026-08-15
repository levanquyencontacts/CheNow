"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "@/services/apiServices";
import { setUser } from "@/services/controllers/auth/AuthSlice";
import store from "@/services/store";
import type { AuthUser } from "@/services/types/apiType";


export const useMeQuery = () =>
  useQuery({
    queryKey: ['me'],
    queryFn: api.user.getMe,
  });

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.user.updateMe,
    onSuccess: (user: AuthUser) => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      store.dispatch(setUser(user));
      toast.success("Cap nhat thong tin thanh cong.");
    },
    onError: () => {
      toast.error("Khong the cap nhat thong tin.");
    },
  });
};

export const useUploadUserImageMutation = () =>
  useMutation({
    mutationFn: api.user.uploadImage,
    onError: () => {
      toast.error("Khong the tai anh len.");
    },
  });
