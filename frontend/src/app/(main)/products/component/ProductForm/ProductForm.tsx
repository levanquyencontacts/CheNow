"use client";

import { Box, Button, TextArea, TextInput } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInfiniteCategoriesQuery } from "@/services/controllers/categories/CategoriesQueries";
import { useUploadImageMutation } from "@/services/file/FileQueries";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { SideBarProduct } from "../SideBarProduct";

const productSchema = z.object({
  categoryId: z.string().min(1, "Please select a category."),
  description: z.string().trim().optional(),
  price: z
    .string()
    .trim()
    .min(1, "Please enter a price.")
    .refine((value) => {
      const price = Number(value);
      return Number.isFinite(price) && price > 0;
    }, "Price must be greater than 0."),
  productName: z.string().trim().min(1, "Please enter a product name."),
  status: z.enum(["active", "inactive"]),
  quantity: z.number().min(0, "Quantity must be 0 or greater."),
  minQuantity: z.number().min(0, "Minimum quantity must be 0 or greater."),
  imageUrl: z.string().nullable(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export interface ProductSubmitPayload {
  categoryId: number;
  description: string | null;
  imageUrl: string | null;
  minQuantity: number;
  price: number;
  productName: string;
  quantity: number;
}

interface ProductFormProps {
  deleteAction?: ReactNode;
  defaultValues?: ProductFormValues;
  isLoading?: boolean;
  isSaving?: boolean;
  mode: "create" | "edit";
  onSubmit: (payload: ProductSubmitPayload) => Promise<void> | void;
}

const emptyValues: ProductFormValues = {
  categoryId: "",
  description: "",
  price: "",
  productName: "",
  status: "active",
  quantity: 0,
  minQuantity: 0,
  imageUrl: null,
};

export function ProductForm({
  deleteAction,
  defaultValues = emptyValues,
  isLoading = false,
  isSaving = false,
  mode,
  onSubmit,
}: ProductFormProps) {
  const router = useRouter();
  const {
    formState: { errors, isDirty, isValid },
    control,
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<ProductFormValues>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(productSchema),
  });
  const categoryId = useWatch({ control, name: "categoryId" });
  const status = useWatch({ control, name: "status" });
  const productImage = useWatch({ control, name: "imageUrl" });
  const isActive = status === "active";

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const {
    data: categoriesData,
    fetchNextPage: fetchNextCategoriesPage,
    hasNextPage: hasMoreCategories,
    isFetchingNextPage: isFetchingMoreCategories,
    isLoading: isLoadingCategories,
  } = useInfiniteCategoriesQuery({
    limit: 10,
    order: "ASC",
  });
  const categories = categoriesData?.pages.flatMap((page) => page.data) ?? [];

  const { mutateAsync: uploadImage, isPending: isUploadingImage } =
    useUploadImageMutation();
  const isSubmitting = isSaving || isUploadingImage;
  const canSave = mode === "create" ? isValid : isValid && isDirty;
  const title = mode === "create" ? "Add New Product" : "Edit Product";
  const submitLabel = mode === "create" ? "Save Product" : "Update Product";
  const submittingLabel = mode === "create" ? "Saving..." : "Updating...";

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

  const submitProduct = async (values: ProductFormValues) => {
    await onSubmit({
      categoryId: Number(values.categoryId),
      productName: values.productName.trim(),
      price: Number(values.price),
      quantity: values.quantity,
      minQuantity: values.minQuantity,
      imageUrl: values.imageUrl,
      description: values.description?.trim() || null,
    });
  };
  return (
    <form
      className="min-h-full bg-white px-4 py-8 text-[#143d2a] sm:px-6 lg:px-8"
      noValidate
      onSubmit={handleSubmit(submitProduct)}
    >
      <Box className="mx-auto w-full max-w-6xl">
        <Box className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Box>
            <Button
              className="mb-3 h-auto cursor-pointer gap-1 rounded-none px-0 py-0 text-xs font-semibold text-[#335a45] hover:bg-transparent hover:text-[#183d2b]"
              onClick={() => router.back()}
              type="button"
              variant="text"
            >
              <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5" />
              Back
            </Button>
            <h1 className="text-2xl font-semibold text-[#183d2b]">{title}</h1>
          </Box>

          <Box className="flex items-center gap-3">
            {deleteAction}
            <Button
              className="h-9 rounded-sm border-[#bfa58e] bg-white px-8 text-xs font-semibold text-[#765a45] hover:bg-[#fff8f1]"
              disabled={isSubmitting}
              onClick={() => router.back()}
              type="button"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              className="h-9 rounded-sm bg-[#183d2b] px-8 text-xs font-semibold text-white hover:bg-[#102f21]"
              disabled={!canSave || isSubmitting || isLoading}
              type="submit"
            >
              {isSubmitting ? submittingLabel : submitLabel}
            </Button>
          </Box>
        </Box>

        <Box className="grid gap-6 lg:grid-cols-[330px_minmax(0,1fr)]">
          <SideBarProduct
            categories={categories}
            categoryId={categoryId}
            hasMoreCategories={hasMoreCategories}
            isActive={isActive}
            isFetchingMoreCategories={isFetchingMoreCategories}
            isLoadingCategories={isLoadingCategories || isLoading}
            onActiveChange={(checked) =>
              setValue("status", checked ? "active" : "inactive", {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            onCategoryChange={(nextCategoryId) =>
              setValue("categoryId", nextCategoryId, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            onImageChange={handleImageChange}
            onLoadMoreCategories={() => fetchNextCategoriesPage()}
            productImage={productImage}
          />

          <Box className="flex flex-col gap-6">
            <Box className="rounded-lg border border-[#eadfd4] bg-[#fff8f3] p-7">
              <h2 className="mb-6 text-base font-semibold text-[#183d2b]">
                Basic Information
              </h2>

              <Box className="flex flex-col gap-5">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-[#4c3d31]">
                    Product Name
                  </span>
                  <TextInput
                    className="h-11 rounded-none border-0 placeholder:text-[#c5bab0] focus:ring-2 focus:ring-[#183d2b]/20"
                    invalid={Boolean(errors.productName)}
                    placeholder="Example: Lotus Seed Longan Dessert"
                    readOnly={isLoading}
                    {...register("productName")}
                  />
                  {errors.productName?.message ? (
                    <p className="mt-2 text-xs text-red-700">
                      {errors.productName.message}
                    </p>
                  ) : null}
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-[#4c3d31]">
                    Product Description
                  </span>
                  <TextArea
                    className="min-h-24 w-full resize-none border-0 bg-white px-4 py-3 text-sm text-[#183d2b] outline-none placeholder:text-[#c5bab0] focus:ring-2 focus:ring-[#183d2b]/20"
                    disabled={isLoading}
                    minRows={4}
                    placeholder="Describe flavor, ingredients, and notes..."
                    {...register("description")}
                  />
                </label>
              </Box>
            </Box>

            <Box className="rounded-lg border border-[#eadfd4] bg-[#fff8f3] p-7">
              <h2 className="mb-6 text-base font-semibold text-[#183d2b]">
                Price & Stock
              </h2>

              <Box className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-[#4c3d31]">
                    Price (VND)
                  </span>
                  <TextInput
                    className="h-11 rounded-none border-0 placeholder:text-[#c5bab0] focus:ring-2 focus:ring-[#183d2b]/20"
                    inputMode="decimal"
                    invalid={Boolean(errors.price)}
                    placeholder="0"
                    readOnly={isLoading}
                    {...register("price")}
                  />
                  {errors.price?.message ? (
                    <p className="mt-2 text-xs text-red-700">
                      {errors.price.message}
                    </p>
                  ) : null}
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-[#4c3d31]">
                    Stock Quantity
                  </span>
                  <TextInput
                    className="h-11 rounded-none border-0 placeholder:text-[#c5bab0] focus:ring-2 focus:ring-[#183d2b]/20"
                    inputMode="numeric"
                    invalid={Boolean(errors.quantity)}
                    placeholder="0"
                    readOnly={isLoading}
                    {...register("quantity", { valueAsNumber: true })}
                  />
                  {errors.quantity?.message ? (
                    <p className="mt-2 text-xs text-red-700">
                      {errors.quantity.message}
                    </p>
                  ) : null}
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-[#4c3d31]">
                    Minimum Stock Quantity
                  </span>
                  <TextInput
                    className="h-11 rounded-none border-0 placeholder:text-[#c5bab0] focus:ring-2 focus:ring-[#183d2b]/20"
                    inputMode="numeric"
                    invalid={Boolean(errors.minQuantity)}
                    placeholder="0"
                    readOnly={isLoading}
                    {...register("minQuantity", { valueAsNumber: true })}
                  />
                  {errors.minQuantity?.message ? (
                    <p className="mt-2 text-xs text-red-700">
                      {errors.minQuantity.message}
                    </p>
                  ) : null}
                </label>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </form>
  );
}
