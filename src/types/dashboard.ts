export interface RevenueChartItem {
  date: string;
  revenue: number;
}

export interface DashboardResponse {
  monthlyRevenue: number;
  workOrders: number;
  lowStock: number;
  unpaidDebt: number;
  revenueChart: RevenueChartItem[];
}
