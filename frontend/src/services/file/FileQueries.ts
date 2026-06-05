"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "@/services/apiServices";

export const useUploadImageMutation = () =>
    useMutation({
        mutationFn: api.file.uploadImage,
        onError: () => {
            toast.error("Cannot upload image.");
        },
    });
