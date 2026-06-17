"use client";

import { Box, Button } from "@/components";
import { useDashboardTopProductsQuery } from "@/services/controllers/dashboard/DashboardQueries";
import type {
  DashboardTopProductsRange,
  DashboardTopProductsSortBy,
} from "@/services/types/apiType";
import { useState } from "react";

import { formatCurrency } from "./dashboardFormat";

const rangeOptions: Array<{
  label: string;
  value: DashboardTopProductsRange;
}> = [
  { label: "Ngay", value: "today" },
  { label: "Tuan", value: "week" },
  { label: "Thang", value: "month" },
  { label: "Nam", value: "year" },
];

const sortOptions: Array<{
  label: string;
  value: DashboardTopProductsSortBy;
}> = [
  { label: "Doanh thu", value: "revenue" },
  { label: "So luong", value: "quantity" },
];

export function DashboardTopProducts() {
  const [range, setRange] = useState<DashboardTopProductsRange>("week");
  const [sortBy, setSortBy] = useState<DashboardTopProductsSortBy>("quantity");
  const { data, isLoading } = useDashboardTopProductsQuery(range, 5, sortBy);
  const products = data?.items ?? [];

  return (
    <Box className="rounded-md border border-[#eadfd4] bg-white p-4 shadow-sm">
      <Box className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold text-[#211812]">Top san pham</p>
        <Box className="flex flex-wrap gap-2">
          <Box className="flex rounded-full bg-[#fffaf5] p-1 text-[10px] font-bold ring-1 ring-[#eadfd4]">
            {rangeOptions.map((option) => {
              const active = range === option.value;

              return (
                <Button
                  className={[
                    "h-auto rounded-full px-2.5 py-1 text-[10px] shadow-none",
                    active
                      ? "bg-[#432010] text-white hover:bg-[#432010]"
                      : "bg-transparent text-[#5f5148] hover:bg-[#fff1e7]",
                  ].join(" ")}
                  key={option.value}
                  onClick={() => setRange(option.value)}
                  variant="text"
                >
                  {option.label}
                </Button>
              );
            })}
          </Box>
          <Box className="flex rounded-full bg-[#fffaf5] p-1 text-[10px] font-bold ring-1 ring-[#eadfd4]">
            {sortOptions.map((option) => {
              const active = sortBy === option.value;

              return (
                <Button
                  className={[
                    "h-auto rounded-full px-2.5 py-1 text-[10px] shadow-none",
                    active
                      ? "bg-[#315d3b] text-white hover:bg-[#315d3b]"
                      : "bg-transparent text-[#5f5148] hover:bg-[#fff1e7]",
                  ].join(" ")}
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  variant="text"
                >
                  {option.label}
                </Button>
              );
            })}
          </Box>
        </Box>
      </Box>
      <Box className="space-y-3">
        {isLoading ? (
          <p className="text-xs text-[#8a7867]">Dang tai du lieu...</p>
        ) : null}
        {products.map((product) => (
          <Box className="flex items-center gap-3" key={product.productId}>
            <span
              className={[
                "flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-white",
                product.rank === 1
                  ? "bg-[#f07a2f]"
                  : product.rank === 2
                    ? "bg-[#9a9a9a]"
                    : product.rank === 3
                      ? "bg-[#9c67d9]"
                      : "bg-[#efc645]",
              ].join(" ")}
            >
              {product.rank}
            </span>
            <Box className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-[#211812]">
                {product.productName}
              </p>
              <p className="text-[10px] text-[#8a7867]">
                Da ban {product.quantity}
              </p>
            </Box>
            <p className="text-xs font-bold text-[#211812]">
              {formatCurrency(product.revenue)}
            </p>
          </Box>
        ))}
        {!isLoading && products.length === 0 ? (
          <p className="text-xs text-[#8a7867]">Chua co du lieu.</p>
        ) : null}
      </Box>
    </Box>
  );
}
