export interface RevenueChartItem {
  date: string;
  revenue: number;
}
export interface DashboardResponse {
  monthlyRevenue: number;
  workOrders: number;
  lowStock: number;
  unpaidDebt: number;

  completedOrders: number;
  pendingOrders: number;

  revenueChart: {
    date: string;
    revenue: number;
  }[];
}
