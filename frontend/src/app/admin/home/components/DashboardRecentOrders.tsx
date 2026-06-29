import { statusMeta } from "@/common/utils/status";
import {
  Box,
  Button,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@/components";
import type {
  DashboardRecentOrder,
  OrderStatus,
} from "@/services/types/apiType";
import { useDashboardRecentOrdersQuery } from "@/services/controllers/dashboard/DashboardQueries";
import type { StatusVariant } from "@/components";
import { CalendarDays } from "lucide-react";

import { formatCurrency, formatTime } from "./dashboardFormat";

const orderStatusVariant: Record<OrderStatus, StatusVariant> = {
  cancelled: "danger",
  completed: "success",
  confirmed: "success",
  pending: "pending",
  preparing: "warning",
  ready: "neutral",
};

const emptyStatusCounts: Record<OrderStatus | "all", number> = {
  all: 0,
  cancelled: 0,
  completed: 0,
  confirmed: 0,
  pending: 0,
  preparing: 0,
  ready: 0,
};

export function DashboardRecentOrders() {
  const { data, isLoading } = useDashboardRecentOrdersQuery(10);
  const orders: DashboardRecentOrder[] = data?.items ?? [];
  const statusCounts = data?.statusCounts ?? emptyStatusCounts;

  return (
    <Box className="mt-4 rounded-md border border-[#eadfd4] bg-white p-4 shadow-sm">
      <Box className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold text-[#211812]">Don hang gan day</p>
        <Button
          className="h-auto rounded-sm px-0 py-0 text-[10px] font-bold text-[#d17345] shadow-none hover:bg-transparent"
          variant="text"
        >
          Xem tat ca
        </Button>
      </Box>
      <Box className="mb-3 flex flex-wrap gap-2 text-[10px] font-bold">
        {[
          `Tat ca (${statusCounts.all ?? 0})`,
          `Dang lam (${
            (statusCounts.confirmed ?? 0) +
            (statusCounts.preparing ?? 0) +
            (statusCounts.ready ?? 0)
          })`,
          `Hoan thanh (${statusCounts.completed ?? 0})`,
          `Da huy (${statusCounts.cancelled ?? 0})`,
        ].map((item, index) => (
          <Button
            className={[
              "h-auto rounded-full border px-3 py-1 text-[10px] shadow-none",
              index === 0
                ? "border-[#432010] bg-[#432010] text-white"
                : "border-[#eadfd4] text-[#5f5148]",
            ].join(" ")}
            key={item}
            variant="text"
          >
            {item}
          </Button>
        ))}
      </Box>
      <TableContainer>
        <Table className="min-w-[680px]" size="small">
          <TableHead>
            <TableRow className="border-b border-[#eadfd4] text-[10px] uppercase text-[#8a7867]">
              <TableCell className="py-3 font-bold">Ma don</TableCell>
              <TableCell className="py-3 font-bold">
                Khach hang / Mon
              </TableCell>
              <TableCell className="py-3 font-bold">Trang thai</TableCell>
              <TableCell className="py-3 font-bold">Thoi gian</TableCell>
              <TableCell align="right" className="py-3 font-bold">
                Tong
              </TableCell>
              <TableCell align="right" className="py-3 font-bold" />
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                className="border-b border-[#eadfd4] last:border-b-0"
                key={order.id}
              >
                <TableCell className="py-3 text-xs font-bold text-[#6b5f56]">
                  {order.code}
                </TableCell>
                <TableCell className="py-3">
                  <p className="text-xs font-bold text-[#211812]">
                    {order.customer}
                  </p>
                  <p className="text-[10px] text-[#8a7867]">{order.item}</p>
                </TableCell>
                <TableCell className="py-3">
                  <StatusBadge
                    className="px-2 py-1 text-[10px] font-bold"
                    label={statusMeta[order.status].label}
                    status={order.status}
                    variant={orderStatusVariant[order.status]}
                  />
                </TableCell>
                <TableCell className="py-3 text-xs text-[#4f463f]">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays aria-hidden="true" className="h-3 w-3" />
                    {formatTime(order.createdAt)}
                  </span>
                </TableCell>
                <TableCell
                  align="right"
                  className="py-3 text-xs font-bold text-[#211812]"
                >
                  {formatCurrency(order.totalAmount)}
                </TableCell>
                <TableCell align="right" className="py-3">
                  <Button
                    className="h-8 rounded-sm px-3 text-[10px]"
                    size="small"
                    variant="outlined"
                  >
                    Chi tiet
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && orders.length === 0 ? (
              <TableRow>
                <TableCell
                  className="py-8 text-center text-xs text-[#8a7867]"
                  colSpan={6}
                >
                  Chua co don hang gan day.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
