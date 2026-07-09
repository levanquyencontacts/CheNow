"use client";

import { useMemo, useState } from "react";
import { Paper } from "@/components";
import { AdminChatHeader } from "./components/AdminChatHeader";
import { ConversationList } from "./components/ConversationList";
import { ConversationPanel } from "./components/ConversationPanel";
import { CustomerInfoPanel } from "./components/CustomerInfoPanel";
import {
  conversations,
  messages,
  quickAnswers,
} from "./components/admin-chat.mock";

export default function AdminChatPage() {
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [reply, setReply] = useState("");
  const [search, setSearch] = useState("");

  const filteredConversations = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return conversations;
    }

    return conversations.filter((conversation) =>
      [conversation.customer, conversation.phone, conversation.lastMessage]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [search]);

  const activeConversation = useMemo(
    () =>
      conversations.find((conversation) => conversation.id === activeId) ??
      conversations[0],
    [activeId],
  );

  const handleSendReply = () => {
    if (!reply.trim()) {
      return;
    }

    setReply("");
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
          onSelectConversation={setActiveId}
          searchValue={search}
        />
        <ConversationPanel
          conversation={activeConversation}
          messages={messages}
          onQuickAnswer={setReply}
          onReplyChange={setReply}
          onSendReply={handleSendReply}
          quickAnswers={quickAnswers}
          reply={reply}
        />
        <CustomerInfoPanel conversation={activeConversation} />
      </Paper>
    </div>
  );
}
