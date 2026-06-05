"use client";

import { Button } from "@/components";
import { useModal } from "@/providers";
import {
    useProductQuery,
    useUpdateProductMutation,
} from "@/services/controllers/products/ProductsQueries";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import {
    ProductForm,
    ProductFormValues,
    ProductSubmitPayload,
} from "../../component/ProductForm/ProductForm";

export default function ProductsEditPage() {
    const { openModal } = useModal();
    const params = useParams<{ id: string }>();
    const productId = Number(params.id);
    const { data: product, isLoading } = useProductQuery(productId);
    const { mutateAsync: updateProduct, isPending: isUpdating } =
        useUpdateProductMutation();

    const defaultValues = useMemo<ProductFormValues | undefined>(() => {
        if (!product) {
            return undefined;
        }

        return {
            categoryId: String(product.categoryId),
            description: product.description ?? "",
            price: String(product.price),
            productName: product.productName,
            status: "active",
            stockQuantity: "",
        };
    }, [product]);

    const submitProduct = async (payload: ProductSubmitPayload) => {
        await updateProduct({
            id: productId,
            ...payload,
        });
    };

    return (
        <ProductForm
            defaultImageUrl={product?.imageUrl ?? null}
            defaultValues={defaultValues}
            deleteAction={
                <Button
                    className="h-9 rounded-sm border-[#f0c8c5] bg-[#fff2ef] px-8 text-xs font-semibold text-[#b12f1d] hover:bg-[#ffe1dc]"
                    disabled={isLoading || isUpdating}
                    onClick={() =>
                        openModal("DELETE_PRODUCT", {
                            productId,
                            productName: product?.productName,
                        })
                    }
                    type="button"
                    variant="delete"
                >
                    Delete
                </Button>
            }
            isLoading={isLoading}
            isSaving={isUpdating}
            mode="edit"
            onSubmit={submitProduct}
        />
    );
}
