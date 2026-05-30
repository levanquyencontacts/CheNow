'use client';
import * as React from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { clsx } from "../utils";

export interface SearchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  clearable?: boolean;
  fullWidth?: boolean;
  onClear?: () => void;
  size?: "small" | "medium";
}

export const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  (
    {
      className,
      clearable = true,
      disabled = false,
      fullWidth = false,
      onChange,
      onClear,
      placeholder = "Tim kiem...",
      size = "medium",
      value,
      ...props
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState("");
    const currentValue = isControlled ? String(value ?? "") : internalValue;
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(event.target.value);
      }

      onChange?.(event);
    };

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
      }

      onClear?.();
      inputRef.current?.focus();
    };

    return (
      <span
        className={clsx(
          "inline-flex items-center rounded-lg bg-white text-[#7b6d60] transition focus-within:ring-2 focus-within:ring-[#805533]/25",
          size === "small" ? "h-8 px-2.5" : "h-9 px-3",
          disabled && "cursor-not-allowed opacity-60",
          fullWidth ? "w-full" : "w-56",
          className
        )}
      >
        <SearchIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
        <input
          className="min-w-0 flex-1 bg-transparent px-2 text-sm text-[#314032] outline-none placeholder:text-[#9a8b7c] disabled:cursor-not-allowed"
          disabled={disabled}
          onChange={handleChange}
          placeholder={placeholder}
          ref={inputRef}
          type="search"
          value={currentValue}
          {...props}
        />
        {clearable && currentValue && !disabled ? (
          <button
            aria-label="Clear search"
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[#7b6d60] transition hover:bg-[#e3d5c9] hover:text-[#143d2a]"
            onClick={handleClear}
            type="button"
          >
            <X aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </span>
    );
  }
);

Search.displayName = "Search";
