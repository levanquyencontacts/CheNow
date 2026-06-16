"use client";

import { LIMIT_PAGE, routes } from "@/common/utils/constant";
import { Box, Button } from "@/components";
import {
  useOrderQuery,
  useOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/services/controllers/orders/OrdersQueries";
import type { OrderStatus } from "@/services/types/apiType";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { statusMeta } from "../../../common/utils/status";
import { printInvoice } from "./components/invoice/Invoice";
import { OrderDetail } from "./components/order/OrderDetail";
import { OrderStatusTabs } from "./components/order/OrderStatusTabs";
import { OrdersTable } from "./components/order/OrdersTable";

const orderCountQueryParams = {
  limit: 1,
  order: "DESC" as const,
  page: 1,
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
      limit: LIMIT_PAGE,
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

  const allCountQuery = useOrdersQuery(orderCountQueryParams);

  const pendingCountQuery = useOrdersQuery({
    ...orderCountQueryParams,
    status: "pending",
  });
  const confirmedCountQuery = useOrdersQuery({
    ...orderCountQueryParams,
    status: "confirmed",
  });
  const preparingCountQuery = useOrdersQuery({
    ...orderCountQueryParams,
    status: "preparing",
  });
  const readyCountQuery = useOrdersQuery({
    ...orderCountQueryParams,
    status: "ready",
  });
  const completedCountQuery = useOrdersQuery({
    ...orderCountQueryParams,
    status: "completed",
  });
  const cancelledCountQuery = useOrdersQuery({
    ...orderCountQueryParams,
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
    cancelled: cancelledCountQuery.data?.metadata.pagination.total,
    completed: completedCountQuery.data?.metadata.pagination.total,
    confirmed: confirmedCountQuery.data?.metadata.pagination.total,
    pending: pendingCountQuery.data?.metadata.pagination.total,
    preparing: preparingCountQuery.data?.metadata.pagination.total,
    ready: readyCountQuery.data?.metadata.pagination.total,
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setSelectedOrderId(undefined);
    setPage(1);
  };

  const handleStatusChange = (status: OrderStatus | "all") => {
    setSelectedStatus(status);
    setSelectedOrderId(undefined);
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    setSelectedOrderId(undefined);
  };

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

        <OrderStatusTabs
          onChange={handleStatusChange}
          selectedStatus={selectedStatus}
          statusCounts={statusCounts}
        />

        <OrdersTable
          isError={isError}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          onPrintInvoice={printInvoice}
          onSearchChange={handleSearchChange}
          onSelectOrder={setSelectedOrderId}
          orders={orders}
          page={page}
          pagination={pagination}
          searchValue={searchValue}
          selectedOrder={selectedOrder}
        />

        {selectedOrder && selectedMeta ? (
          <OrderDetail
            actionLoading={updateOrderStatusMutation.isPending}
            isFetchingDetail={isFetchingDetail}
            onPrintInvoice={printInvoice}
            onUpdateStatus={handleUpdateStatus}
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
