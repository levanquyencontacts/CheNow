"use client";

import { Box, Button, Checkbox, Modal, TextField } from "@/components";
import { useModal } from "@/providers";
import { useInfiniteCategoriesQuery } from "@/services/controllers/categories/CategoriesQueries";
import {
  useCategorySizeQuery,
  useCreateCategorySizeMutation,
  useUpdateCategorySizeMutation,
} from "@/services/controllers/category-sizes/CategorySizesQueries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const sizeCategorySchema = z.object({
  categoryId: z.number(),
  extraPrice: z.number().min(0, "Extra price must be 0 or greater."),
});

const productSizeSchema = z.object({
  categories: z
    .array(sizeCategorySchema)
    .min(1, "Please select at least one category."),
  code: z.string().trim().min(1, "Size code is required."),
  name: z.string().trim().min(1, "Size name is required."),
});

type ProductSizeForm = z.infer<typeof productSizeSchema>;

const defaultValues: ProductSizeForm = {
  categories: [],
  code: "",
  name: "",
};

interface ProductSizeModalProps {
  sizeId?: number;
}

export function ProductSizeModal({ sizeId }: ProductSizeModalProps) {
  const { closeModal, openModal } = useModal();
  const isUpdateMode = Boolean(sizeId);
  const { data: sizeDetail, isLoading: isLoadingDetail } =
    useCategorySizeQuery(sizeId);
  const { mutate: createSize, isPending: isCreating } =
    useCreateCategorySizeMutation();
  const { mutate: updateSize, isPending: isUpdating } =
    useUpdateCategorySizeMutation();
  const isSaving = isCreating || isUpdating;
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
  } = useForm<ProductSizeForm>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(productSizeSchema),
  });
  const selectedCategories = useWatch({ control, name: "categories" });
  const watchedCode = useWatch({ control, name: "code" });
  const watchedName = useWatch({ control, name: "name" });

  useEffect(() => {
    if (!sizeDetail) {
      return;
    }

    reset({
      categories: sizeDetail.category.map((category) => ({
        categoryId: category.id,
        extraPrice: Number(category.extraPrice),
      })),
      code: sizeDetail.code,
      name: sizeDetail.name,
    });
  }, [reset, sizeDetail]);

  const selectedCategoryIds = selectedCategories.map(
    (category) => category.categoryId,
  );
  const toggleCategory = (categoryId: number) => {
    const isSelected = selectedCategoryIds.includes(categoryId);
    const nextCategories = isSelected
      ? selectedCategories.filter(
          (category) => category.categoryId !== categoryId,
        )
      : [...selectedCategories, { categoryId, extraPrice: 0 }];

    setValue("categories", nextCategories, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const updateCategoryExtraPrice = (categoryId: number, extraPrice: number) => {
    setValue(
      "categories",
      selectedCategories.map((category) =>
        category.categoryId === categoryId
          ? { ...category, extraPrice }
          : category,
      ),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const submitProductSize = ({ categories, code, name }: ProductSizeForm) => {
    const payload = {
      categories,
      code: code.trim(),
      name: name.trim(),
    };

    if (sizeId) {
      updateSize({ id: sizeId, ...payload }, { onSuccess: closeModal });
      return;
    }

    createSize(payload, { onSuccess: closeModal });
  };

  const openDeleteSizeModal = () => {
    if (!sizeId) {
      return;
    }

    openModal("DELETE_PRODUCT_SIZE", {
      sizeId,
      sizeName: watchedName || sizeDetail?.name,
    });
  };

  return (
    <Modal
      className="max-w-[960px] rounded-md bg-[#fff8f1]"
      closeTitle="Close size modal"
      onClose={closeModal}
      size="lg"
    >
      <form
        className="flex h-full min-h-0 flex-col overflow-hidden bg-[#fff8f1]"
        noValidate
        onSubmit={handleSubmit(submitProductSize)}
      >
        <Box className="shrink-0 border-b border-[#eadfd4] bg-[#fff8f1] px-8 pb-4 pt-7">
          <Box className="flex items-start justify-between gap-4 pr-10">
            <Box className="border-l-2 border-[#183d2b] pl-4">
              <Modal.Title className="mb-1 min-h-0 text-xl font-semibold text-[#183d2b]">
                {isUpdateMode ? "Chi tiet kich co" : "Them kich co"}
              </Modal.Title>
              <p className="text-xs text-[#31483a]">
                {isUpdateMode
                  ? "Chinh sua thong tin va danh muc ap dung cho kich co san pham."
                  : "Tao kich co moi va thiet lap gia them theo tung danh muc."}
              </p>
            </Box>
          </Box>
        </Box>

        <Box className="min-h-0 flex-1 px-8 pb-7 pt-5">
          <Box className="grid h-full min-h-0 gap-5 lg:grid-cols-[minmax(0,1fr)_190px]">
            <Box className="flex min-h-0 flex-col rounded-lg border border-[#d8d0c5] bg-white/72 p-6">
              <Box className="grid gap-5 sm:grid-cols-2">
                <TextField
                  disabled={isLoadingDetail}
                  error={Boolean(errors.name)}
                  fullWidth
                  helperText={errors.name?.message}
                  label="Ten kich co"
                  placeholder="Nho (Small)"
                  {...register("name")}
                />

                <TextField
                  disabled={isLoadingDetail}
                  error={Boolean(errors.code)}
                  fullWidth
                  helperText={errors.code?.message}
                  label="Ma kich co"
                  placeholder="S"
                  {...register("code")}
                />
              </Box>

              <Box className="mt-6 flex min-h-0 flex-1 flex-col">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5c554c]">
                  Danh muc ap dung
                </p>
                <Box className="min-h-0 flex-1 overflow-y-auto rounded-md border border-[#d8d0c5]">
                  {isLoadingCategories ? (
                    <Box className="p-4 text-xs text-[#6f665c]">
                      Loading categories...
                    </Box>
                  ) : null}

                  {!isLoadingCategories && categories.length === 0 ? (
                    <Box className="p-4 text-xs text-[#6f665c]">
                      No categories found.
                    </Box>
                  ) : null}

                  {categories.map((category) => {
                    const selectedCategory = selectedCategories.find(
                      (item) => item.categoryId === category.id,
                    );
                    const isSelected = Boolean(selectedCategory);

                    return (
                      <Box
                        className={`grid min-h-14 grid-cols-[minmax(0,1fr)_120px] items-center gap-3 border-b border-[#d8d0c5] p-3 ${
                          isSelected ? "bg-[#edf5ed]" : "bg-white/58"
                        }`}
                        key={category.id}
                      >
                        <label className="flex min-w-0 cursor-pointer items-center gap-2">
                          <Checkbox
                            checked={isSelected}
                            disabled={isLoadingDetail}
                            onChange={() => toggleCategory(category.id)}
                          />
                          <span className="truncate text-xs font-semibold uppercase leading-4 text-[#183d2b]">
                            {category.categoryName}
                          </span>
                        </label>

                        <input
                          className="h-8 w-full rounded-md border border-[#d8d0c5] bg-white px-3 text-right text-sm font-semibold text-[#183d2b] outline-none transition placeholder:text-[#b7a89a] focus:border-[#183d2b] disabled:cursor-not-allowed disabled:bg-[#f5f0e9] disabled:text-[#a09183]"
                          disabled={!isSelected || isLoadingDetail}
                          inputMode="numeric"
                          onChange={(event) =>
                            updateCategoryExtraPrice(
                              category.id,
                              Number(event.target.value),
                            )
                          }
                          placeholder="0"
                          step="0.01"
                          type="number"
                          value={selectedCategory?.extraPrice ?? 0}
                        />
                      </Box>
                    );
                  })}
                </Box>

                {hasNextPage ? (
                  <Button
                    className="mt-3 h-8 rounded-md px-3 text-xs text-[#183d2b]"
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                    type="button"
                    variant="text"
                  >
                    {isFetchingNextPage ? "Loading..." : "Load more categories"}
                  </Button>
                ) : null}

                {errors.categories?.message ? (
                  <p className="mt-2 text-xs text-red-700">
                    {errors.categories.message}
                  </p>
                ) : null}
              </Box>
            </Box>

            <Box className="self-start flex flex-col gap-2">
              <span className="mb-1 text-center text-[11px] text-[#5c554c]">
                {isUpdateMode ? "Dang chinh sua" : "Dang tao moi"}
              </span>
              <Button
                className="h-10 rounded-md bg-[#183d2b] text-xs font-semibold text-white hover:bg-[#102f21]"
                disabled={!isValid || !isDirty || isSaving}
                type="submit"
              >
                {isSaving
                  ? isUpdateMode
                    ? "Dang luu..."
                    : "Dang tao..."
                  : isUpdateMode
                    ? "Luu thay doi"
                    : "Them kich co"}
              </Button>
              <Button
                className="h-10 rounded-md border-[#b9b0a5] bg-white text-xs font-semibold text-[#183d2b]"
                disabled={isSaving}
                onClick={closeModal}
                type="button"
                variant="outlined"
              >
                Huy bo
              </Button>

              <Box className="mt-2 rounded-lg bg-white/70 p-4 shadow-[0_6px_14px_rgba(47,35,22,0.04)]">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5c554c]">
                  Xem truoc
                </p>
                <PreviewRow label="Ten" value={watchedName || "-"} />
                <PreviewRow label="Ma" value={watchedCode || "-"} />
                <PreviewRow
                  label="Danh muc"
                  value={`${selectedCategories.length} danh muc`}
                />
              </Box>

              {isUpdateMode ? (
                <Button
                  className="h-10 rounded-md px-3 text-xs font-semibold"
                  disabled={isSaving}
                  onClick={openDeleteSizeModal}
                  type="button"
                  variant="delete"
                >
                  Delete size
                </Button>
              ) : null}
            </Box>
          </Box>
        </Box>
      </form>
    </Modal>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <Box className="mb-1.5 flex items-center justify-between gap-3 text-xs">
      <span className="text-[#5c554c]">{label}</span>
      <span className="max-w-24 truncate text-right font-semibold text-[#183d2b]">
        {value}
      </span>
    </Box>
  );
}
