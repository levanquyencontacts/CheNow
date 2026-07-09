import { chatStats } from "./admin-chat.mock";

export function AdminChatHeader() {
  return (
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
        {chatStats.map(([value, label]) => (
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
  );
}
