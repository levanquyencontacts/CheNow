"use client";

import { useMemo, useState } from "react";
import {
  Clock3,
  MessageSquareText,
  MoreHorizontal,
  Phone,
  Search,
  Send,
  Tag,
  UserRound,
  type LucideIcon,
} from "lucide-react";

const conversations = [
  {
    id: 1,
    customer: "Nguyễn Minh Anh",
    phone: "0900 128 456",
    lastMessage: "Mình muốn hỏi đơn matcha giao khoảng mấy phút?",
    time: "2 phút",
    unread: 2,
    status: "Đang chờ",
    orderCode: "CN-1042",
    channel: "Website",
  },
  {
    id: 2,
    customer: "Trần Quốc Bảo",
    phone: "0912 222 888",
    lastMessage: "Có topping kem cheese không shop?",
    time: "12 phút",
    unread: 1,
    status: "Đang tư vấn",
    orderCode: "Chưa có đơn",
    channel: "Menu",
  },
  {
    id: 3,
    customer: "Linh Phạm",
    phone: "0988 771 002",
    lastMessage: "Cảm ơn shop nha.",
    time: "1 giờ",
    unread: 0,
    status: "Đã xử lý",
    orderCode: "CN-1036",
    channel: "Website",
  },
];

const messages = [
  {
    id: 1,
    author: "customer",
    text: "Chào shop, mình muốn hỏi đơn matcha giao khoảng mấy phút?",
    time: "10:24",
  },
  {
    id: 2,
    author: "staff",
    text: "CheNow chào bạn. Khu vực nội thành Hà Nội thường giao trong 25-35 phút sau khi xác nhận đơn.",
    time: "10:25",
  },
  {
    id: 3,
    author: "customer",
    text: "Nếu mình đặt 4 ly thì có freeship không?",
    time: "10:26",
  },
];

const quickAnswers = [
  "Dạ đơn từ 120.000đ được freeship trong khu vực hỗ trợ.",
  "Bạn cho mình xin mã đơn để kiểm tra nhanh nhé.",
  "Món này có thể chọn size, đường, đá và topping theo ý bạn.",
];

export default function AdminChatPage() {
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [reply, setReply] = useState("");

  const activeConversation = useMemo(
    () =>
      conversations.find((conversation) => conversation.id === activeId) ??
      conversations[0],
    [activeId],
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#fff8f1] p-4 text-[#183d2b]">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b57936]">
            Hỗ trợ khách hàng
          </p>
          <h1 className="mt-1 text-2xl font-black text-[#432010]">
            Hộp thư chat
          </h1>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            ["5", "Đang chờ"],
            ["18", "Hôm nay"],
            ["92%", "Phản hồi"],
          ].map(([value, label]) => (
            <div
              className="rounded-lg border border-[#eadfd4] bg-white px-4 py-2"
              key={label}
            >
              <p className="text-lg font-black text-[#432010]">{value}</p>
              <p className="text-[11px] font-semibold text-[#8a7867]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid min-h-[720px] overflow-hidden rounded-xl border border-[#eadfd4] bg-white shadow-sm lg:grid-cols-[310px_minmax(0,1fr)_280px]">
        <aside className="border-b border-[#eadfd4] bg-[#fffaf5] lg:border-b-0 lg:border-r">
          <div className="border-b border-[#eadfd4] p-3">
            <label className="flex h-10 items-center gap-2 rounded-lg border border-[#eadfd4] bg-white px-3 text-xs text-[#8a7867]">
              <Search size={15} />
              <input
                className="min-w-0 flex-1 bg-transparent outline-none"
                placeholder="Tìm khách, số điện thoại..."
              />
            </label>
          </div>
          <div className="divide-y divide-[#eadfd4]">
            {conversations.map((conversation) => {
              const active = conversation.id === activeId;

              return (
                <button
                  className={`w-full px-4 py-3 text-left transition ${
                    active ? "bg-white" : "hover:bg-white/70"
                  }`}
                  key={conversation.id}
                  onClick={() => setActiveId(conversation.id)}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-[#432010]">
                        {conversation.customer}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-[#6c5a4b]">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unread ? (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d17345] px-1 text-[10px] font-black text-white">
                        {conversation.unread}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-[#9b806a]">
                    <span>{conversation.channel}</span>
                    <span>{conversation.time}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex min-w-0 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-[#eadfd4] px-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef7ef] text-[#2d6a4f]">
                <UserRound size={18} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-[#432010]">
                  {activeConversation.customer}
                </p>
                <p className="text-xs font-semibold text-[#8a7867]">
                  {activeConversation.status} · {activeConversation.phone}
                </p>
              </div>
            </div>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#7b6757] hover:bg-[#fff4ec]"
              type="button"
            >
              <MoreHorizontal size={18} />
            </button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-[#fffaf5] p-5">
            {messages.map((message) => (
              <div
                className={`flex ${message.author === "staff" ? "justify-end" : "justify-start"}`}
                key={message.id}
              >
                <div
                  className={`max-w-[72%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    message.author === "staff"
                      ? "bg-[#2d6a4f] text-white"
                      : "bg-white text-[#432010]"
                  }`}
                >
                  <p className="leading-6">{message.text}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      message.author === "staff"
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

          <footer className="border-t border-[#eadfd4] bg-white p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickAnswers.map((answer) => (
                <button
                  className="rounded-full border border-[#eadfd4] px-3 py-1.5 text-xs font-bold text-[#6c543e] hover:border-[#2d6a4f] hover:text-[#2d6a4f]"
                  key={answer}
                  onClick={() => setReply(answer)}
                  type="button"
                >
                  {answer}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <textarea
                className="min-h-12 flex-1 resize-none rounded-xl border border-[#eadfd4] bg-[#fffaf5] px-3 py-3 text-sm text-[#432010] outline-none focus:border-[#2d6a4f]"
                onChange={(event) => setReply(event.target.value)}
                placeholder="Nhập phản hồi cho khách..."
                value={reply}
              />
              <button
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2d6a4f] text-white hover:bg-[#1b4332]"
                type="button"
              >
                <Send size={18} />
              </button>
            </div>
          </footer>
        </section>

        <aside className="hidden border-l border-[#eadfd4] bg-[#fffaf5] p-4 lg:block">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b57936]">
            Thông tin khách
          </p>
          <div className="mt-4 space-y-3">
            <InfoLine
              icon={UserRound}
              label="Khách hàng"
              value={activeConversation.customer}
            />
            <InfoLine
              icon={Phone}
              label="Số điện thoại"
              value={activeConversation.phone}
            />
            <InfoLine
              icon={Tag}
              label="Mã đơn gần nhất"
              value={activeConversation.orderCode}
            />
            <InfoLine
              icon={Clock3}
              label="Tin mới nhất"
              value={activeConversation.time}
            />
          </div>

          <div className="mt-6 rounded-xl border border-[#eadfd4] bg-white p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-black text-[#432010]">
              <MessageSquareText size={16} />
              Ghi chú nội bộ
            </div>
            <p className="text-xs leading-5 text-[#6c5a4b]">
              Khách thường hỏi về thời gian giao và topping. Ưu tiên phản hồi
              trong 5 phút để giữ trải nghiệm tốt.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#eadfd4] bg-white p-3">
      <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#9b806a]">
        <Icon size={13} />
        {label}
      </div>
      <p className="text-sm font-bold text-[#432010]">{value}</p>
    </div>
  );
}
