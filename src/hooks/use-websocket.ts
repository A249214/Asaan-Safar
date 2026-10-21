import { useEffect } from 'react';
import { useTrackingStore } from '@/stores/tracking.store';
import { DEPARTURE_BOARD } from '@/lib/mock-data';

type WebSocketMessage =
  | { type: 'SEAT_UPDATE'; seatId: string; status: string }
  | { type: 'SCHEDULE_CHANGE'; routeId: string; newTime: string }
  | { type: 'ROUTE_DELAY'; busId: string; delayMinutes: number }
  | { type: 'BUS_REPLACEMENT'; oldBusId: string; newBusId: string }
  | { type: 'DEPARTURE'; platform: string; message: string };

export function useWebSocket() {
  const updateBusLocation = useTrackingStore((s) => s.updateBusLocation);
  const addNotification = useTrackingStore((s) => s.addNotification);

  useEffect(() => {
    const interval = setInterval(() => {
      const busIds = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7'];
      const busId = busIds[Math.floor(Math.random() * busIds.length)];
      const progress = Math.min(1, Math.random() * 0.9 + 0.05);

      updateBusLocation({
        busId,
        progress,
        timestamp: new Date().toISOString(),
        status: Math.random() > 0.85 ? 'delayed' : 'on-time',
        delayMinutes: Math.random() > 0.85 ? Math.floor(Math.random() * 30) + 5 : 0,
      });

      const events: WebSocketMessage[] = [
        { type: 'SEAT_UPDATE', seatId: `seat-${Math.floor(Math.random() * 40) + 1}`, status: 'booked' },
        { type: 'SCHEDULE_CHANGE', routeId: 'r1', newTime: '06:15' },
        { type: 'ROUTE_DELAY', busId: 'B3', delayMinutes: 15 },
        { type: 'BUS_REPLACEMENT', oldBusId: 'BT-1190', newBusId: 'BT-9900' },
        { type: 'DEPARTURE', platform: 'P-01', message: 'Bus BT-4521 now boarding' },
      ];

      const event = events[Math.floor(Math.random() * events.length)];
      switch (event.type) {
        case 'DEPARTURE':
          addNotification(`Platform ${event.platform}: ${event.message}`);
          break;
        case 'ROUTE_DELAY':
          addNotification(`Bus ${event.busId} delayed by ${event.delayMinutes} minutes`);
          break;
        case 'BUS_REPLACEMENT':
          addNotification(`Vehicle replacement: ${event.oldBusId} → ${event.newBusId}`);
          break;
        default:
          break;
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [updateBusLocation, addNotification]);
}

export function useDepartureBoardUpdates() {
  useEffect(() => {
    const interval = setInterval(() => {
      DEPARTURE_BOARD.forEach((entry) => {
        if (Math.random() > 0.95 && entry.status === 'on-time') {
          entry.status = 'boarding';
        }
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);
}
