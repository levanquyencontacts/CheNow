import api from "@/services/apiServices";
import type {
  DashboardSummaryRange,
  DashboardTopProductsRange,
  DashboardTopProductsSortBy,
} from "@/services/types/apiType";
import { useQuery } from "@tanstack/react-query";

export const useDashboardStatsQuery = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => api.dashboard.getStats(),
  });
};

export const useDashboardSummaryQuery = (
  range: DashboardSummaryRange = "today",
) => {
  return useQuery({
    queryKey: ["dashboard", "summary", range],
    queryFn: () => api.dashboard.getSummary(range),
  });
};

export const useDashboardTopProductsQuery = (
  range: DashboardTopProductsRange,
  limit = 5,
  sortBy: DashboardTopProductsSortBy = "revenue",
) => {
  return useQuery({
    queryKey: ["dashboard", "top-products", range, limit, sortBy],
    queryFn: () => api.dashboard.getTopProducts({ limit, range, sortBy }),
  });
};

export const useDashboardRecentOrdersQuery = (limit = 10) => {
  return useQuery({
    queryKey: ["dashboard", "recent-orders", limit],
    queryFn: () => api.dashboard.getRecentOrders(limit),
  });
};

export const useDashboardRevenueQuery = (range = "week", date?: string) => {
  return useQuery({
    queryKey: ["dashboard", "revenue", range, date],
    queryFn: () => api.dashboard.getRevenue(range, date),
  });
};
