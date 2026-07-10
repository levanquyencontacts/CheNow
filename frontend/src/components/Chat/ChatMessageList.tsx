import { forwardRef, ReactNode, UIEvent } from "react";
import { clsx } from "@/components/utils";
import { ChatAuthor, ChatMessage } from "@/services/types/apiType";
import { ChatDateSeparator } from "./ChatDateSeparator";
import { ChatMessageBubble } from "./ChatMessageBubble";

type ChatMessageListProps = {
  className?: string;
  currentUserRole: ChatAuthor;
  emptyState?: ReactNode;
  messages: ChatMessage[];
  notice?: ReactNode;
  onScroll?: (event: UIEvent<HTMLDivElement>) => void;
};

type ChatTimelineItem =
  | {
      id: string;
      label: string;
      type: "date";
    }
  | {
      id: ChatMessage["id"];
      message: ChatMessage;
      type: "message";
    };

export const ChatMessageList = forwardRef<HTMLDivElement, ChatMessageListProps>(
  function ChatMessageList(
    {
      className,
      currentUserRole,
      emptyState,
      messages,
      notice,
      onScroll,
    },
    ref,
  ) {
    const timelineItems = buildChatTimeline(messages);

    return (
      <div
        className={clsx(
          "space-y-3 overflow-y-auto bg-[#fffaf5] px-4 py-4",
          className,
        )}
        onScroll={onScroll}
        ref={ref}
      >
        {notice}
        {timelineItems.length ? (
          timelineItems.map((item) =>
            item.type === "date" ? (
              <ChatDateSeparator key={item.id} label={item.label} />
            ) : (
              <ChatMessageBubble
                currentUserRole={currentUserRole}
                key={item.id}
                message={item.message}
              />
            ),
          )
        ) : (
          <div className="rounded-xl bg-white px-4 py-6 text-center text-sm font-semibold text-[#8a7867]">
            {emptyState ?? "Chua co tin nhan."}
          </div>
        )}
      </div>
    );
  },
);

function buildChatTimeline(messages: ChatMessage[]) {
  const items: ChatTimelineItem[] = [];
  let previousDateKey: string | null = null;

  messages.forEach((message) => {
    const dateKey = getChatDateKey(message);

    if (dateKey !== previousDateKey) {
      items.push({
        id: `date-${dateKey}`,
        label: formatChatDateLabel(dateKey),
        type: "date",
      });
      previousDateKey = dateKey;
    }

    items.push({
      id: message.id,
      message,
      type: "message",
    });
  });

  return items;
}

function getChatDateKey(message: ChatMessage) {
  const value = message.createdAt ?? new Date().toISOString();
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return getDateKeyFromDate(date);
}

function formatChatDateLabel(dateKey: string) {
  const todayKey = getDateKeyFromDate(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getDateKeyFromDate(yesterday);

  if (dateKey === todayKey) {
    return "Hom nay";
  }

  if (dateKey === yesterdayKey) {
    return "Hom qua";
  }

  const date = new Date(`${dateKey}T00:00:00+07:00`);

  if (Number.isNaN(date.getTime())) {
    return dateKey;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
  }).format(date);
}

function getDateKeyFromDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return date.toISOString().slice(0, 10);
  }

  return `${year}-${month}-${day}`;
}
