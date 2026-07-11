import { ChatConversation, ChatMessage } from "@/services/types/apiType";

export function mergeConversations(
  apiConversations: ChatConversation[],
  liveConversations: ChatConversation[],
) {
  const liveIds = new Set(
    liveConversations.map((conversation) => conversation.id),
  );

  return [
    ...liveConversations,
    ...apiConversations.filter((conversation) => !liveIds.has(conversation.id)),
  ];
}

export function mergeMessages(
  apiMessages: ChatMessage[],
  liveMessages: ChatMessage[],
) {
  const merged = new Map<ChatMessage["id"], ChatMessage>();

  apiMessages.forEach((message) => {
    merged.set(message.id, message);
  });

  liveMessages.forEach((message) => {
    merged.set(message.id, message);
  });

  return Array.from(merged.values()).sort((first, second) => {
    const firstTime = first.createdAt ? new Date(first.createdAt).getTime() : 0;
    const secondTime = second.createdAt
      ? new Date(second.createdAt).getTime()
      : 0;

    return firstTime - secondTime;
  });
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
