import type { HTMLAttributes, ReactNode } from "react";
import { clsx } from "../utils";

interface HelperTextProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
  error?: boolean;
}

export function HelperText({
  children,
  className,
  error,
  ...props
}: HelperTextProps) {
  if (!children) {
    return null;
  }

  return (
    <p
      className={clsx(
        "mt-2 text-[11px]",
        error ? "text-red-700" : "italic text-[#6f6256]",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
