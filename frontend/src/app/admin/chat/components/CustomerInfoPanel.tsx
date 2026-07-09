import { Clock3, MessageSquareText, Phone, Tag, UserRound } from "lucide-react";
import { ChatConversation } from "@/services/types/apiType";
import { InfoLine } from "./InfoLine";

type CustomerInfoPanelProps = {
  conversation: ChatConversation;
};

export function CustomerInfoPanel({ conversation }: CustomerInfoPanelProps) {
  return (
    <aside className="hidden border-l border-[#eadfd4] bg-[#fffaf5] p-4 lg:block">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b57936]">
        Thông tin khách
      </p>
      <div className="mt-4 space-y-3">
        <InfoLine
          icon={UserRound}
          label="Khách hàng"
          value={conversation.customer}
        />
        <InfoLine icon={Phone} label="Số điện thoại" value={conversation.phone} />
        <InfoLine
          icon={Tag}
          label="Mã đơn gần nhất"
          value={conversation.orderCode}
        />
        <InfoLine icon={Clock3} label="Tin mới nhất" value={conversation.time} />
      </div>

      <div className="mt-6 rounded-xl border border-[#eadfd4] bg-white p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-black text-[#432010]">
          <MessageSquareText size={16} />
          Ghi chú nội bộ
        </div>
        <p className="text-xs leading-5 text-[#6c5a4b]">
          Khách thường hỏi về thời gian giao và topping. Ưu tiên phản hồi trong
          5 phút để giữ trải nghiệm tốt.
        </p>
      </div>
    </aside>
  );
}
