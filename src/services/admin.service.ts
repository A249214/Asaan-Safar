import { Route, Booking, BusType } from '@/types/booking.types';
import { UserRole } from '@/types/auth.types';
import { bookingService } from '@/services/booking.service';
import { POPULAR_ROUTES } from '@/lib/mock-data';
import { useAuditStore } from '@/stores/audit.store';
import { generateId, maskCNIC, maskMobile } from '@/lib/utils';

const ROUTES_STORAGE_KEY = 'transitpk_persisted_routes';

function getInitialRoutes(): Route[] {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(ROUTES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
  }
  return [...POPULAR_ROUTES];
}

function persistRoutes(items: Route[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ROUTES_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }
}

const adminRoutes: Route[] = getInitialRoutes();

export interface TerminalPlatform {
  id: string;
  bayNumber: string;
  terminalName: string;
  assignedRouteId?: string;
  assignedRouteName?: string;
  busNumber?: string;
  driverName?: string;
  departureTime?: string;
  status: 'on-time' | 'delayed' | 'boarding' | 'departed' | 'maintenance_hold';
  boardedCount: number;
  totalSeats: number;
}

const DEFAULT_PLATFORMS: TerminalPlatform[] = [
  {
    id: 'bay-01',
    bayNumber: 'Bay 01',
    terminalName: 'Thokar Niaz Baig Central, Lahore',
    assignedRouteId: 'r1',
    assignedRouteName: 'Lahore → Islamabad',
    busNumber: 'BT-4521',
    driverName: 'Muhammad Aslam',
    departureTime: '06:00',
    status: 'boarding',
    boardedCount: 32,
    totalSeats: 40,
  },
  {
    id: 'bay-02',
    bayNumber: 'Bay 02',
    terminalName: 'Thokar Niaz Baig Central, Lahore',
    assignedRouteId: 'r2',
    assignedRouteName: 'Lahore → Karachi',
    busNumber: 'BT-9821',
    driverName: 'Hassan Raza',
    departureTime: '08:00',
    status: 'on-time',
    boardedCount: 12,
    totalSeats: 36,
  },
  {
    id: 'bay-03',
    bayNumber: 'Bay 03',
    terminalName: 'Thokar Niaz Baig Central, Lahore',
    assignedRouteId: 'r1-night',
    assignedRouteName: 'Lahore → Islamabad Sleeper',
    busNumber: 'BT-7722',
    driverName: 'Waqas Anwar',
    departureTime: '22:30',
    status: 'on-time',
    boardedCount: 0,
    totalSeats: 28,
  },
  {
    id: 'bay-04',
    bayNumber: 'Bay 04',
    terminalName: 'Thokar Niaz Baig Central, Lahore',
    status: 'maintenance_hold',
    boardedCount: 0,
    totalSeats: 0,
  },
  {
    id: 'bay-05',
    bayNumber: 'Bay 05',
    terminalName: 'Faizabad Interchange Terminal, Islamabad',
    assignedRouteId: 'r1-ret',
    assignedRouteName: 'Islamabad → Lahore',
    busNumber: 'BT-4522',
    driverName: 'Rashid Minhas',
    departureTime: '07:00',
    status: 'boarding',
    boardedCount: 22,
    totalSeats: 40,
  },
  {
    id: 'bay-06',
    bayNumber: 'Bay 06',
    terminalName: 'Faizabad Interchange Terminal, Islamabad',
    assignedRouteId: 'r3',
    assignedRouteName: 'Islamabad → Peshawar',
    busNumber: 'BT-1123',
    driverName: 'Imran Shah',
    departureTime: '07:30',
    status: 'on-time',
    boardedCount: 8,
    totalSeats: 15,
  },
];

const platforms: TerminalPlatform[] = [...DEFAULT_PLATFORMS];

function assertAdminOrManager(userRole?: UserRole) {
  if (
    userRole !== UserRole.ADMIN &&
    userRole !== UserRole.SUPER_ADMIN &&
    userRole !== UserRole.MANAGER
  ) {
    throw new Error('403 Forbidden: Administrative authority required for this operation.');
  }
}

function assertStaff(userRole?: UserRole) {
  if (
    userRole !== UserRole.ADMIN &&
    userRole !== UserRole.SUPER_ADMIN &&
    userRole !== UserRole.MANAGER &&
    userRole !== UserRole.CONDUCTOR
  ) {
    throw new Error('403 Forbidden: Authorized terminal staff credentials required.');
  }
}

export const adminService = {
  // 1. Routes & Schedules Management
  getRoutes: async (): Promise<{ data: Route[] }> => {
    return { data: [...adminRoutes] };
  },

  createRoute: async (routeData: Partial<Route>, userRole?: UserRole): Promise<{ data: Route }> => {
    assertAdminOrManager(userRole);
    const newRoute: Route = {
      id: generateId('r'),
      from: routeData.from || 'Lahore',
      to: routeData.to || 'Islamabad',
      departureTime: routeData.departureTime || '06:00',
      arrivalTime: routeData.arrivalTime || '10:30',
      duration: routeData.duration || '4h 30m',
      durationMinutes: routeData.durationMinutes || 270,
      fare: routeData.fare || 3000,
      busType: routeData.busType || BusType.EXECUTIVE,
      availableSeats: routeData.availableSeats || 40,
      luxuryLevel: routeData.luxuryLevel || 'executive',
      journeyType: routeData.journeyType || 'intercity',
      operatorId: routeData.operatorId || 'op-transitpk',
      operatorName: routeData.operatorName || 'TransitPK Express',
      vehicleType: routeData.vehicleType || 'Yutong Master Starliner',
      seatLayout: routeData.seatLayout || 'coach_2x2',
      amenities: routeData.amenities || ['ac', 'wifi', 'usb_charging', 'refreshments'],
      departureTerminal: routeData.departureTerminal || 'Thokar Niaz Baig Central, Lahore',
      arrivalTerminal: routeData.arrivalTerminal || 'Faizabad Terminal, Islamabad',
      isAvailable: true,
      platform: routeData.platform || 'Bay 01',
      busNumber: routeData.busNumber || 'BT-' + Math.floor(1000 + Math.random() * 9000),
      driver: routeData.driver || 'Assigned Driver',
      status: 'on-time',
      stops: routeData.stops || ['Bhera Service Area'],
    };

    adminRoutes.unshift(newRoute);
    persistRoutes(adminRoutes);

    useAuditStore.getState().logAction(
      'ROUTE_CREATED',
      `New route created: ${newRoute.from} → ${newRoute.to} (${newRoute.departureTime} HRS) at Rs. ${newRoute.fare}`,
      newRoute.id
    );

    return { data: newRoute };
  },

  updateRoute: async (
    routeId: string,
    updates: Partial<Route>,
    userRole?: UserRole
  ): Promise<{ data: Route }> => {
    assertAdminOrManager(userRole);
    const index = adminRoutes.findIndex((r) => r.id === routeId);
    if (index === -1) throw new Error('Route not found');

    const prev = adminRoutes[index];
    adminRoutes[index] = { ...prev, ...updates };
    persistRoutes(adminRoutes);

    useAuditStore.getState().logAction(
      'SCHEDULE_UPDATED',
      `Route ${prev.from} → ${prev.to} schedule updated. Departure: ${updates.departureTime || prev.departureTime}, Platform: ${updates.platform || prev.platform}, Fare: Rs. ${updates.fare || prev.fare}`,
      routeId
    );

    return { data: adminRoutes[index] };
  },

  // Safe Vehicle Replacement Operation: Prevents reservation corruption
  replaceVehicleSafely: async (
    routeId: string,
    newBusNumber: string,
    newCapacity: number,
    userRole?: UserRole
  ): Promise<{ data: { route: Route; remappedBookingsCount: number } }> => {
    assertAdminOrManager(userRole);
    const route = adminRoutes.find((r) => r.id === routeId);
    if (!route) throw new Error('Route not found');

    const { data: allBookings } = await bookingService.getBookings();
    const affectedBookings = allBookings.filter(
      (b) => b.routeId === routeId && b.status === 'confirmed'
    );

    const totalBookedSeats = affectedBookings.reduce((sum, b) => sum + (b.seats?.length || 0), 0);

    // Guard against capacity deficit
    if (newCapacity < totalBookedSeats) {
      throw new Error(
        `Capacity Deficit Conflict: Replacement vehicle has only ${newCapacity} seats, but ${totalBookedSeats} seats are already booked on this departure. Select a vehicle with capacity >= ${totalBookedSeats} to protect passenger reservations.`
      );
    }

    const prevBusNumber = route.busNumber;
    route.busNumber = newBusNumber;
    route.availableSeats = Math.max(0, newCapacity - totalBookedSeats);
    persistRoutes(adminRoutes);

    // Safely update all active bookings with replacement bus registration
    affectedBookings.forEach((b) => {
      b.busNumber = newBusNumber;
    });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('transitpk_persisted_bookings', JSON.stringify(allBookings));
      } catch {
        // ignore
      }
    }

    useAuditStore.getState().logAction(
      'VEHICLE_REPLACED_SAFE_TRANSFER',
      `Breakdown / Fleet Replacement: Replaced coach ${prevBusNumber} with ${newBusNumber} on route ${route.from} → ${route.to}. Safely preserved ${totalBookedSeats} booked passenger seats without double-booking.`,
      routeId
    );

    return { data: { route, remappedBookingsCount: affectedBookings.length } };
  },

  // Safe Departure Cancellation Operation
  cancelDepartureSafely: async (
    routeId: string,
    reason: string,
    userRole?: UserRole
  ): Promise<{ data: { route: Route; cancelledBookingsCount: number } }> => {
    assertAdminOrManager(userRole);
    const route = adminRoutes.find((r) => r.id === routeId);
    if (!route) throw new Error('Route not found');

    route.status = 'delayed';
    route.isAvailable = false;
    persistRoutes(adminRoutes);

    const { data: allBookings } = await bookingService.getBookings();
    const affected = allBookings.filter(
      (b) => b.routeId === routeId && b.status === 'confirmed'
    );

    affected.forEach((b) => {
      b.status = 'cancelled';
      b.paymentStatus = 'refunded';
    });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('transitpk_persisted_bookings', JSON.stringify(allBookings));
      } catch {
        // ignore
      }
    }

    useAuditStore.getState().logAction(
      'DEPARTURE_CANCELLED',
      `Departure cancelled: ${route.from} → ${route.to} (${route.departureTime} HRS). Reason: ${reason}. ${affected.length} reservations marked for automatic refund processing.`,
      routeId
    );

    return { data: { route, cancelledBookingsCount: affected.length } };
  },

  // 2. Bookings & Passenger Manifest Operations
  getAdminBookings: async (
    userRole?: UserRole
  ): Promise<{ data: (Booking & { isCnicMasked: boolean; isPhoneMasked: boolean })[] }> => {
    assertStaff(userRole);
    const { data: all } = await bookingService.getBookings();

    // Role-based PII Restriction
    const isConductor = userRole === UserRole.CONDUCTOR;

    const mapped = all.map((b) => {
      if (isConductor) {
        return {
          ...b,
          passengerInfo: {
            ...b.passengerInfo,
            cnic: maskCNIC(b.passengerInfo.cnic),
            mobile: maskMobile(b.passengerInfo.mobile),
          },
          isCnicMasked: true,
          isPhoneMasked: true,
        };
      }
      return {
        ...b,
        isCnicMasked: false,
        isPhoneMasked: false,
      };
    });

    if (!isConductor && (userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN)) {
      useAuditStore.getState().logAction(
        'PII_ACCESS_AUDIT',
        'Authorized administrative officer accessed full unmasked passenger manifest',
        'passenger_manifest'
      );
    }

    return { data: mapped };
  },

  // Check-in passenger at gate
  checkInPassenger: async (idOrPnr: string, userRole?: UserRole): Promise<{ success: boolean; message: string }> => {
    assertStaff(userRole);
    const { data: all } = await bookingService.getBookings();
    const target = idOrPnr.toUpperCase();
    const found = all.find((b) => b.id.toUpperCase() === target || b.pnr.toUpperCase() === target);
    if (!found) throw new Error('Booking not found');

    useAuditStore.getState().logAction(
      'PASSENGER_BOARDED_GATE',
      `Passenger ${found.passengerInfo.fullName} (Seats: ${found.seats.map((s) => s.number).join(', ')}) checked in and boarded at departure platform.`,
      found.pnr
    );

    return {
      success: true,
      message: `Passenger ${found.passengerInfo.fullName} successfully boarded!`,
    };
  },

  // Supervisor override
  supervisorOverrideBooking: async (
    idOrPnr: string,
    action: 'confirm' | 'cancel' | 'refund',
    reason: string,
    userRole?: UserRole
  ): Promise<{ success: boolean }> => {
    assertAdminOrManager(userRole);
    const { data: all } = await bookingService.getBookings();
    const target = idOrPnr.toUpperCase();
    const found = all.find((b) => b.id.toUpperCase() === target || b.pnr.toUpperCase() === target);
    if (!found) throw new Error('Booking not found');

    if (action === 'cancel' || action === 'refund') {
      found.status = 'cancelled';
      found.paymentStatus = 'refunded';
    } else if (action === 'confirm') {
      found.status = 'confirmed';
      found.paymentStatus = 'paid';
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('transitpk_persisted_bookings', JSON.stringify(all));
      } catch {
        // ignore
      }
    }

    useAuditStore.getState().logAction(
      'SUPERVISOR_OVERRIDE',
      `Supervisor action: ${action.toUpperCase()} on booking ${found.pnr}. Reason: ${reason}`,
      found.pnr
    );

    return { success: true };
  },

  // 3. Terminal Boarding Points & Platform Operations
  getTerminalPlatforms: async (terminalName?: string): Promise<{ data: TerminalPlatform[] }> => {
    let result = [...platforms];
    if (terminalName) {
      result = result.filter((p) => p.terminalName.toLowerCase().includes(terminalName.toLowerCase()));
    }
    return { data: result };
  },

  updatePlatformBay: async (
    bayId: string,
    updates: Partial<TerminalPlatform>,
    userRole?: UserRole
  ): Promise<{ data: TerminalPlatform }> => {
    assertStaff(userRole);
    const index = platforms.findIndex((p) => p.id === bayId);
    if (index === -1) throw new Error('Platform bay not found');

    const prev = platforms[index];
    platforms[index] = { ...prev, ...updates };

    useAuditStore.getState().logAction(
      'TERMINAL_BAY_REASSIGNED',
      `Platform ${prev.bayNumber} at ${prev.terminalName} updated: Status=${updates.status || prev.status}, AssignedRoute=${updates.assignedRouteName || prev.assignedRouteName || 'None'}`,
      bayId
    );

    return { data: platforms[index] };
  },
};
