import type { DashboardRevenuePoint } from "@/services/types/apiType";

export const formatCurrency = (value: number) => {
  if (value >= 1_000_000) {
    return `${new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: 1,
    }).format(value / 1_000_000)}tr`;
  }

  if (value >= 1_000) {
    return `${new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: 0,
    }).format(value / 1_000)}K`;
  }

  return `${new Intl.NumberFormat("vi-VN").format(value)}d`;
};

export const formatTime = (value: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export function buildEmptyChartPoints(): DashboardRevenuePoint[] {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 6);

  return Array.from({ length: 7 }, (_, index) => ({
    date: `empty-${index}`,
    label: formatChartLabel(
      new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + index,
      ),
    ),
    revenue: 0,
  }));
}

function formatChartLabel(date: Date) {
  const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return `${weekdays[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}`;
}
