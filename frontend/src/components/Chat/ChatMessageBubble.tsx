import { clsx } from "@/components/utils";
import { ChatAuthor, ChatMessage } from "@/services/types/apiType";

type ChatMessageBubbleProps = {
  className?: string;
  currentUserRole: ChatAuthor;
  message: ChatMessage;
};

export function ChatMessageBubble({
  className,
  currentUserRole,
  message,
}: ChatMessageBubbleProps) {
  const ownMessage = isOwnChatMessage(message.author, currentUserRole);
  const statusLabel = ownMessage ? getMessageStatusLabel(message.status) : null;

  return (
    <div
      className={clsx(
        "flex",
        ownMessage ? "justify-end" : "justify-start",
        className,
      )}
    >
      <div
        className={clsx(
          "max-w-[82%] rounded-2xl px-3 py-2 text-sm shadow-sm md:max-w-[72%]",
          ownMessage ? "bg-[#2d6a4f] text-white" : "bg-white text-[#432010]",
        )}
      >
        <p className="leading-6">{message.text}</p>
        <p
          className={clsx(
            "mt-1 text-[10px]",
            ownMessage ? "text-white/60" : "text-[#9a8170]",
          )}
        >
          {message.time}
          {statusLabel ? ` · ${statusLabel}` : null}
        </p>
      </div>
    </div>
  );
}

function isOwnChatMessage(author: ChatAuthor, currentUserRole: ChatAuthor) {
  if (author === currentUserRole) {
    return true;
  }

  const staffRoles: ChatAuthor[] = ["admin", "staff"];

  return staffRoles.includes(author) && staffRoles.includes(currentUserRole);
}

function getMessageStatusLabel(status: ChatMessage["status"]) {
  if (status === "sending") {
    return "Đang gửi...";
  }

  if (status === "failed") {
    return "Gửi thất bại";
  }

  if (status === "sent") {
    return "Đã gửi";
  }

  return null;
}
