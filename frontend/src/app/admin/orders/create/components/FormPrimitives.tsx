import { Box } from "@/components";
import type { ReactNode } from "react";

export function Section({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-[#eadfd4] bg-white/90 p-4 shadow-[0_8px_18px_rgba(55,36,20,0.04)]">
      <h2 className="mb-4 text-base font-bold text-[#183d2b]">{title}</h2>
      {children}
    </section>
  );
}

export function Field({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-1.5 text-xs font-semibold text-[#5c554c]">
      {label}
      {children}
    </label>
  );
}

export function QuantityControl({
  disabled = false,
  onChange,
  value,
}: {
  disabled?: boolean;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <Box className="inline-flex h-9 items-center overflow-hidden rounded-md border border-[#eadfd4] bg-white">
      <button
        className="flex h-full w-9 items-center justify-center text-[#6f665c] disabled:opacity-40"
        disabled={disabled || value <= 1}
        onClick={() => onChange(Math.max(value - 1, 1))}
        type="button"
      >
        -
      </button>
      <span className="flex h-full w-10 items-center justify-center border-x border-[#eadfd4] text-sm font-semibold text-[#183d2b]">
        {value}
      </span>
      <button
        className="flex h-full w-9 items-center justify-center text-[#6f665c] disabled:opacity-40"
        disabled={disabled}
        onClick={() => onChange(value + 1)}
        type="button"
      >
        +
      </button>
    </Box>
  );
}
