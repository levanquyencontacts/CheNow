"use client";

import cheMitImage from "@/common/assets/images/chemit.png";
import { routes } from "@/common/utils/constant";
import { Box, Button, Pagination, Image } from "@/components";
import {
  CalendarDays,
  Check,
  Clock3,
  Download,
  Eye,
  MapPin,
  MoreHorizontal,
  PackageCheck,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  useOrderQuery,
  useOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/services/controllers/orders/OrdersQueries";
import { useRouter } from "next/navigation";
import type {
  Order as ApiOrder,
  OrderStatus,
} from "@/services/types/apiType";

const LIMIT = 10;

const statusMeta: Record<
  OrderStatus,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    icon: typeof Clock3;
    description: string;
  }
> = {
  pending: {
    label: "Pending",
    badgeClass: "border-[#efd69b] bg-[#fff8df] text-[#8a6418]",
    dotClass: "bg-[#c99545]",
    icon: Clock3,
    description: "Order has been created",
  },
  confirmed: {
    label: "Confirmed",
    badgeClass: "border-[#cbdccf] bg-[#eef7ef] text-[#315d3b]",
    dotClass: "bg-[#527b59]",
    icon: ShieldCheck,
    description: "Order confirmation",
  },
  preparing: {
    label: "Preparing",
    badgeClass: "border-[#eac7aa] bg-[#fff3e8] text-[#9b4b16]",
    dotClass: "bg-[#d17345]",
    icon: PackageCheck,
    description: "Preparing products",
  },
  ready: {
    label: "Ready",
    badgeClass: "border-[#d8cbbf] bg-[#f5eee7] text-[#6b5a49]",
    dotClass: "bg-[#8a6a50]",
    icon: Truck,
    description: "Ready for pickup or delivery",
  },
  completed: {
    label: "Completed",
    badgeClass: "border-[#b8d2bc] bg-[#eef7ef] text-[#315d3b]",
    dotClass: "bg-[#315d3b]",
    icon: Check,
    description: "Completed",
  },
  cancelled: {
    label: "Cancelled",
    badgeClass: "border-[#f0c8c5] bg-[#fff2ef] text-[#b12f1d]",
    dotClass: "bg-[#b12f1d]",
    icon: X,
    description: "Cancelled",
  },
};

const statusTabs: Array<{ label: string; value: OrderStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Preparing", value: "preparing" },
  { label: "Ready", value: "ready" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const timeline: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
];

const formatCurrency = (value: string | number | null | undefined) =>
  `${new Intl.NumberFormat("vi-VN").format(Number(value ?? 0))} d`;

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const formatOrderCode = (id: number) => `ORD${String(id).padStart(6, "0")}`;

const escapeHtml = (value: string | number | null | undefined) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const buildInvoiceHtml = (order: ApiOrder) => {
  const items = order.orderItems ?? [];
  const rows = items
    .map((item, index) => {
      const toppings =
        item.orderItemToppings
          ?.map(
            (topping) =>
              `${topping.toppingName} x${topping.quantity} (${formatCurrency(
                topping.price,
              )})`,
          )
          .join(", ") || "-";

      return `
        <tr>
          <td>${index + 1}</td>
          <td>
            <strong>${escapeHtml(item.productName)}</strong>
            <span>Size ${escapeHtml(item.sizeName)}</span>
            <small>${escapeHtml(toppings)}</small>
          </td>
          <td>${formatCurrency(item.price)}</td>
          <td>${item.quantity}</td>
          <td>${formatCurrency(item.subtotal)}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <!doctype html>
    <html>
      <head>
        <title>Invoice ${formatOrderCode(order.id)}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            color: #183d2b;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 32px;
          }
          .invoice {
            margin: 0 auto;
            max-width: 820px;
          }
          .header {
            align-items: flex-start;
            border-bottom: 2px solid #183d2b;
            display: flex;
            justify-content: space-between;
            padding-bottom: 20px;
          }
          h1, h2, p { margin: 0; }
          h1 { font-size: 28px; letter-spacing: 1px; }
          .brand { color: #315d3b; font-size: 14px; font-weight: 700; margin-top: 6px; }
          .code { color: #5c554c; font-size: 13px; line-height: 1.7; text-align: right; }
          .section {
            display: grid;
            gap: 12px;
            grid-template-columns: 1fr 1fr;
            margin-top: 22px;
          }
          .box {
            border: 1px solid #eadfd4;
            border-radius: 8px;
            padding: 14px;
          }
          .box h2 {
            font-size: 13px;
            margin-bottom: 8px;
            text-transform: uppercase;
          }
          .line { color: #314032; font-size: 13px; line-height: 1.7; }
          table {
            border-collapse: collapse;
            margin-top: 22px;
            width: 100%;
          }
          th {
            background: #fff3e8;
            color: #5c554c;
            font-size: 12px;
            text-align: left;
            text-transform: uppercase;
          }
          th, td {
            border-bottom: 1px solid #eadfd4;
            padding: 12px 10px;
            vertical-align: top;
          }
          td { font-size: 13px; }
          td span, td small {
            color: #6f665c;
            display: block;
            margin-top: 4px;
          }
          .summary {
            margin-left: auto;
            margin-top: 20px;
            max-width: 320px;
          }
          .summary-row {
            display: flex;
            font-size: 14px;
            justify-content: space-between;
            padding: 7px 0;
          }
          .total {
            border-top: 2px solid #183d2b;
            color: #315d3b;
            font-size: 18px;
            font-weight: 700;
            margin-top: 6px;
            padding-top: 12px;
          }
          .note {
            color: #6f665c;
            font-size: 12px;
            margin-top: 28px;
            text-align: center;
          }
          @media print {
            body { padding: 0; }
            .invoice { max-width: none; }
          }
        </style>
      </head>
      <body>
        <main class="invoice">
          <div class="header">
            <div>
              <h1>HOA DON</h1>
              <p class="brand">Sam Sam Dessert</p>
            </div>
            <div class="code">
              <p><strong>${formatOrderCode(order.id)}</strong></p>
              <p>Ngay tao: ${formatDateTime(order.createdAt)}</p>
              <p>Trang thai: ${escapeHtml(statusMeta[order.status].label)}</p>
            </div>
          </div>

          <section class="section">
            <div class="box">
              <h2>Khach hang</h2>
              <p class="line">Ten: ${escapeHtml(
                order.receiverName || `Customer #${order.userId}`,
              )}</p>
              <p class="line">Dien thoai: ${escapeHtml(
                order.receiverPhone || "-",
              )}</p>
              <p class="line">Dia chi: ${escapeHtml(
                order.deliveryAddress || "-",
              )}</p>
            </div>
            <div class="box">
              <h2>Thanh toan</h2>
              <p class="line">Phuong thuc: ${escapeHtml(
                order.paymentMethod.toUpperCase(),
              )}</p>
              <p class="line">Trang thai: ${escapeHtml(order.paymentStatus)}</p>
              <p class="line">Ghi chu: ${escapeHtml(order.note || "-")}</p>
            </div>
          </section>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>San pham</th>
                <th>Don gia</th>
                <th>SL</th>
                <th>Thanh tien</th>
              </tr>
            </thead>
            <tbody>
              ${
                rows ||
                '<tr><td colspan="5" style="text-align:center;">Khong co san pham.</td></tr>'
              }
            </tbody>
          </table>

          <section class="summary">
            <div class="summary-row">
              <span>Tam tinh</span>
              <strong>${formatCurrency(order.subtotalAmount)}</strong>
            </div>
            <div class="summary-row">
              <span>Giam gia</span>
              <strong>${formatCurrency(-Number(order.discountAmount ?? 0))}</strong>
            </div>
            <div class="summary-row">
              <span>Phi giao hang</span>
              <strong>${formatCurrency(order.shippingFee)}</strong>
            </div>
            <div class="summary-row total">
              <span>Tong cong</span>
              <strong>${formatCurrency(order.totalAmount)}</strong>
            </div>
          </section>

          <p class="note">Cam on quy khach.</p>
        </main>
      </body>
    </html>
  `;
};

const printInvoice = (order: ApiOrder) => {
  const printWindow = window.open("", "_blank", "width=900,height=720");

  if (!printWindow) {
    return;
  }

  printWindow.document.open();
  printWindow.document.write(buildInvoiceHtml(order));
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">(
    "all",
  );
  const [selectedOrderId, setSelectedOrderId] = useState<number>();
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const router = useRouter();

  const queryParams = useMemo(
    () => ({
      limit: LIMIT,
      order: "DESC" as const,
      page,
      searchValue: searchValue.trim() || undefined,
      sort: "createdAt",
      status: selectedStatus === "all" ? undefined : selectedStatus,
    }),
    [page, searchValue, selectedStatus],
  );

  const { data, isError, isLoading } = useOrdersQuery(queryParams);
  const { data: selectedOrderDetail, isFetching: isFetchingDetail } =
    useOrderQuery(selectedOrderId);
  const updateOrderStatusMutation = useUpdateOrderStatusMutation();

  const allCountQuery = useOrdersQuery({ limit: 1, order: "DESC", page: 1 });
  const pendingCountQuery = useOrdersQuery({
    limit: 1,
    order: "DESC",
    page: 1,
    status: "pending",
  });
  const confirmedCountQuery = useOrdersQuery({
    limit: 1,
    order: "DESC",
    page: 1,
    status: "confirmed",
  });
  const preparingCountQuery = useOrdersQuery({
    limit: 1,
    order: "DESC",
    page: 1,
    status: "preparing",
  });
  const readyCountQuery = useOrdersQuery({
    limit: 1,
    order: "DESC",
    page: 1,
    status: "ready",
  });
  const completedCountQuery = useOrdersQuery({
    limit: 1,
    order: "DESC",
    page: 1,
    status: "completed",
  });
  const cancelledCountQuery = useOrdersQuery({
    limit: 1,
    order: "DESC",
    page: 1,
    status: "cancelled",
  });

  const orders = data?.data ?? [];
  const pagination = data?.metadata.pagination;
  const selectedOrder =
    selectedOrderDetail ??
    orders.find((order) => order.id === selectedOrderId) ??
    orders[0];
  const selectedMeta = selectedOrder ? statusMeta[selectedOrder.status] : null;
  const statusCounts: Record<OrderStatus | "all", number | undefined> = {
    all: allCountQuery.data?.metadata.pagination.total,
    pending: pendingCountQuery.data?.metadata.pagination.total,
    confirmed: confirmedCountQuery.data?.metadata.pagination.total,
    preparing: preparingCountQuery.data?.metadata.pagination.total,
    ready: readyCountQuery.data?.metadata.pagination.total,
    completed: completedCountQuery.data?.metadata.pagination.total,
    cancelled: cancelledCountQuery.data?.metadata.pagination.total,
  };
  const actionLoading = updateOrderStatusMutation.isPending;

  const handleUpdateStatus = (orderId: number, status: OrderStatus) => {
    updateOrderStatusMutation.mutate({ id: orderId, status });
  };

  return (
    <Box className="bg-[#fff8f1] px-4 py-4 text-[#143d2a] sm:px-6 lg:px-8">
      <Box className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <Box className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Box>
            <h1 className="text-2xl font-semibold tracking-normal text-[#183d2b]">
              Orders
            </h1>
            <p className="mt-0.5 text-xs text-[#4d5b4f]">
              Track order progress, payment, and delivery details.
            </p>
          </Box>

          <Button
            className="h-9 w-fit rounded-md bg-[#183d2b] px-4 text-xs font-semibold text-white shadow-[0_6px_12px_rgba(24,61,43,0.14)] hover:bg-[#102f21]"
            onClick={() => router.push(routes.ORDER_CREATE)}
          >
            <Plus aria-hidden="true" className="h-3.5 w-3.5" />
            Create order
          </Button>
        </Box>

        <Box className="rounded-lg border border-[#eadfd4] bg-white/78 p-3 shadow-[0_8px_18px_rgba(55,36,20,0.04)]">
          <Box className="flex flex-wrap gap-2">
            {statusTabs.map((tab) => {
              const active = selectedStatus === tab.value;
              const meta = tab.value === "all" ? null : statusMeta[tab.value];

              return (
                <button
                  className={[
                    "inline-flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-semibold transition",
                    active
                      ? "border-[#183d2b] bg-[#183d2b] text-white shadow-sm"
                      : "border-[#eadfd4] bg-[#fffaf5] text-[#5c554c] hover:border-[#c2ad9d] hover:bg-[#fff3e8]",
                  ].join(" ")}
                  key={tab.value}
                  onClick={() => {
                    setSelectedStatus(tab.value);
                    setSelectedOrderId(undefined);
                    setPage(1);
                  }}
                  type="button"
                >
                  {meta ? (
                    <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} />
                  ) : (
                    <ShoppingBag aria-hidden="true" className="h-3.5 w-3.5" />
                  )}
                  {tab.label}
                  <span
                    className={[
                      "rounded-full px-2 py-0.5 text-[10px]",
                      active
                        ? "bg-white/18 text-white"
                        : "bg-[#f3e8de] text-[#6b5a49]",
                    ].join(" ")}
                  >
                    {statusCounts[tab.value] ?? "-"}
                  </span>
                </button>
              );
            })}
          </Box>
        </Box>

        <Box className="flex flex-col rounded-lg border border-[#eadfd4] bg-white/90 shadow-[0_16px_34px_rgba(55,36,20,0.06)]">
          <Box className="grid gap-3 border-b border-[#eadfd4] bg-[#fffaf5] p-4 lg:grid-cols-[minmax(220px,1fr)_160px_160px_160px_auto]">
            <label className="flex h-10 items-center gap-2.5 rounded-md border border-[#eadfd4] bg-white px-3 text-xs text-[#8a7867]">
              <Search aria-hidden="true" className="h-4 w-4" />
              <input
                className="h-full min-w-0 flex-1 bg-transparent text-[#183d2b] outline-none placeholder:text-[#9d8b78]"
                onChange={(event) => {
                  setSearchValue(event.target.value);
                  setSelectedOrderId(undefined);
                  setPage(1);
                }}
                placeholder="Search orders..."
                value={searchValue}
              />
            </label>

            {["Status", "Created date", "Customer"].map((label) => (
              <button
                className="flex h-10 items-center justify-between rounded-md border border-[#eadfd4] bg-white px-3 text-xs font-semibold text-[#5c554c] hover:bg-[#fff8f1]"
                key={label}
                type="button"
              >
                {label}
                <span className="text-[#9d8b78]">v</span>
              </button>
            ))}

            <Button
              className="h-10 rounded-md border-[#d8cbbf] bg-white px-4 text-xs font-semibold text-[#5c554c] shadow-none hover:bg-[#fff8f1]"
              disabled={!selectedOrder}
              onClick={() => {
                if (selectedOrder) {
                  printInvoice(selectedOrder);
                }
              }}
              variant="outlined"
            >
              <Download aria-hidden="true" className="h-3.5 w-3.5" />
              Export invoice
            </Button>
          </Box>

          <Box className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead>
                <tr className="h-12 border-b border-[#eadfd4] bg-white/70 text-xs font-semibold text-[#5c554c]">
                  <th className="px-4">Order code</th>
                  <th className="px-4">Customer</th>
                  <th className="px-4">Total</th>
                  <th className="px-4">Status</th>
                  <th className="px-4">Payment</th>
                  <th className="px-4">Created</th>
                  <th className="px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <OrdersMessageRow message="Loading orders..." />
                ) : null}
                {isError ? (
                  <OrdersMessageRow danger message="Cannot load orders." />
                ) : null}
                {!isLoading && !isError && orders.length === 0 ? (
                  <OrdersMessageRow message="No orders found." />
                ) : null}

                {orders.map((order) => {
                  const meta = statusMeta[order.status];

                  return (
                    <tr
                      className={[
                        "h-16 cursor-pointer border-b border-[#eadfd4] bg-white/70 text-[#183d2b] transition last:border-b-0 hover:bg-[#fff8f1]",
                        selectedOrder?.id === order.id ? "bg-[#fff3e8]" : "",
                      ].join(" ")}
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <td className="px-4 text-xs font-semibold text-[#1f2c22]">
                        {formatOrderCode(order.id)}
                      </td>
                      <td className="px-4">
                        <Box className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3e8de] text-[#6b5a49]">
                            <UserRound aria-hidden="true" className="h-4 w-4" />
                          </span>
                          <Box>
                            <p className="text-xs font-semibold text-[#183d2b]">
                              {order.receiverName || `Customer #${order.userId}`}
                            </p>
                            <p className="mt-0.5 text-xs text-[#6f665c]">
                              {order.receiverPhone || "-"}
                            </p>
                          </Box>
                        </Box>
                      </td>
                      <td className="px-4 text-xs font-semibold">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-4">
                        <StatusPill meta={meta} />
                      </td>
                      <td className="px-4 text-xs font-semibold text-[#314032]">
                        {order.paymentMethod.toUpperCase()}
                      </td>
                      <td className="px-4 text-xs text-[#314032]">
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td className="px-4">
                        <Box className="flex justify-end gap-2">
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#eadfd4] bg-white text-[#183d2b] hover:bg-[#fff8f1]"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedOrderId(order.id);
                            }}
                            type="button"
                          >
                            <Eye aria-hidden="true" className="h-4 w-4" />
                          </button>
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#eadfd4] bg-white text-[#183d2b] hover:bg-[#fff8f1]"
                            type="button"
                          >
                            <MoreHorizontal
                              aria-hidden="true"
                              className="h-4 w-4"
                            />
                          </button>
                        </Box>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>

          <Box className="flex flex-col gap-3 border-t border-[#eadfd4] bg-[#fffaf5] px-5 py-4 text-xs font-semibold text-[#314032] sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {pagination?.total ? (page - 1) * LIMIT + 1 : 0}-
              {Math.min(page * LIMIT, pagination?.total ?? 0)} of{" "}
              {pagination?.total ?? 0} orders
            </span>
            <Pagination
              count={pagination?.totalPages ?? 1}
              disabled={isLoading}
              onChange={(_, nextPage) => {
                setPage(nextPage);
                setSelectedOrderId(undefined);
              }}
              page={page}
            />
          </Box>
        </Box>

        {selectedOrder && selectedMeta ? (
          <OrderDetail
            actionLoading={actionLoading}
            isFetchingDetail={isFetchingDetail}
            onUpdateStatus={handleUpdateStatus}
            onPrintInvoice={printInvoice}
            order={selectedOrder}
            selectedMeta={selectedMeta}
          />
        ) : (
          <Box className="rounded-lg border border-[#eadfd4] bg-white/80 p-6 text-sm text-[#6f665c]">
            Select an order to view detail.
          </Box>
        )}

      </Box>
    </Box>
  );
}

function OrderDetail({
  actionLoading,
  isFetchingDetail,
  onPrintInvoice,
  onUpdateStatus,
  order,
  selectedMeta,
}: {
  actionLoading: boolean;
  isFetchingDetail: boolean;
  onPrintInvoice: (order: ApiOrder) => void;
  onUpdateStatus: (orderId: number, status: OrderStatus) => void;
  order: ApiOrder;
  selectedMeta: (typeof statusMeta)[OrderStatus];
}) {
  const items = order.orderItems ?? [];
  const itemQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const itemSubtotal = items.reduce(
    (total, item) => total + Number(item.subtotal ?? 0),
    0,
  );

  return (
    <Box className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.9fr)]">
      <Box className="rounded-lg border border-[#eadfd4] bg-white/90 p-5 shadow-[0_16px_34px_rgba(55,36,20,0.06)]">
        <Box className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Box className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-[#183d2b]">
              Order detail #{formatOrderCode(order.id)}
            </h2>
            <StatusPill meta={selectedMeta} />
            {isFetchingDetail ? (
              <span className="text-xs font-semibold text-[#8a7867]">
                Updating...
              </span>
            ) : null}
          </Box>

          <Box className="flex gap-2">
            <Button
              className="h-8 rounded-md border-[#d8cbbf] bg-white px-3 text-xs font-semibold text-[#5c554c] shadow-none hover:bg-[#fff8f1]"
              onClick={() => onPrintInvoice(order)}
              variant="outlined"
            >
              <Download aria-hidden="true" className="h-3.5 w-3.5" />
              Xuat hoa don
            </Button>
            <Button
              className="h-8 rounded-md border-[#b8d2bc] bg-[#eef7ef] px-3 text-xs font-semibold text-[#315d3b] shadow-none hover:bg-[#e1f1e4]"
              disabled={actionLoading || order.status !== "pending"}
              onClick={() => onUpdateStatus(order.id, "confirmed")}
            >
              <Check aria-hidden="true" className="h-3.5 w-3.5" />
              Confirm
            </Button>
            <Button
              className="h-8 rounded-md px-3 text-xs font-semibold"
              disabled={actionLoading || order.status === "cancelled"}
              onClick={() => onUpdateStatus(order.id, "cancelled")}
              variant="delete"
            >
              <X aria-hidden="true" className="h-3.5 w-3.5" />
              Cancel
            </Button>
          </Box>
        </Box>

        <Box className="grid gap-4 lg:grid-cols-3">
          <InfoCard title="Customer information">
            <InfoLine
              icon={UserRound}
              text={order.receiverName || `Customer #${order.userId}`}
            />
            <InfoLine icon={Phone} text={order.receiverPhone || "-"} />
            <InfoLine icon={MapPin} text={order.deliveryAddress || "-"} />
            <p className="pt-2 text-xs font-semibold text-[#183d2b]">
              Note: {order.note || "-"}
            </p>
          </InfoCard>

          <InfoCard title="Order information">
            <InfoLine
              icon={CalendarDays}
              text={`Created: ${formatDateTime(order.createdAt)}`}
            />
            <InfoLine
              icon={ShoppingBag}
              text={`Payment method: ${order.paymentMethod.toUpperCase()}`}
            />
            <InfoLine
              icon={Truck}
              text={`Shipping: ${formatCurrency(order.shippingFee)}`}
              tone="success"
            />
            <InfoLine
              icon={PackageCheck}
              text={`Order type: ${order.orderType.replace("_", " ")}`}
            />
          </InfoCard>

          <InfoCard title="Payment summary">
            <SummaryLine label="Subtotal" value={order.subtotalAmount} />
            <SummaryLine
              danger
              label="Discount"
              value={-Number(order.discountAmount ?? 0)}
            />
            <SummaryLine label="Shipping fee" value={order.shippingFee} />
            <Box className="mt-2 flex items-center justify-between border-t border-[#eadfd4] pt-3 text-sm font-bold text-[#183d2b]">
              <span>Total</span>
              <span className="text-[#315d3b]">
                {formatCurrency(order.totalAmount)}
              </span>
            </Box>
          </InfoCard>
        </Box>

        <Box className="mt-5">
          <h3 className="mb-2 text-sm font-semibold text-[#183d2b]">
            Product list
          </h3>
          <Box className="overflow-hidden rounded-md border border-[#eadfd4]">
            <table className="w-full min-w-[640px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[#eadfd4] bg-[#fffaf5] text-[#5c554c]">
                  <th className="px-3 py-3">Product</th>
                  <th className="px-3 py-3">Topping</th>
                  <th className="px-3 py-3">Unit price</th>
                  <th className="px-3 py-3">Qty</th>
                  <th className="px-3 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td
                      className="px-3 py-6 text-center text-[#6f665c]"
                      colSpan={5}
                    >
                      No products in this order.
                    </td>
                  </tr>
                ) : null}

                {items.map((item) => {
                  const toppings =
                    item.orderItemToppings
                      ?.map(
                        (topping) =>
                          `${topping.toppingName} x${topping.quantity}`,
                      )
                      .join(", ") || "-";

                  return (
                    <tr
                      className="border-b border-[#eadfd4] last:border-b-0"
                      key={item.id}
                    >
                      <td className="px-3 py-3">
                        <Box className="flex items-center gap-3">
                          <Box className="h-10 w-10 overflow-hidden rounded-md border border-[#eadfd4] bg-[#f6eee6]">
                            <Image
                              alt={item.productName}
                              className="h-full w-full object-cover"
                              previewType="thumbnails"
                              src={item.product?.imageUrl || cheMitImage.src}
                            />
                          </Box>
                          <Box>
                            <span className="font-semibold text-[#183d2b]">
                              {item.productName}
                            </span>
                            <p className="mt-0.5 text-[11px] text-[#6f665c]">
                              Size {item.sizeName}
                            </p>
                          </Box>
                        </Box>
                      </td>
                      <td className="px-3 py-3 text-[#314032]">{toppings}</td>
                      <td className="px-3 py-3 font-semibold text-[#183d2b]">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-3 py-3 font-semibold text-[#183d2b]">
                        {item.quantity}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold text-[#183d2b]">
                        {formatCurrency(item.subtotal)}
                      </td>
                    </tr>
                  );
                })}

                <tr className="bg-[#fffaf5] font-bold text-[#183d2b]">
                  <td className="px-3 py-3" colSpan={3}>
                    Total
                  </td>
                  <td className="px-3 py-3">{itemQuantity}</td>
                  <td className="px-3 py-3 text-right">
                    {formatCurrency(itemSubtotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </Box>
        </Box>
      </Box>

      <Box className="rounded-lg border border-[#eadfd4] bg-white/90 p-5 shadow-[0_16px_34px_rgba(55,36,20,0.06)]">
        <h2 className="text-lg font-semibold text-[#183d2b]">
          Status history
        </h2>
        <Box className="mt-5 space-y-0">
          {timeline.map((status, index) => {
            const meta = statusMeta[status];
            const Icon = meta.icon;
            const reached =
              timeline.indexOf(order.status) >= index &&
              order.status !== "cancelled";
            const active = order.status === status;

            return (
              <Box
                className="grid grid-cols-[48px_1fr_auto] gap-3"
                key={status}
              >
                <Box className="flex flex-col items-center">
                  <span
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-full border",
                      reached
                        ? `${meta.badgeClass} shadow-[0_6px_12px_rgba(55,36,20,0.06)]`
                        : "border-[#d8cbbf] bg-[#f1ece6] text-[#8a7867]",
                    ].join(" ")}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  {index < timeline.length - 1 ? (
                    <span
                      className={[
                        "h-11 border-l border-dashed",
                        reached ? "border-[#c99545]" : "border-[#d8cbbf]",
                      ].join(" ")}
                    />
                  ) : null}
                </Box>
                <Box className="pb-4 pt-1">
                  <p
                    className={[
                      "text-xs font-bold",
                      active ? "text-[#9b4b16]" : "text-[#5c554c]",
                    ].join(" ")}
                  >
                    {meta.label}
                  </p>
                  <p className="mt-1 text-xs text-[#6f665c]">
                    {meta.description}
                  </p>
                </Box>
                {active ? (
                  <span className="pt-1 text-xs font-semibold text-[#6f665c]">
                    {formatDateTime(order.updatedAt || order.createdAt)}
                  </span>
                ) : null}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

function OrdersMessageRow({
  danger = false,
  message,
}: {
  danger?: boolean;
  message: string;
}) {
  return (
    <tr>
      <td
        className={[
          "px-4 py-8 text-center text-sm",
          danger ? "text-[#b12f1d]" : "text-[#6f665c]",
        ].join(" ")}
        colSpan={7}
      >
        {message}
      </td>
    </tr>
  );
}

function StatusPill({ meta }: { meta: (typeof statusMeta)[OrderStatus] }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.badgeClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
      {meta.label}
    </span>
  );
}

function InfoCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Box className="rounded-md border border-[#eadfd4] bg-[#fffaf5] p-4">
      <h3 className="mb-3 text-sm font-semibold text-[#183d2b]">{title}</h3>
      <Box className="space-y-2">{children}</Box>
    </Box>
  );
}

function InfoLine({
  icon: Icon,
  text,
  tone = "default",
}: {
  icon: typeof UserRound;
  text: string;
  tone?: "default" | "success";
}) {
  return (
    <p className="flex items-start gap-2 text-xs font-medium text-[#314032]">
      <Icon
        aria-hidden="true"
        className={[
          "mt-0.5 h-3.5 w-3.5 shrink-0",
          tone === "success" ? "text-[#315d3b]" : "text-[#6b5a49]",
        ].join(" ")}
      />
      <span>{text}</span>
    </p>
  );
}

function SummaryLine({
  danger = false,
  label,
  value,
}: {
  danger?: boolean;
  label: string;
  value: string | number;
}) {
  return (
    <Box className="flex items-center justify-between text-xs font-semibold">
      <span className="text-[#6f665c]">{label}</span>
      <span className={danger ? "text-[#b12f1d]" : "text-[#183d2b]"}>
        {formatCurrency(value)}
      </span>
    </Box>
  );
}
