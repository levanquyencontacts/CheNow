import { Search } from "@/components";
import { ChatConversation } from "@/services/types/apiType";
import { ConversationListItem } from "./ConversationListItem";

type ConversationListProps = {
  activeId: number;
  conversations: ChatConversation[];
  onSelectConversation: (id: number) => void;
  onSearchChange: (value: string) => void;
  searchValue: string;
};

export function ConversationList({
  activeId,
  conversations,
  onSearchChange,
  onSelectConversation,
  searchValue,
}: ConversationListProps) {
  return (
    <aside className="border-b border-[#eadfd4] bg-[#fffaf5] lg:border-b-0 lg:border-r">
      <div className="border-b border-[#eadfd4] p-3">
        <Search
          className="h-10 w-full border border-[#eadfd4]"
          fullWidth
          onChange={(event) => onSearchChange(event.target.value)}
          onClear={() => onSearchChange("")}
          placeholder="Tìm khách, số điện thoại..."
          value={searchValue}
        />
      </div>
      <div className="divide-y divide-[#eadfd4]">
        {conversations.map((conversation) => (
          <ConversationListItem
            active={conversation.id === activeId}
            conversation={conversation}
            key={conversation.id}
            onSelect={onSelectConversation}
          />
        ))}
      </div>
    </aside>
  );
}
