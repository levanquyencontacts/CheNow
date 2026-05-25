import * as React from "react";
import { clsx } from "../utils";

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  endAdornment?: React.ReactNode;
  error?: boolean;
  fullWidth?: boolean;
  helperText?: React.ReactNode;
  label?: React.ReactNode;
  variant?: "standard" | "outlined";
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      endAdornment,
      error = false,
      fullWidth = false,
      helperText,
      id,
      label,
      variant = "outlined",
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <label className={clsx("block", fullWidth && "w-full")} htmlFor={inputId}>
        {label && (
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#906544]">
            {label}
          </span>
        )}
        <span className="relative block">
          <input
            className={clsx(
              "h-10 w-full bg-transparent pr-8 text-sm text-[#3b4139] outline-none transition placeholder:text-[#b7b1a9]",
              variant === "standard"
                ? "border-0 border-b border-[#c9c2b7] px-0 focus:border-[#234535]"
                : "rounded-md border border-[#c9c2b7] px-3 focus:border-[#234535]",
              error && "border-red-700",
              className
            )}
            id={inputId}
            ref={ref}
            {...props}
          />
          {endAdornment && (
            <span className="absolute right-1 top-3 text-[#a6ada7]">
              {endAdornment}
            </span>
          )}
        </span>
        {helperText && (
          <span
            className={clsx(
              "mt-2 block text-xs",
              error ? "text-red-700" : "text-[#786f62]"
            )}
          >
            {helperText}
          </span>
        )}
      </label>
    );
  }
);

TextField.displayName = "TextField";
