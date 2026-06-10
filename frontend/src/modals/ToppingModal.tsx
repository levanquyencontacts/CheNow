"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Box, Button, Checkbox, Modal, TextField, UploadImage } from "@/components";
import { useModal } from "@/providers";
import { useInfiniteCategoriesQuery } from "@/services/controllers/categories/CategoriesQueries";
import {
  useCreateToppingMutation,
  useToppingQuery,
  useUpdateToppingMutation,
} from "@/services/controllers/toppings/ToppingsQueries";
import { useUploadImageMutation } from "@/services/file/FileQueries";

const toppingSchema = z.object({
  categoryIds: z.array(z.number()).min(1, "Please select at least one category."),
  description: z.string().trim().optional(),
  imageUrl: z.string().nullable(),
  name: z.string().trim().min(1, "Topping name is required."),
  price: z.number().min(0, "Price must be 0 or greater."),
});

type ToppingForm = z.infer<typeof toppingSchema>;

const defaultValues: ToppingForm = {
  categoryIds: [],
  description: "",
  imageUrl: null,
  name: "",
  price: 0,
};

interface ToppingModalProps {
  toppingId?: number;
}

export function ToppingModal({ toppingId }: ToppingModalProps) {
  const { closeModal } = useModal();
  const isUpdateMode = Boolean(toppingId);
  const { data: toppingDetail, isLoading: isLoadingDetail } =
    useToppingQuery(toppingId);
  const { mutate: createTopping, isPending: isCreating } =
    useCreateToppingMutation();
  const { mutate: updateTopping, isPending: isUpdating } =
    useUpdateToppingMutation();
  const { mutateAsync: uploadImage, isPending: isUploadingImage } =
    useUploadImageMutation();
  const isSaving = isCreating || isUpdating || isUploadingImage;
  const {
    data: categoriesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingCategories,
  } = useInfiniteCategoriesQuery({
    limit: 10,
    order: "ASC",
  });
  const categories = categoriesData?.pages.flatMap((page) => page.data) ?? [];
  const {
    formState: { errors, isDirty, isValid },
    control,
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<ToppingForm>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(toppingSchema),
  });
  const categoryIds = useWatch({ control, name: "categoryIds" });
  const imageUrl = useWatch({ control, name: "imageUrl" });

  useEffect(() => {
    if (!toppingDetail) {
      return;
    }

    reset({
      categoryIds: toppingDetail.categoryIds,
      description: toppingDetail.description ?? "",
      imageUrl: toppingDetail.imageUrl ?? null,
      name: toppingDetail.name,
      price: Number(toppingDetail.price),
    });
  }, [reset, toppingDetail]);

  const handleImageChange = async (file: File | null) => {
    if (!file) {
      setValue("imageUrl", null, {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }

    const fileName = await uploadImage(file);
    setValue("imageUrl", fileName, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const toggleCategory = (categoryId: number) => {
    const nextCategoryIds = categoryIds.includes(categoryId)
      ? categoryIds.filter((id) => id !== categoryId)
      : [...categoryIds, categoryId];

    setValue("categoryIds", nextCategoryIds, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const submitTopping = ({
    categoryIds,
    description,
    imageUrl,
    name,
    price,
  }: ToppingForm) => {
    const payload = {
      categoryIds,
      description: description?.trim() || null,
      imageUrl,
      name: name.trim(),
      price,
    };

    if (toppingId) {
      updateTopping({ id: toppingId, ...payload }, { onSuccess: closeModal });
      return;
    }

    createTopping(payload, { onSuccess: closeModal });
  };

  return (
    <Modal
      className="max-w-[880px] rounded-md"
      closeTitle="Close topping modal"
      onClose={closeModal}
    >
      <form
        className="flex min-h-[560px] flex-col"
        noValidate
        onSubmit={handleSubmit(submitTopping)}
      >
        <Box className="px-8 pb-7 pt-7">
          <Modal.Title className="mb-1 min-h-0 text-xl font-semibold">
            {isUpdateMode ? "Update Topping" : "Topping Details"}
          </Modal.Title>
          <p className="mb-8 text-xs text-[#4d5b4f]">
            Manage and update extra ingredients for your menu.
          </p>

          <Box className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
            <Box className="rounded-md border border-[#eadfd4] bg-white/70 p-7">
              <Box className="grid gap-6 sm:grid-cols-2">
                <TextField
                  className="pr-0"
                  disabled={isLoadingDetail}
                  error={Boolean(errors.name)}
                  fullWidth
                  helperText={errors.name?.message}
                  label="Topping Name"
                  placeholder="Example: Hat sen duong phen"
                  variant="standard"
                  {...register("name")}
                />

                <TextField
                  className="pr-0"
                  disabled={isLoadingDetail}
                  endAdornment={<span className="text-xs font-semibold">d</span>}
                  error={Boolean(errors.price)}
                  fullWidth
                  helperText={errors.price?.message}
                  inputMode="numeric"
                  label="Price (VND)"
                  placeholder="15000"
                  type="number"
                  variant="standard"
                  {...register("price", { valueAsNumber: true })}
                />
              </Box>

              <Box className="mt-6">
                <p className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#906544]">
                  Categories
                </p>
                <Box className="max-h-32 overflow-y-auto rounded-md border border-[#eadfd4] bg-[#fffaf5] p-3">
                  {isLoadingCategories ? (
                    <p className="text-xs text-[#786f62]">Loading categories...</p>
                  ) : null}

                  {!isLoadingCategories && categories.length === 0 ? (
                    <p className="text-xs text-[#786f62]">No categories found.</p>
                  ) : null}

                  <Box className="grid gap-2 sm:grid-cols-2">
                    {categories.map((category) => (
                      <label
                        className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#3b4139]"
                        key={category.id}
                      >
                        <Checkbox
                          checked={categoryIds.includes(category.id)}
                          disabled={isLoadingDetail}
                          onChange={() => toggleCategory(category.id)}
                        />
                        {category.categoryName}
                      </label>
                    ))}
                  </Box>

                  {hasNextPage ? (
                    <Button
                      className="mt-3 h-8 rounded-sm px-3 text-xs"
                      disabled={isFetchingNextPage}
                      onClick={() => fetchNextPage()}
                      type="button"
                      variant="text"
                    >
                      {isFetchingNextPage ? "Loading..." : "Load more"}
                    </Button>
                  ) : null}
                </Box>
                {errors.categoryIds?.message ? (
                  <p className="mt-2 text-xs text-red-700">
                    {errors.categoryIds.message}
                  </p>
                ) : null}
              </Box>

              <label className="mt-6 block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#906544]">
                  Description
                </span>
                <textarea
                  className="min-h-28 w-full resize-none rounded-md border border-[#c9c2b7] bg-transparent px-3 py-3 text-sm text-[#3b4139] outline-none transition placeholder:text-[#b7b1a9] focus:border-[#234535]"
                  disabled={isLoadingDetail}
                  placeholder="Describe flavor, usage, and notes..."
                  {...register("description")}
                />
              </label>
            </Box>

            <Box className="rounded-md border border-[#eadfd4] bg-white/70 p-5">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#906544]">
                Illustration Image
              </p>
              <UploadImage
                aspectRatio={1}
                disabled={isLoadingDetail || isUploadingImage}
                helperText={
                  isUploadingImage
                    ? "Uploading image..."
                    : "PNG, JPG or WebP, maximum 5 MB."
                }
                onChange={handleImageChange}
                previewType="thumbnails"
                value={imageUrl}
              />
            </Box>
          </Box>
        </Box>

        <Modal.BottomButtons className="mt-auto justify-end gap-3 px-8 pb-8">
          <Button
            className="h-10 min-w-36 rounded-md border-[#b98f70] bg-white px-5 text-xs font-semibold text-[#8b4b25]"
            disabled={isSaving}
            onClick={closeModal}
            type="button"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            className="h-10 min-w-36 rounded-md bg-[#183d2b] px-5 text-xs font-semibold text-white hover:bg-[#102f21]"
            disabled={!isValid || !isDirty || isSaving}
            type="submit"
          >
            {isSaving
              ? isUpdateMode
                ? "Updating..."
                : "Saving..."
              : isUpdateMode
                ? "Update Information"
                : "Save Information"}
          </Button>
        </Modal.BottomButtons>
      </form>
    </Modal>
  );
}
