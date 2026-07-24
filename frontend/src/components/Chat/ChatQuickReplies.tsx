import { clsx } from "@/components/utils";

type ChatQuickRepliesProps = {
  className?: string;
  items: string[];
  onSelect: (reply: string) => void;
  variant?: "customer" | "default";
};

export function ChatQuickReplies({
  className,
  items,
  onSelect,
  variant = "default",
}: ChatQuickRepliesProps) {
  if (!items.length) {
    return null;
  }

  return (
    <div className={clsx("flex flex-wrap gap-2", className)}>
      {items.map((reply) => (
        <button
          className={clsx(
            "rounded-full border px-3 py-1.5 text-xs font-bold transition",
            variant === "customer"
              ? "border-[#ded8d2] bg-white text-[#62574f] shadow-[0_1px_2px_rgba(67,32,16,0.04)] hover:border-[#07845f] hover:bg-[#f2faf7] hover:text-[#07845f]"
              : "border-[#eadfd4] text-[#5f5148] hover:border-[#2d6a4f] hover:text-[#2d6a4f]",
          )}
          key={reply}
          onClick={() => onSelect(reply)}
          type="button"
        >
          {reply}
        </button>
      ))}
    </div>
  );
}
