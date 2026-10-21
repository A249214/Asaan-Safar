export interface AuditEntry {
  id: string;
  action: string;
  userId: string;
  userName: string;
  userRole: string;
  resource: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface DashboardStats {
  dailyRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  activeBuses: number;
  activeRoutes: number;
  passengerCount: number;
}

export interface ChartDataPoint {
  date?: string;
  route?: string;
  hour?: string;
  revenue?: number;
  passengers?: number;
  usage?: number;
}
