import { AxiosInstance } from "axios";
import {
  ChatConversationResponse,
  ChatMessageResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/services/types/apiType";

export class ChatService {
  constructor(private apiClient: AxiosInstance) {}

  async getConversations(
    params?: PaginationParams,
  ): Promise<PaginatedResponse<ChatConversationResponse>> {
    const { data } = await this.apiClient.get("/conversations", { params });
    return data;
  }

  async getMessages(
    conversationId: number,
    params?: PaginationParams,
  ): Promise<PaginatedResponse<ChatMessageResponse>> {
    const { data } = await this.apiClient.get(
      `/conversations/${conversationId}/messages`,
      { params },
    );
    return data;
  }
}
