import type {
  DashboardRecentOrdersResponse,
  DashboardStats,
  DashboardSummary,
  DashboardSummaryRange,
  DashboardTopProduct,
  DashboardTopProductsRange,
  DashboardTopProductsSortBy,
} from "@/services/types/apiType";
import type { AxiosInstance } from "axios";

export type DashboardTopProductsResponse = {
  items: DashboardTopProduct[];
};

export class DashboardService {
  constructor(private apiClient: AxiosInstance) {}

  async getStats(): Promise<DashboardStats> {
    const { data } = await this.apiClient.get("/dashboard");
    return data;
  }

  async getSummary(range: DashboardSummaryRange = "today"): Promise<DashboardSummary> {
    const { data } = await this.apiClient.get("/dashboard/summary", {
      params: { range },
    });
    return data;
  }

  async getTopProducts({
    limit = 5,
    range = "today",
    sortBy = "revenue",
  }: {
    limit?: number;
    range?: DashboardTopProductsRange;
    sortBy?: DashboardTopProductsSortBy;
  }): Promise<DashboardTopProductsResponse> {
    const { data } = await this.apiClient.get("/dashboard/top-products", {
      params: { limit, range, sortBy },
    });
    return data;
  }

  async getRecentOrders(limit = 10): Promise<DashboardRecentOrdersResponse> {
    const { data } = await this.apiClient.get("/dashboard/recent-orders", {
      params: { limit },
    });
    return data;
  }
}
