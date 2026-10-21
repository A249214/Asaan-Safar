export type BusStatus = 'active' | 'available' | 'under_maintenance' | 'out_of_service' | 'broken';

export interface Driver {
  id: string;
  name: string;
  cnic: string;
  phone: string;
  licenseNumber: string;
}

export interface Bus {
  id: string;
  registrationNumber: string;
  model: string;
  capacity: number;
  status: BusStatus;
  driverId?: string;
  routeId?: string;
  insuranceExpiry: string;
  registrationExpiry: string;
  lastMaintenance: string;
  nextMaintenance: string;
  fuelLevel: number;
  documents?: string[];
}

export interface MaintenanceLog {
  id: string;
  busId: string;
  type: 'breakdown' | 'scheduled' | 'repair';
  description: string;
  cost: number;
  status: 'pending' | 'in_progress' | 'completed';
  reportedAt: string;
  completedAt?: string;
  images?: string[];
}
