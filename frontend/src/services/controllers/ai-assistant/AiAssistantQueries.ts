import api from "@/services/apiServices";
import {
  AskAiPayload,
  GenerateProductDescriptionPayload,
} from "@/services/types/apiType";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useAskAiMutation = () => {
  return useMutation({
    mutationFn: (payload: AskAiPayload) => api.aiAssistant.ask(payload),
    onError: () => {
      toast.error("Khong the hoi AI luc nay.");
    },
  });
};

export const useGenerateProductDescriptionMutation = () => {
  return useMutation({
    mutationFn: (payload: GenerateProductDescriptionPayload) =>
      api.aiAssistant.generateProductDescription(payload),
    onError: () => {
      toast.error("Khong the tao mo ta bang AI luc nay.");
    },
  });
};
