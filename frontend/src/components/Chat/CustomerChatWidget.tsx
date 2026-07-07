"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Headphones,
  MessageCircle,
  Minimize2,
  Send,
  Sparkles,
  X,
} from "lucide-react";

type ChatMessage = {
  id: number;
  roomId?: string;
  author: "customer" | "staff";
  text: string;
  time: string;
};

const quickReplies = ["Tư vấn món", "Theo dõi đơn", "Khuyến mãi hôm nay"];
const roomId = "customer-demo-room";
const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3001";

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    author: "staff",
    text: "CheNow xin chào. Bạn cần tư vấn món, kiểm tra đơn hay hỏi khuyến mãi?",
    time: "Vừa xong",
  },
];

export function CustomerChatWidget() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [connected, setConnected] = useState(false);

  const socket = useMemo(
    () =>
      io(socketUrl, {
        autoConnect: false,
        transports: ["websocket"],
      }),
    [],
  );

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("chat:join", { roomId });
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("chat:new", (message: ChatMessage) => {
      setMessages((current) => [...current, message]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("chat:new");
      socket.disconnect();
    };
  }, [socket]);

  const addMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    socket.emit("chat:send", {
      roomId,
      author: "customer",
      text: trimmed,
    });
    setInputValue("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addMessage(inputValue);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[90]">
      {open ? (
        <section className="w-[calc(100vw-40px)] max-w-[360px] overflow-hidden rounded-2xl border border-[#eadfd4] bg-white shadow-2xl">
          <header className="flex items-center justify-between bg-[#432010] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <Headphones size={18} />
              </div>
              <div>
                <p className="text-sm font-black leading-none">Hỗ trợ CheNow</p>
                <p className="mt-1 text-[11px] text-white/60">
                  {connected ? "Socket đã kết nối" : "Đang kết nối socket..."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                aria-label="Thu nhỏ chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                onClick={() => setOpen(false)}
                type="button"
              >
                <Minimize2 size={16} />
              </button>
              <button
                aria-label="Đóng chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          </header>

          <div className="max-h-[360px] space-y-3 overflow-y-auto bg-[#fffaf5] px-4 py-4">
            <div className="rounded-xl bg-[#eef7ef] px-3 py-2 text-xs font-semibold text-[#315d3b]">
              <Sparkles className="mr-1 inline-block" size={13} />
              Bạn có thể hỏi về món, topping, phí giao hàng hoặc đơn hiện tại.
            </div>
            {messages.map((message) => (
              <div
                className={`flex ${message.author === "customer" ? "justify-end" : "justify-start"}`}
                key={message.id}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    message.author === "customer"
                      ? "bg-[#2d6a4f] text-white"
                      : "bg-white text-[#432010]"
                  }`}
                >
                  <p>{message.text}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      message.author === "customer"
                        ? "text-white/60"
                        : "text-[#9a8170]"
                    }`}
                  >
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#eadfd4] bg-white p-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <button
                  className="rounded-full border border-[#eadfd4] px-3 py-1 text-xs font-bold text-[#5f5148] hover:border-[#2d6a4f] hover:text-[#2d6a4f]"
                  key={reply}
                  onClick={() => addMessage(reply)}
                  type="button"
                >
                  {reply}
                </button>
              ))}
            </div>
            <form className="flex gap-2" onSubmit={handleSubmit}>
              <input
                className="min-w-0 flex-1 rounded-xl border border-[#eadfd4] bg-[#fffaf5] px-3 text-sm text-[#432010] outline-none focus:border-[#2d6a4f]"
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Nhập tin nhắn..."
                value={inputValue}
              />
              <button
                aria-label="Gửi tin nhắn"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2d6a4f] text-white hover:bg-[#1b4332]"
                type="submit"
              >
                <Send size={17} />
              </button>
            </form>
          </div>
        </section>
      ) : (
        <button
          aria-label="Mở chat hỗ trợ"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#2d6a4f] text-white shadow-2xl transition-transform hover:scale-105"
          onClick={() => setOpen(true)}
          type="button"
        >
          <MessageCircle size={24} />
          <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-[#f59e0b]" />
          <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-full bg-[#432010] px-3 py-2 text-xs font-bold text-white shadow-lg group-hover:block">
            Chat với CheNow
          </span>
        </button>
      )}
    </div>
  );
}
