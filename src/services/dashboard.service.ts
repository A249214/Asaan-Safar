import {
  MOCK_STATS,
  REVENUE_DATA,
  PASSENGER_DATA,
  PEAK_HOURS_DATA,
  FLEET_USAGE_DATA,
} from '@/lib/mock-data';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const dashboardService = {
  getStats: async () => {
    await delay();
    return { data: MOCK_STATS };
  },

  getRevenueData: async () => {
    await delay();
    return { data: REVENUE_DATA };
  },

  getPassengerData: async () => {
    await delay();
    return { data: PASSENGER_DATA };
  },

  getPeakHoursData: async () => {
    await delay();
    return { data: PEAK_HOURS_DATA };
  },

  getFleetUsageData: async () => {
    await delay();
    return { data: FLEET_USAGE_DATA };
  },
};
