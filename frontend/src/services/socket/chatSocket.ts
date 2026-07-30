import { io, Socket } from "socket.io-client";
import {
  ChatConversationResponse,
  ChatMessageResponse,
  ChatSocketAck,
  MarkChatConversationReadResult,
  SendChatMessagePayload,
  SendChatMessageResult,
} from "@/services/types/apiType";
import { clearStoredTokens } from "@/services/controllers/auth/tokenStorage";

const socketURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:3001";

let chatSocket: Socket | null = null;

export function connectChatSocket(token: string) {
  if (chatSocket?.connected) {
    return chatSocket;
  }

  chatSocket = io(socketURL, {
    auth: { token },
    autoConnect: true,
    transports: ["websocket"],
  });
  chatSocket.on("auth:role-changed", () => {
    clearStoredTokens();
    window.location.assign("/login");
  });

  return chatSocket;
}

export function disconnectChatSocket() {
  chatSocket?.disconnect();
  chatSocket = null;
}

export function getChatSocket() {
  return chatSocket;
}

export function sendChatMessage(
  payload: SendChatMessagePayload,
  timeoutMs = 10000,
) {
  return emitWithAck<SendChatMessageResult>("message:send", payload, timeoutMs);
}

export function joinConversation(conversationId: number) {
  return emitWithAck<ChatConversationResponse>("conversation:join", {
    conversationId,
  });
}

export function leaveConversation(conversationId: number) {
  return emitWithAck<{ conversationId: number }>("conversation:leave", {
    conversationId,
  });
}

export function markConversationRead(conversationId: number) {
  return emitWithAck<MarkChatConversationReadResult>("conversation:read", {
    conversationId,
  });
}

export function onNewMessage(callback: (message: ChatMessageResponse) => void) {
  chatSocket?.on("message:new", callback);

  return () => {
    chatSocket?.off("message:new", callback);
  };
}

export function onConversationUpdated(
  callback: (conversation: ChatConversationResponse) => void,
) {
  chatSocket?.on("conversation:updated", callback);
  chatSocket?.on("conversation:broadcast", callback);

  return () => {
    chatSocket?.off("conversation:updated", callback);
    chatSocket?.off("conversation:broadcast", callback);
  };
}

function emitWithAck<T>(
  eventName: string,
  payload: unknown,
  timeoutMs = 10000,
): Promise<ChatSocketAck<T>> {
  return new Promise((resolve) => {
    if (!chatSocket?.connected) {
      resolve({
        success: false,
        error: { message: "Socket is not connected" },
      });
      return;
    }

    let settled = false;
    const timer = window.setTimeout(() => {
      if (settled) {
        return;
      }

      settled = true;
      resolve({
        success: false,
        error: { message: "Socket request timed out" },
      });
    }, timeoutMs);

    chatSocket.emit(eventName, payload, (ack: ChatSocketAck<T>) => {
      if (settled) {
        return;
      }

      settled = true;
      window.clearTimeout(timer);
      resolve(ack);
    });
  });
}
