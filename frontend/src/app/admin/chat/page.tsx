"use client";

import { useCallback, useMemo, useState } from "react";
import { Paper } from "@/components";
import { useChatSocket } from "@/hooks/useChatSocket";
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
} from "@/services/types/apiType";
import { AdminChatHeader } from "./components/AdminChatHeader";
import { ConversationList } from "./components/ConversationList";
import { ConversationPanel } from "./components/ConversationPanel";
import { CustomerInfoPanel } from "./components/CustomerInfoPanel";
import {
  conversations,
  messages as initialMessages,
  quickAnswers,
} from "./components/admin-chat.mock";

export default function AdminChatPage() {
  const [conversationItems, setConversationItems] =
    useState<ChatConversation[]>(conversations);
  const [conversationMessages, setConversationMessages] =
    useState<Record<number, ChatMessage[]>>({
      [conversations[0].id]: initialMessages,
    });
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [reply, setReply] = useState("");
  const [search, setSearch] = useState("");

  const upsertConversation = useCallback((conversation: ChatConversation) => {
    setConversationItems((current) => {
      const withoutCurrent = current.filter((item) => item.id !== conversation.id);

      return [conversation, ...withoutCurrent];
    });
  }, []);

  const handleNewMessage = useCallback((message: ChatMessageResponse) => {
    if (message.senderRole !== "customer") {
      return;
    }

    setConversationMessages((current) => ({
      ...current,
      [message.conversationId]: [
        ...(current[message.conversationId] ?? []),
        mapChatMessageResponse(message),
      ],
    }));
  }, []);

  const handleConversationUpdated = useCallback(
    (conversation: ChatConversationResponse) => {
      upsertConversation(mapChatConversationResponse(conversation));
    },
    [upsertConversation],
  );

  const { joinConversation, sendMessage } = useChatSocket({
    onConversationUpdated: handleConversationUpdated,
    onNewMessage: handleNewMessage,
  });

  const filteredConversations = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return conversationItems;
    }

    return conversationItems.filter((conversation) =>
      [conversation.customer, conversation.phone, conversation.lastMessage]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [conversationItems, search]);

  const activeConversation = useMemo(
    () =>
      conversationItems.find((conversation) => conversation.id === activeId) ??
      conversationItems[0],
    [activeId, conversationItems],
  );

  const activeMessages = conversationMessages[activeId] ?? [];

  const handleSelectConversation = (conversationId: number) => {
    setActiveId(conversationId);
    void joinConversation(conversationId);
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

    setConversationMessages((current) => ({
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
      setConversationMessages((current) => ({
        ...current,
        [activeConversation.id]: markChatMessageFailed(
          current[activeConversation.id] ?? [],
          tempMessage.id,
        ),
      }));
      return;
    }

    setConversationMessages((current) => ({
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
    <div className="flex min-h-screen flex-col bg-[#fff8f1] p-4 text-[#183d2b]">
      <AdminChatHeader />

      <Paper
        className="grid min-h-[720px] overflow-hidden border border-[#eadfd4] lg:grid-cols-[310px_minmax(0,1fr)_280px]"
        elevation={1}
      >
        <ConversationList
          activeId={activeId}
          conversations={filteredConversations}
          onSearchChange={setSearch}
          onSelectConversation={handleSelectConversation}
          searchValue={search}
        />
        {activeConversation ? (
          <>
            <ConversationPanel
              conversation={activeConversation}
              messages={activeMessages}
              onQuickAnswer={setReply}
              onReplyChange={setReply}
              onSendReply={handleSendReply}
              quickAnswers={quickAnswers}
              reply={reply}
            />
            <CustomerInfoPanel conversation={activeConversation} />
          </>
        ) : null}
      </Paper>
    </div>
  );
}
