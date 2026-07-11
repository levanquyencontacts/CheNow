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
  replaceChatMessage,
} from "@/services/controllers/chat/chatMapper";
import {
  ChatConversation,
  ChatConversationResponse,
  ChatMessage,
  ChatMessageResponse,
  PaginatedResponse,
} from "@/services/types/apiType";
import {
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

function isFullChatMessage(
  message: ChatConversationResponse["lastMessage"],
): message is ChatMessageResponse {
  return Boolean(
    message &&
      "conversationId" in message &&
      "updatedAt" in message &&
      "deletedAt" in message,
  );
}

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
  const conversationItemsRef = useRef<ChatConversation[]>([]);
  const previousActiveId = useRef<number | undefined>(undefined);

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
    if (activeId && conversationItems.some((item) => item.id === activeId)) {
      return activeId;
    }

    return conversationItems[0]?.id;
  }, [activeId, conversationItems]);

  useEffect(() => {
    if (activeId || !conversationItems[0]) {
      return;
    }

    const firstConversationId = conversationItems[0].id;

    window.queueMicrotask(() => setActiveId(firstConversationId));
  }, [activeId, conversationItems]);

  useEffect(() => {
    conversationItemsRef.current = conversationItems;
  }, [conversationItems]);

  const messagesQuery = useChatMessagesInfiniteQuery(
    selectedConversationId,
    messageQueryParams,
    Boolean(selectedConversationId),
  );
  const refetchMessages = messagesQuery.refetch;

  const apiMessages = useMemo(
    () =>
      (messagesQuery.data?.pages.flatMap((page) => page.data) ?? [])
        .map(mapChatMessageResponse)
        .reverse(),
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

  const refreshConversationMessages = useCallback(
    (conversationId: number) => {
      return queryClient.invalidateQueries({
        queryKey: ["chat", "messages", "infinite", conversationId],
      });
    },
    [queryClient],
  );

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

  const handleNewMessage = useCallback(
    (message: ChatMessageResponse) => {
      if (message.senderRole !== "customer") {
        return;
      }

      const currentConversation = conversationItemsRef.current.find(
        (item) => item.id === message.conversationId,
      );
      const mappedMessage = mapChatMessageResponse(message);

      appendMessageToMessagesCache(message);
      if (
        currentConversation &&
        currentConversation.lastMessageId !== message.id
      ) {
        upsertConversation({
          ...currentConversation,
          lastMessage: message.content ?? "",
          lastMessageId: message.id,
          time: mappedMessage.time,
          unread:
            message.conversationId === selectedConversationId
              ? 0
              : currentConversation.unread + 1,
        });
      }

      setLiveMessages((current) => ({
        ...current,
        [message.conversationId]: [
          ...(current[message.conversationId] ?? []),
          mappedMessage,
        ],
      }));

      if (message.conversationId === selectedConversationId) {
        clearConversationUnread(message.conversationId);
      }
    },
    [
      appendMessageToMessagesCache,
      clearConversationUnread,
      selectedConversationId,
      upsertConversation,
    ],
  );

  const handleConversationUpdated = useCallback(
    (conversation: ChatConversationResponse) => {
      const mappedConversation = mapChatConversationResponse(conversation);
      const currentConversation = conversationItemsRef.current.find(
        (item) => item.id === conversation.id,
      );
      const shouldPreserveLocalUnread =
        conversation.unreadCount === undefined && currentConversation;
      const shouldMarkNewConversationUnread =
        conversation.unreadCount === undefined &&
        !currentConversation &&
        conversation.id !== selectedConversationId &&
        conversation.lastMessage?.senderRole === "customer";
      let nextConversation = mappedConversation;

      if (shouldPreserveLocalUnread) {
        nextConversation = {
          ...mappedConversation,
          unread: currentConversation.unread,
        };
      } else if (shouldMarkNewConversationUnread) {
        nextConversation = {
          ...mappedConversation,
          unread: 1,
        };
      }

      if (isFullChatMessage(conversation.lastMessage)) {
        appendMessageToMessagesCache(conversation.lastMessage);
      }

      upsertConversation(nextConversation);
      void refreshConversationMessages(conversation.id);

      if (conversation.id === selectedConversationId) {
        clearConversationUnread(conversation.id);
      }
    },
    [
      appendMessageToMessagesCache,
      clearConversationUnread,
      refreshConversationMessages,
      selectedConversationId,
      upsertConversation,
    ],
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
    void refetchMessages();
    clearConversationUnread(selectedConversationId);
    markConversationReadWithReason(selectedConversationId);
  }, [
    clearConversationUnread,
    joinConversation,
    leaveConversation,
    markConversationReadWithReason,
    refetchMessages,
    selectedConversationId,
  ]);

  useEffect(() => {
    if (!selectedConversationId || !activeMessages.length) {
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
    setActiveId(conversationId);
    setReply("");
    void refreshConversationMessages(conversationId);
  };

  const handleSendReply = async () => {
    const trimmed = reply.trim();
    if (!trimmed || !activeConversation) {
      return;
    }

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

    setLiveMessages((current) => ({
      ...current,
      [activeConversation.id]: replaceChatMessage(
        current[activeConversation.id] ?? [],
        tempMessage.id,
        mapChatMessageResponse(data.message),
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
