"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Headphones,
  MessageCircle,
  Minimize2,
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
        (current: { data?: ChatMessageResponse[]; meta?: unknown } | undefined) => {
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

    setPendingMessages((current) => {
      const next = current.filter(
        (message) =>
          message.status === "sending" ||
          message.status === "failed" ||
          !historyIds.has(String(message.id)),
      );

      return next.length === current.length ? current : next;
    });
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
      (current: { data?: ChatMessageResponse[]; meta?: unknown } | undefined) => {
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
    <div className="fixed bottom-5 right-5 z-[90]">
      {open ? (
        <section className="w-[calc(100vw-40px)] max-w-[360px] overflow-hidden rounded-2xl border border-[#eadfd4] bg-white shadow-2xl">
          <header className="flex items-center justify-between bg-[#432010] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <Headphones size={18} />
              </div>
              <div>
                <p className="text-sm font-black leading-none">Hỗ trợ CheNow</p>
                <p className="mt-1 text-[11px] text-white/60">
                  Thường phản hồi trong vài phút
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                aria-label="Thu nhỏ chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                onClick={() => setOpen(false)}
                type="button"
              >
                <Minimize2 size={16} />
              </button>
              <button
                aria-label="Đóng chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          </header>

          <ChatMessageList
            className="max-h-[360px]"
            currentUserRole="customer"
            emptyState={loadingHistory ? "Đang tải tin nhắn..." : undefined}
            messages={displayMessages}
            notice={
              <div className="rounded-xl bg-[#eef7ef] px-3 py-2 text-xs font-semibold text-[#315d3b]">
                <Sparkles className="mr-1 inline-block" size={13} />
                Bạn có thể hỏi về món, topping, phí giao hàng hoặc đơn hiện tại.
              </div>
            }
            ref={messageListRef}
          />

          <div className="border-t border-[#eadfd4] bg-white p-3">
            <ChatQuickReplies
              className="mb-3"
              items={quickReplies}
              onSelect={sendCustomerMessage}
            />
            <ChatComposer
              disabled={loadingHistory}
              onChange={setInputValue}
              onSubmit={() => sendCustomerMessage(inputValue)}
              value={inputValue}
            />
          </div>
        </section>
      ) : (
        <button
          aria-label="Mở chat hỗ trợ"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#2d6a4f] text-white shadow-2xl transition-transform hover:scale-105"
          onClick={() => setOpen(true)}
          type="button"
        >
          <MessageCircle size={24} />
          <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-[#f59e0b]" />
          <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-full bg-[#432010] px-3 py-2 text-xs font-bold text-white shadow-lg group-hover:block">
            Chat với CheNow
          </span>
        </button>
      )}
    </div>
  );
}
