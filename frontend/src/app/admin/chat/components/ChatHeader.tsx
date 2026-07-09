import { MoreHorizontal, UserRound } from "lucide-react";
import { ChatConversation } from "@/services/types/apiType";

type ChatHeaderProps = {
  conversation: ChatConversation;
};

export function ChatHeader({ conversation }: ChatHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[#eadfd4] px-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef7ef] text-[#2d6a4f]">
          <UserRound size={18} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-[#432010]">
            {conversation.customer}
          </p>
          <p className="text-xs font-semibold text-[#8a7867]">
            {conversation.status} · {conversation.phone}
          </p>
        </div>
      </div>
      <button
        className="flex h-9 w-9 items-center justify-center rounded-lg text-[#7b6757] hover:bg-[#fff4ec]"
        type="button"
      >
        <MoreHorizontal size={18} />
      </button>
    </header>
  );
}
