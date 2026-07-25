"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import type { EmojiStyle } from "emoji-picker-react";
import type { RefObject } from "react";
import { createPortal } from "react-dom";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  loading: () => (
    <div
      aria-label="Đang tải danh sách emoji"
      className="flex h-full items-center justify-center rounded-lg border border-[#eadfd4] bg-white text-sm text-[#766b64] shadow-xl"
      role="status"
    >
      Đang tải emoji...
    </div>
  ),
  ssr: false,
});

export type EmojiSelection = {
  emoji: string;
};

type EmojiPickerPopoverProps = {
  anchorRef: RefObject<HTMLButtonElement | null>;
  id: string;
  onClose: () => void;
  onSelect: (selection: EmojiSelection) => void;
};

const VIEWPORT_MARGIN = 8;
const ANCHOR_GAP = 8;
const PICKER_MAX_HEIGHT = 400;
const PICKER_MAX_WIDTH = 350;
const NATIVE_EMOJI_STYLE = "native" as EmojiStyle;

export function EmojiPickerPopover({
  anchorRef,
  id,
  onClose,
  onSelect,
}: EmojiPickerPopoverProps) {
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    const popover = popoverRef.current;

    if (!anchor || !popover) {
      return;
    }

    const anchorRect = anchor.getBoundingClientRect();
    const width = Math.min(
      PICKER_MAX_WIDTH,
      Math.max(0, window.innerWidth - VIEWPORT_MARGIN * 2),
    );
    const height = Math.min(
      PICKER_MAX_HEIGHT,
      Math.max(0, window.innerHeight - VIEWPORT_MARGIN * 2),
    );
    const left = Math.max(
      VIEWPORT_MARGIN,
      Math.min(
        anchorRect.right - width,
        window.innerWidth - width - VIEWPORT_MARGIN,
      ),
    );
    const topAbove = anchorRect.top - ANCHOR_GAP - height;
    const topBelow = anchorRect.bottom + ANCHOR_GAP;
    const fitsAbove = topAbove >= VIEWPORT_MARGIN;
    const fitsBelow =
      topBelow + height <= window.innerHeight - VIEWPORT_MARGIN;
    const top = fitsAbove
      ? topAbove
      : fitsBelow
        ? topBelow
        : Math.max(
            VIEWPORT_MARGIN,
            Math.min(
              topAbove,
              window.innerHeight - height - VIEWPORT_MARGIN,
            ),
          );

    Object.assign(popover.style, {
      height: `${height}px`,
      left: `${left}px`,
      top: `${top}px`,
      visibility: "visible",
      width: `${width}px`,
    });
  }, [anchorRef]);

  useLayoutEffect(() => {
    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [updatePosition]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      const anchor = anchorRef.current;

      if (!(target instanceof Node)) {
        return;
      }

      if (anchor?.contains(target) || popoverRef.current?.contains(target)) {
        return;
      }

      onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();
      onClose();
      anchorRef.current?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [anchorRef, onClose]);

  return createPortal(
    <div
      aria-label="Chọn emoji"
      className="fixed z-[150] overflow-hidden rounded-lg shadow-[0_16px_40px_rgba(67,32,16,0.22)]"
      id={id}
      ref={popoverRef}
      role="dialog"
      style={{
        overscrollBehavior: "contain",
        visibility: "hidden",
      }}
    >
      <EmojiPicker
        autoFocusSearch
        emojiStyle={NATIVE_EMOJI_STYLE}
        height="100%"
        lazyLoadEmojis
        onEmojiClick={(selection: EmojiSelection) => onSelect(selection)}
        previewConfig={{ showPreview: false }}
        searchClearButtonLabel="Xóa nội dung tìm kiếm"
        searchPlaceholder="Tìm emoji"
        width="100%"
      />
    </div>,
    document.body,
  );
}
