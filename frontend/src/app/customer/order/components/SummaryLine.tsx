import { formatPrice } from "../orderUtils";

type SummaryLineProps = {
  label: string;
  value: number;
};

export function SummaryLine({ label, value }: SummaryLineProps) {
  return (
    <div className="flex items-center justify-between text-sm font-semibold">
      <span className="text-on-surface-variant">{label}</span>
      <span className="text-charcoal-black">{formatPrice(value)}</span>
    </div>
  );
}

