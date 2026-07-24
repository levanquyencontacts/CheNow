import { CheckCircle2 } from "lucide-react";
import { formatPrice } from "../orderUtils";
import { SummaryLine } from "./SummaryLine";

type OrderSummaryCardProps = {
  deliveryFee: number;
  disabled: boolean;
  disabledReason?: string;
  isPending: boolean;
  onConfirm: () => void;
  subtotal: number;
  total: number;
};

export function OrderSummaryCard({
  deliveryFee,
  disabled,
  disabledReason,
  isPending,
  onConfirm,
  subtotal,
  total,
}: OrderSummaryCardProps) {
  return (
    <aside className="self-start rounded-2xl border border-[#eadfd4] bg-white p-5 shadow-sm lg:sticky lg:top-6">
      <h2 className="mb-4 text-lg font-bold text-charcoal-black">
        Tóm tắt đơn
      </h2>
      <div className="space-y-3">
        <SummaryLine label="Tạm tính" value={subtotal} />
        <SummaryLine label="Phí giao hàng" value={deliveryFee} />
        <div className="flex items-center justify-between border-t border-[#eadfd4] pt-4">
          <span className="font-bold text-on-surface-variant">Tổng cộng</span>
          <span className="text-2xl font-black text-primary">
            {formatPrice(total)}
          </span>
        </div>
      </div>
      <button
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber py-4 text-lg font-bold text-charcoal-black shadow-lg shadow-amber/20 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
        disabled={disabled}
        onClick={onConfirm}
        type="button"
      >
        <CheckCircle2 size={20} />
        {isPending ? "Đang tạo đơn..." : "Xác nhận đặt hàng"}
      </button>
      {disabledReason && (
        <p className="mt-2 text-center text-xs font-semibold text-error">
          {disabledReason}
        </p>
      )}
      <p className="mt-3 text-center text-xs leading-5 text-on-surface-variant">
        Nhân viên cửa hàng sẽ xác nhận đơn trước khi pha chế.
      </p>
    </aside>
  );
}
