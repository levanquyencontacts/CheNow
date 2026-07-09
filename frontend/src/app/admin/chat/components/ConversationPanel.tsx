import {
  ChatComposer,
  ChatMessageList,
  ChatQuickReplies,
} from "@/components/Chat";
import { ChatConversation, ChatMessage } from "@/services/types/apiType";
import { ChatHeader } from "./ChatHeader";

type ConversationPanelProps = {
  conversation: ChatConversation;
  messages: ChatMessage[];
  onQuickAnswer: (answer: string) => void;
  onReplyChange: (value: string) => void;
  onSendReply: () => void;
  quickAnswers: string[];
  reply: string;
};

export function ConversationPanel({
  conversation,
  messages,
  onQuickAnswer,
  onReplyChange,
  onSendReply,
  quickAnswers,
  reply,
}: ConversationPanelProps) {
  return (
    <section className="flex min-w-0 flex-col">
      <ChatHeader conversation={conversation} />
      <ChatMessageList
        className="flex-1 space-y-4 p-5"
        currentUserRole="staff"
        messages={messages}
      />
      <footer className="border-t border-[#eadfd4] bg-white p-4">
        <ChatQuickReplies
          className="mb-3"
          items={quickAnswers}
          onSelect={onQuickAnswer}
        />
        <ChatComposer
          multiline
          onChange={onReplyChange}
          onSubmit={onSendReply}
          placeholder="Nhập phản hồi cho khách..."
          value={reply}
        />
      </footer>
    </section>
  );
}
