"use client";

import { Box } from "@/components";
import {
  ArrowDownRight,
  ArrowUpRight,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { ReportRevenueSummary } from "../types";
import { formatFullCurrency } from "./reportFormat";

interface Props {
  summary: ReportRevenueSummary;
}

export function ReportRevenueSummaryCards({ summary }: Props) {
  const cards = [
    {
      label: "Tổng doanh thu",
      value: formatFullCurrency(summary.totalRevenue),
      icon: <Wallet aria-hidden className="h-4 w-4" />,
      color: "text-[#c75f2a]",
      bg: "bg-[#fff6ed]",
    },
    {
      label: "Tổng đơn hàng",
      value: `${summary.totalOrders} đơn`,
      icon: <ShoppingBag aria-hidden className="h-4 w-4" />,
      color: "text-[#315d3b]",
      bg: "bg-[#f0faf3]",
    },
    {
      label: "TB / đơn",
      value: formatFullCurrency(summary.avgPerOrder),
      icon: <TrendingUp aria-hidden className="h-4 w-4" />,
      color: "text-[#2563eb]",
      bg: "bg-[#eff6ff]",
    },
    {
      label: "Tăng trưởng",
      value: `${summary.growthPercent >= 0 ? "+" : ""}${summary.growthPercent.toFixed(1)}%`,
      icon:
        summary.growthPercent >= 0 ? (
          <ArrowUpRight aria-hidden className="h-4 w-4" />
        ) : (
          <ArrowDownRight aria-hidden className="h-4 w-4" />
        ),
      color: summary.growthPercent >= 0 ? "text-[#315d3b]" : "text-[#b12f1d]",
      bg: summary.growthPercent >= 0 ? "bg-[#f0faf3]" : "bg-[#fff5f5]",
    },
  ];

  return (
    <Box className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => (
        <Box
          key={card.label}
          className="rounded-md border border-[#eadfd4] bg-white p-4 shadow-sm"
        >
          <Box
            className={[
              "mb-2 flex h-8 w-8 items-center justify-center rounded-full",
              card.bg,
              card.color,
            ].join(" ")}
          >
            {card.icon}
          </Box>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#8a7867]">
            {card.label}
          </p>
          <p
            className={["mt-0.5 text-sm font-extrabold", card.color].join(" ")}
          >
            {card.value}
          </p>
        </Box>
      ))}
    </Box>
  );
}
