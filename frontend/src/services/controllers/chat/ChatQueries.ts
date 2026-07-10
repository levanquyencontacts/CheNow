import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import api from "@/services/apiServices";
import { PaginatedResponse, PaginationParams } from "@/services/types/apiType";

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

export const useChatMessagesInfiniteQuery = (
  conversationId?: number,
  params?: Omit<PaginationParams, "page">,
  enabled = true,
) => {
  return useInfiniteQuery({
    enabled: enabled && Boolean(conversationId),
    queryKey: ["chat", "messages", "infinite", conversationId, params],
    queryFn: ({ pageParam = 1 }) =>
      api.chat.getMessages(Number(conversationId), {
        ...params,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      const pagination = getPagination(lastPage);

      if (!pagination) {
        return undefined;
      }

      const nextPage = pagination.page + 1;

      return nextPage <= pagination.totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
};

function getPagination<T>(response: PaginatedResponse<T>) {
  const responseWithMetadata = response as PaginatedResponse<T> & {
    metadata?: {
      pagination?: PaginatedResponse<T>["meta"];
    };
  };

  return response.meta ?? responseWithMetadata.metadata?.pagination;
}
