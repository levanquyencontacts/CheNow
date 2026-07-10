import { forwardRef, ReactNode, UIEvent } from "react";
import { clsx } from "@/components/utils";
import { ChatAuthor, ChatMessage } from "@/services/types/apiType";
import { ChatMessageBubble } from "./ChatMessageBubble";

type ChatMessageListProps = {
  className?: string;
  currentUserRole: ChatAuthor;
  emptyState?: ReactNode;
  messages: ChatMessage[];
  notice?: ReactNode;
  onScroll?: (event: UIEvent<HTMLDivElement>) => void;
};

export const ChatMessageList = forwardRef<HTMLDivElement, ChatMessageListProps>(
  function ChatMessageList(
    {
      className,
      currentUserRole,
      emptyState,
      messages,
      notice,
      onScroll,
    },
    ref,
  ) {
    return (
      <div
        className={clsx(
          "space-y-3 overflow-y-auto bg-[#fffaf5] px-4 py-4",
          className,
        )}
        onScroll={onScroll}
        ref={ref}
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
            {emptyState ?? "Chua co tin nhan."}
          </div>
        )}
      </div>
    );
  },
);
