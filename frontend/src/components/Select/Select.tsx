import { ChevronDown } from "lucide-react";
import * as React from "react";
import { clsx } from "../utils";

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  error?: boolean;
  fullWidth?: boolean;
  helperText?: React.ReactNode;
  label?: React.ReactNode;
  placeholder?: string;
  variant?: "standard" | "outlined" | "plain";
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      children,
      className,
      error = false,
      fullWidth = false,
      helperText,
      id,
      label,
      placeholder,
      style,
      variant = "outlined",
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <label className={clsx("block", fullWidth && "w-full")} htmlFor={selectId}>
        {label && (
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#906544]">
            {label}
          </span>
        )}
        <span className="relative block">
          <select
            className={clsx(
              "h-10 w-full appearance-none bg-transparent pl-3 pr-10 text-sm text-[#3b4139] outline-none transition disabled:cursor-not-allowed disabled:opacity-60",
              variant === "standard"
                ? "border-0 border-b border-[#c9c2b7] pl-0 focus:border-[#234535]"
                : variant === "plain"
                  ? "border-0 focus:border-0"
                : "rounded-md border border-[#c9c2b7] px-3 focus:border-[#234535]",
              error && "border-red-700",
              className
            )}
            id={selectId}
            ref={ref}
            style={{
              appearance: "none",
              MozAppearance: "none",
              WebkitAppearance: "none",
              ...style,
            }}
            {...props}
          >
            {placeholder && (
              <option disabled value="">
                {placeholder}
              </option>
            )}
            {children}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8e8579]"
          />
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

Select.displayName = "Select";
