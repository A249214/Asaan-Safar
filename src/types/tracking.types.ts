export interface BusLocation {
  id: string;
  route: string;
  from: string;
  to: string;
  progress: number;
  lat: number;
  lng: number;
  driver: string;
  status: 'on-time' | 'delayed' | 'stopped';
  eta: string;
  delayMinutes?: number;
}

export interface TrackingUpdate {
  busId: string;
  progress: number;
  lat?: number;
  lng?: number;
  timestamp: string;
  status?: BusLocation['status'];
  delayMinutes?: number;
}

export interface RouteProgress {
  busId: string;
  percentage: number;
  eta: string;
}
