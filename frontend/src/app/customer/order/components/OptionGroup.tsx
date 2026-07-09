"use client";

type OptionGroupProps = {
  active: string;
  items: { label: string; value: string; hint?: string }[];
  label: string;
  onChange: (value: string) => void;
};

export function OptionGroup({ active, items, label, onChange }: OptionGroupProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-bold text-charcoal-black">{label}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {items.map((item) => (
          <button
            className={`rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${
              active === item.value
                ? "border-primary bg-emerald/10 text-primary"
                : "border-[#eadfd4] bg-white text-on-surface"
            }`}
            key={item.value}
            onClick={() => onChange(item.value)}
            type="button"
          >
            {item.label}
            {item.hint && <span className="mt-1 block text-[11px] font-medium text-on-surface-variant">{item.hint}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

