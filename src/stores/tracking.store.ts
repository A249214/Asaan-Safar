import { create } from 'zustand';
import { BusLocation, TrackingUpdate } from '@/types/tracking.types';
import { MOCK_TRACKING } from '@/lib/mock-data';

interface TrackingState {
  buses: BusLocation[];
  selectedBusId: string | null;
  notifications: string[];
  updateBusLocation: (update: TrackingUpdate) => void;
  setSelectedBus: (id: string | null) => void;
  addNotification: (message: string) => void;
}

export const useTrackingStore = create<TrackingState>((set) => ({
  buses: [...MOCK_TRACKING],
  selectedBusId: null,
  notifications: [],

  updateBusLocation: (update) =>
    set((state) => ({
      buses: state.buses.map((bus) =>
        bus.id === update.busId
          ? {
              ...bus,
              progress: update.progress ?? bus.progress,
              lat: update.lat ?? bus.lat,
              lng: update.lng ?? bus.lng,
              status: update.status ?? bus.status,
              delayMinutes: update.delayMinutes ?? bus.delayMinutes,
            }
          : bus
      ),
    })),

  setSelectedBus: (id) => set({ selectedBusId: id }),

  addNotification: (message) =>
    set((state) => ({
      notifications: [message, ...state.notifications].slice(0, 10),
    })),
}));
