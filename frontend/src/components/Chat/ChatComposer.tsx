"use client";

import {
  ChangeEvent,
  FormEvent,
  SyntheticEvent,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Paperclip, Send, Smile } from "lucide-react";
import TextArea from "@/components/Input/TextArea";
import { clsx } from "@/components/utils";
import {
  EmojiPickerPopover,
  EmojiSelection,
} from "./EmojiPickerPopover";

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

type ComposerField = HTMLInputElement | HTMLTextAreaElement;

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
  const fieldRef = useRef<ComposerField | null>(null);
  const emojiButtonRef = useRef<HTMLButtonElement | null>(null);
  const selectionRef = useRef({ end: value.length, start: value.length });
  const pendingCaretRef = useRef<number | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerId = useId();
  const pickerVisible = pickerOpen && !disabled;

  const closePicker = useCallback(() => {
    setPickerOpen(false);
  }, []);

  const setInputRef = useCallback((element: HTMLInputElement | null) => {
    fieldRef.current = element;
  }, []);

  const setTextareaRef = useCallback((element: HTMLTextAreaElement | null) => {
    fieldRef.current = element;
  }, []);

  useLayoutEffect(() => {
    const pendingCaret = pendingCaretRef.current;
    const field = fieldRef.current;

    if (pendingCaret === null || !field || disabled) {
      return;
    }

    field.focus();
    field.setSelectionRange(pendingCaret, pendingCaret);
    selectionRef.current = { end: pendingCaret, start: pendingCaret };
    pendingCaretRef.current = null;
  }, [disabled, value]);

  const rememberSelection = (event: SyntheticEvent<ComposerField>) => {
    const field = event.currentTarget;
    const start = field.selectionStart ?? value.length;
    const end = field.selectionEnd ?? start;

    selectionRef.current = { end, start };
  };

  const handleChange = (event: ChangeEvent<ComposerField>) => {
    rememberSelection(event);
    onChange(event.target.value);
  };

  const handlePickerToggle = () => {
    if (disabled) {
      return;
    }

    const field = fieldRef.current;

    if (field) {
      const start = field.selectionStart ?? value.length;
      const end = field.selectionEnd ?? start;
      selectionRef.current = { end, start };
    }

    setPickerOpen((current) => !current);
  };

  const handleEmojiSelect = ({ emoji }: EmojiSelection) => {
    if (disabled) {
      return;
    }

    const start = Math.min(selectionRef.current.start, value.length);
    const end = Math.min(
      Math.max(selectionRef.current.end, start),
      value.length,
    );
    const nextValue = `${value.slice(0, start)}${emoji}${value.slice(end)}`;
    const nextCaret = start + emoji.length;

    pendingCaretRef.current = nextCaret;
    selectionRef.current = { end: nextCaret, start: nextCaret };
    setPickerOpen(false);
    onChange(nextValue);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value.trim() || disabled) {
      return;
    }

    onSubmit();
  };

  const emojiButton = (
    <button
      aria-controls={pickerId}
      aria-expanded={pickerVisible}
      aria-haspopup="dialog"
      aria-label="Chọn emoji"
      className={
        variant === "customer"
          ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#766b64] transition-colors hover:bg-[#f4efe9] hover:text-[#087f5b] disabled:cursor-not-allowed disabled:opacity-50"
          : "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#eadfd4] bg-[#fffaf5] text-[#766b64] transition-colors hover:border-[#2d6a4f] hover:bg-[#f4efe9] hover:text-[#2d6a4f] disabled:cursor-not-allowed disabled:opacity-50"
      }
      disabled={disabled}
      onClick={handlePickerToggle}
      ref={emojiButtonRef}
      type="button"
    >
      <Smile aria-hidden="true" size={17} />
    </button>
  );

  const emojiPicker =
    pickerVisible ? (
      <EmojiPickerPopover
        anchorRef={emojiButtonRef}
        id={pickerId}
        onClose={closePicker}
        onSelect={handleEmojiSelect}
      />
    ) : null;

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
          onChange={handleChange}
          onSelect={rememberSelection}
          placeholder={placeholder}
          ref={setInputRef}
          value={value}
        />
        {emojiButton}
        {emojiPicker}
        <button
          aria-label="Đính kèm tệp"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#766b64] opacity-60"
          disabled
          title="Tính năng đính kèm đang được phát triển"
          type="button"
        >
          <Paperclip aria-hidden="true" size={17} />
        </button>
        <button
          aria-label="Gửi tin nhắn"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#07845f] text-white shadow-[0_4px_10px_rgba(7,132,95,0.28)] transition hover:bg-[#066f51] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={disabled || !value.trim()}
          type="submit"
        >
          <Send aria-hidden="true" size={18} />
        </button>
      </form>
    );
  }

  return (
    <form
      className={clsx("flex items-end gap-2", className)}
      onSubmit={handleSubmit}
    >
      {multiline ? (
        <TextArea
          className={clsx(fieldClassName, "py-3")}
          disabled={disabled}
          maxRows={5}
          minRows={2}
          onChange={handleChange}
          onSelect={rememberSelection}
          placeholder={placeholder}
          ref={setTextareaRef}
          value={value}
        />
      ) : (
        <input
          className={fieldClassName}
          disabled={disabled}
          onChange={handleChange}
          onSelect={rememberSelection}
          placeholder={placeholder}
          ref={setInputRef}
          value={value}
        />
      )}
      {emojiButton}
      {emojiPicker}
      <button
        aria-label="Gửi tin nhắn"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2d6a4f] text-white transition hover:bg-[#1b4332] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled || !value.trim()}
        type="submit"
      >
        <Send aria-hidden="true" size={17} />
      </button>
    </form>
  );
}
