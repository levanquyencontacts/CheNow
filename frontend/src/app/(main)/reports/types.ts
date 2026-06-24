export type ReportRevenueRange = "week" | "month" | "year";

export interface ReportRevenuePoint {
  date: string;
  label: string;
  revenue: number;
  orderCount: number;
}

export interface ReportRevenueSummary {
  totalRevenue: number;
  totalOrders: number;
  avgPerOrder: number;
  peakDate: string | null;
  peakRevenue: number;
  growthPercent: number;
}

export interface ReportRevenueData {
  points: ReportRevenuePoint[];
  summary: ReportRevenueSummary;
}
