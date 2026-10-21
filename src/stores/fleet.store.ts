import { create } from 'zustand';
import { Bus, Driver, MaintenanceLog } from '@/types/fleet.types';
import { fleetService } from '@/services/fleet.service';
import { toast } from 'react-hot-toast';
import { useAuditStore } from '@/stores/audit.store';

interface FleetState {
  buses: Bus[];
  drivers: Driver[];
  maintenanceLogs: MaintenanceLog[];
  isLoading: boolean;

  fetchBuses: () => Promise<void>;
  fetchDrivers: () => Promise<void>;
  addBus: (bus: Omit<Bus, 'id'>) => Promise<void>;
  updateBus: (id: string, updates: Partial<Bus>) => Promise<void>;
  deleteBus: (id: string) => Promise<void>;
  markMaintenance: (id: string, description: string) => Promise<void>;
  replaceVehicle: (busId: string) => Promise<void>;
  assignDriver: (busId: string, driverId: string) => Promise<void>;
  assignRoute: (busId: string, routeId: string) => Promise<void>;
}

export const useFleetStore = create<FleetState>((set, get) => ({
  buses: [],
  drivers: [],
  maintenanceLogs: [],
  isLoading: false,

  fetchBuses: async () => {
    set({ isLoading: true });
    try {
      const response = await fleetService.getBuses();
      set({ buses: response.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchDrivers: async () => {
    const response = await fleetService.getDrivers();
    set({ drivers: response.data });
  },

  addBus: async (bus) => {
    const response = await fleetService.createBus(bus);
    set((state) => ({ buses: [...state.buses, response.data] }));
    useAuditStore.getState().logAction('CREATE_BUS', `Added bus ${response.data.registrationNumber}`);
    toast.success('Bus added successfully');
  },

  updateBus: async (id, updates) => {
    const response = await fleetService.updateBus(id, updates);
    set((state) => ({
      buses: state.buses.map((b) => (b.id === id ? response.data : b)),
    }));
    useAuditStore.getState().logAction('UPDATE_BUS', `Updated bus ${id}`);
  },

  deleteBus: async (id) => {
    await fleetService.deleteBus(id);
    set((state) => ({ buses: state.buses.filter((b) => b.id !== id) }));
    useAuditStore.getState().logAction('DELETE_BUS', `Deleted bus ${id}`);
    toast.success('Bus deleted');
  },

  markMaintenance: async (id, description) => {
    const bus = get().buses.find((b) => b.id === id);
    if (!bus) return;

    await get().updateBus(id, { status: 'under_maintenance' });
    const log = await fleetService.createMaintenanceLog({
      busId: id,
      type: 'breakdown',
      description,
      cost: 0,
      status: 'pending',
      reportedAt: new Date().toISOString(),
    });
    set((state) => ({ maintenanceLogs: [...state.maintenanceLogs, log.data] }));

    if (bus.routeId) {
      await get().replaceVehicle(id);
    }
    toast.success('Maintenance reported');
  },

  replaceVehicle: async (busId) => {
    const { buses } = get();
    const brokenBus = buses.find((b) => b.id === busId);
    if (!brokenBus?.routeId) return;

    const replacement = buses.find(
      (b) => b.status === 'available' && b.id !== busId
    );
    if (!replacement) {
      toast.error('No replacement vehicle available');
      return;
    }

    await get().updateBus(replacement.id, {
      routeId: brokenBus.routeId,
      status: 'active',
    });
    await get().updateBus(brokenBus.id, { routeId: undefined });

    useAuditStore.getState().logAction(
      'VEHICLE_REPLACEMENT',
      `${brokenBus.registrationNumber} replaced by ${replacement.registrationNumber} on route ${brokenBus.routeId}`
    );
    toast.success(`${replacement.registrationNumber} assigned as replacement`);
  },

  assignDriver: async (busId, driverId) => {
    await get().updateBus(busId, { driverId });
    toast.success('Driver assigned');
  },

  assignRoute: async (busId, routeId) => {
    await get().updateBus(busId, { routeId, status: 'active' });
    toast.success('Route assigned');
  },
}));
