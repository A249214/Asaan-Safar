import { Bus, MaintenanceLog } from '@/types/fleet.types';
import { MOCK_BUSES, MOCK_DRIVERS } from '@/lib/mock-data';
import { generateId } from '@/lib/utils';

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

const buses = [...MOCK_BUSES];
const drivers = [...MOCK_DRIVERS];
const maintenanceLogs: MaintenanceLog[] = [];

export const fleetService = {
  getBuses: async () => {
    await delay();
    return { data: buses };
  },

  getDrivers: async () => {
    await delay();
    return { data: drivers };
  },

  createBus: async (bus: Omit<Bus, 'id'>) => {
    await delay();
    const newBus: Bus = { ...bus, id: generateId('bus') };
    buses.push(newBus);
    return { data: newBus };
  },

  updateBus: async (id: string, updates: Partial<Bus>) => {
    await delay();
    const index = buses.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Bus not found');
    buses[index] = { ...buses[index], ...updates };
    return { data: buses[index] };
  },

  deleteBus: async (id: string) => {
    await delay();
    const idx = buses.findIndex((b) => b.id === id);
    if (idx !== -1) buses.splice(idx, 1);
    return { data: { success: true } };
  },

  createMaintenanceLog: async (log: Omit<MaintenanceLog, 'id'>) => {
    await delay();
    const newLog: MaintenanceLog = { ...log, id: generateId('ml') };
    maintenanceLogs.push(newLog);
    return { data: newLog };
  },

  getMaintenanceLogs: async () => {
    await delay();
    return { data: maintenanceLogs };
  },
};
