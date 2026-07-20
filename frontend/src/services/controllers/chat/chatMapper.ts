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
  const createdAt = normalizeChatDate(message.createdAt);

  return {
    id: message.id,
    author: message.senderRole,
    createdAt,
    status: "sent",
    text: message.content ?? "",
    time: formatChatTime(createdAt),
  };
}

export function mapChatConversationResponse(
  conversation: ChatConversationResponse,
): ChatConversation {
  const lastMessage = conversation.lastMessage?.content ?? "";
  const lastMessageAt = conversation.lastMessageAt
    ? normalizeChatDate(conversation.lastMessageAt)
    : conversation.lastMessage?.createdAt
      ? normalizeChatDate(conversation.lastMessage.createdAt)
      : null;

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
    time: lastMessageAt ? formatChatTime(lastMessageAt) : "",
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

function normalizeChatDate(value: string | Date | number) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? new Date().toISOString()
      : value.toISOString();
  }

  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? new Date().toISOString()
      : date.toISOString();
  }

  const raw = String(value).trim();

  if (!raw) {
    return new Date().toISOString();
  }

  // Already has an explicit timezone / Zulu marker.
  if (/[zZ]|[+-]\d{2}:?\d{2}$/.test(raw)) {
    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? raw : date.toISOString();
  }

  // Postgres / Nest often returns "YYYY-MM-DD HH:mm:ss[.sss]" without zone.
  // Treat that as Asia/Ho_Chi_Minh (server), not browser-local or UTC.
  const isoLocal = raw.includes("T") ? raw : raw.replace(" ", "T");
  const hanoiDate = new Date(`${isoLocal}+07:00`);

  if (!Number.isNaN(hanoiDate.getTime())) {
    return hanoiDate.toISOString();
  }

  const fallback = new Date(raw);
  return Number.isNaN(fallback.getTime()) ? raw : fallback.toISOString();
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
