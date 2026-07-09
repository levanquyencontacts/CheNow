import { useQuery } from "@tanstack/react-query";
import api from "@/services/apiServices";
import { PaginationParams } from "@/services/types/apiType";

export const useCustomerChatConversationQuery = (
  params?: PaginationParams,
  enabled = true,
) => {
  return useQuery({
    enabled,
    queryKey: ["chat", "customer-conversation", params],
    queryFn: () => api.chat.getConversations(params),
  });
};

export const useChatMessagesQuery = (
  conversationId?: number,
  params?: PaginationParams,
  enabled = true,
) => {
  return useQuery({
    enabled: enabled && Boolean(conversationId),
    queryKey: ["chat", "messages", conversationId, params],
    queryFn: () => api.chat.getMessages(Number(conversationId), params),
  });
};
