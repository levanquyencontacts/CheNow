"use client";

import { FormEvent, useEffect, useState } from "react";
import { Box, Button, Checkbox, Modal, PageHeader, TextField } from "@/components";
import { appConstants } from "@/common/utils/constant";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdMutation,
  useTestApiProductsQuery,
  useUpdateProductMutation,
  useUploadImageMutation,
} from "@/services/controllers/testapi/testApiQueries";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string | null;
  quantity: number;
  isAvailable: boolean;
}

interface ProductsResponse {
  data: Product[];
  metadata: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

const apiUrl = appConstants.NEXT_PUBLIC_API_URL ;

function getImageFileName(imageUrl: string | null) {
  if (!imageUrl) {
    return "";
  }

  return imageUrl.split("/").filter(Boolean).pop() ?? "";
}

function getProductImageSrc(fileName: string | null, type: "originals" | "thumbnails") {
  const imageFileName = getImageFileName(fileName);

  if (!imageFileName) {
    return "";
  }

  return `${apiUrl}/file/image/${type}/${encodeURIComponent(imageFileName)}`;
}

export default function TestApiPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchName, setSearchName] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productImageName, setProductImageName] = useState("");
  const { data, isError, isLoading } = useTestApiProductsQuery(searchName);
  const createProductMutation = useCreateProductMutation();
  const deleteProductMutation = useDeleteProductMutation();
  const getProductByIdMutation = useGetProductByIdMutation();
  const updateProductMutation = useUpdateProductMutation();
  const uploadImageMutation = useUploadImageMutation();
  const response = data as ProductsResponse | undefined;
  const products = response?.data ?? [];
  const pagination = response?.metadata.pagination;

  const isSaving =
    createProductMutation.isPending || updateProductMutation.isPending;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearchName(searchInput.trim());
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setProductImageName("");
    setIsProductModalOpen(true);
  };

  const openUpdateModal = (id: number) => {
    getProductByIdMutation.mutate(id, {
      onSuccess: (product) => {
        const productDetail = product as Product;

        setEditingProduct(productDetail);
        setProductImageName(getImageFileName(productDetail.imageUrl));
        setIsProductModalOpen(true);
      },
    });
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setProductImageName("");
  };

  const handleSubmitProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const price = Number(formData.get("price") ?? 0);
    const quantity = Number(formData.get("quantity") ?? 0);

    const payload = {
      name,
      description,
      price,
      imageUrl: productImageName || null,
      quantity,
      isAvailable: formData.get("isAvailable") === "on",
    };

    if (editingProduct) {
      updateProductMutation.mutate(
        { id: editingProduct.id, ...payload },
        { onSuccess: closeProductModal },
      );
      return;
    }

    createProductMutation.mutate(payload, { onSuccess: closeProductModal });
  };

  const handleDeleteProduct = (id: number) => {
    deleteProductMutation.mutate(id);
  };

  const handleUploadImage = (file: File | undefined) => {
    if (!file) {
      return;
    }

    uploadImageMutation.mutate(file, {
      onSuccess: (response) => {
        setProductImageName(response.fileName);
      },
    });
  };

  return (
    <Box className="flex min-h-full flex-col">
      <PageHeader searchPlaceholder="Search products..." />

      <Box className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
        <Box className="overflow-hidden rounded-md border border-[#eadfd4] bg-white shadow-sm">
          <Box className="border-b border-[#eadfd4] px-5 py-4">
            <Box className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Box>
                <h1 className="text-lg font-bold text-[#143d2a]">Test API</h1>
                <p className="mt-1 text-sm text-[#75685c]">
                  Product data from /product API.
                </p>
              </Box>
              <Button
                className="h-9 rounded-md bg-[#143d2a] px-4 text-xs text-white hover:bg-[#0f2f20]"
                onClick={openCreateModal}
              >
                Create Product
              </Button>
            </Box>
            <Box className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
              <TextField
                className="h-9"
                label="Search name"
                name="name"
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="product?name=h"
                value={searchInput}
                variant="outlined"
              />
              <Box className="flex gap-2">
                <Button
                  className="h-9 rounded-md px-4 text-xs"
                  onClick={() => {
                    setSearchInput("");
                    setSearchName("");
                  }}
                  type="button"
                  variant="outlined"
                >
                  Clear
                </Button>
              </Box>
            </Box>
          </Box>

          <Box className="overflow-x-auto">
            <table className="w-full min-w-180 border-collapse text-left">
              <thead>
                <tr className="border-b border-[#eadfd4] text-[11px] font-bold text-[#4d453d]">
                  <th className="w-20 px-5 py-3">Image</th>
                  <th className="w-16 px-5 py-3">ID</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="w-28 px-5 py-3">Price</th>
                  <th className="w-28 px-5 py-3">Quantity</th>
                  <th className="w-32 px-5 py-3">Available</th>
                  <th className="w-28 px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      className="px-5 py-8 text-center text-sm text-[#75685c]"
                      colSpan={8}
                    >
                      Loading products...
                    </td>
                  </tr>
                ) : null}

                {isError ? (
                  <tr>
                    <td
                      className="px-5 py-8 text-center text-sm font-semibold text-[#b13d38]"
                      colSpan={8}
                    >
                      Cannot load products.
                    </td>
                  </tr>
                ) : null}

                {!isLoading && !isError && products.length === 0 ? (
                  <tr>
                    <td
                      className="px-5 py-8 text-center text-sm text-[#75685c]"
                      colSpan={8}
                    >
                      No products found.
                    </td>
                  </tr>
                ) : null}

                {products.map((product) => (
                  <tr
                    className="border-b border-[#f0e7df] last:border-0"
                    key={product.id}
                  >
                    <td className="px-5 py-4">
                      {product.imageUrl ? (
                        <img
                          alt={product.name}
                          className="h-12 w-12 rounded-md object-cover"
                          src={getProductImageSrc(product.imageUrl, "thumbnails")}
                        />
                      ) : (
                        <Box className="flex h-12 w-12 items-center justify-center rounded-md bg-[#eee8e2] text-xs font-bold text-[#9d958e]">
                          IMG
                        </Box>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-[#6d6156]">
                      {product.id}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-[#2f241c]">
                      {product.name}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#5d5448]">
                      {product.description}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-[#231f1b]">
                      {product.price}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-[#6d6156]">
                      {product.quantity}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={[
                          "inline-flex items-center gap-2 text-sm font-semibold",
                          product.isAvailable
                            ? "text-[#2d7044]"
                            : "text-[#b13d38]",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "h-2 w-2 rounded-full",
                            product.isAvailable
                              ? "bg-[#2d7044]"
                              : "bg-[#b13d38]",
                          ].join(" ")}
                        />
                        {product.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Box className="flex justify-end gap-2">
                        <Button
                          className="h-8 rounded-md px-3 text-xs"
                          disabled={getProductByIdMutation.isPending}
                          onClick={() => openUpdateModal(product.id)}
                          variant="outlined"
                        >
                          {getProductByIdMutation.isPending ? "Loading..." : "Edit"}
                        </Button>
                        <Button
                          className="h-8 rounded-md border-[#f0c8c5] px-3 text-xs text-[#b13d38] hover:bg-[#ffeceb]"
                          disabled={deleteProductMutation.isPending}
                          onClick={() => handleDeleteProduct(product.id)}
                          variant="outlined"
                        >
                          Delete
                        </Button>
                      </Box>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>

          {pagination ? (
            <Box className="flex items-center justify-between border-t border-[#eadfd4] px-5 py-3 text-sm text-[#75685c]">
              <span>Total: {pagination.total}</span>
              <span>
                Page {pagination.page} / {pagination.totalPages}
              </span>
            </Box>
          ) : null}
        </Box>
      </Box>

      {isProductModalOpen ? (
        <Modal
          className="max-w-[560px] rounded-md"
          closeTitle="Close product modal"
          onClose={closeProductModal}
        >
          <form className="p-6" noValidate onSubmit={handleSubmitProduct}>
            <Modal.Title>
              {editingProduct ? "Update Product" : "Create Product"}
            </Modal.Title>

            <Box className="mt-4 grid gap-4 sm:grid-cols-2">
              <TextField
                defaultValue={editingProduct?.name ?? ""}
                fullWidth
                label="Name"
                name="name"
                placeholder="Product name"
                required
              />
              <TextField
                defaultValue={editingProduct?.price ?? ""}
                fullWidth
                label="Price"
                min={0}
                name="price"
                placeholder="0"
                required
                step="0.01"
                type="number"
              />
              <TextField
                defaultValue={editingProduct?.quantity ?? 0}
                fullWidth
                label="Quantity"
                min={0}
                name="quantity"
                placeholder="0"
                type="number"
              />
              <TextField
                className="sm:col-span-2"
                defaultValue={editingProduct?.description ?? ""}
                fullWidth
                label="Description"
                name="description"
                placeholder="Product description"
              />
            </Box>

            <Box className="mt-5 rounded-md border border-[#eadfd4] bg-[#fff3e8] p-4">
              <p className="text-[11px] font-semibold uppercase text-[#906544]">
                Product Image
              </p>
              <Box className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
                {productImageName ? (
                  <img
                    alt="Product original"
                    className="h-24 w-24 rounded-md object-cover"
                    src={getProductImageSrc(productImageName, "originals")}
                  />
                ) : (
                  <Box className="flex h-24 w-24 items-center justify-center rounded-md bg-[#eee8e2] text-xs font-bold text-[#9d958e]">
                    IMG
                  </Box>
                )}
                <Box>
                  <input
                    accept="image/*"
                    className="block text-sm text-[#314032]"
                    onChange={(event) => handleUploadImage(event.target.files?.[0])}
                    type="file"
                  />
                  <p className="mt-2 text-xs text-[#75685c]">
                    {uploadImageMutation.isPending
                      ? "Uploading..."
                      : productImageName || "Choose image to upload"}
                  </p>
                </Box>
              </Box>
            </Box>

            <label className="mt-5 flex items-center gap-3 text-sm font-semibold text-[#314032]">
              <Checkbox
                defaultChecked={editingProduct?.isAvailable ?? true}
                name="isAvailable"
              />
              Available
            </label>

            <Modal.BottomButtons className="justify-end">
              <Button
                className="h-10 rounded-md px-4 text-xs"
                onClick={closeProductModal}
                type="button"
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                className="h-10 rounded-md bg-[#143d2a] px-4 text-xs text-white hover:bg-[#0f2f20]"
                disabled={isSaving}
                type="submit"
              >
                {isSaving
                  ? "Saving..."
                  : editingProduct
                    ? "Update"
                    : "Create"}
              </Button>
            </Modal.BottomButtons>
          </form>
        </Modal>
      ) : null}
    </Box>
  );
}
