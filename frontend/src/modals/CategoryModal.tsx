"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Box, Button, Modal, TextField } from "@/components";
import { useModal } from "@/providers";
import {
  useCategoryQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "@/services/controllers/categories/CategoriesQueries";

interface CategoryModalProps {
  categoryId?: number;
}

const categorySchema = z.object({
  categoryName: z.string().trim().min(1, "Category name is required."),
  description: z.string().trim().optional(),
  status: z.enum(["active", "inactive"]),
});

type CategoryForm = z.infer<typeof categorySchema>;

const defaultValues: CategoryForm = {
  categoryName: "",
  description: "",
  status: "active",
};

export function CategoryModal({ categoryId }: CategoryModalProps) {
  const { closeModal } = useModal();
  const isUpdateMode = Boolean(categoryId);
  const { data: categoryDetail, isLoading: isLoadingDetail } =
    useCategoryQuery(categoryId);
  const { mutate: createCategory, isPending: isCreating } = useCreateCategoryMutation();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategoryMutation();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategoryMutation();
  const isSaving =
    isCreating ||
    isDeleting ||
    isUpdating;
  const {
    formState: { errors, isValid, isDirty },
    control,
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<CategoryForm>({
    defaultValues,
    resolver: zodResolver(categorySchema),
  });
  const status = useWatch({ control, name: "status" });
  const isActive = status === "active";

  useEffect(() => {
    if (!categoryDetail) {
      return;
    }

    reset({
      categoryName: categoryDetail.categoryName,
      description: categoryDetail.description ?? "",
      status: categoryDetail.status === "active" ? "active" : "inactive",
    });
  }, [categoryDetail, reset]);

  const submitCategory = ({ categoryName, description, status }: CategoryForm) => {
    const payload = {
      categoryName,
      description: description ?? "",
      status,
    };

    if (categoryId) {
      updateCategory(
        { id: categoryId, ...payload },
        { onSuccess: closeModal }
      );
      return;
    }

    createCategory(payload, { onSuccess: closeModal });
  };

  const handleDeleteCategory = () => {
    if (!categoryId) {
      return;
    }

    deleteCategory(categoryId, { onSuccess: closeModal });
  };

  return (
    <Modal
      className="max-w-[620px] rounded-md"
      closeTitle="Close category modal"
      onClose={closeModal}
    >
      <form
        className="flex min-h-[420px] flex-col"
        noValidate
        onSubmit={handleSubmit(submitCategory)}
      >
        <Box className="px-7 pb-6 pt-6">
          <Modal.Title className="mb-5 min-h-0 text-base font-semibold">
            {isUpdateMode ? "Update Category" : "Add New Category"}
          </Modal.Title>

          <Box className="flex flex-col gap-5">
            <TextField
              disabled={isLoadingDetail}
              error={Boolean(errors.categoryName)}
              fullWidth
              helperText={errors.categoryName?.message}
              label="Category Name"
              placeholder="Example: Fruit Tea"
              required
              {...register("categoryName")}
            />

            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#906544]">
                Description
              </span>
              <textarea
                className="min-h-24 w-full resize-none rounded-md border border-[#c9c2b7] bg-transparent px-3 py-3 text-sm text-[#3b4139] outline-none transition placeholder:text-[#b7b1a9] focus:border-[#234535] disabled:cursor-not-allowed disabled:bg-[#f5eee7] disabled:text-[#a09183]"
                disabled={isLoadingDetail}
                placeholder="Short description for this product group..."
                {...register("description")}
              />
            </label>

            <Box className="flex items-center justify-between py-1">
              <Box>
                <p className="text-sm font-semibold text-[#3b4139]">
                  Activity Status
                </p>
                <p className="mt-0.5 text-xs text-[#6f6256]">
                  {isActive ? "Active" : "Inactive"}
                </p>
              </Box>

              <button
                aria-pressed={isActive}
                className={`relative h-7 w-12 rounded-full transition disabled:cursor-not-allowed disabled:opacity-60 ${isActive ? "bg-[#183d2b]" : "bg-[#d8cbbf]"
                  }`}
                disabled={isLoadingDetail}
                onClick={() =>
                  setValue("status", isActive ? "inactive" : "active", {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                type="button"
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${isActive ? "left-6" : "left-1"
                    }`}
                />
              </button>
            </Box>
          </Box>
        </Box>

        <Modal.BottomButtons className="mt-auto justify-between border-t border-[#eadfd4] bg-[#fff3e8] px-7 py-5">
          <Box>
            {isUpdateMode ? (
              <Button
                className="h-10 rounded-md px-5 text-xs"
                disabled={isSaving}
                onClick={handleDeleteCategory}
                type="button"
                variant="delete"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            ) : null}
          </Box>

          <Box className="flex gap-2.5">
            <Button
              className="h-10 rounded-md px-5 text-xs text-[#6f6256]"
              disabled={isSaving}
              onClick={closeModal}
              type="button"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              className="h-10 rounded-md bg-[#183d2b] px-5 text-xs text-white hover:bg-[#102f21]"
              disabled={!isValid || !isDirty || isSaving}
              type="submit"
            >
              {isSaving
                ? isUpdateMode
                  ? "Updating..."
                  : "Adding..."
                : isUpdateMode
                  ? "Update Category"
                  : "Add Category"}
            </Button>
          </Box>
        </Modal.BottomButtons>
      </form>
    </Modal>
  );
}
