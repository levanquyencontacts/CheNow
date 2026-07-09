import { clsx } from "@/components/utils";

type ChatQuickRepliesProps = {
  className?: string;
  items: string[];
  onSelect: (reply: string) => void;
};

export function ChatQuickReplies({
  className,
  items,
  onSelect,
}: ChatQuickRepliesProps) {
  if (!items.length) {
    return null;
  }

  return (
    <div className={clsx("flex flex-wrap gap-2", className)}>
      {items.map((reply) => (
        <button
          className="rounded-full border border-[#eadfd4] px-3 py-1.5 text-xs font-bold text-[#5f5148] transition hover:border-[#2d6a4f] hover:text-[#2d6a4f]"
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
