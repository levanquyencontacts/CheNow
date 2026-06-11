import React, { type Ref } from "react";
import { twMerge } from "tailwind-merge";
import type { Override } from "@/common/shared";
import { clsx } from "@/components/utils";
import api from "@/services/apiServices";

type Fit = "cover" | "contain";
type PreviewType = "originals" | "thumbnails";

const isAbsoluteUrl = (value: string) =>
  value.startsWith("http://") ||
  value.startsWith("https://") ||
  value.startsWith("blob:") ||
  value.startsWith("data:") ||
  value.startsWith("/");

const getImageSrc = (src: string | null, previewType?: PreviewType) => {
  const trimmed = src?.trim();

  if (!trimmed) {
    return undefined;
  }

  if (!previewType || isAbsoluteUrl(trimmed)) {
    return trimmed;
  }

  return previewType === "thumbnails"
    ? api.file.getThumbnailUrl(trimmed)
    : api.file.getOriginalImageUrl(trimmed);
};

export type ImageProps = Override<
  React.ImgHTMLAttributes<HTMLImageElement>,
  {
    src: string | null;
    alt: string;
    width?: number;
    height?: number;
    fit?: Fit;
    isStacked?: boolean;
    previewType?: PreviewType;
  }
>;

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      className,
      fit = "cover",
      isStacked = false,
      previewType,
      src,
      style,
      ...rest
    }: ImageProps,
    forwardedRef: Ref<HTMLImageElement>,
  ) => {
    const resolvedSrc = getImageSrc(src, previewType);
    const hasSrc = Boolean(resolvedSrc);

    return (
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
      <img
        className={twMerge(
          clsx(
            "box-border bg-white",
            !hasSrc && "animate-pulse bg-[#f3e8de]",
            isStacked &&
              "shadow-[1px_-1px_0_0_white,2px_-2px_0_0_#d8c8bd,3px_-3px_0_0_white,4px_-4px_0_0_#d8c8bd]",
            className,
          ),
        )}
        ref={forwardedRef}
        src={resolvedSrc}
        style={{ objectFit: fit, ...style }}
        {...rest}
      />
    );
  },
);

Image.displayName = "Image";

export { Image };
