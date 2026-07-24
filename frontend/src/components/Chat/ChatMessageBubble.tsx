import { Heart } from "lucide-react";
import { clsx } from "@/components/utils";
import { ChatAuthor, ChatMessage } from "@/services/types/apiType";

type ChatMessageBubbleProps = {
  className?: string;
  currentUserRole: ChatAuthor;
  message: ChatMessage;
  variant?: "customer" | "default";
};

export function ChatMessageBubble({
  className,
  currentUserRole,
  message,
  variant = "default",
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
      <div className="flex max-w-[84%] items-end gap-2 md:max-w-[78%]">
        <div
          className={clsx(
            "rounded-2xl px-3 py-2 text-sm shadow-sm",
            ownMessage
              ? variant === "customer"
                ? "rounded-br-md bg-[#07845f] text-white shadow-[0_4px_10px_rgba(7,132,95,0.15)]"
                : "bg-[#2d6a4f] text-white"
              : variant === "customer"
                ? "rounded-bl-md border border-[#eee8e2] bg-white text-[#432010] shadow-[0_3px_10px_rgba(67,32,16,0.06)]"
                : "bg-white text-[#432010]",
          )}
        >
          {variant === "customer" && !ownMessage && (
            <p className="mb-1 text-[11px] font-black text-[#77513d]">CheNow</p>
          )}
          <p className="leading-5">{message.text}</p>
          <p
            className={clsx(
              "mt-1 text-[10px]",
              ownMessage ? "text-white/70" : "text-[#9a8170]",
            )}
          >
            {message.time}
            {statusLabel ? ` · ${statusLabel}` : null}
          </p>
        </div>
        {variant === "customer" && !ownMessage && (
          <button
            aria-label="Yêu thích tin nhắn"
            className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#6f655e] transition hover:bg-[#f4efe9] hover:text-[#07845f]"
            type="button"
          >
            <Heart size={15} />
          </button>
        )}
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
