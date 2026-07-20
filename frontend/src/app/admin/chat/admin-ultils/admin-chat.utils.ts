import { ChatConversation } from "@/services/types/apiType";
import {
  compareChatMessages,
  mergeMessages,
} from "@/services/controllers/chat/chatMessageOrder";

export { compareChatMessages, mergeMessages };

export function mergeConversations(
  apiConversations: ChatConversation[],
  liveConversations: ChatConversation[],
) {
  const byId = new Map<number, ChatConversation>();

  for (const conversation of apiConversations) {
    byId.set(conversation.id, conversation);
  }

  for (const live of liveConversations) {
    const existing = byId.get(live.id);

    if (!existing) {
      byId.set(live.id, live);
      continue;
    }

    const liveMessageId = live.lastMessageId ?? 0;
    const existingMessageId = existing.lastMessageId ?? 0;

    if (liveMessageId > existingMessageId) {
      byId.set(live.id, live);
      continue;
    }

    if (liveMessageId === existingMessageId) {
      // Same preview: live wins (local read/clear is fresher than stale API).
      byId.set(live.id, {
        ...existing,
        ...live,
        unread: live.unread,
      });
    }
    // API has a newer last message — keep API row as-is.
  }

  const liveIds = new Set(liveConversations.map((conversation) => conversation.id));
  const ordered: ChatConversation[] = [];

  for (const live of liveConversations) {
    const merged = byId.get(live.id);
    if (merged) {
      ordered.push(merged);
    }
  }

  for (const api of apiConversations) {
    if (!liveIds.has(api.id)) {
      const merged = byId.get(api.id);
      if (merged) {
        ordered.push(merged);
      }
    }
  }

  return ordered;
}

export function filterConversationsByKeyword(
  conversations: ChatConversation[],
  keyword: string,
) {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) {
    return conversations;
  }

  return conversations.filter((conversation) =>
    [conversation.customer, conversation.phone, conversation.lastMessage]
      .join(" ")
      .toLowerCase()
      .includes(normalizedKeyword),
  );
}

export function markConversationReadLocally(
  conversations: ChatConversation[],
  conversationId: number,
) {
  return conversations.map((conversation) =>
    conversation.id === conversationId
      ? { ...conversation, unread: 0 }
      : conversation,
  );
}
