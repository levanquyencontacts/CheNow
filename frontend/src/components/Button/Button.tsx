import * as React from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "../utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
  variant?: "contained" | "outlined" | "text";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      fullWidth = false,
      size = "medium",
      type = "button",
      variant = "contained",
      ...props
    },
    ref
  ) => {
    const sizes = {
      small: "h-9 px-4 text-xs",
      medium: "h-11 px-5 text-sm",
      large: "h-14 px-7 text-sm",
    };
    const variants = {
      contained:
        "bg-[#183d2b] text-black shadow-[0_7px_14px_rgba(48,74,52,0.16)] hover:bg-[#102f21]",
      outlined:
        "border border-[#e5d8cc] bg-transparent text-[#5d5448] hover:bg-white/60",
      text: "bg-transparent text-[#6c543e] hover:bg-[#e9ddd2]/50",
    };

    return (
      <button
        className={twMerge(
          clsx(
            "inline-flex items-center justify-center gap-3 rounded-lg font-semibold transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
            sizes[size],
            variants[variant],
            fullWidth && "w-full",
            className
          )
        )}
        ref={ref}
        type={type}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
