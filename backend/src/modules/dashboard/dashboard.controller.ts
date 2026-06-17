import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('summary')
  getSummary(@Query('range') range?: string) {
    return this.dashboardService.getSummary(range);
  }

  @Get('revenue')
  getRevenue(@Query('range') range?: string) {
    return this.dashboardService.getRevenue(range);
  }

  @Get('top-products')
  getTopProducts(
    @Query('range') range?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
  ) {
    return this.dashboardService.getTopProducts(range, limit, sortBy);
  }

  @Get('recent-orders')
  getRecentOrders(@Query('limit') limit?: string) {
    return this.dashboardService.getRecentOrders(limit);
  }
}
