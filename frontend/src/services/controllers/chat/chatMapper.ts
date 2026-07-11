import {
  ChatAuthor,
  ChatConversation,
  ChatConversationResponse,
  ChatMessage,
  ChatMessageResponse,
} from "@/services/types/apiType";

export function createTempChatMessage({
  author,
  text,
}: {
  author: ChatAuthor;
  text: string;
}): ChatMessage {
  const createdAt = new Date().toISOString();

  return {
    id: `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    author,
    createdAt,
    status: "sending",
    text,
    time: formatChatTime(createdAt),
  };
}

export function mapChatMessageResponse(
  message: ChatMessageResponse,
): ChatMessage {
  return {
    id: message.id,
    author: message.senderRole,
    createdAt: message.createdAt,
    status: "sent",
    text: message.content ?? "",
    time: formatChatTime(message.createdAt),
  };
}

export function mapChatConversationResponse(
  conversation: ChatConversationResponse,
): ChatConversation {
  const lastMessage = conversation.lastMessage?.content ?? "";

  return {
    id: conversation.id,
    channel: "Website",
    customer:
      conversation.title ??
      conversation.customer?.fullName ??
      conversation.customer?.email ??
      "Khách hàng",
    lastMessage,
    lastMessageId: conversation.lastMessage?.id,
    orderCode: "Chưa có đơn",
    phone: "",
    status: "Đang tư vấn",
    time: conversation.lastMessageAt
      ? formatChatTime(conversation.lastMessageAt)
      : "",
    unread: conversation.unreadCount ?? 0,
  };
}

export function replaceChatMessage(
  messages: ChatMessage[],
  tempId: ChatMessage["id"],
  nextMessage: ChatMessage,
) {
  return messages.map((message) =>
    message.id === tempId ? nextMessage : message,
  );
}

export function markChatMessageFailed(
  messages: ChatMessage[],
  tempId: ChatMessage["id"],
) {
  return messages.map((message) =>
    message.id === tempId ? { ...message, status: "failed" as const } : message,
  );
}

function formatChatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  });
}
