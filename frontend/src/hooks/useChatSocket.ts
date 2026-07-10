"use client";

import { useCallback, useEffect, useState } from "react";
import { getStoredAccessToken } from "@/services/controllers/auth/tokenStorage";
import {
  connectChatSocket,
  disconnectChatSocket,
  joinConversation,
  leaveConversation,
  markConversationRead,
  onConversationUpdated,
  onNewMessage,
  sendChatMessage,
} from "@/services/socket/chatSocket";
import {
  ChatConversationResponse,
  ChatMessageResponse,
  SendChatMessagePayload,
} from "@/services/types/apiType";

type UseChatSocketOptions = {
  enabled?: boolean;
  onConversationUpdated?: (conversation: ChatConversationResponse) => void;
  onNewMessage?: (message: ChatMessageResponse) => void;
};

export function useChatSocket({
  enabled = true,
  onConversationUpdated: handleConversationUpdated,
  onNewMessage: handleNewMessage,
}: UseChatSocketOptions = {}) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const token = getStoredAccessToken();

    if (!token) {
      return;
    }

    const socket = connectChatSocket(token);

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    window.queueMicrotask(() => setConnected(socket.connected));

    const cleanupNewMessage = handleNewMessage
      ? onNewMessage(handleNewMessage)
      : undefined;
    const cleanupConversationUpdated = handleConversationUpdated
      ? onConversationUpdated(handleConversationUpdated)
      : undefined;

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      cleanupNewMessage?.();
      cleanupConversationUpdated?.();
    };
  }, [enabled, handleConversationUpdated, handleNewMessage]);

  const sendMessage = useCallback((payload: SendChatMessagePayload) => {
    return sendChatMessage(payload);
  }, []);

  const join = useCallback((conversationId: number) => {
    return joinConversation(conversationId);
  }, []);

  const leave = useCallback((conversationId: number) => {
    return leaveConversation(conversationId);
  }, []);

  const markRead = useCallback((conversationId: number) => {
    return markConversationRead(conversationId);
  }, []);

  return {
    connected,
    disconnect: disconnectChatSocket,
    joinConversation: join,
    leaveConversation: leave,
    markConversationRead: markRead,
    sendMessage,
  };
}
