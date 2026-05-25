import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import * as React from "react";
import { clsx } from "../utils";

export interface LinkProps
  extends NextLinkProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  underline?: "always" | "hover" | "none";
}

export function Link({
  className,
  underline = "hover",
  ...props
}: LinkProps) {
  return (
    <NextLink
      className={clsx(
        "transition",
        underline === "always" && "underline",
        underline === "hover" && "hover:underline",
        className
      )}
      {...props}
    />
  );
}
