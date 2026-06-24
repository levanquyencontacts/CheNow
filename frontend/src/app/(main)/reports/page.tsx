"use client";

import { Box, Button } from "@/components";
import { BarChart3, TrendingUp } from "lucide-react";
import { useState } from "react";
import { ReportRevenueChart } from "./components/ReportRevenueChart";
import { ReportRevenueSummaryCards } from "./components/ReportRevenueSummaryCards";
import { ReportRevenueTable } from "./components/ReportRevenueTable";
import { getMockRevenue } from "./mockData";
import type { ReportRevenueRange } from "./types";

const rangeOptions: Array<{ label: string; value: ReportRevenueRange }> = [
  { label: "Tuần", value: "week" },
  { label: "Tháng", value: "month" },
  { label: "Năm", value: "year" },
];

const rangeDescriptions: Record<ReportRevenueRange, string> = {
  week: "Theo từng ngày trong tuần",
  month: "Theo từng ngày trong tháng",
  year: "Theo từng tháng trong năm",
};

const tabs = [
  {
    label: "Doanh thu",
    value: "revenue",
    icon: <TrendingUp className="h-3.5 w-3.5" />,
  },
  {
    label: "Tổng quan",
    value: "overview",
    icon: <BarChart3 className="h-3.5 w-3.5" />,
  },
];

export default function ReportsPage() {
  const [range, setRange] = useState<ReportRevenueRange>("week");
  const [activeTab, setActiveTab] = useState("revenue");

  const { points, summary } = getMockRevenue(range);

  return (
    <Box className="min-h-screen bg-[#faf5f0] p-4 md:p-6">
      {/* Header */}
      <Box className="mb-6">
        <Box className="flex items-center gap-2">
          <Box className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#432010] text-white">
            <BarChart3 className="h-4 w-4" />
          </Box>
          <Box>
            <h1 className="text-lg font-extrabold text-[#211812]">Báo cáo</h1>
            <p className="text-[11px] font-semibold text-[#8a7867]">
              Phân tích doanh thu & hiệu suất kinh doanh
            </p>
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      <Box className="mb-4 flex gap-1 rounded-lg bg-[#f0e8df] p-1 w-fit">
        {tabs.map((tab) => {
          const active = activeTab === tab.value;
          return (
            <Button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              variant="text"
              aria-pressed={active}
              className={[
                "flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-bold shadow-none",
                active
                  ? "bg-[#432010] text-white hover:bg-[#432010]"
                  : "bg-transparent text-[#5f5148] hover:bg-[#e0d5ca]",
              ].join(" ")}
            >
              {tab.icon}
              {tab.label}
            </Button>
          );
        })}
      </Box>

      {/* Revenue Tab */}
      {activeTab === "revenue" && (
        <Box className="flex flex-col gap-4">
          {/* Range Selector */}
          <Box className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-[#8a7867]">
              {rangeDescriptions[range]}
            </p>
            <Box className="flex rounded-full bg-[#fffaf5] p-1 text-[10px] font-bold ring-1 ring-[#eadfd4]">
              {rangeOptions.map((opt) => {
                const active = range === opt.value;
                return (
                  <Button
                    key={opt.value}
                    onClick={() => setRange(opt.value)}
                    variant="text"
                    aria-pressed={active}
                    className={[
                      "h-7 rounded-full px-3 py-0 text-[10px] shadow-none",
                      active
                        ? "bg-[#432010] text-white hover:bg-[#432010]"
                        : "bg-transparent text-[#5f5148] hover:bg-[#fff1e7]",
                    ].join(" ")}
                  >
                    {opt.label}
                  </Button>
                );
              })}
            </Box>
          </Box>

          {/* Summary Cards */}
          <ReportRevenueSummaryCards summary={summary} />

          {/* Chart */}
          <Box className="rounded-md border border-[#eadfd4] bg-white p-4 shadow-sm">
            <Box className="mb-3">
              <p className="text-sm font-bold text-[#211812]">
                Biểu đồ doanh thu
              </p>
              <p className="text-[10px] font-semibold text-[#8a7867]">
                Doanh thu (cột) & Số đơn (đường) · {rangeDescriptions[range]}
              </p>
            </Box>
            <ReportRevenueChart points={points} range={range} />
          </Box>

          {/* Table */}
          <ReportRevenueTable points={points} />
        </Box>
      )}

      {/* Overview Tab (placeholder) */}
      {activeTab === "overview" && (
        <Box className="flex min-h-[300px] flex-col items-center justify-center rounded-md border border-dashed border-[#eadfd4] bg-white text-center">
          <BarChart3 className="mb-3 h-10 w-10 text-[#d4b99a]" />
          <p className="text-sm font-bold text-[#5f5148]">
            Tổng quan đang phát triển
          </p>
          <p className="mt-1 max-w-[240px] text-xs text-[#8a7867]">
            Tính năng phân tích tổng quan sẽ được bổ sung trong thời gian tới.
          </p>
        </Box>
      )}
    </Box>
  );
}
