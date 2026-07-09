"use client";

import { Minus, Plus } from "lucide-react";

type QuantityStepperProps = {
  onChange: (value: number) => void;
  value: number;
};

export function QuantityStepper({ onChange, value }: QuantityStepperProps) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-surface-container px-2 py-1">
      <button
        className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-on-surface-variant transition-colors hover:text-primary"
        onClick={() => onChange(Math.max(0, value - 1))}
        type="button"
      >
        <Minus size={14} />
      </button>
      <span className="min-w-6 text-center text-sm font-bold">{value}</span>
      <button
        className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-on-surface-variant transition-colors hover:text-primary"
        onClick={() => onChange(value + 1)}
        type="button"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

