"use client";

import { LIMIT_PAGE, LIMIT_PAGE_ARRAY } from "@/common/utils/constant";
import { Box, Button, PageHeader, TablePagination } from "@/components";
import { useModal } from "@/providers";
import {
  useCategorySizesQuery,
  useDeleteCategorySizeMutation,
} from "@/services/controllers/category-sizes/CategorySizesQueries";
import { useInfiniteCategoriesQuery } from "@/services/controllers/categories/CategoriesQueries";
import { CirclePlus } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductSizeCard } from "./components/ProductSizeCard";
import { ProductSizeFilters } from "./filter/ProductSizeFilters";

export default function ProductSize() {
  const { openModal } = useModal();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(LIMIT_PAGE);
  const [searchValue, setSearchValue] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const { mutate: deleteCategorySize } = useDeleteCategorySizeMutation();

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      order: "ASC" as const,
      searchValue,
      categoryId: categoryId ? Number(categoryId) : undefined,
    }),
    [categoryId, limit, page, searchValue]
  );

  const { data, isError, isLoading } = useCategorySizesQuery(queryParams);
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
  const sizes = data?.data ?? [];
  const pagination = data?.metadata.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  return (
    <>
      <PageHeader title="Size" searchPlaceholder="Search size..." />

      <Box className="min-h-full bg-[#fff8f1] px-4 py-4 text-[#143d2a] sm:px-6 lg:px-8">
        <Box className="mx-auto flex w-full max-w-7xl flex-col gap-4">
          <Box className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Box>
              <h1 className="text-2xl font-semibold tracking-normal text-[#183d2b]">
                Size Management
              </h1>
              <p className="mt-0.5 max-w-xl text-xs leading-5 text-[#4d5b4f]">
                Define size names, short codes, and category-specific extra
                price adjustments.
              </p>
            </Box>

            <Button
              className="h-9 w-fit rounded-md bg-[#183d2b] px-4 text-xs font-semibold text-white shadow-[0_6px_12px_rgba(24,61,43,0.14)] hover:bg-[#102f21]"
              onClick={() => openModal("PRODUCT_SIZE")}
            >
              <CirclePlus aria-hidden="true" className="h-3.5 w-3.5" />
              Add Size
            </Button>
          </Box>

          <ProductSizeFilters
            categories={categories}
            categoryValue={categoryId}
            hasMoreCategories={hasMoreCategories}
            isFetchingMoreCategories={isFetchingMoreCategories}
            isLoadingCategories={isLoadingCategories}
            onCategoryChange={(nextCategoryId) => {
              setCategoryId(nextCategoryId);
              setPage(1);
            }}
            onLoadMoreCategories={() => fetchNextCategoriesPage()}
            onReset={() => {
              setSearchValue("");
              setCategoryId("");
              setPage(1);
            }}
            onSearchChange={(nextSearchValue) => {
              setSearchValue(nextSearchValue);
              setPage(1);
            }}
            searchValue={searchValue}
          />

        {isLoading ? (
          <Box className="rounded-lg border border-[#ded8ce] bg-white/75 p-6 text-sm text-[#6f665c]">
            Loading sizes...
          </Box>
        ) : null}

        {isError ? (
          <Box className="rounded-lg border border-[#f0c8c5] bg-[#fff2ef] p-6 text-sm text-[#b12f1d]">
            Cannot load sizes.
          </Box>
        ) : null}

        {!isLoading && !isError && sizes.length === 0 ? (
          <Box className="rounded-lg border border-[#ded8ce] bg-white/75 p-6 text-sm text-[#6f665c]">
            No sizes found.
          </Box>
        ) : null}

        {!isLoading && !isError && sizes.length > 0 ? (
          <Box className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sizes.map((size) => (
              <ProductSizeCard
                key={size.id}
                onDelete={(sizeId) => deleteCategorySize(sizeId)}
                onEdit={(sizeId) => openModal("PRODUCT_SIZE", { sizeId })}
                size={size}
              />
            ))}
          </Box>
        ) : null}

        <Box className="overflow-hidden rounded-lg border border-[#ded8ce] bg-white/90">
          <TablePagination
            count={totalPages}
            disabled={isLoading}
            limit={pagination?.limit ?? limit}
            onLimitChange={(nextLimit) => {
              setLimit(nextLimit);
              setPage(1);
            }}
            onPageChange={setPage}
            page={page}
            rowsPerPageOptions={LIMIT_PAGE_ARRAY}
            total={pagination?.total ?? 0}
          />
        </Box>
        </Box>
      </Box>
    </>
  );
}
