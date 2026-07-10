import { clsx } from "@/components/utils";

type ChatDateSeparatorProps = {
  className?: string;
  label: string;
};

export function ChatDateSeparator({
  className,
  label,
}: ChatDateSeparatorProps) {
  return (
    <div className={clsx("flex items-center gap-3 py-2", className)}>
      <div className="h-px flex-1 bg-[#eadfd4]" />
      <span className="rounded-full border border-[#eadfd4] bg-white px-3 py-1 text-[11px] font-bold text-[#8a7867] shadow-sm">
        {label}
      </span>
      <div className="h-px flex-1 bg-[#eadfd4]" />
    </div>
  );
}
