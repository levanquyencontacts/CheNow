import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../guards/jwtauth.guath';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleCode } from '../../common/enums/common.enum';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleCode.ADMIN, RoleCode.STAFF)
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
  getRevenue(@Query('range') range?: string, @Query('date') date?: string) {
    return this.dashboardService.getRevenue(range, date);
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
