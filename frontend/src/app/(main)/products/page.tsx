"use client";

import { LIMIT_PAGE, LIMIT_PAGE_ARRAY, routes } from "@/common/utils/constant";
import { formatDate } from "@/common/utils/formatDate";
import {
  Box,
  Button,
  Image,
  Table,
  TableActionCell,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@/components";
import { useInfiniteCategoriesQuery } from "@/services/controllers/categories/CategoriesQueries";
import { useProductsQuery } from "@/services/controllers/products/ProductsQueries";
import { PaginationParams } from "@/services/types/apiType";
import { CirclePlus, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductsFilters } from "./filter/ProductsFilters";

/** Format price with Vietnamese đồng currency style */
const formatPrice = (price: number) => price.toLocaleString("vi-VN") + "đ";

/** Truncate text to maxLen characters with ellipsis */
const truncateText = (text: string, maxLen = 50) =>
  text.length > maxLen ? text.slice(0, maxLen) + "…" : text;

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(LIMIT_PAGE);
  const [searchValue, setSearchValue] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const router = useRouter();

  const paginationParams: PaginationParams = {
    page,
    limit,
    order: "ASC",
    searchValue,
    categoryId: categoryId ? Number(categoryId) : undefined,
  };

  const { data, isError, isLoading } = useProductsQuery(paginationParams);
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
  const products = data?.data ?? [];
  const pagination = data?.metadata.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const handleCreateProduct = () => {
    router.push(routes.PRODUCT_CREATE);
  };

  const handleEditProduct = (productId: number) => {
    router.push(routes.PRODUCT_EDIT(productId));
  };

  return (
    <>
      <Box className="bg-[#fff8f1] px-4 py-4 text-[#143d2a] sm:px-6 lg:px-8">
        <Box className="mx-auto flex w-full max-w-7xl flex-col gap-4">
          <Box className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Box>
              <h1 className="text-2xl font-semibold tracking-normal text-[#183d2b]">
                Products
              </h1>
              <p className="mt-0.5 text-xs text-[#4d5b4f]">
                Manage product catalog, prices, categories, and product details.
              </p>
            </Box>

            <Button
              onClick={handleCreateProduct}
              className="h-9 w-fit rounded-md bg-[#183d2b] px-4 text-xs font-semibold text-white shadow-[0_6px_12px_rgba(24,61,43,0.14)] hover:bg-[#102f21]"
            >
              <CirclePlus aria-hidden="true" className="h-3.5 w-3.5" />
              Add Product
            </Button>
          </Box>

          <ProductsFilters
            onReset={() => {
              setSearchValue("");
              setCategoryId("");
              setPage(1);
            }}
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
            onSearchChange={(nextSearchValue) => {
              setSearchValue(nextSearchValue);
              setPage(1);
            }}
            searchValue={searchValue}
          />

          <Box className="flex flex-col rounded-lg border border-[#eadfd4] bg-white/90 shadow-[0_16px_34px_rgba(55,36,20,0.06)]">
            <TableContainer className="bg-white/70">
              <Table
                className="min-w-275 table-fixed text-left text-sm"
                padding="none"
                size="small"
              >
                <TableHead>
                  <TableRow
                    className="h-12 bg-[#fffaf5] text-xs font-semibold uppercase tracking-normal text-[#5c554c] cursor-pointer"
                    style={{ borderBottom: "1px solid #eadfd4" }}
                  >
                    <TableCell
                      style={{
                        width: "7%",
                        padding: "16px",
                        borderBottom: 0,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#5c554c",
                      }}
                    >
                      ID
                    </TableCell>
                    <TableCell
                      style={{
                        width: "22%",
                        padding: "16px 20px",
                        borderBottom: 0,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#5c554c",
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      style={{
                        width: "22%",
                        padding: "16px 20px",
                        borderBottom: 0,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#5c554c",
                      }}
                    >
                      Image
                    </TableCell>
                    <TableCell
                      style={{
                        width: "10%",
                        padding: "16px",
                        borderBottom: 0,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#5c554c",
                      }}
                    >
                      Price
                    </TableCell>
                    <TableCell
                      style={{
                        width: "13%",
                        padding: "16px",
                        borderBottom: 0,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#5c554c",
                      }}
                    >
                      Category
                    </TableCell>
                    <TableCell
                      style={{
                        width: "21%",
                        padding: "16px",
                        borderBottom: 0,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#5c554c",
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      style={{
                        width: "9%",
                        padding: "16px",
                        borderBottom: 0,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#5c554c",
                      }}
                    >
                      Created
                    </TableCell>
                    <TableCell
                      style={{
                        width: "9%",
                        padding: "16px",
                        borderBottom: 0,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#5c554c",
                      }}
                    >
                      Updated
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{
                        width: "6%",
                        padding: "16px",
                        borderBottom: 0,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#5c554c",
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {isLoading ? (
                    <TableRow className="h-20 bg-white/60 text-[#6f665c]">
                      <TableCell
                        colSpan={9}
                        style={{
                          padding: "16px 20px",
                          borderBottom: 0,
                          color: "#6f665c",
                        }}
                      >
                        Loading products...
                      </TableCell>
                    </TableRow>
                  ) : null}

                  {isError ? (
                    <TableRow className="h-20 bg-white/60 text-[#b12f1d]">
                      <TableCell
                        colSpan={9}
                        style={{
                          padding: "16px 20px",
                          borderBottom: 0,
                          color: "#b12f1d",
                        }}
                      >
                        Cannot load products.
                      </TableCell>
                    </TableRow>
                  ) : null}

                  {!isLoading && !isError && products.length === 0 ? (
                    <TableRow className="h-20 bg-white/60 text-[#6f665c]">
                      <TableCell
                        colSpan={9}
                        style={{
                          padding: "16px 20px",
                          borderBottom: 0,
                          color: "#6f665c",
                        }}
                      >
                        No products found.
                      </TableCell>
                    </TableRow>
                  ) : null}

                  {products.map((product) => (
                    <TableRow
                      className="group h-20 bg-white/60 text-[#153c2a] transition hover:bg-[#fff8f1]"
                      key={product.id}
                      style={{ borderBottom: "1px solid #eadfd4" }}
                      onClick={() => handleEditProduct(product.id)}
                    >
                      <TableCell
                        className="font-medium"
                        style={{
                          padding: "16px",
                          borderBottom: 0,
                          color: "#21372b",
                        }}
                      >
                        {product.id}
                      </TableCell>
                      <TableCell>
                        <Box>{product.productName}</Box>
                      </TableCell>
                      <TableCell
                        style={{ padding: "16px 20px", borderBottom: 0 }}
                      >
                        <Box className="flex items-center gap-3">
                          <Box className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#eadfd4] bg-[#f6eee6] text-[#8d6b4f]">
                            {product.imageUrl ? (
                              <Image
                                alt={product.productName}
                                className="h-full w-full"
                                previewType="thumbnails"
                                src={product.imageUrl}
                              />
                            ) : (
                              <Package aria-hidden="true" className="h-5 w-5" />
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell
                        style={{
                          padding: "16px",
                          borderBottom: 0,
                          color: "#183d2b",
                        }}
                      >
                        {product.price}
                      </TableCell>
                      <TableCell
                        style={{
                          padding: "16px",
                          borderBottom: 0,
                          color: "#183d2b",
                        }}
                      >
                        {product.categoryName || "-"}
                      </TableCell>
                      <TableCell
                        style={{
                          padding: "16px",
                          borderBottom: 0,
                          color: "#183d2b",
                        }}
                      >
                        {product.description || "-"}
                      </TableCell>
                      <TableCell
                        style={{
                          padding: "16px",
                          borderBottom: 0,
                          color: "#284536",
                        }}
                      >
                        {formatDate(product.createdAt)}
                      </TableCell>
                      <TableCell
                        style={{
                          padding: "16px",
                          borderBottom: 0,
                          color: "#284536",
                        }}
                      >
                        {formatDate(product.updatedAt)}
                      </TableCell>
                      <TableActionCell
                        onClick={() => handleEditProduct(product.id)}
                      />
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

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
