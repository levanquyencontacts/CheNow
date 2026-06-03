import React, { type Ref } from "react";
import { twMerge } from "tailwind-merge";
import type { Override } from "@/common/shared";
import { clsx } from "@/components/utils";

type Fit = "cover" | "contain";

export type ImageProps = Override<
  React.ImgHTMLAttributes<HTMLImageElement>,
  {
    src: string | null;
    alt: string;
    width?: number;
    height?: number;
    fit?: Fit;
    isStacked?: boolean;
  }
>;

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      className,
      fit = "cover",
      isStacked = false,
      src,
      style,
      ...rest
    }: ImageProps,
    forwardedRef: Ref<HTMLImageElement>,
  ) => {
    const hasSrc = Boolean(src?.trim());

    return (
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
        src={hasSrc ? src ?? undefined : undefined}
        style={{ objectFit: fit, ...style }}
        {...rest}
      />
    );
  },
);

Image.displayName = "Image";

export { Image };
