"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type ChatMessage = {
  id: string;
  sender: string;
  text: string;
  time: string;
};

const socketURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3001";

export default function SocketDemoPage() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [sender, setSender] = useState("Customer");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const socket = io(`${socketURL}/chat`);
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("chat:history", (history: ChatMessage[]) => {
      setMessages(history);
    });

    socket.on("chat:message", (message: ChatMessage) => {
      setMessages((current) => [...current, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!text.trim()) {
      return;
    }

    socketRef.current?.emit("chat:send", {
      sender,
      text,
    });

    setText("");
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 bg-white p-6 text-[#432010]">
      <header>
        <h1 className="text-2xl font-black">Socket demo don gian</h1>
        <p className="mt-2 text-sm text-[#6c5a4b]">
          Mo trang nay o 2 tab khac nhau, gui tin nhan o mot tab va xem tab con
          lai nhan ngay.
        </p>
        <p className="mt-2 text-sm font-bold">
          Trang thai: {connected ? "Da ket noi socket" : "Chua ket noi"}
        </p>
      </header>

      <section className="min-h-80 flex-1 space-y-3 rounded-xl border border-[#eadfd4] bg-[#fffaf5] p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-[#8a7867]">Chua co tin nhan.</p>
        ) : (
          messages.map((message) => (
            <div className="rounded-lg bg-white p-3 shadow-sm" key={message.id}>
              <div className="flex items-center justify-between text-xs font-bold text-[#8a7867]">
                <span>{message.sender}</span>
                <span>{message.time}</span>
              </div>
              <p className="mt-1 text-sm">{message.text}</p>
            </div>
          ))
        )}
      </section>

      <form className="grid gap-3 rounded-xl border border-[#eadfd4] p-4" onSubmit={handleSubmit}>
        <input
          className="rounded-lg border border-[#eadfd4] px-3 py-2 text-sm outline-none focus:border-[#2d6a4f]"
          onChange={(event) => setSender(event.target.value)}
          placeholder="Ten nguoi gui"
          value={sender}
        />
        <div className="flex gap-2">
          <input
            className="min-w-0 flex-1 rounded-lg border border-[#eadfd4] px-3 py-2 text-sm outline-none focus:border-[#2d6a4f]"
            onChange={(event) => setText(event.target.value)}
            placeholder="Nhap tin nhan..."
            value={text}
          />
          <button
            className="rounded-lg bg-[#2d6a4f] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            disabled={!connected}
            type="submit"
          >
            Gui
          </button>
        </div>
      </form>
    </main>
  );
}
