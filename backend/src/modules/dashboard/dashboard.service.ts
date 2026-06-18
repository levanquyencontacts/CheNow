import { Injectable } from '@nestjs/common';
import {
  addDays,
  getChangePercent,
  getDateWindow,
  parseLimit,
  startOfDay,
} from './ultil/dashboard-date.util';
import { DashboardQueryService } from './dashboard-query.service';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardQueryService: DashboardQueryService) {}

  async getStats() {
    const [summary, revenue, topProducts, recentOrders] = await Promise.all([
      this.getSummary(),
      this.getRevenue(),
      this.getTopProducts(),
      this.getRecentOrders(),
    ]);

    return {
      summary,
      revenueByDay: revenue.points,
      topProducts: topProducts.items,
      recentOrders: recentOrders.items,
      statusCounts: recentOrders.statusCounts,
    };
  }

  async getSummary(range = 'today') {
    const { days, endDate, startDate } = getDateWindow(range);
    const previousStartDate = addDays(startDate, -days);
    const [currentSummary, previousSummary] = await Promise.all([
      this.dashboardQueryService.getSummaryByRange(startDate, endDate),
      this.dashboardQueryService.getSummaryByRange(
        previousStartDate,
        startDate,
      ),
    ]);

    return {
      revenue: {
        value: currentSummary.revenue,
        changePercent: getChangePercent(
          currentSummary.revenue,
          previousSummary.revenue,
        ),
      },
      orders: {
        value: currentSummary.orders,
        changePercent: getChangePercent(
          currentSummary.orders,
          previousSummary.orders,
        ),
      },
      customers: {
        value: currentSummary.customers,
        changePercent: getChangePercent(
          currentSummary.customers,
          previousSummary.customers,
        ),
      },
      cancelled: {
        value: currentSummary.cancelled,
        changePercent: getChangePercent(
          currentSummary.cancelled,
          previousSummary.cancelled,
        ),
      },
    };
  }

  async getRevenue(range = 'week') {
    const { days, endDate, startDate } = getDateWindow(range);

    return {
      points: await this.dashboardQueryService.getRevenueByDay(
        startDate,
        endDate,
        days,
      ),
    };
  }

  async getTopProducts(range = 'week', limit?: string, sortBy?: string) {
    const { endDate, startDate } = getDateWindow(range);

    return {
      items: await this.dashboardQueryService.getTopProductsByRange(
        startDate,
        endDate,
        parseLimit(limit, 5),
        this.normalizeTopProductsSortBy(sortBy),
      ),
    };
  }

  async getRecentOrders(limit?: string) {
    const todayStart = startOfDay(new Date());
    const tomorrowStart = addDays(todayStart, 1);
    const orders = await this.dashboardQueryService.getRecentOrdersByLimit(
      parseLimit(limit, 5),
    );

    return {
      items: orders.map((order) => ({
        id: order.id,
        invoiceCode:
          (order.invoiceCode as string) ||
          `ORD${String(order.id).padStart(6, '0')}`,
        customer: order.receiverName || `Customer #${order.userId}`,
        item: order.orderItems?.[0]?.productName || '-',
        status: order.status,
        createdAt: order.createdAt,
        totalAmount: Number(order.totalAmount ?? 0),
      })),
      statusCounts: await this.dashboardQueryService.getStatusCounts(
        todayStart,
        tomorrowStart,
      ),
    };
  }

  private normalizeTopProductsSortBy(sortBy?: string) {
    return sortBy === 'quantity' ? 'quantity' : 'revenue';
  }
}
