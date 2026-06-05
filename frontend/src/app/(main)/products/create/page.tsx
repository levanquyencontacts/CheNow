"use client";

import { useCreateProductMutation } from "@/services/controllers/products/ProductsQueries";
import { useRouter } from "next/navigation";
import { ProductForm, ProductSubmitPayload } from "../component/ProductForm/ProductForm";
import { routes } from "@/common/utils/constant";

export default function ProductsCreatePage() {
    const router = useRouter();
    const { mutateAsync: createProduct, isPending: isCreating } =
        useCreateProductMutation();

    const submitProduct = async (payload: ProductSubmitPayload) => {
        await createProduct(payload);
        router.push(routes.PRODUCTS);
    };

    return (
        <ProductForm
            isSaving={isCreating}
            mode="create"
            onSubmit={submitProduct}
        />
    );
}
