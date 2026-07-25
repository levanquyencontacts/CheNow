"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { LIMIT_PAGE } from "@/common/utils/constant";
import { Paper } from "@/components";
import { useChatSocket } from "@/hooks/useChatSocket";
import {
  useChatMessagesInfiniteQuery,
  useCustomerChatConversationQuery,
} from "@/services/controllers/chat/ChatQueries";
import {
  createTempChatMessage,
  mapChatConversationResponse,
  mapChatMessageResponse,
  markChatMessageFailed,
} from "@/services/controllers/chat/chatMapper";
import {
  ChatConversation,
  ChatConversationResponse,
  ChatMessage,
  ChatMessageResponse,
  PaginatedResponse,
} from "@/services/types/apiType";
import {
  compareChatMessages,
  filterConversationsByKeyword,
  markConversationReadLocally,
  mergeConversations,
  mergeMessages,
} from "./admin-ultils/admin-chat.utils";
import { AdminChatHeader } from "./components/AdminChatHeader";
import { ConversationList } from "./components/ConversationList";
import { ConversationPanel } from "./components/ConversationPanel";
import { CustomerInfoPanel } from "./components/CustomerInfoPanel";
import { quickAnswers } from "./components/admin-chat.mock";

const conversationQueryParams = {
  limit: LIMIT_PAGE * 2,
  order: "DESC" as const,
  page: 1,
  sort: "lastMessageAt",
};

const messageQueryParams = {
  limit: 30,
  order: "DESC" as const,
  sort: "createdAt",
};

type ChatMessagesInfiniteData = InfiniteData<
  PaginatedResponse<ChatMessageResponse>,
  number
>;

export default function AdminChatPage() {
  const queryClient = useQueryClient();
  const [liveConversations, setLiveConversations] = useState<
    ChatConversation[]
  >([]);
  const [liveMessages, setLiveMessages] = useState<Record<number, ChatMessage[]>>(
    {},
  );
  const [activeId, setActiveId] = useState<number>();
  const [reply, setReply] = useState("");
  const [search, setSearch] = useState("");
  const userSelectedRef = useRef(false);
  const conversationItemsRef = useRef<ChatConversation[]>([]);
  const previousActiveId = useRef<number | undefined>(undefined);
  const selectedConversationIdRef = useRef<number | undefined>(undefined);

  const conversationParams = useMemo(
    () => ({
      ...conversationQueryParams,
      searchValue: search.trim() || undefined,
    }),
    [search],
  );

  const conversationsQuery =
    useCustomerChatConversationQuery(conversationParams);

  const apiConversations = useMemo(
    () =>
      (conversationsQuery.data?.data ?? []).map(mapChatConversationResponse),
    [conversationsQuery.data],
  );

  const conversationItems = useMemo(
    () =>
      filterConversationsByKeyword(
        mergeConversations(apiConversations, liveConversations),
        search,
      ),
    [apiConversations, liveConversations, search],
  );

  const selectedConversationId = useMemo(() => {
    if (activeId != null) {
      return activeId;
    }

    return conversationItems[0]?.id;
  }, [activeId, conversationItems]);

  // Pin the first thread once so a newer conversation moving to top does not
  // auto-select itself and immediately wipe its unread badge.
  useEffect(() => {
    if (activeId != null || conversationItems[0]?.id == null) {
      return;
    }

    const firstConversationId = conversationItems[0].id;
    let cancelled = false;

    queueMicrotask(() => {
      if (!cancelled) {
        setActiveId(firstConversationId);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activeId, conversationItems]);

  useEffect(() => {
    conversationItemsRef.current = conversationItems;
  }, [conversationItems]);

  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  const messagesQuery = useChatMessagesInfiniteQuery(
    selectedConversationId,
    messageQueryParams,
    Boolean(selectedConversationId),
  );

  const apiMessages = useMemo(
    () =>
      (messagesQuery.data?.pages.flatMap((page) => page.data) ?? [])
        .map(mapChatMessageResponse)
        .sort(compareChatMessages),
    [messagesQuery.data],
  );

  const upsertConversation = useCallback((conversation: ChatConversation) => {
    setLiveConversations((current) => {
      const withoutCurrent = current.filter(
        (item) => item.id !== conversation.id,
      );

      return [conversation, ...withoutCurrent];
    });
  }, []);

  const clearConversationUnread = useCallback((conversationId: number) => {
    setLiveConversations((current) => {
      const updatedCurrent = markConversationReadLocally(
        current,
        conversationId,
      );

      if (updatedCurrent.some((conversation) => conversation.id === conversationId)) {
        return updatedCurrent;
      }

      const conversation = conversationItemsRef.current.find(
        (item) => item.id === conversationId,
      );

      return conversation
        ? [{ ...conversation, unread: 0 }, ...updatedCurrent]
        : updatedCurrent;
    });
  }, []);

  const appendMessageToMessagesCache = useCallback(
    (message: ChatMessageResponse) => {
      queryClient.setQueriesData<ChatMessagesInfiniteData>(
        {
          queryKey: ["chat", "messages", "infinite", message.conversationId],
        },
        (current) => {
          if (!current?.pages.length) {
            return current;
          }

          const alreadyExists = current.pages.some((page) =>
            page.data.some((item) => item.id === message.id),
          );

          if (alreadyExists) {
            return current;
          }

          const [firstPage, ...restPages] = current.pages;

          return {
            ...current,
            pages: [
              {
                ...firstPage,
                data: [message, ...firstPage.data],
                meta: {
                  ...firstPage.meta,
                  total: firstPage.meta.total + 1,
                },
              },
              ...restPages,
            ],
          };
        },
      );
    },
    [queryClient],
  );

  // Thread: message:new → cache + optimistic inbox unread for other threads.
  const handleNewMessage = useCallback(
    (message: ChatMessageResponse) => {
      const selectedId = selectedConversationIdRef.current;
      const mappedMessage = mapChatMessageResponse(message);

      appendMessageToMessagesCache(message);

      setLiveMessages((current) => {
        const existing = current[message.conversationId];
        if (!existing?.length) {
          return current;
        }

        return {
          ...current,
          [message.conversationId]: existing.filter(
            (item) => item.status === "sending" || item.status === "failed",
          ),
        };
      });

      if (message.conversationId === selectedId) {
        clearConversationUnread(message.conversationId);
        return;
      }

      if (message.senderRole !== "customer") {
        return;
      }

      const currentConversation = conversationItemsRef.current.find(
        (item) => item.id === message.conversationId,
      );

      if (!currentConversation || currentConversation.lastMessageId === message.id) {
        return;
      }

      upsertConversation({
        ...currentConversation,
        lastMessage: message.content ?? "",
        lastMessageId: message.id,
        time: mappedMessage.time,
        unread: currentConversation.unread + 1,
      });
    },
    [appendMessageToMessagesCache, clearConversationUnread, upsertConversation],
  );

  // Inbox: conversation:updated + conversation:broadcast (per-user unreadCount).
  const handleConversationUpdated = useCallback(
    (conversation: ChatConversationResponse) => {
      const mappedConversation = mapChatConversationResponse(conversation);
      const currentConversation = conversationItemsRef.current.find(
        (item) => item.id === conversation.id,
      );
      const selectedId = selectedConversationIdRef.current;
      const isSelected = conversation.id === selectedId;
      const incomingLastMessageId = conversation.lastMessage?.id;
      const hasNewCustomerMessage =
        conversation.lastMessage?.senderRole === "customer" &&
        incomingLastMessageId != null &&
        incomingLastMessageId !== currentConversation?.lastMessageId;
      const serverUnread =
        typeof conversation.unreadCount === "number"
          ? conversation.unreadCount
          : null;

      let unread: number;

      if (isSelected) {
        unread = 0;
      } else if (serverUnread != null && serverUnread > 0) {
        unread = serverUnread;
      } else if (hasNewCustomerMessage) {
        // Server may still return 0 (stale lastReadAt); never drop a new customer preview.
        unread = Math.max(serverUnread ?? 0, (currentConversation?.unread ?? 0) + 1);
      } else if (
        conversation.lastMessage?.senderRole === "customer" &&
        (currentConversation?.unread ?? 0) > 0 &&
        (serverUnread == null || serverUnread === 0)
      ) {
        // Keep optimistic badge if message:new already bumped and broadcast repeats same lastMessageId.
        unread = currentConversation!.unread;
      } else if (serverUnread != null) {
        unread = serverUnread;
      } else {
        unread = currentConversation?.unread ?? 0;
      }

      upsertConversation({
        ...mappedConversation,
        lastMessage:
          mappedConversation.lastMessage ||
          currentConversation?.lastMessage ||
          "",
        lastMessageId:
          incomingLastMessageId ?? currentConversation?.lastMessageId,
        time: mappedConversation.time || currentConversation?.time || "",
        unread,
      });

      if (isSelected) {
        clearConversationUnread(conversation.id);
      }
    },
    [clearConversationUnread, upsertConversation],
  );

  const {
    joinConversation,
    leaveConversation,
    markConversationRead,
    sendMessage,
  } = useChatSocket({
    onConversationUpdated: handleConversationUpdated,
    onNewMessage: handleNewMessage,
  });

  const markConversationReadWithReason = useCallback(
    (conversationId: number) => {
      if (conversationId !== selectedConversationId) {
        return;
      }

      void markConversationRead(conversationId);
    },
    [markConversationRead, selectedConversationId],
  );

  const activeConversation = useMemo(
    () =>
      conversationItems.find(
        (conversation) => conversation.id === selectedConversationId,
      ) ?? null,
    [selectedConversationId, conversationItems],
  );

  const activeMessages = selectedConversationId
    ? mergeMessages(apiMessages, liveMessages[selectedConversationId] ?? [])
    : [];

  useEffect(() => {
    if (
      !selectedConversationId ||
      previousActiveId.current === selectedConversationId
    ) {
      return;
    }

    const oldActiveId = previousActiveId.current;

    if (oldActiveId) {
      void leaveConversation(oldActiveId);
    }

    previousActiveId.current = selectedConversationId;
    void joinConversation(selectedConversationId);

    // Only persist "read" when the admin explicitly picked a thread.
    // Auto-pinning the first inbox item on reload must NOT clear unreadCount.
    if (userSelectedRef.current) {
      clearConversationUnread(selectedConversationId);
      markConversationReadWithReason(selectedConversationId);
    }
  }, [
    clearConversationUnread,
    selectedConversationId,
    joinConversation,
    leaveConversation,
    markConversationReadWithReason,
  ]);

  useEffect(() => {
    if (
      !userSelectedRef.current ||
      !selectedConversationId ||
      !activeMessages.length
    ) {
      return;
    }

    clearConversationUnread(selectedConversationId);
    markConversationReadWithReason(selectedConversationId);
  }, [
    activeMessages.length,
    clearConversationUnread,
    markConversationReadWithReason,
    selectedConversationId,
  ]);

  const handleSelectConversation = (conversationId: number) => {
    userSelectedRef.current = true;
    setActiveId(conversationId);
    setReply("");
    clearConversationUnread(conversationId);
    void markConversationRead(conversationId);
  };

  const handleSendReply = async () => {
    const trimmed = reply.trim();
    if (!trimmed || !activeConversation) {
      return;
    }

    userSelectedRef.current = true;
    clearConversationUnread(activeConversation.id);
    void markConversationRead(activeConversation.id);

    const tempMessage = createTempChatMessage({
      author: "staff",
      text: trimmed,
    });

    setLiveMessages((current) => ({
      ...current,
      [activeConversation.id]: [
        ...(current[activeConversation.id] ?? []),
        tempMessage,
      ],
    }));
    setReply("");

    const ack = await sendMessage({
      conversationId: activeConversation.id,
      content: trimmed,
      type: "text",
    });

    const data = ack.data;

    if (!ack.success || !data) {
      setLiveMessages((current) => ({
        ...current,
        [activeConversation.id]: markChatMessageFailed(
          current[activeConversation.id] ?? [],
          tempMessage.id,
        ),
      }));
      return;
    }

    // Persist into cache (sorted via mergeMessages) and drop the temp slot.
    appendMessageToMessagesCache(data.message);
    setLiveMessages((current) => ({
      ...current,
      [activeConversation.id]: (current[activeConversation.id] ?? []).filter(
        (message) => message.id !== tempMessage.id,
      ),
    }));
    upsertConversation(mapChatConversationResponse(data.conversation));
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#fff8f1] p-4 text-[#183d2b]">
      <AdminChatHeader />

      <Paper
        className="grid min-h-0 flex-1 overflow-hidden border border-[#eadfd4] lg:grid-cols-[310px_minmax(0,1fr)_280px]"
        elevation={1}
      >
        <ConversationList
          activeId={selectedConversationId}
          conversations={conversationItems}
          isError={conversationsQuery.isError}
          isLoading={conversationsQuery.isLoading}
          onSearchChange={setSearch}
          onSelectConversation={handleSelectConversation}
          searchValue={search}
        />
        {activeConversation ? (
          <>
            <ConversationPanel
              conversation={activeConversation}
              disabled={!activeConversation}
              hasOlderMessages={messagesQuery.hasNextPage}
              isError={messagesQuery.isError}
              isFetchingOlderMessages={messagesQuery.isFetchingNextPage}
              isLoading={messagesQuery.isLoading}
              messages={activeMessages}
              onLoadOlderMessages={() => {
                return messagesQuery.fetchNextPage();
              }}
              onQuickAnswer={setReply}
              onReplyChange={setReply}
              onSendReply={handleSendReply}
              quickAnswers={quickAnswers}
              reply={reply}
            />
            <CustomerInfoPanel conversation={activeConversation} />
          </>
        ) : (
          <section className="flex min-h-[560px] items-center justify-center bg-[#fffaf5] px-6 text-center text-sm font-semibold text-[#8a7867] lg:col-span-2">
            Chon mot hoi thoai de xem tin nhan.
          </section>
        )}
      </Paper>
    </div>
  );
}
