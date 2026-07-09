import { LucideIcon } from "lucide-react";

type InfoLineProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export function InfoLine({ icon: Icon, label, value }: InfoLineProps) {
  return (
    <div className="rounded-xl border border-[#eadfd4] bg-white p-3">
      <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#9b806a]">
        <Icon size={13} />
        {label}
      </div>
      <p className="text-sm font-bold text-[#432010]">{value}</p>
    </div>
  );
}
