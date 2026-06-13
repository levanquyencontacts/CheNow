"use client";

import { Box, Button, Pagination } from "@/components";
import cheMitImage from "@/common/assets/images/chemit.png";
import {
  CalendarDays,
  Check,
  Clock3,
  Download,
  Eye,
  Mail,
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
import Image from "next/image";
import { useMemo, useState } from "react";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "delivering"
  | "completed"
  | "cancelled";

type Order = {
  id: string;
  customer: string;
  phone: string;
  email: string;
  address: string;
  total: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
  note: string;
};

const statusMeta: Record<
  OrderStatus,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    icon: typeof Clock3;
  }
> = {
  pending: {
    label: "Pending",
    badgeClass: "border-[#efd69b] bg-[#fff8df] text-[#8a6418]",
    dotClass: "bg-[#c99545]",
    icon: Clock3,
  },
  confirmed: {
    label: "Confirmed",
    badgeClass: "border-[#cbdccf] bg-[#eef7ef] text-[#315d3b]",
    dotClass: "bg-[#527b59]",
    icon: ShieldCheck,
  },
  preparing: {
    label: "Preparing",
    badgeClass: "border-[#eac7aa] bg-[#fff3e8] text-[#9b4b16]",
    dotClass: "bg-[#d17345]",
    icon: PackageCheck,
  },
  delivering: {
    label: "Delivering",
    badgeClass: "border-[#d8cbbf] bg-[#f5eee7] text-[#6b5a49]",
    dotClass: "bg-[#8a6a50]",
    icon: Truck,
  },
  completed: {
    label: "Completed",
    badgeClass: "border-[#b8d2bc] bg-[#eef7ef] text-[#315d3b]",
    dotClass: "bg-[#315d3b]",
    icon: Check,
  },
  cancelled: {
    label: "Cancelled",
    badgeClass: "border-[#f0c8c5] bg-[#fff2ef] text-[#b12f1d]",
    dotClass: "bg-[#b12f1d]",
    icon: X,
  },
};

const orders: Order[] = [
  {
    id: "ORD000128",
    customer: "Nguyen Van Quyen",
    phone: "0987 654 321",
    email: "quyen@gmail.com",
    address: "123 Nguyen Trai, P. Ben Thanh, Quan 1, TP. Ho Chi Minh",
    total: 115000,
    subtotal: 100000,
    discount: -10000,
    shippingFee: 15000,
    status: "pending",
    paymentMethod: "COD",
    createdAt: "13/06/2025 10:30",
    note: "Giao gio hanh chinh",
  },
  {
    id: "ORD000127",
    customer: "Tran Minh Hung",
    phone: "0968 123 456",
    email: "hung@gmail.com",
    address: "45 Le Loi, Quan 1, TP. Ho Chi Minh",
    total: 120000,
    subtotal: 120000,
    discount: 0,
    shippingFee: 0,
    status: "confirmed",
    paymentMethod: "Momo",
    createdAt: "13/06/2025 10:15",
    note: "Goi truoc khi giao",
  },
  {
    id: "ORD000126",
    customer: "Le Thi Mai",
    phone: "0933 222 111",
    email: "mai@gmail.com",
    address: "16 Cach Mang Thang 8, Quan 3, TP. Ho Chi Minh",
    total: 85000,
    subtotal: 75000,
    discount: 0,
    shippingFee: 10000,
    status: "preparing",
    paymentMethod: "COD",
    createdAt: "13/06/2025 09:50",
    note: "It da",
  },
  {
    id: "ORD000125",
    customer: "Pham Tuan Anh",
    phone: "0911 987 654",
    email: "anh@gmail.com",
    address: "88 Nguyen Dinh Chieu, Quan 3, TP. Ho Chi Minh",
    total: 135000,
    subtotal: 120000,
    discount: 0,
    shippingFee: 15000,
    status: "delivering",
    paymentMethod: "VNPay",
    createdAt: "13/06/2025 09:20",
    note: "Nhanh giup khach",
  },
  {
    id: "ORD000124",
    customer: "Hoang Gia Bao",
    phone: "0909 555 666",
    email: "bao@gmail.com",
    address: "9 Pasteur, Quan 1, TP. Ho Chi Minh",
    total: 90000,
    subtotal: 90000,
    discount: 0,
    shippingFee: 0,
    status: "completed",
    paymentMethod: "Momo",
    createdAt: "12/06/2025 21:30",
    note: "Da thanh toan",
  },
  {
    id: "ORD000123",
    customer: "Vu Thuy Linh",
    phone: "0977 888 999",
    email: "linh@gmail.com",
    address: "20 Vo Van Tan, Quan 3, TP. Ho Chi Minh",
    total: 70000,
    subtotal: 70000,
    discount: 0,
    shippingFee: 0,
    status: "cancelled",
    paymentMethod: "COD",
    createdAt: "12/06/2025 20:10",
    note: "Khach huy don",
  },
];

const statusTabs: Array<{ label: string; value: OrderStatus | "all"; count: number }> = [
  { label: "All", value: "all", count: 128 },
  { label: "Pending", value: "pending", count: 12 },
  { label: "Confirmed", value: "confirmed", count: 18 },
  { label: "Preparing", value: "preparing", count: 15 },
  { label: "Delivering", value: "delivering", count: 10 },
  { label: "Completed", value: "completed", count: 56 },
  { label: "Cancelled", value: "cancelled", count: 17 },
];

const timeline: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "delivering",
  "completed",
];

const formatCurrency = (value: number) =>
  `${new Intl.NumberFormat("vi-VN").format(value)} d`;

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0].id);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        selectedStatus === "all" || order.status === selectedStatus;
      const matchesSearch =
        !normalizedSearch ||
        [order.id, order.customer, order.phone]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [searchValue, selectedStatus]);

  const selectedOrder =
    orders.find((order) => order.id === selectedOrderId) ?? orders[0];
  const selectedMeta = statusMeta[selectedOrder.status];

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

          <Button className="h-9 w-fit rounded-md bg-[#183d2b] px-4 text-xs font-semibold text-white shadow-[0_6px_12px_rgba(24,61,43,0.14)] hover:bg-[#102f21]">
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
                    {tab.count}
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
                <span className="text-[#9d8b78]">⌄</span>
              </button>
            ))}

            <Button
              className="h-10 rounded-md border-[#d8cbbf] bg-white px-4 text-xs font-semibold text-[#5c554c] shadow-none hover:bg-[#fff8f1]"
              variant="outlined"
            >
              <Download aria-hidden="true" className="h-3.5 w-3.5" />
              Export
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
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-8 text-center text-sm text-[#6f665c]"
                      colSpan={7}
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : null}

                {filteredOrders.map((order) => {
                  const meta = statusMeta[order.status];

                  return (
                    <tr
                      className={[
                        "h-16 cursor-pointer border-b border-[#eadfd4] bg-white/70 text-[#183d2b] transition last:border-b-0 hover:bg-[#fff8f1]",
                        selectedOrder.id === order.id ? "bg-[#fff3e8]" : "",
                      ].join(" ")}
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <td className="px-4 text-xs font-semibold text-[#1f2c22]">
                        {order.id}
                      </td>
                      <td className="px-4">
                        <Box className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3e8de] text-[#6b5a49]">
                            <UserRound aria-hidden="true" className="h-4 w-4" />
                          </span>
                          <Box>
                            <p className="text-xs font-semibold text-[#183d2b]">
                              {order.customer}
                            </p>
                            <p className="mt-0.5 text-xs text-[#6f665c]">
                              {order.phone}
                            </p>
                          </Box>
                        </Box>
                      </td>
                      <td className="px-4 text-xs font-semibold">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.badgeClass}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-4 text-xs font-semibold text-[#314032]">
                        {order.paymentMethod}
                      </td>
                      <td className="px-4 text-xs text-[#314032]">
                        {order.createdAt}
                      </td>
                      <td className="px-4">
                        <Box className="flex justify-end gap-2">
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#eadfd4] bg-white text-[#183d2b] hover:bg-[#fff8f1]"
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
              Showing {filteredOrders.length ? 1 : 0}-{filteredOrders.length} of
              {" "}128 orders
            </span>
            <Pagination count={22} onChange={(_, nextPage) => setPage(nextPage)} page={page} />
          </Box>
        </Box>

        <Box className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.9fr)]">
          <Box className="rounded-lg border border-[#eadfd4] bg-white/90 p-5 shadow-[0_16px_34px_rgba(55,36,20,0.06)]">
            <Box className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Box className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-[#183d2b]">
                  Order detail #{selectedOrder.id}
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${selectedMeta.badgeClass}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${selectedMeta.dotClass}`} />
                  {selectedMeta.label}
                </span>
              </Box>

              <Box className="flex gap-2">
                <Button className="h-8 rounded-md border-[#b8d2bc] bg-[#eef7ef] px-3 text-xs font-semibold text-[#315d3b] shadow-none hover:bg-[#e1f1e4]">
                  <Check aria-hidden="true" className="h-3.5 w-3.5" />
                  Confirm
                </Button>
                <Button
                  className="h-8 rounded-md px-3 text-xs font-semibold"
                  variant="delete"
                >
                  <X aria-hidden="true" className="h-3.5 w-3.5" />
                  Cancel
                </Button>
              </Box>
            </Box>

            <Box className="grid gap-4 lg:grid-cols-3">
              <InfoCard title="Customer information">
                <InfoLine icon={UserRound} text={selectedOrder.customer} />
                <InfoLine icon={Phone} text={selectedOrder.phone} />
                <InfoLine icon={Mail} text={selectedOrder.email} />
                <InfoLine icon={MapPin} text={selectedOrder.address} />
                <p className="pt-2 text-xs font-semibold text-[#183d2b]">
                  Note: {selectedOrder.note}
                </p>
              </InfoCard>

              <InfoCard title="Order information">
                <InfoLine icon={CalendarDays} text={`Created: ${selectedOrder.createdAt}`} />
                <InfoLine
                  icon={ShoppingBag}
                  text={`Payment method: ${selectedOrder.paymentMethod}`}
                />
                <InfoLine icon={Truck} text="Shipping: 15.000 d" tone="success" />
                <InfoLine icon={PackageCheck} text="Preparation note: less ice" />
              </InfoCard>

              <InfoCard title="Payment summary">
                <SummaryLine label="Subtotal" value={selectedOrder.subtotal} />
                <SummaryLine danger label="Discount" value={selectedOrder.discount} />
                <SummaryLine label="Shipping fee" value={selectedOrder.shippingFee} />
                <Box className="mt-2 flex items-center justify-between border-t border-[#eadfd4] pt-3 text-sm font-bold text-[#183d2b]">
                  <span>Total</span>
                  <span className="text-[#315d3b]">
                    {formatCurrency(selectedOrder.total)}
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
                    {[
                      ["Che Thai", "Tran Chau, Thach Dua", 45000, 2, 90000],
                      ["Tra Sua Truyen Thong", "Tran Chau", 35000, 1, 35000],
                    ].map(([name, topping, price, qty, amount]) => (
                      <tr className="border-b border-[#eadfd4] last:border-b-0" key={String(name)}>
                        <td className="px-3 py-3">
                          <Box className="flex items-center gap-3">
                            <Box className="h-10 w-10 overflow-hidden rounded-md border border-[#eadfd4] bg-[#f6eee6]">
                              <Image
                                alt={String(name)}
                                className="h-full w-full object-cover"
                                src={cheMitImage}
                              />
                            </Box>
                            <span className="font-semibold text-[#183d2b]">
                              {name}
                            </span>
                          </Box>
                        </td>
                        <td className="px-3 py-3 text-[#314032]">{topping}</td>
                        <td className="px-3 py-3 font-semibold text-[#183d2b]">
                          {formatCurrency(Number(price))}
                        </td>
                        <td className="px-3 py-3 font-semibold text-[#183d2b]">
                          {qty}
                        </td>
                        <td className="px-3 py-3 text-right font-semibold text-[#183d2b]">
                          {formatCurrency(Number(amount))}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-[#fffaf5] font-bold text-[#183d2b]">
                      <td className="px-3 py-3" colSpan={3}>
                        Total
                      </td>
                      <td className="px-3 py-3">3</td>
                      <td className="px-3 py-3 text-right">
                        {formatCurrency(125000)}
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
                  timeline.indexOf(selectedOrder.status) >= index &&
                  selectedOrder.status !== "cancelled";
                const active = selectedOrder.status === status;

                return (
                  <Box className="grid grid-cols-[48px_1fr_auto] gap-3" key={status}>
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
                        {status === "pending"
                          ? "Order has been created"
                          : status === "confirmed"
                            ? "Order confirmation"
                            : status === "preparing"
                              ? "Preparing products"
                              : status === "delivering"
                                ? "Out for delivery"
                                : "Completed"}
                      </p>
                    </Box>
                    {active ? (
                      <span className="pt-1 text-xs font-semibold text-[#6f665c]">
                        {selectedOrder.createdAt}
                      </span>
                    ) : null}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
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
  value: number;
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
