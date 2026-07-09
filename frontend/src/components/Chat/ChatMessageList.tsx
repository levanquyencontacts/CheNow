import { ReactNode } from "react";
import { clsx } from "@/components/utils";
import { ChatAuthor, ChatMessage } from "@/services/types/apiType";
import { ChatMessageBubble } from "./ChatMessageBubble";

type ChatMessageListProps = {
  className?: string;
  currentUserRole: ChatAuthor;
  emptyState?: ReactNode;
  messages: ChatMessage[];
  notice?: ReactNode;
};

export function ChatMessageList({
  className,
  currentUserRole,
  emptyState,
  messages,
  notice,
}: ChatMessageListProps) {
  return (
    <div
      className={clsx(
        "space-y-3 overflow-y-auto bg-[#fffaf5] px-4 py-4",
        className,
      )}
    >
      {notice}
      {messages.length ? (
        messages.map((message) => (
          <ChatMessageBubble
            currentUserRole={currentUserRole}
            key={message.id}
            message={message}
          />
        ))
      ) : (
        <div className="rounded-xl bg-white px-4 py-6 text-center text-sm font-semibold text-[#8a7867]">
          {emptyState ?? "Chưa có tin nhắn."}
        </div>
      )}
    </div>
  );
}
