import { apiGet } from "./api";

export type RevenueChartItemDto = {
  date: string;
  revenue: number;
};

export type DashboardStatsDto = {
  totalRevenue: number;
  totalBookings: number;
  totalUsers: number;
  activeFields: number;
  revenueItems: RevenueChartItemDto[];
};

export const dashboardService = {
  async getStats(): Promise<DashboardStatsDto> {
    return apiGet<DashboardStatsDto>("/admin/dashboard/stats");
  },
};
