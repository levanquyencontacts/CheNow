import cheMitImage from "@/common/assets/images/chemit.png";
import { Image } from "@/components";
import type { Product } from "@/services/types/apiType";
import NextImage from "next/image";

export function ProductThumb({ product }: { product: Product }) {
  if (product.imageUrl) {
    return (
      <Image
        alt={product.productName}
        className="h-full w-full rounded-md object-cover"
        previewType="thumbnails"
        src={product.imageUrl}
      />
    );
  }

  return (
    <NextImage
      alt={product.productName}
      className="h-full w-full rounded-md object-cover"
      src={cheMitImage}
    />
  );
}
