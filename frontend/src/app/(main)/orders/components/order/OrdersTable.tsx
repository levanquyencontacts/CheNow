import {
  Box,
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@/components";
import type { Order as ApiOrder } from "@/services/types/apiType";
import { Eye, MoreHorizontal, UserRound } from "lucide-react";

import { LIMIT_PAGE } from "../../../../../common/utils/constant";
import { statusMeta } from "../../../../../common/utils/status";
import { formatCurrency, formatDateTime } from "../ultils/orderFormat";
import { OrdersFilterBar } from "./OrdersFilterBar";
import { OrdersMessageRow } from "./OrdersMessageRow";
import { StatusPill } from "./StatusPill";

type PaginationMetadata = {
  total: number;
  totalPages: number;
};

export function OrdersTable({
  isError,
  isLoading,
  onPageChange,
  onPrintInvoice,
  onSearchChange,
  onSelectOrder,
  orders,
  page,
  pagination,
  searchValue,
  selectedOrder,
}: {
  isError: boolean;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onPrintInvoice: (order: ApiOrder) => void;
  onSearchChange: (value: string) => void;
  onSelectOrder: (orderId: number) => void;
  orders: ApiOrder[];
  page: number;
  pagination?: PaginationMetadata;
  searchValue: string;
  selectedOrder?: ApiOrder;
}) {
  return (
    <Box className="flex flex-col rounded-lg border border-[#eadfd4] bg-white/90 shadow-[0_16px_34px_rgba(55,36,20,0.06)]">
      <OrdersFilterBar
        onPrintInvoice={onPrintInvoice}
        onSearchChange={onSearchChange}
        searchValue={searchValue}
        selectedOrder={selectedOrder}
      />

      <TableContainer>
        <Table className="min-w-[980px] text-sm" size="small">
          <TableHead>
            <TableRow className="h-12 border-b border-[#eadfd4] bg-white/70 text-xs font-semibold text-[#5c554c]">
              <TableCell className="px-4">Order code</TableCell>
              <TableCell className="px-4">Customer</TableCell>
              <TableCell className="px-4">Total</TableCell>
              <TableCell className="px-4">Status</TableCell>
              <TableCell className="px-4">Payment</TableCell>
              <TableCell className="px-4">Created</TableCell>
              <TableCell align="right" className="px-4">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
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
                <TableRow
                  className={[
                    "h-16 cursor-pointer border-b border-[#eadfd4] bg-white/70 text-[#183d2b] transition last:border-b-0 hover:bg-[#fff8f1]",
                    selectedOrder?.id === order.id ? "bg-[#fff3e8]" : "",
                  ].join(" ")}
                  key={order.id}
                  onClick={() => onSelectOrder(order.id)}
                >
                  <TableCell className="px-4 text-xs font-semibold text-[#1f2c22]">
                    {order.invoiceCode}
                  </TableCell>
                  <TableCell className="px-4">
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
                  </TableCell>
                  <TableCell className="px-4 text-xs font-semibold">
                    {formatCurrency(order.totalAmount)}
                  </TableCell>
                  <TableCell className="px-4">
                    <StatusPill meta={meta} />
                  </TableCell>
                  <TableCell className="px-4 text-xs font-semibold text-[#314032]">
                    {order.paymentMethod.toUpperCase()}
                  </TableCell>
                  <TableCell className="px-4 text-xs text-[#314032]">
                    {formatDateTime(order.createdAt)}
                  </TableCell>
                  <TableCell align="right" className="px-4">
                    <Box className="flex justify-end gap-2">
                      <Button
                        aria-label="View order"
                        className="h-8 w-8 rounded-md border-[#eadfd4] bg-white p-0 text-[#183d2b] shadow-none hover:bg-[#fff8f1]"
                        onClick={(event) => {
                          event.stopPropagation();
                          onSelectOrder(order.id);
                        }}
                        variant="outlined"
                      >
                        <Eye aria-hidden="true" className="h-4 w-4" />
                      </Button>
                      <Button
                        aria-label="More actions"
                        className="h-8 w-8 rounded-md border-[#eadfd4] bg-white p-0 text-[#183d2b] shadow-none hover:bg-[#fff8f1]"
                        variant="outlined"
                      >
                        <MoreHorizontal
                          aria-hidden="true"
                          className="h-4 w-4"
                        />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className="flex flex-col gap-3 border-t border-[#eadfd4] bg-[#fffaf5] px-5 py-4 text-xs font-semibold text-[#314032] sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing {pagination?.total ? (page - 1) * LIMIT_PAGE + 1 : 0}-
          {Math.min(page * LIMIT_PAGE, pagination?.total ?? 0)} of{" "}
          {pagination?.total ?? 0} orders
        </span>
        <Pagination
          count={pagination?.totalPages ?? 1}
          disabled={isLoading}
          onChange={(_, nextPage) => onPageChange(nextPage)}
          page={page}
        />
      </Box>
    </Box>
  );
}
