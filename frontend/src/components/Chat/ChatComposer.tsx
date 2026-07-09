"use client";

import { FormEvent } from "react";
import { Send } from "lucide-react";
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
};

export function ChatComposer({
  className,
  disabled = false,
  multiline = false,
  onChange,
  onSubmit,
  placeholder = "Nhập tin nhắn...",
  value,
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
