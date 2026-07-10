import {
  ChatComposer,
  ChatMessageList,
  ChatQuickReplies,
} from "@/components/Chat";
import { ChatConversation, ChatMessage } from "@/services/types/apiType";
import { UIEvent, useEffect, useRef } from "react";
import { ChatHeader } from "./ChatHeader";

type ConversationPanelProps = {
  conversation: ChatConversation;
  hasOlderMessages?: boolean;
  disabled?: boolean;
  isError?: boolean;
  isFetchingOlderMessages?: boolean;
  isLoading?: boolean;
  onLoadOlderMessages?: () => Promise<unknown> | void;
  messages: ChatMessage[];
  onQuickAnswer: (answer: string) => void;
  onReplyChange: (value: string) => void;
  onSendReply: () => void;
  quickAnswers: string[];
  reply: string;
};

export function ConversationPanel({
  conversation,
  hasOlderMessages = false,
  disabled = false,
  isError = false,
  isFetchingOlderMessages = false,
  isLoading = false,
  onLoadOlderMessages,
  messages,
  onQuickAnswer,
  onReplyChange,
  onSendReply,
  quickAnswers,
  reply,
}: ConversationPanelProps) {
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const initialScrollDoneRef = useRef(false);
  const lastScrollTopRef = useRef(0);
  const loadingOlderRef = useRef(false);

  useEffect(() => {
    initialScrollDoneRef.current = false;
    lastScrollTopRef.current = 0;
  }, [conversation.id]);

  useEffect(() => {
    if (initialScrollDoneRef.current || isLoading || !messages.length) {
      return;
    }

    const listElement = messageListRef.current;

    if (!listElement) {
      return;
    }

    window.requestAnimationFrame(() => {
      listElement.scrollTop = listElement.scrollHeight;
      lastScrollTopRef.current = listElement.scrollTop;
      initialScrollDoneRef.current = true;
    });
  }, [conversation.id, isLoading, messages.length]);

  const handleMessageListScroll = async (event: UIEvent<HTMLDivElement>) => {
    const listElement = event.currentTarget;
    const currentScrollTop = listElement.scrollTop;
    const scrollingUp = currentScrollTop < lastScrollTopRef.current;
    const nearTop = listElement.scrollTop <= 24;

    lastScrollTopRef.current = currentScrollTop;

    if (
      !scrollingUp ||
      !nearTop ||
      !hasOlderMessages ||
      isFetchingOlderMessages ||
      loadingOlderRef.current ||
      !onLoadOlderMessages
    ) {
      return;
    }

    const previousScrollHeight = listElement.scrollHeight;

    loadingOlderRef.current = true;
    try {
      await onLoadOlderMessages();
    } finally {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          listElement.scrollTop =
            listElement.scrollHeight - previousScrollHeight;
          lastScrollTopRef.current = listElement.scrollTop;
          loadingOlderRef.current = false;
        });
      });
    }
  };

  return (
    <section className="flex min-h-0 min-w-0 flex-col overflow-hidden">
      <ChatHeader conversation={conversation} />
      <ChatMessageList
        className="min-h-0 flex-1 space-y-4 p-5"
        currentUserRole="staff"
        emptyState={
          isLoading
            ? "Dang tai tin nhan..."
            : isError
              ? "Khong the tai tin nhan."
              : "Chua co tin nhan."
        }
        messages={messages}
        notice={
          isFetchingOlderMessages ? (
            <div className="rounded-xl bg-white px-4 py-2 text-center text-xs font-semibold text-[#8a7867]">
              Dang tai tin nhan cu...
            </div>
          ) : null
        }
        onScroll={handleMessageListScroll}
        ref={messageListRef}
      />
      <footer className="shrink-0 border-t border-[#eadfd4] bg-white p-4">
        <ChatQuickReplies
          className="mb-3"
          items={quickAnswers}
          onSelect={onQuickAnswer}
        />
        <ChatComposer
          disabled={disabled || isLoading}
          multiline
          onChange={onReplyChange}
          onSubmit={onSendReply}
          placeholder="Nhap phan hoi cho khach..."
          value={reply}
        />
      </footer>
    </section>
  );
}
