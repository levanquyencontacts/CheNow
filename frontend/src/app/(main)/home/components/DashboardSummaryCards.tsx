import { Box, Button } from "@/components";
import { useDashboardSummaryQuery } from "@/services/controllers/dashboard/DashboardQueries";
import type {
  DashboardSummaryMetric,
  DashboardSummaryRange,
} from "@/services/types/apiType";
import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Clock3,
  ShoppingBag,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { formatCurrency } from "./dashboardFormat";

const toneClass: Record<string, string> = {
  blue: "bg-[#edf4ff] text-[#3f6eb3]",
  green: "bg-[#ecf8e7] text-[#3f8c45]",
  orange: "bg-[#fff1e7] text-[#d17345]",
  rose: "bg-[#fff0f0] text-[#c94b4b]",
};

const formatMetric = (
  metric?: DashboardSummaryMetric,
  note = "so voi hom qua",
) => {
  const change = metric?.changePercent ?? 0;
  const trend = change >= 0 ? "up" : "down";
  const prefix = change >= 0 ? "+" : "";

  return {
    note: `${prefix}${change}% ${note}`,
    trend,
  };
};

const rangeOptions: Array<{
  label: string;
  note: string;
  value: DashboardSummaryRange;
}> = [
  { label: "Ngay", note: "so voi hom qua", value: "today" },
  { label: "Tuan", note: "so voi tuan truoc", value: "week" },
  { label: "Thang", note: "so voi ky truoc", value: "month" },
];

export function DashboardSummaryCards() {
  const [range, setRange] = useState<DashboardSummaryRange>("today");
  const activeRange = rangeOptions.find((option) => option.value === range);
  const { data, isLoading } = useDashboardSummaryQuery(range);
  const stats = [
    {
      title: "Doanh thu",
      value: formatCurrency(data?.revenue.value ?? 0),
      icon: WalletCards,
      tone: "orange",
      ...formatMetric(data?.revenue, activeRange?.note),
    },
    {
      title: "Don hang",
      value: String(data?.orders.value ?? 0),
      icon: ShoppingBag,
      tone: "green",
      ...formatMetric(data?.orders, activeRange?.note),
    },
    {
      title: "Khach hang moi",
      value: String(data?.customers.value ?? 0),
      icon: UsersRound,
      tone: "blue",
      ...formatMetric(data?.customers, activeRange?.note),
    },
    {
      title: "Huy don",
      value: String(data?.cancelled.value ?? 0),
      icon: Clock3,
      tone: "rose",
      ...formatMetric(data?.cancelled, activeRange?.note),
    },
  ];

  return (
    <Box className="space-y-3">
      <Box className="flex justify-end">
        <Box className="flex rounded-full bg-white p-1 text-[10px] font-bold shadow-sm ring-1 ring-[#eadfd4]">
          {rangeOptions.map((option) => {
            const active = range === option.value;

            return (
              <Button
                className={[
                  "h-auto rounded-full px-3 py-1 text-[10px] shadow-none",
                  active
                    ? "bg-[#123b29] text-white hover:bg-[#123b29]"
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
      </Box>
      <Box className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;

          return (
            <Box
              className="rounded-md border border-[#eadfd4] bg-white p-4 shadow-sm"
              key={stat.title}
            >
              <Box className="mb-3 flex items-start justify-between">
                <p className="text-[11px] font-bold text-[#2d221b]">
                  {stat.title}
                </p>
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-md ${toneClass[stat.tone]}`}
                >
                  <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                </span>
              </Box>
              <p className="text-2xl font-extrabold leading-none text-[#1f1814]">
                {isLoading ? "..." : stat.value}
              </p>
              <p
                className={`mt-2 flex items-center gap-1 text-[10px] font-semibold ${
                  stat.trend === "up" ? "text-[#3f8c45]" : "text-[#b12f1d]"
                }`}
              >
                <TrendIcon aria-hidden="true" className="h-3 w-3" />
                {stat.note}
              </p>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
