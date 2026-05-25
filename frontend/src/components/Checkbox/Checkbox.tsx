import * as React from "react";
import { Check } from "lucide-react";
import { clsx } from "../utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  controlSize?: "small" | "medium";
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, className, controlSize = "small", ...props }, ref) => (
    <span className={clsx("relative inline-flex shrink-0", className)}>
      <input
        checked={checked}
        className="peer sr-only"
        ref={ref}
        type="checkbox"
        {...props}
      />
      <span
        className={clsx(
          "flex items-center justify-center border border-[#b9ad9f] bg-transparent text-transparent transition peer-checked:border-[#304a34] peer-checked:bg-[#304a34] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#304a34]/30",
          controlSize === "small" ? "h-4 w-4" : "h-5 w-5"
        )}
      >
        <Check className="h-3 w-3" />
      </span>
    </span>
  )
);

Checkbox.displayName = "Checkbox";
