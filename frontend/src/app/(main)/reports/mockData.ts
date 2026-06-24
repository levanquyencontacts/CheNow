// ─── Mock Revenue Data ────────────────────────────────────────────────────────

import { ReportRevenuePoint } from "./types";

export const mockRevenueWeek: ReportRevenuePoint[] = [
  { date: "2026-06-16", label: "T2 16/6", revenue: 4_200_000, orderCount: 12 },
  { date: "2026-06-17", label: "T3 17/6", revenue: 5_800_000, orderCount: 18 },
  { date: "2026-06-18", label: "T4 18/6", revenue: 3_500_000, orderCount: 10 },
  { date: "2026-06-19", label: "T5 19/6", revenue: 7_100_000, orderCount: 24 },
  { date: "2026-06-20", label: "T6 20/6", revenue: 9_200_000, orderCount: 31 },
  { date: "2026-06-21", label: "T7 21/6", revenue: 11_500_000, orderCount: 38 },
  { date: "2026-06-22", label: "CN 22/6", revenue: 8_300_000, orderCount: 27 },
];

export const mockRevenueMonth: ReportRevenuePoint[] = Array.from(
  { length: 24 },
  (_, i) => ({
    date: `2026-06-${String(i + 1).padStart(2, "0")}`,
    label: `${i + 1}/6`,
    revenue: Math.floor(2_000_000 + Math.random() * 9_000_000),
    orderCount: Math.floor(5 + Math.random() * 30),
  }),
);

export const mockRevenueYear: ReportRevenuePoint[] = [
  { date: "2026-01", label: "T1", revenue: 62_000_000, orderCount: 210 },
  { date: "2026-02", label: "T2", revenue: 55_000_000, orderCount: 185 },
  { date: "2026-03", label: "T3", revenue: 78_000_000, orderCount: 262 },
  { date: "2026-04", label: "T4", revenue: 91_000_000, orderCount: 305 },
  { date: "2026-05", label: "T5", revenue: 84_000_000, orderCount: 281 },
  { date: "2026-06", label: "T6", revenue: 103_000_000, orderCount: 342 },
  { date: "2026-07", label: "T7", revenue: 0, orderCount: 0 },
  { date: "2026-08", label: "T8", revenue: 0, orderCount: 0 },
  { date: "2026-09", label: "T9", revenue: 0, orderCount: 0 },
  { date: "2026-10", label: "T10", revenue: 0, orderCount: 0 },
  { date: "2026-11", label: "T11", revenue: 0, orderCount: 0 },
  { date: "2026-12", label: "T12", revenue: 0, orderCount: 0 },
];

export function getMockRevenue(range: "week" | "month" | "year") {
  const points =
    range === "week"
      ? mockRevenueWeek
      : range === "month"
        ? mockRevenueMonth
        : mockRevenueYear;

  const totalRevenue = points.reduce((s, p) => s + p.revenue, 0);
  const totalOrders = points.reduce((s, p) => s + p.orderCount, 0);
  const avgPerOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const peak = points.reduce<ReportRevenuePoint | null>(
    (max, p) => (!max || p.revenue > max.revenue ? p : max),
    null,
  );

  return {
    points,
    summary: {
      totalRevenue,
      totalOrders,
      avgPerOrder,
      peakDate: peak?.label ?? null,
      peakRevenue: peak?.revenue ?? 0,
      growthPercent: 12.4,
    },
  };
}
