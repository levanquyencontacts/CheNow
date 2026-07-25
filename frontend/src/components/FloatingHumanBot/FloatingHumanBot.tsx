"use client";

import Image from "next/image";
import {
  PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type FloatingHumanBotProps = {
  className?: string;
  onActivate?: () => void;
};

type BotPosition = {
  x: number;
  y: number;
};

const BOT_WIDTH = 134;
const BOT_HEIGHT = 212;
const VIEWPORT_MARGIN = 12;
const DRAG_THRESHOLD = 6;
const STORAGE_KEY = "chenow-floating-assistant-position";
const INITIAL_POSITION = { x: 24, y: 120 };

function getDefaultPosition() {
  if (typeof window === "undefined") {
    return INITIAL_POSITION;
  }

  return {
    x: window.innerWidth - BOT_WIDTH - 24,
    y: window.innerHeight - BOT_HEIGHT - 92,
  };
}

function clampPosition(position: BotPosition) {
  if (typeof window === "undefined") {
    return position;
  }

  return {
    x: Math.min(
      Math.max(VIEWPORT_MARGIN, position.x),
      window.innerWidth - BOT_WIDTH - VIEWPORT_MARGIN,
    ),
    y: Math.min(
      Math.max(VIEWPORT_MARGIN, position.y),
      window.innerHeight - BOT_HEIGHT - VIEWPORT_MARGIN,
    ),
  };
}

export function FloatingHumanBot({
  className,
  onActivate,
}: FloatingHumanBotProps) {
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef(INITIAL_POSITION);
  const draggedRef = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState(INITIAL_POSITION);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      const storedPosition = window.localStorage.getItem(STORAGE_KEY);

      if (!storedPosition) {
        const nextPosition = clampPosition(getDefaultPosition());

        positionRef.current = nextPosition;
        setPosition(nextPosition);
        return;
      }

      try {
        const parsed = JSON.parse(storedPosition) as BotPosition;
        const nextPosition = clampPosition(parsed);

        positionRef.current = nextPosition;
        setPosition(nextPosition);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const nextPosition = clampPosition(positionRef.current);

      positionRef.current = nextPosition;
      setPosition(nextPosition);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const moveTo = useCallback((nextPosition: BotPosition) => {
    const clamped = clampPosition(nextPosition);

    positionRef.current = clamped;
    setPosition(clamped);
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    draggedRef.current = false;
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    dragOffsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!dragging) {
      return;
    }

    const distance = Math.hypot(
      event.clientX - pointerStartRef.current.x,
      event.clientY - pointerStartRef.current.y,
    );

    if (distance > DRAG_THRESHOLD) {
      draggedRef.current = true;
    }

    moveTo({
      x: event.clientX - dragOffsetRef.current.x,
      y: event.clientY - dragOffsetRef.current.y,
    });
  };

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setDragging(false);
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(positionRef.current),
    );

    if (!draggedRef.current) {
      onActivate?.();
    }
  };

  const handlePointerCancel = () => {
    setDragging(false);
  };

  return (
    <button
      aria-label="Mở chat hỗ trợ"
      className={[
        "fixed z-[90] touch-none select-none rounded-[34px] outline-none",
        "transition-[filter,transform] duration-200 ease-out",
        "focus-visible:ring-4 focus-visible:ring-sky-300/55",
        dragging
          ? "cursor-grabbing scale-[1.03] drop-shadow-[0_22px_36px_rgba(15,23,42,0.22)]"
          : "cursor-grab animate-[assistant-float_3.4s_ease-in-out_infinite] hover:scale-[1.03] hover:drop-shadow-[0_22px_36px_rgba(15,23,42,0.22)]",
        className ?? "",
      ].join(" ")}
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        height: BOT_HEIGHT,
        left: position.x,
        top: position.y,
        width: BOT_WIDTH,
      }}
      type="button"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-5 bottom-1 h-6 rounded-full bg-slate-900/14 blur-md"
      />
      <Image
        alt=""
        className="pointer-events-none relative h-full w-full object-contain drop-shadow-[0_12px_20px_rgba(15,23,42,0.18)]"
        draggable={false}
        height={640}
        priority={false}
        src="/assistant/chenow-assistant.png"
        width={363}
      />
      <span
        aria-hidden="true"
        className="absolute right-3 top-10 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.18)]"
      />
      <style jsx>{`
        @keyframes assistant-float {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }
      `}</style>
    </button>
  );
}
