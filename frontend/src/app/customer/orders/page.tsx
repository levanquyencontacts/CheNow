"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, PackageSearch, Search } from "lucide-react";
import { LIMIT_PAGE, routes } from "@/common/utils/constant";
import { statusMeta, statusTabs } from "@/common/utils/status";
import { Pagination } from "@/components/Pagination/Pagination";
import { useMyOrdersQuery } from "@/services/controllers/orders/OrdersQueries";
import type { Order, OrderStatus } from "@/services/types/apiType";
import {
  formatCurrency,
  formatDateTime,
  formatOrderCode,
} from "../../admin/orders/components/ultils/orderFormat";

const getOrderCode = (order: Order) => order.invoiceCode || formatOrderCode(order.id);

const getItemPreview = (order: Order) => {
  const items = order.orderItems ?? [];
  const quantity = items.reduce((total, item) => total + item.quantity, 0);
  const preview = items
    .slice(0, 2)
    .map((item) => item.productName)
    .join(", ");

  if (!items.length) return "Chua co mon";
  return `${quantity} mon${preview ? ` - ${preview}` : ""}`;
};

export default function CustomerOrdersPage() {
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">(
    "all",
  );
  const [searchValue, setSearchValue] = useState("");

  const queryParams = useMemo(
    () => ({
      limit: LIMIT_PAGE,
      order: "DESC" as const,
      page,
      searchValue: searchValue.trim() || undefined,
      sort: "createdAt",
      status: selectedStatus === "all" ? undefined : selectedStatus,
    }),
    [page, searchValue, selectedStatus],
  );

  const ordersQuery = useMyOrdersQuery(queryParams);
  const orders = ordersQuery.data?.data ?? [];
  const pagination = ordersQuery.data?.metadata.pagination;

  const handleStatusChange = (status: OrderStatus | "all") => {
    setSelectedStatus(status);
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-cream-white px-6 pb-16 pt-28 text-on-surface">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Tai khoan
            </p>
            <h1 className="mt-2 text-3xl font-black text-charcoal-black md:text-4xl">
              Don hang cua toi
            </h1>
            <p className="mt-2 text-sm text-on-surface-variant">
              Theo doi cac don da dat va xem lai chi tiet giao hang.
            </p>
          </div>

          <label className="flex h-11 w-full items-center gap-2 rounded-lg border border-[#eadfd4] bg-white px-3 text-sm text-[#5f5148] shadow-sm lg:w-80">
            <Search className="text-[#8c6a5a]" size={17} />
            <input
              className="w-full bg-transparent outline-none placeholder:text-[#9d8b78]"
              onChange={(event) => {
                setSearchValue(event.target.value);
                setPage(1);
              }}
              placeholder="Tim ma don / hoa don"
              type="search"
              value={searchValue}
            />
          </label>
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {statusTabs.map((tab) => {
            const active = selectedStatus === tab.value;
            return (
              <button
                className={[
                  "h-9 shrink-0 rounded-full border px-4 text-xs font-bold transition",
                  active
                    ? "border-[#183d2b] bg-[#183d2b] text-white"
                    : "border-[#eadfd4] bg-white text-[#5f5148] hover:border-[#2d6a4f]",
                ].join(" ")}
                key={tab.value}
                onClick={() => handleStatusChange(tab.value)}
                type="button"
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {ordersQuery.isLoading ? (
          <div className="rounded-xl border border-dashed border-[#d8cbbf] bg-white p-10 text-center text-sm text-on-surface-variant">
            Dang tai don hang...
          </div>
        ) : ordersQuery.isError ? (
          <div className="rounded-xl border border-error/30 bg-white p-10 text-center">
            <p className="font-semibold text-error">
              Khong the tai danh sach don hang.
            </p>
            <button
              className="mt-4 rounded-lg border border-error/30 px-4 py-2 text-sm font-bold text-error"
              onClick={() => void ordersQuery.refetch()}
              type="button"
            >
              Thu lai
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#d8cbbf] bg-white p-10 text-center">
            <PackageSearch className="mx-auto text-primary" size={36} />
            <h2 className="mt-4 text-lg font-black text-charcoal-black">
              Chua co don hang nao
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Cac don ban dat se xuat hien tai day.
            </p>
            <Link
              className="mt-5 inline-flex rounded-lg bg-amber px-4 py-3 text-sm font-black text-charcoal-black"
              href="/customer/menu"
            >
              Dat mon ngay
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#eadfd4] bg-white shadow-sm">
            <div className="hidden grid-cols-[1.1fr_1fr_1fr_1fr_1.5fr_120px] border-b border-[#eadfd4] bg-[#fffaf5] px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#6f665c] md:grid">
              <span>Ma don</span>
              <span>Ngay dat</span>
              <span>Tong tien</span>
              <span>Trang thai</span>
              <span>Mon</span>
              <span className="text-right">Chi tiet</span>
            </div>

            {orders.map((order) => {
              const meta = statusMeta[order.status] ?? statusMeta.pending;
              return (
                <article
                  className="grid gap-3 border-b border-[#eadfd4] px-4 py-4 last:border-b-0 md:grid-cols-[1.1fr_1fr_1fr_1fr_1.5fr_120px] md:items-center"
                  key={order.id}
                >
                  <div className="font-black text-charcoal-black">
                    {getOrderCode(order)}
                  </div>
                  <div className="text-sm text-on-surface-variant">
                    {formatDateTime(order.createdAt)}
                  </div>
                  <div className="text-sm font-bold text-[#315d3b]">
                    {formatCurrency(order.totalAmount)}
                  </div>
                  <div>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${meta.badgeClass}`}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <div className="text-sm text-[#5f5148]">
                    {getItemPreview(order)}
                  </div>
                  <Link
                    className="inline-flex items-center justify-end gap-1 text-sm font-bold text-primary"
                    href={routes.CUSTOMER_ORDER_DETAIL(order.id)}
                  >
                    Xem
                    <ChevronRight size={16} />
                  </Link>
                </article>
              );
            })}
          </div>
        )}

        {pagination && pagination.totalPages > 1 ? (
          <div className="mt-6 flex justify-end">
            <Pagination
              count={pagination.totalPages}
              onChange={(_, nextPage) => setPage(nextPage)}
              page={page}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
}
