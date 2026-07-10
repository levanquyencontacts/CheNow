import { Search } from "@/components";
import { ChatConversation } from "@/services/types/apiType";
import { ConversationListItem } from "./ConversationListItem";

type ConversationListProps = {
  activeId?: number;
  conversations: ChatConversation[];
  isError?: boolean;
  isLoading?: boolean;
  onSelectConversation: (id: number) => void;
  onSearchChange: (value: string) => void;
  searchValue: string;
};

export function ConversationList({
  activeId,
  conversations,
  isError = false,
  isLoading = false,
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
          placeholder="Tim khach, so dien thoai..."
          value={searchValue}
        />
      </div>
      <div className="divide-y divide-[#eadfd4]">
        {isLoading ? (
          <ConversationListState label="Dang tai hoi thoai..." />
        ) : null}
        {!isLoading && isError ? (
          <ConversationListState label="Khong the tai hoi thoai." />
        ) : null}
        {!isLoading && !isError && !conversations.length ? (
          <ConversationListState label="Chua co hoi thoai nao." />
        ) : null}
        {!isLoading && !isError
          ? conversations.map((conversation) => (
              <ConversationListItem
                active={conversation.id === activeId}
                conversation={conversation}
                key={conversation.id}
                onSelect={onSelectConversation}
              />
            ))
          : null}
      </div>
    </aside>
  );
}

function ConversationListState({ label }: { label: string }) {
  return (
    <div className="px-4 py-8 text-center text-sm font-semibold text-[#8a7867]">
      {label}
    </div>
  );
}
