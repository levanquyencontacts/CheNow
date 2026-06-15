import {
  AskAiPayload,
  AskAiResponse,
  GenerateProductDescriptionPayload,
  GenerateProductDescriptionResponse,
} from "@/services/types/apiType";
import { AxiosInstance } from "axios";

export class AiAssistantService {
  constructor(private apiClient: AxiosInstance) {}

  async ask(payload: AskAiPayload): Promise<AskAiResponse> {
    const { data } = await this.apiClient.post("/ai-assistant/ask", payload, {
      timeout: 120000,
    });
    return data;
  }

  async generateProductDescription(
    payload: GenerateProductDescriptionPayload,
  ): Promise<GenerateProductDescriptionResponse> {
    const { data } = await this.apiClient.post(
      "/ai-assistant/product-description",
      payload,
      {
        timeout: 120000,
      },
    );
    return data;
  }
}
