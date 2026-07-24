"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Headphones,
  Leaf,
  MessageCircle,
  Minus,
  Sparkles,
  X,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useChatSocket } from "@/hooks/useChatSocket";
import {
  useChatMessagesQuery,
  useCustomerChatConversationQuery,
} from "@/services/controllers/chat/ChatQueries";
import {
  createTempChatMessage,
  mapChatMessageResponse,
  markChatMessageFailed,
} from "@/services/controllers/chat/chatMapper";
import {
  mergeMessages,
  sortChatMessages,
} from "@/services/controllers/chat/chatMessageOrder";
import { ChatMessage, ChatMessageResponse } from "@/services/types/apiType";
import { ChatComposer } from "./ChatComposer";
import { ChatMessageList } from "./ChatMessageList";
import { ChatQuickReplies } from "./ChatQuickReplies";

const quickReplies = ["Tư vấn món", "Theo dõi đơn", "Khuyến mãi hôm nay"];

const greetingMessage: ChatMessage = {
  id: "greeting",
  author: "staff",
  status: "sent",
  text: "CheNow xin chào. Bạn cần tư vấn món, kiểm tra đơn hay hỏi khuyến mãi?",
  time: "Vừa xong",
};

function getMessagesFromQueryData(
  data: { data?: ChatMessageResponse[] } | ChatMessageResponse[] | undefined,
) {
  if (!data) {
    return [] as ChatMessageResponse[];
  }

  if (Array.isArray(data)) {
    return data;
  }

  return Array.isArray(data.data) ? data.data : [];
}

export function CustomerChatWidget() {
  const queryClient = useQueryClient();
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const [conversationId, setConversationId] = useState<number | undefined>();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  // Only optimistic temps / failed sends. History comes from the messages query.
  const [pendingMessages, setPendingMessages] = useState<ChatMessage[]>([]);

  const conversationQuery = useCustomerChatConversationQuery(
    { limit: 1, page: 1, order: "DESC" },
    open,
  );
  const currentConversation = conversationQuery.data?.data?.[0];
  const activeConversationId = currentConversation?.id ?? conversationId;

  // DESC page 1 = newest window so a reload always includes the latest sends.
  const messagesQuery = useChatMessagesQuery(
    activeConversationId,
    { limit: 100, page: 1, order: "DESC" },
    open && Boolean(activeConversationId),
  );

  const historyMessages = useMemo(() => {
    const loaded = getMessagesFromQueryData(messagesQuery.data);
    return sortChatMessages(loaded.map(mapChatMessageResponse));
  }, [messagesQuery.data]);

  const displayMessages = useMemo(() => {
    if (!activeConversationId && pendingMessages.length === 0) {
      return [greetingMessage];
    }

    if (
      messagesQuery.isLoading &&
      historyMessages.length === 0 &&
      pendingMessages.length === 0
    ) {
      return [greetingMessage];
    }

    const merged = mergeMessages(historyMessages, pendingMessages);
    return merged.length > 0 ? merged : [greetingMessage];
  }, [
    activeConversationId,
    historyMessages,
    messagesQuery.isLoading,
    pendingMessages,
  ]);

  const latestMessageId = displayMessages[displayMessages.length - 1]?.id;
  const loadingHistory =
    conversationQuery.isLoading ||
    (Boolean(activeConversationId) && messagesQuery.isLoading);

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
    },
    [],
  );

  useEffect(() => {
    if (!open || loadingHistory || !displayMessages.length) {
      return;
    }

    window.requestAnimationFrame(() => {
      scrollMessagesToBottom("auto");
    });
  }, [
    open,
    loadingHistory,
    latestMessageId,
    displayMessages.length,
    scrollMessagesToBottom,
  ]);

  const handleNewMessage = useCallback(
    (message: ChatMessageResponse) => {
      if (
        activeConversationId &&
        message.conversationId !== activeConversationId
      ) {
        return;
      }

      if (message.senderRole === "customer") {
        return;
      }

      // Prefer query cache so reload/refetch stays consistent.
      queryClient.setQueryData(
        [
          "chat",
          "messages",
          message.conversationId,
          { limit: 100, page: 1, order: "DESC" },
        ],
        (
          current: { data?: ChatMessageResponse[]; meta?: unknown } | undefined,
        ) => {
          if (!current?.data) {
            return {
              data: [message],
              meta: { page: 1, limit: 100, total: 1, totalPages: 1 },
            };
          }

          if (current.data.some((item) => item.id === message.id)) {
            return current;
          }

          return {
            ...current,
            data: [message, ...current.data],
            meta: current.meta,
          };
        },
      );
    },
    [activeConversationId, queryClient],
  );

  const { joinConversation, sendMessage } = useChatSocket({
    enabled: open,
    onNewMessage: handleNewMessage,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (conversationQuery.isLoading) {
      return;
    }

    if (!currentConversation) {
      return;
    }

    window.queueMicrotask(() => {
      setConversationId(currentConversation.id);
      void joinConversation(currentConversation.id);
    });
  }, [
    conversationQuery.isLoading,
    currentConversation,
    joinConversation,
    open,
  ]);

  // Drop pending rows once the same message id appears in history.
  useEffect(() => {
    if (!historyMessages.length || !pendingMessages.length) {
      return;
    }

    const historyIds = new Set(
      historyMessages.map((message) => String(message.id)),
    );

    let cancelled = false;
    window.queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      setPendingMessages((current) => {
        const next = current.filter(
          (message) =>
            message.status === "sending" ||
            message.status === "failed" ||
            !historyIds.has(String(message.id)),
        );

        return next.length === current.length ? current : next;
      });
    });

    return () => {
      cancelled = true;
    };
  }, [historyMessages, pendingMessages.length]);

  const sendCustomerMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const tempMessage = createTempChatMessage({
      author: "customer",
      text: trimmed,
    });

    setPendingMessages((current) =>
      sortChatMessages([...current, tempMessage]),
    );
    setInputValue("");
    window.requestAnimationFrame(() => {
      scrollMessagesToBottom("smooth");
    });

    const ack = await sendMessage({
      conversationId: activeConversationId,
      content: trimmed,
      type: "text",
    });

    const data = ack.data;

    if (!ack.success || !data) {
      console.warn("Customer chat message failed", ack.error);
      setPendingMessages((current) =>
        markChatMessageFailed(current, tempMessage.id),
      );
      return;
    }

    const nextConversationId = data.message.conversationId;
    setConversationId(nextConversationId);
    void joinConversation(nextConversationId);

    // Remove temp; put confirmed message into the messages query cache.
    setPendingMessages((current) =>
      current.filter((message) => message.id !== tempMessage.id),
    );

    queryClient.setQueryData(
      [
        "chat",
        "messages",
        nextConversationId,
        { limit: 100, page: 1, order: "DESC" },
      ],
      (
        current: { data?: ChatMessageResponse[]; meta?: unknown } | undefined,
      ) => {
        if (!current?.data) {
          return {
            data: [data.message],
            meta: { page: 1, limit: 100, total: 1, totalPages: 1 },
          };
        }

        if (current.data.some((item) => item.id === data.message.id)) {
          return current;
        }

        return {
          ...current,
          data: [data.message, ...current.data],
        };
      },
    );

    void queryClient.invalidateQueries({
      queryKey: ["chat", "customer-conversation"],
    });
    void queryClient.invalidateQueries({
      queryKey: ["chat", "messages", nextConversationId],
    });
  };

  return (
    <div className="fixed bottom-3 right-3 z-[90] sm:bottom-5 sm:right-5">
      {open ? (
        <section className="flex h-[590px] max-h-[calc(100dvh-24px)] w-[calc(100vw-24px)] max-w-[340px] flex-col overflow-hidden rounded-[22px] border border-[#e8e0d9] bg-[#fcfbfa] shadow-[0_16px_45px_rgba(67,32,16,0.2)]">
          <header className="flex shrink-0 items-center justify-between bg-gradient-to-br from-[#0a936b] to-[#057958] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/15 shadow-inner">
                <Headphones size={20} strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm font-black leading-none">Hỗ trợ CheNow</p>
                <p className="mt-1 text-[10px] font-medium text-white/80">
                  Thường phản hồi trong vài phút
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                aria-label="Thu nhỏ chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                onClick={() => setOpen(false)}
                type="button"
              >
                <Minus size={17} strokeWidth={2.5} />
              </button>
              <button
                aria-label="Đóng chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          </header>

          <ChatMessageList
            className="min-h-0 flex-1"
            currentUserRole="customer"
            emptyState={loadingHistory ? "Đang tải tin nhắn..." : undefined}
            messages={displayMessages}
            notice={
              <div className="flex items-start gap-2 rounded-xl bg-[#eaf5f0] px-3 py-2.5 text-[11px] font-medium leading-5 text-[#50635a]">
                <Sparkles
                  className="mt-0.5 shrink-0 text-[#07845f]"
                  size={13}
                />
                <span>
                  Bạn có thể hỏi về món, topping, phí giao hoặc đơn hàng hiện
                  tại.
                </span>
              </div>
            }
            ref={messageListRef}
            variant="customer"
          />

          <div className="shrink-0 bg-[#fcfbfa] px-3 pb-3 pt-1">
            <ChatQuickReplies
              className="mb-3"
              items={quickReplies}
              onSelect={sendCustomerMessage}
              variant="customer"
            />
            <ChatComposer
              disabled={loadingHistory}
              onChange={setInputValue}
              onSubmit={() => sendCustomerMessage(inputValue)}
              value={inputValue}
              variant="customer"
            />
          </div>

          <footer className="flex h-10 shrink-0 items-center justify-center gap-1.5 border-t border-[#eee8e2] bg-white text-[10px] text-[#8e837b]">
            <Leaf className="text-[#18a474]" size={12} />
            <span>
              Powered by{" "}
              <strong className="font-black text-[#6d625b]">CheNow</strong>
            </span>
          </footer>
        </section>
      ) : (
        <button
          aria-label="Mở chat hỗ trợ"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#07845f] text-white shadow-[0_10px_28px_rgba(7,132,95,0.32)] transition-transform hover:scale-105"
          onClick={() => setOpen(true)}
          type="button"
        >
          <MessageCircle size={24} />
          <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#f4b544]" />
          <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-full bg-[#432010] px-3 py-2 text-xs font-bold text-white shadow-lg group-hover:block">
            Chat với CheNow
          </span>
        </button>
      )}
    </div>
  );
}
