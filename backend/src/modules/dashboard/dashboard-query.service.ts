import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from '../../common/enums/common.enum';
import { OrderItems } from '../orders/entity/order-items';
import { Orders } from '../orders/entity/orders.entity';
import {
  addDays,
  addMonths,
  formatChartLabel,
  formatMonthLabel,
  startOfMonth,
  toDateKey,
  toMonthKey,
} from './ultil/dashboard-date.util';

@Injectable()
export class DashboardQueryService {
  constructor(
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
    @InjectRepository(OrderItems)
    private readonly orderItemsRepository: Repository<OrderItems>,
  ) {}

  async getSummaryByRange(startDate: Date, endDate: Date) {
    const raw = await this.ordersRepository
      .createQueryBuilder('order')
      .select('COUNT(order.id)', 'orders')
      .addSelect(
        'COALESCE(SUM(CASE WHEN order.status = :completed THEN order.totalAmount ELSE 0 END), 0)',
        'revenue',
      )
      .addSelect(
        'COUNT(CASE WHEN order.status = :cancelled THEN 1 END)',
        'cancelled',
      )
      .addSelect('COUNT(DISTINCT order.userId)', 'customers')
      .where('order.createdAt >= :startDate', { startDate })
      .andWhere('order.createdAt < :endDate', { endDate })
      .setParameters({
        cancelled: OrderStatus.CANCELLED,
        completed: OrderStatus.COMPLETED,
      })
      .getRawOne<{
        cancelled: string;
        customers: string;
        orders: string;
        revenue: string;
      }>();

    return {
      cancelled: Number(raw?.cancelled ?? 0),
      customers: Number(raw?.customers ?? 0),
      orders: Number(raw?.orders ?? 0),
      revenue: Number(raw?.revenue ?? 0),
    };
  }

  async getRevenueByMonth(startDate: Date, endDate: Date) {
    const rows = await this.ordersRepository
      .createQueryBuilder('order')
      .select("TO_CHAR(order.createdAt, 'YYYY-MM')", 'month')
      .addSelect('COALESCE(SUM(order.totalAmount), 0)', 'revenue')
      .where('order.createdAt >= :startDate', { startDate })
      .andWhere('order.createdAt < :endDate', { endDate })
      .andWhere('order.status = :status', { status: OrderStatus.COMPLETED })
      .groupBy("TO_CHAR(order.createdAt, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .getRawMany<{ month: string; revenue: string }>();

    const revenueMap = new Map(
      rows.map((row) => [row.month, Number(row.revenue ?? 0)]),
    );

    return Array.from({ length: 12 }, (_, index) => {
      const date = addMonths(startOfMonth(startDate), index);
      const key = toMonthKey(date);

      return {
        date: key,
        label: formatMonthLabel(date.getMonth()),
        revenue: revenueMap.get(key) ?? 0,
      };
    });
  }

  async getRevenueByDay(startDate: Date, endDate: Date, days: number) {
    const rows = await this.ordersRepository
      .createQueryBuilder('order')
      .select("TO_CHAR(order.createdAt, 'YYYY-MM-DD')", 'date')
      .addSelect('COALESCE(SUM(order.totalAmount), 0)', 'revenue')
      .where('order.createdAt >= :startDate', { startDate })
      .andWhere('order.createdAt < :endDate', { endDate })
      .andWhere('order.status = :status', { status: OrderStatus.COMPLETED })
      .groupBy("TO_CHAR(order.createdAt, 'YYYY-MM-DD')")
      .orderBy('date', 'ASC')
      .getRawMany<{ date: string; revenue: string }>();

    const revenueMap = new Map(
      rows.map((row) => [row.date, Number(row.revenue ?? 0)]),
    );

    return Array.from({ length: days }, (_, index) => {
      const date = addDays(startDate, index);
      const key = toDateKey(date);

      return {
        date: key,
        label: formatChartLabel(date),
        revenue: revenueMap.get(key) ?? 0,
      };
    });
  }

  async getTopProductsByRange(
    startDate: Date,
    endDate: Date,
    limit: number,
    sortBy: 'quantity' | 'revenue',
  ) {
    const rows = await this.orderItemsRepository
      .createQueryBuilder('orderItem')
      .innerJoin('orderItem.order', 'order')
      .select('orderItem.productId', 'productId')
      .addSelect('orderItem.productName', 'productName')
      .addSelect('SUM(orderItem.quantity)', 'quantity')
      .addSelect('COALESCE(SUM(orderItem.subtotal), 0)', 'revenue')
      .where('order.createdAt >= :startDate', { startDate })
      .andWhere('order.createdAt < :endDate', { endDate })
      .andWhere('order.status != :cancelled', {
        cancelled: OrderStatus.CANCELLED,
      })
      .groupBy('orderItem.productId')
      .addGroupBy('orderItem.productName')
      .orderBy(sortBy, 'DESC')
      .limit(limit)
      .getRawMany<{
        productId: string;
        productName: string;
        quantity: string;
        revenue: string;
      }>();

    return rows.map((row, index) => ({
      productId: Number(row.productId),
      productName: row.productName,
      quantity: Number(row.quantity ?? 0),
      revenue: Number(row.revenue ?? 0),
      rank: index + 1,
    }));
  }

  getRecentOrdersByLimit(limit: number) {
    return this.ordersRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['orderItems'],
      take: limit,
    });
  }

  async getStatusCounts(startDate: Date, endDate: Date) {
    const rows = await this.ordersRepository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(order.id)', 'count')
      .where('order.createdAt >= :startDate', { startDate })
      .andWhere('order.createdAt < :endDate', { endDate })
      .groupBy('order.status')
      .getRawMany<{ count: string; status: OrderStatus }>();

    const counts = {
      all: 0,
      cancelled: 0,
      completed: 0,
      confirmed: 0,
      pending: 0,
      preparing: 0,
      ready: 0,
    };

    rows.forEach((row) => {
      counts[row.status] = Number(row.count ?? 0);
      counts.all += Number(row.count ?? 0);
    });

    return counts;
  }
}
