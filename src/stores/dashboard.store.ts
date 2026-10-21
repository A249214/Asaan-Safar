import { create } from 'zustand';
import { DashboardStats, ChartDataPoint } from '@/types/dashboard.types';
import { dashboardService } from '@/services/dashboard.service';

interface DashboardState {
  stats: DashboardStats;
  revenueData: ChartDataPoint[];
  passengerData: ChartDataPoint[];
  peakHoursData: ChartDataPoint[];
  fleetUsageData: ChartDataPoint[];
  isLoading: boolean;
  fetchStats: () => Promise<void>;
}

const defaultStats: DashboardStats = {
  dailyRevenue: 0,
  weeklyRevenue: 0,
  monthlyRevenue: 0,
  activeBuses: 0,
  activeRoutes: 0,
  passengerCount: 0,
};

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: defaultStats,
  revenueData: [],
  passengerData: [],
  peakHoursData: [],
  fleetUsageData: [],
  isLoading: false,

  fetchStats: async () => {
    set({ isLoading: true });
    try {
      const [stats, revenue, passengers, peak, fleet] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRevenueData(),
        dashboardService.getPassengerData(),
        dashboardService.getPeakHoursData(),
        dashboardService.getFleetUsageData(),
      ]);
      set({
        stats: stats.data,
        revenueData: revenue.data,
        passengerData: passengers.data,
        peakHoursData: peak.data,
        fleetUsageData: fleet.data,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },
}));
