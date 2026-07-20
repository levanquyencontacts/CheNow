import { clsx } from "@/components/utils";
import { ChatConversation } from "@/services/types/apiType";

type ConversationListItemProps = {
  active: boolean;
  conversation: ChatConversation;
  onSelect: (id: number) => void;
};

export function ConversationListItem({
  active,
  conversation,
  onSelect,
}: ConversationListItemProps) {
  return (
    <button
      className={clsx(
        "w-full px-4 py-3 text-left transition",
        active ? "bg-white" : "hover:bg-white/70",
      )}
      onClick={() => onSelect(conversation.id)}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-[#432010]">
            {conversation.customer}
          </p>
          <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-[#6c5a4b]">
            {conversation.lastMessage}
          </p>
        </div>
        {conversation.unread > 0 ? (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d17345] px-1 text-[10px] font-black text-white">
            {conversation.unread}
          </span>
        ) : null}
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-[#9b806a]">
        <span>{conversation.channel}</span>
        <span>{conversation.time}</span>
      </div>
    </button>
  );
}
