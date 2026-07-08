"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  Headphones,
  MessageCircle,
  Minimize2,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { io, Socket } from "socket.io-client";

type ChatMessage = {
  id: string;
  sender: string;
  text: string;
  time: string;
};

const CUSTOMER_NAME = "Customer";
const quickReplies = ["Tu van mon", "Theo doi don", "Khuyen mai hom nay"];

const socketURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:3001";

export function CustomerChatWidget() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const socket = io(`${socketURL}/chat`);
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("chat:history", (history: ChatMessage[]) => {
      setMessages(history);
    });

    socket.on("chat:message", (message: ChatMessage) => {
      setMessages((current) => [...current, message]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    socketRef.current?.emit("send", {
      sender: CUSTOMER_NAME,
      text: trimmed,
    });

    setInputValue("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(inputValue);
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
                <p className="text-sm font-black leading-none">Ho tro CheNow</p>
                <p className="mt-1 text-[11px] text-white/60">
                  {connected ? "Da ket noi socket" : "Chua ket noi socket"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                aria-label="Thu nho chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                onClick={() => setOpen(false)}
                type="button"
              >
                <Minimize2 size={16} />
              </button>
              <button
                aria-label="Dong chat"
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
              Vi du socket: gui tin bang chat:send, nhan tin bang chat:message.
            </div>
            {messages.map((message) => {
              const isCustomer = message.sender === CUSTOMER_NAME;

              return (
                <div
                  className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}
                  key={message.id}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                      isCustomer
                        ? "bg-[#2d6a4f] text-white"
                        : "bg-white text-[#432010]"
                    }`}
                  >
                    <p className="text-[11px] font-bold opacity-70">
                      {message.sender}
                    </p>
                    <p>{message.text}</p>
                    <p
                      className={`mt-1 text-[10px] ${
                        isCustomer ? "text-white/60" : "text-[#9a8170]"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-[#eadfd4] bg-white p-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <button
                  className="rounded-full border border-[#eadfd4] px-3 py-1 text-xs font-bold text-[#5f5148] hover:border-[#2d6a4f] hover:text-[#2d6a4f]"
                  key={reply}
                  onClick={() => sendMessage(reply)}
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
                placeholder="Nhap tin nhan..."
                value={inputValue}
              />
              <button
                aria-label="Gui tin nhan"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2d6a4f] text-white hover:bg-[#1b4332] disabled:opacity-50"
                disabled={!connected}
                type="submit"
              >
                <Send size={17} />
              </button>
            </form>
          </div>
        </section>
      ) : (
        <button
          aria-label="Mo chat ho tro"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#2d6a4f] text-white shadow-2xl transition-transform hover:scale-105"
          onClick={() => setOpen(true)}
          type="button"
        >
          <MessageCircle size={24} />
          <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-[#f59e0b]" />
          <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-full bg-[#432010] px-3 py-2 text-xs font-bold text-white shadow-lg group-hover:block">
            Chat voi CheNow
          </span>
        </button>
      )}
    </div>
  );
}
