import {
  ChatComposer,
  ChatMessageList,
  ChatQuickReplies,
} from "@/components/Chat";
import { ChatConversation, ChatMessage } from "@/services/types/apiType";
import { ArrowDown } from "lucide-react";
import { UIEvent, useCallback, useEffect, useRef, useState } from "react";
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
  const isNearBottomRef = useRef(true);
  const latestMessageIdRef = useRef<ChatMessage["id"] | null>(null);
  const lastScrollTopRef = useRef(0);
  const loadingOlderRef = useRef(false);
  const [showNewMessageNotice, setShowNewMessageNotice] = useState(false);
  const latestMessage = messages[messages.length - 1];
  const latestMessageId = latestMessage?.id;

  const scrollMessagesToBottom = useCallback(
    (behavior: ScrollBehavior = "auto") => {
      const listElement = messageListRef.current;

      if (!listElement) {
        return;
      }

      listElement.scrollTo({
        behavior,
        top: listElement.scrollHeight,
      });
      lastScrollTopRef.current = listElement.scrollHeight;
    },
    [],
  );

  useEffect(() => {
    initialScrollDoneRef.current = false;
    isNearBottomRef.current = true;
    latestMessageIdRef.current = null;
    lastScrollTopRef.current = 0;
    window.requestAnimationFrame(() => setShowNewMessageNotice(false));
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
      isNearBottomRef.current = true;
      latestMessageIdRef.current = latestMessageId ?? null;
      lastScrollTopRef.current = listElement.scrollTop;
      initialScrollDoneRef.current = true;
    });
  }, [conversation.id, isLoading, latestMessageId, messages.length]);

  useEffect(() => {
    if (!initialScrollDoneRef.current || !latestMessage || !latestMessageId) {
      return;
    }

    const previousLatestMessageId = latestMessageIdRef.current;

    if (latestMessageId === previousLatestMessageId) {
      return;
    }

    latestMessageIdRef.current = latestMessageId;

    if (!previousLatestMessageId) {
      return;
    }

    if (isOwnChatMessage(latestMessage) || isNearBottomRef.current) {
      scrollMessagesToBottom();
      setShowNewMessageNotice(false);
      return;
    }

    window.requestAnimationFrame(() => setShowNewMessageNotice(true));
  }, [latestMessage, latestMessageId, scrollMessagesToBottom]);

  const handleMessageListScroll = async (event: UIEvent<HTMLDivElement>) => {
    const listElement = event.currentTarget;
    const currentScrollTop = listElement.scrollTop;
    const distanceFromBottom =
      listElement.scrollHeight - currentScrollTop - listElement.clientHeight;
    const scrollingUp = currentScrollTop < lastScrollTopRef.current;
    const nearTop = listElement.scrollTop <= 24;
    const nearBottom = distanceFromBottom <= 80;

    isNearBottomRef.current = nearBottom;
    lastScrollTopRef.current = currentScrollTop;

    if (nearBottom) {
      setShowNewMessageNotice(false);
    }

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

  const handleNewMessageNoticeClick = () => {
    scrollMessagesToBottom("smooth");
    isNearBottomRef.current = true;
    setShowNewMessageNotice(false);
  };

  return (
    <section className="relative flex min-h-0 min-w-0 flex-col overflow-hidden">
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
      {showNewMessageNotice ? (
        <button
          className="absolute bottom-28 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#d8c7b9] bg-white px-4 py-2 text-xs font-black text-[#2d6a4f] shadow-[0_10px_24px_rgba(67,32,16,0.16)] transition hover:border-[#2d6a4f] hover:bg-[#f7fff8]"
          onClick={handleNewMessageNoticeClick}
          type="button"
        >
          <ArrowDown aria-hidden="true" className="h-4 w-4" />
          Co tin nhan moi
        </button>
      ) : null}
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

function isOwnChatMessage(message: ChatMessage) {
  return message.author === "admin" || message.author === "staff";
}
