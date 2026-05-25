import * as React from "react";
import { clsx } from "../utils";

export interface FormControlLabelProps {
  className?: string;
  control: React.ReactNode;
  label: React.ReactNode;
}

export function FormControlLabel({
  className,
  control,
  label,
}: FormControlLabelProps) {
  return (
    <label
      className={clsx(
        "flex cursor-pointer items-start gap-3 text-xs leading-5 text-[#5f564b]",
        className
      )}
    >
      {control}
      <span>{label}</span>
    </label>
  );
}
