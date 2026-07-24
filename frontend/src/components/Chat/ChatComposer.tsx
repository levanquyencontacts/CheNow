"use client";

import { FormEvent } from "react";
import { Paperclip, Send, Smile } from "lucide-react";
import TextArea from "@/components/Input/TextArea";
import { clsx } from "@/components/utils";

type ChatComposerProps = {
  className?: string;
  disabled?: boolean;
  multiline?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  value: string;
  variant?: "customer" | "default";
};

export function ChatComposer({
  className,
  disabled = false,
  multiline = false,
  onChange,
  onSubmit,
  placeholder = "Nhập tin nhắn...",
  value,
  variant = "default",
}: ChatComposerProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value.trim() || disabled) {
      return;
    }

    onSubmit();
  };

  const fieldClassName =
    "min-w-0 flex-1 rounded-xl border border-[#eadfd4] bg-[#fffaf5] px-3 text-sm text-[#432010] outline-none focus:border-[#2d6a4f]";

  if (variant === "customer") {
    return (
      <form
        className={clsx(
          "flex h-13 items-center gap-1 rounded-2xl border border-[#eadfd4] bg-white p-1.5 pl-3 shadow-[0_5px_16px_rgba(67,32,16,0.08)]",
          className,
        )}
        onSubmit={handleSubmit}
      >
        <input
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#432010] outline-none placeholder:text-[#9c9189]"
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          value={value}
        />
        <button
          aria-label="Thêm biểu tượng cảm xúc"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#766b64] transition-colors hover:bg-[#f4efe9] hover:text-[#087f5b]"
          disabled={disabled}
          onClick={() => onChange(`${value}${value ? " " : ""}😊`)}
          type="button"
        >
          <Smile size={17} />
        </button>
        <button
          aria-label="Đính kèm tệp"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#766b64] opacity-60"
          disabled
          title="Tính năng đính kèm đang được phát triển"
          type="button"
        >
          <Paperclip size={17} />
        </button>
        <button
          aria-label="Gửi tin nhắn"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#07845f] text-white shadow-[0_4px_10px_rgba(7,132,95,0.28)] transition hover:bg-[#066f51] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={disabled || !value.trim()}
          type="submit"
        >
          <Send size={18} />
        </button>
      </form>
    );
  }

  return (
    <form className={clsx("flex gap-2", className)} onSubmit={handleSubmit}>
      {multiline ? (
        <TextArea
          className={clsx(fieldClassName, "py-3")}
          disabled={disabled}
          maxRows={5}
          minRows={2}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          value={value}
        />
      ) : (
        <input
          className={fieldClassName}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          value={value}
        />
      )}
      <button
        aria-label="Gửi tin nhắn"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2d6a4f] text-white transition hover:bg-[#1b4332] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled || !value.trim()}
        type="submit"
      >
        <Send size={17} />
      </button>
    </form>
  );
}
