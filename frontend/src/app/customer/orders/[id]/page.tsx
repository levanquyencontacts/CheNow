"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  MapPin,
  PackageCheck,
  Phone,
  UserRound,
  X,
} from "lucide-react";
import cheMitImage from "@/common/assets/images/chemit.png";
import { routes } from "@/common/utils/constant";
import { statusMeta } from "@/common/utils/status";
import { Image } from "@/components";
import { useModal } from "@/providers";
import { useMyOrderQuery } from "@/services/controllers/orders/OrdersQueries";
import type { OrderStatus } from "@/services/types/apiType";
import {
  formatCurrency,
  formatDateTime,
  formatOrderCode,
} from "../../../admin/orders/components/ultils/orderFormat";

const paymentMethodLabel: Record<string, string> = {
  cash: "Tien mat",
  momo: "MoMo",
  vnpay: "VNPay",
};

const paymentStatusLabel: Record<string, string> = {
  failed: "That bai",
  paid: "Da thanh toan",
  pending: "Cho thanh toan",
  refunded: "Da hoan tien",
};

const orderTypeLabel: Record<string, string> = {
  delivery: "Giao hang",
  dine_in: "Tai quan",
  take_away: "Mang di",
};

function DetailLine({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex gap-3 rounded-lg bg-[#fffaf5] p-3">
      <Icon className="mt-0.5 shrink-0 text-primary" size={17} />
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-[#8c6a5a]">
          {label}
        </p>
        <p className="mt-1 text-sm font-semibold text-charcoal-black">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

export default function CustomerOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderId = Number(params.id);
  const orderQuery = useMyOrderQuery(
    Number.isFinite(orderId) ? orderId : undefined,
  );
  const { openModal } = useModal();
  const order = orderQuery.data;

  if (orderQuery.isLoading) {
    return (
      <main className="min-h-screen bg-cream-white px-6 pb-16 pt-28 text-on-surface">
        <div className="mx-auto max-w-5xl rounded-xl border border-dashed border-[#d8cbbf] bg-white p-10 text-center text-sm text-on-surface-variant">
          Dang tai chi tiet don hang...
        </div>
      </main>
    );
  }

  if (orderQuery.isError || !order) {
    return (
      <main className="min-h-screen bg-cream-white px-6 pb-16 pt-28 text-on-surface">
        <div className="mx-auto max-w-5xl rounded-xl border border-error/30 bg-white p-10 text-center">
          <p className="font-semibold text-error">
            Khong the tai chi tiet don hang hoac don hang khong ton tai.
          </p>
          <Link
            className="mt-4 inline-flex rounded-lg border border-error/30 px-4 py-2 text-sm font-bold text-error"
            href={routes.CUSTOMER_ORDERS}
          >
            Quay lai don hang
          </Link>
        </div>
      </main>
    );
  }

  const items = order.orderItems ?? [];
  const logs = [...(order.statusLogs ?? [])].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  const timelineLogs =
    logs.length > 0
      ? logs
      : [
          {
            createdAt: order.createdAt,
            id: 0,
            note: "Order created",
            toStatus: order.status,
          },
        ];
  const status = (order.status || "pending") as OrderStatus;
  const meta = statusMeta[status] ?? statusMeta.pending;
  const itemQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const canCancel = order.status === "pending";

  const openCancelOrderModal = () => {
    if (!canCancel) return;

    openModal("CANCEL_CUSTOMER_ORDER", {
      invoiceCode: order.invoiceCode,
      orderCode: formatOrderCode(order.id),
      orderId: order.id,
      totalAmount: order.totalAmount,
    });
  };

  return (
    <main className="min-h-screen bg-cream-white px-6 pb-16 pt-28 text-on-surface">
      <div className="mx-auto max-w-6xl">
        <Link
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary"
          href={routes.CUSTOMER_ORDERS}
        >
          <ArrowLeft size={16} />
          Don hang cua toi
        </Link>

        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Chi tiet don hang
            </p>
            <h1 className="mt-2 text-3xl font-black text-charcoal-black md:text-4xl">
              {order.invoiceCode || formatOrderCode(order.id)}
            </h1>
            <p className="mt-2 text-sm text-on-surface-variant">
              Dat luc {formatDateTime(order.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex w-fit rounded-full border px-4 py-2 text-sm font-black ${meta.badgeClass}`}
            >
              {meta.label}
            </span>
            {canCancel ? (
              <button
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-error/30 bg-white px-4 text-sm font-black text-error transition hover:bg-error/5"
                onClick={openCancelOrderModal}
                type="button"
              >
                <X size={16} />
                Huy don
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-xl border border-[#eadfd4] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-charcoal-black">
              Thong tin giao hang
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <DetailLine
                icon={UserRound}
                label="Nguoi nhan"
                value={order.receiverName}
              />
              <DetailLine
                icon={Phone}
                label="So dien thoai"
                value={order.receiverPhone}
              />
              <DetailLine
                icon={MapPin}
                label="Dia chi"
                value={order.deliveryAddress}
              />
              <DetailLine
                icon={PackageCheck}
                label="Hinh thuc"
                value={orderTypeLabel[order.orderType] ?? order.orderType}
              />
              <DetailLine
                icon={CreditCard}
                label="Thanh toan"
                value={
                  paymentMethodLabel[order.paymentMethod] ?? order.paymentMethod
                }
              />
              <DetailLine
                icon={CalendarDays}
                label="Trang thai thanh toan"
                value={
                  paymentStatusLabel[order.paymentStatus] ??
                  order.paymentStatus
                }
              />
            </div>

            <h2 className="mt-7 text-lg font-black text-charcoal-black">
              San pham
            </h2>
            <div className="mt-4 overflow-hidden rounded-lg border border-[#eadfd4]">
              {items.length === 0 ? (
                <div className="p-6 text-center text-sm text-on-surface-variant">
                  Don hang nay chua co san pham.
                </div>
              ) : (
                items.map((item) => (
                  <article
                    className="border-b border-[#eadfd4] p-4 last:border-b-0"
                    key={item.id}
                  >
                    <div className="flex gap-3">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[#eadfd4] bg-[#f6eee6]">
                        <Image
                          alt={item.productName}
                          className="h-full w-full object-cover"
                          previewType="thumbnails"
                          src={item.product?.imageUrl || cheMitImage.src}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="font-black text-charcoal-black">
                              {item.productName}
                            </h3>
                            <p className="mt-1 text-sm text-on-surface-variant">
                              Size {item.sizeName} x {item.quantity}
                            </p>
                          </div>
                          <p className="font-black text-[#315d3b]">
                            {formatCurrency(item.subtotal)}
                          </p>
                        </div>
                        <p className="mt-2 text-sm text-[#5f5148]">
                          Don gia: {formatCurrency(item.price)}
                          {Number(item.sizeExtraPrice ?? 0) > 0
                            ? ` + size ${formatCurrency(item.sizeExtraPrice)}`
                            : ""}
                        </p>
                        <p className="mt-1 text-sm text-[#5f5148]">
                          Topping:{" "}
                          {item.orderItemToppings?.length
                            ? item.orderItemToppings
                                .map(
                                  (topping) =>
                                    `${topping.toppingName} x${topping.quantity}`,
                                )
                                .join(", ")
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-xl border border-[#eadfd4] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black text-charcoal-black">
                Tong thanh toan
              </h2>
              <div className="mt-4 space-y-3 text-sm">
                <SummaryRow
                  label={`Tam tinh (${itemQuantity} mon)`}
                  value={order.subtotalAmount}
                />
                <SummaryRow
                  danger
                  label="Giam gia"
                  value={-Number(order.discountAmount ?? 0)}
                />
                <SummaryRow label="Phi ship" value={order.shippingFee} />
                <div className="flex items-center justify-between border-t border-[#eadfd4] pt-4 text-base font-black text-charcoal-black">
                  <span>Tong cong</span>
                  <span className="text-[#315d3b]">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-[#eadfd4] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black text-charcoal-black">
                Timeline trang thai
              </h2>
              <div className="mt-5 space-y-0">
                {timelineLogs.map((log, index) => {
                  const logStatus = (log.toStatus || "pending") as OrderStatus;
                  const logMeta = statusMeta[logStatus] ?? statusMeta.pending;
                  const Icon = logMeta.icon;

                  return (
                    <div
                      className="grid grid-cols-[38px_1fr] gap-3"
                      key={`${log.id}-${index}`}
                    >
                      <div className="flex flex-col items-center">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full border ${logMeta.badgeClass}`}
                        >
                          <Icon aria-hidden="true" className="h-4 w-4" />
                        </span>
                        {index < timelineLogs.length - 1 ? (
                          <span className="h-11 border-l border-dashed border-[#d8cbbf]" />
                        ) : null}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-black text-charcoal-black">
                          {logMeta.label}
                        </p>
                        <p className="mt-1 text-xs text-on-surface-variant">
                          {formatDateTime(log.createdAt)}
                        </p>
                        {log.note ? (
                          <p className="mt-1 text-xs text-[#5f5148]">
                            {log.note}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function SummaryRow({
  danger,
  label,
  value,
}: {
  danger?: boolean;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between text-[#5f5148]">
      <span>{label}</span>
      <span className={danger ? "font-bold text-error" : "font-bold"}>
        {formatCurrency(value)}
      </span>
    </div>
  );
}
