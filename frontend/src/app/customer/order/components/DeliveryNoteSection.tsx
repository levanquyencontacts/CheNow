"use client";

type DeliveryNoteSectionProps = {
  note: string;
  onChange: (value: string) => void;
};

const MAX_NOTE_LENGTH = 500;

export function DeliveryNoteSection({
  note,
  onChange,
}: DeliveryNoteSectionProps) {
  return (
    <div className="rounded-2xl border border-[#eadfd4] bg-white p-5 shadow-sm">
      <h2 className="mb-1 text-lg font-bold text-charcoal-black">
        Ghi chú giao hàng
      </h2>
      <p className="mb-3 text-xs text-on-surface-variant">
        Ghi chú cho toàn bộ đơn. Ghi chú từng món vẫn chỉnh trong giỏ.
      </p>
      <textarea
        className="min-h-24 w-full rounded-xl border border-[#eadfd4] bg-[#fffaf5] p-3 text-sm text-charcoal-black outline-none transition-colors focus:border-primary"
        maxLength={MAX_NOTE_LENGTH}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ví dụ: gọi trước khi giao, để ở bảo vệ..."
        value={note}
      />
      <p className="mt-2 text-right text-xs text-on-surface-variant">
        {note.length}/{MAX_NOTE_LENGTH}
      </p>
    </div>
  );
}
