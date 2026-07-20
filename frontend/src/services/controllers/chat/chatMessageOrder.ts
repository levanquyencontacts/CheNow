import { ChatMessage } from "@/services/types/apiType";

export function getChatMessageTimeMs(message: Pick<ChatMessage, "createdAt">) {
  if (!message.createdAt) {
    return 0;
  }

  const timestamp = new Date(message.createdAt).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export function compareChatMessages(first: ChatMessage, second: ChatMessage) {
  const firstId = typeof first.id === "number" ? first.id : null;
  const secondId = typeof second.id === "number" ? second.id : null;

  // Persisted messages: serial id = server insert order (stable across timezone quirks).
  if (firstId != null && secondId != null && firstId !== secondId) {
    return firstId - secondId;
  }

  const timeDiff = getChatMessageTimeMs(first) - getChatMessageTimeMs(second);

  if (timeDiff !== 0) {
    return timeDiff;
  }

  // Temp/optimistic ids stay after persisted messages when timestamps match.
  if (typeof first.id === "string" && typeof second.id !== "string") {
    return 1;
  }

  if (typeof first.id !== "string" && typeof second.id === "string") {
    return -1;
  }

  return String(first.id).localeCompare(String(second.id));
}

export function sortChatMessages(messages: ChatMessage[]) {
  return [...messages].sort(compareChatMessages);
}

export function mergeMessages(
  apiMessages: ChatMessage[],
  liveMessages: ChatMessage[],
) {
  const merged = new Map<string, ChatMessage>();

  apiMessages.forEach((message) => {
    merged.set(String(message.id), message);
  });

  liveMessages.forEach((message) => {
    merged.set(String(message.id), message);
  });

  return sortChatMessages(Array.from(merged.values()));
}
