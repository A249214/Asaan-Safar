import {
  Booking,
  BusType,
  PassengerInfo,
  PaymentMethod,
  RouteFilters,
  Seat,
  BookingStatus,
  PaymentStatus,
} from '@/types/booking.types';
import { CancellationRefundQuote } from '@/types/ticket.types';
import { POPULAR_ROUTES, generateSeatsForLayout, BUS_TYPE_FARES } from '@/lib/mock-data';
import { generatePNR, generateServerBookingId } from '@/lib/utils';

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

const STORAGE_KEY = 'transitpk_persisted_bookings';

function getInitialBookings(): Booking[] {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
  }

  return [
    {
      id: 'BK-2024-001',
      pnr: 'TPK-93A8B1',
      routeId: 'r1',
      routeName: 'Lahore → Islamabad',
      operatorName: 'TransitPK Express',
      departureTime: '06:00',
      departureTerminal: 'Thokar Niaz Baig Central Bay 01, Lahore',
      arrivalTerminal: 'Faizabad Terminal Bay 03, Islamabad',
      busNumber: 'BT-4521',
      travelDate: '2026-10-20',
      busType: BusType.EXECUTIVE,
      seats: [{ id: 's-a12', number: 'A12', status: 'booked' }],
      passengerInfo: {
        fullName: 'Ahmed Khan',
        cnic: '35201-1234567-1',
        mobile: '03001234567',
        gender: 'male',
        emergencyContact: '03217654321',
      },
      paymentMethod: 'debit',
      status: 'confirmed',
      paymentStatus: 'paid',
      transactionId: 'TXN-CARD-4921932',
      fareBreakdown: {
        baseFare: 3500,
        terminalFee: 50,
        taxes: 0,
        totalPayable: 3550,
      },
      qrCode: 'https://transitpk.asaan-safar.pk/verify-ticket?pnr=TPK-93A8B1&token=VT-93A8B101',
      verificationToken: 'VT-93A8B101',
      verificationUrl: 'https://transitpk.asaan-safar.pk/verify-ticket?pnr=TPK-93A8B1&token=VT-93A8B101',
      bookingDate: '2026-10-18T10:15:00.000Z',
      totalFare: 3550,
    },
    {
      id: 'BK-2024-002',
      pnr: 'SNR-418K02',
      routeId: 'r2',
      routeName: 'Lahore → Karachi',
      operatorName: 'Sania Roadways Sleeper',
      departureTime: '08:00',
      departureTerminal: 'Thokar Niaz Baig Central Bay 03, Lahore',
      arrivalTerminal: 'Sohrab Goth Super Highway Terminal, Karachi',
      busNumber: 'BT-9821',
      travelDate: '2026-10-21',
      busType: BusType.BUSINESS,
      seats: [{ id: 's-b05', number: 'B05', status: 'booked' }],
      passengerInfo: {
        fullName: 'Fatima Ali',
        cnic: '42101-7654321-2',
        mobile: '03217654321',
        gender: 'female',
        emergencyContact: '03009876543',
      },
      paymentMethod: 'easypaisa',
      status: 'confirmed',
      paymentStatus: 'paid',
      transactionId: 'TXN-EP-8491023',
      fareBreakdown: {
        baseFare: 5500,
        terminalFee: 50,
        taxes: 0,
        totalPayable: 5550,
      },
      qrCode: 'https://transitpk.asaan-safar.pk/verify-ticket?pnr=SNR-418K02&token=VT-418K0202',
      verificationToken: 'VT-418K0202',
      verificationUrl: 'https://transitpk.asaan-safar.pk/verify-ticket?pnr=SNR-418K02&token=VT-418K0202',
      bookingDate: '2026-10-18T14:30:00.000Z',
      totalFare: 5550,
    },
    {
      id: 'BK-2024-003',
      pnr: 'RAW-782M99',
      routeId: 'r3',
      routeName: 'Islamabad → Peshawar',
      operatorName: 'Rawal Star Express',
      departureTime: '07:30',
      departureTerminal: 'Faizabad Terminal Bay 02, Islamabad',
      arrivalTerminal: 'Peshawar Cantt Terminal Bay 01',
      busNumber: 'BT-1123',
      travelDate: '2026-10-19',
      busType: BusType.STANDARD,
      seats: [{ id: 's-c08', number: 'C08', status: 'booked' }],
      passengerInfo: {
        fullName: 'Usman Malik',
        cnic: '61101-9876543-3',
        mobile: '03339876543',
        gender: 'male',
        emergencyContact: '03123456789',
      },
      paymentMethod: 'cash_terminal',
      status: 'confirmed',
      paymentStatus: 'paid',
      transactionId: 'TXN-CASH-781923',
      fareBreakdown: {
        baseFare: 1500,
        terminalFee: 50,
        taxes: 0,
        totalPayable: 1550,
      },
      qrCode: 'https://transitpk.asaan-safar.pk/verify-ticket?pnr=RAW-782M99&token=VT-782M9903',
      verificationToken: 'VT-782M9903',
      verificationUrl: 'https://transitpk.asaan-safar.pk/verify-ticket?pnr=RAW-782M99&token=VT-782M9903',
      bookingDate: '2026-10-17T09:00:00.000Z',
      totalFare: 1550,
    },
  ];
}

function persistBookings(items: Booking[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage error
    }
  }
}

const routes = [...POPULAR_ROUTES];
const bookings: Booking[] = getInitialBookings();
const routeSeatState: Record<string, Seat[]> = {};
const idempotencyStore: Record<string, Booking> = {};

function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function getDeparturePeriod(timeStr: string): 'morning' | 'afternoon' | 'evening' | 'night' {
  const mins = parseTimeToMinutes(timeStr);
  if (mins >= 300 && mins < 720) return 'morning'; // 05:00 - 11:59
  if (mins >= 720 && mins < 1020) return 'afternoon'; // 12:00 - 16:59
  if (mins >= 1020 && mins < 1260) return 'evening'; // 17:00 - 20:59
  return 'night'; // 21:00 - 04:59
}

export const bookingService = {
  getRoutes: async (filters?: RouteFilters) => {
    await delay(200);
    let result = [...routes];

    if (filters?.journeyType && filters.journeyType !== 'all') {
      result = result.filter((r) => r.journeyType === filters.journeyType);
    }

    if (filters?.from) {
      const q = filters.from.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.from.toLowerCase().includes(q) ||
          r.stops?.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filters?.to) {
      const q = filters.to.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.to.toLowerCase().includes(q) ||
          r.stops?.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filters?.city) {
      const q = filters.city.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.from.toLowerCase().includes(q) ||
          r.to.toLowerCase().includes(q) ||
          r.stops?.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filters?.operatorId && filters.operatorId !== 'all') {
      result = result.filter((r) => r.operatorId === filters.operatorId);
    }

    if (filters?.departurePeriod && filters.departurePeriod !== 'all') {
      result = result.filter(
        (r) => getDeparturePeriod(r.departureTime) === filters.departurePeriod
      );
    }

    if (filters?.luxury && filters.luxury !== 'all') {
      result = result.filter((r) => r.luxuryLevel === filters.luxury);
    }

    if (filters?.vehicleType && filters.vehicleType !== 'all') {
      result = result.filter((r) =>
        r.vehicleType?.toLowerCase().includes(filters.vehicleType!.toLowerCase())
      );
    }

    if (filters?.amenities && filters.amenities.length > 0) {
      result = result.filter((r) =>
        filters.amenities!.every((a) => r.amenities?.includes(a))
      );
    }

    if (filters?.minFare) {
      result = result.filter((r) => r.fare >= filters.minFare!);
    }

    if (filters?.maxFare) {
      result = result.filter((r) => r.fare <= filters.maxFare!);
    }

    if (filters?.maxDurationMinutes) {
      result = result.filter(
        (r) => (r.durationMinutes || 0) <= filters.maxDurationMinutes!
      );
    }

    if (filters?.passengers) {
      result = result.filter((r) => r.availableSeats >= filters.passengers!);
    }

    // Apply Sorting
    const sort = filters?.sortBy || 'departure_asc';
    result.sort((a, b) => {
      switch (sort as string) {
        case 'departure_asc':
        case 'departure-asc':
          return parseTimeToMinutes(a.departureTime) - parseTimeToMinutes(b.departureTime);
        case 'departure_desc':
        case 'departure-desc':
          return parseTimeToMinutes(b.departureTime) - parseTimeToMinutes(a.departureTime);
        case 'fare_asc':
        case 'price_asc':
        case 'price-asc':
          return a.fare - b.fare;
        case 'fare_desc':
        case 'price_desc':
        case 'price-desc':
          return b.fare - a.fare;
        case 'duration_asc':
        case 'duration-asc':
          return (a.durationMinutes || 9999) - (b.durationMinutes || 9999);
        case 'seats_desc':
        case 'seats-desc':
          return b.availableSeats - a.availableSeats;
        default:
          return 0;
      }
    });

    return { data: result };
  },

  getSeats: async (routeId: string, busType: BusType) => {
    await delay(250);
    const key = `${routeId}-${busType}`;

    if (!routeSeatState[key]) {
      const route = routes.find((r) => r.id === routeId);
      const layout = route?.seatLayout || 'coach_2x2';
      const policy = route?.operatorPolicy;
      routeSeatState[key] = generateSeatsForLayout(layout, policy);
    }

    // Sweep expired holds automatically
    const now = Date.now();
    routeSeatState[key].forEach((seat) => {
      if (seat.status === 'held' && seat.lockedUntil && seat.lockedUntil < now) {
        seat.status = 'available';
        seat.lockedUntil = undefined;
        seat.lockedBy = undefined;
      }
    });

    return { data: [...routeSeatState[key]] };
  },

  holdSeat: async (routeId: string, busType: BusType, seatId: string, sessionId: string) => {
    await delay(100);
    const key = `${routeId}-${busType}`;

    if (!routeSeatState[key]) {
      const route = routes.find((r) => r.id === routeId);
      routeSeatState[key] = generateSeatsForLayout(route?.seatLayout, route?.operatorPolicy);
    }

    const seatList = routeSeatState[key];
    const seat = seatList.find((s) => s.id === seatId);
    if (!seat) {
      return { success: false, error: 'NOT_FOUND', message: 'Selected seat could not be found.' };
    }

    const now = Date.now();
    // Release if hold expired
    if (seat.status === 'held' && seat.lockedUntil && seat.lockedUntil < now) {
      seat.status = 'available';
      seat.lockedUntil = undefined;
      seat.lockedBy = undefined;
    }

    if (seat.status === 'booked') {
      return {
        success: false,
        error: 'ALREADY_BOOKED',
        message: `Seat ${seat.number} was just booked by another passenger.`,
      };
    }

    if (seat.status === 'held' && seat.lockedBy && seat.lockedBy !== sessionId) {
      return {
        success: false,
        error: 'ALREADY_HELD',
        message: `Seat ${seat.number} is temporarily held by another passenger. Please choose another seat.`,
      };
    }

    // Atomically claim temporary hold
    const route = routes.find((r) => r.id === routeId);
    const holdSeconds = route?.operatorPolicy?.holdExpirySeconds || 300;
    const expiresAt = now + holdSeconds * 1000;

    seat.status = 'held';
    seat.lockedUntil = expiresAt;
    seat.lockedBy = sessionId;

    return {
      success: true,
      seat: { ...seat },
      lockedUntil: expiresAt,
    };
  },

  releaseSeat: async (routeId: string, busType: BusType, seatId: string, sessionId: string) => {
    await delay(50);
    const key = `${routeId}-${busType}`;
    const seatList = routeSeatState[key];
    if (!seatList) return { success: true };

    const seat = seatList.find((s) => s.id === seatId);
    if (seat && seat.status === 'held' && seat.lockedBy === sessionId) {
      seat.status = 'available';
      seat.lockedUntil = undefined;
      seat.lockedBy = undefined;
    }
    return { success: true };
  },

  revalidateSeats: async (
    routeId: string,
    busType: BusType,
    seatIds: string[],
    sessionId: string
  ) => {
    await delay(150);
    const key = `${routeId}-${busType}`;
    const seatList = routeSeatState[key];
    if (!seatList) return { valid: true };

    const now = Date.now();
    for (const sId of seatIds) {
      const seat = seatList.find((s) => s.id === sId);
      if (!seat) {
        return { valid: false, message: 'One or more selected seats were not found.' };
      }
      if (seat.status === 'booked') {
        return {
          valid: false,
          conflictSeat: seat.number,
          message: `Seat ${seat.number} was just booked by another passenger. Please pick another seat.`,
        };
      }
      if (seat.status === 'held' && seat.lockedUntil && seat.lockedUntil < now) {
        seat.status = 'available';
        seat.lockedUntil = undefined;
        seat.lockedBy = undefined;
        return {
          valid: false,
          conflictSeat: seat.number,
          message: `Your temporary hold on seat ${seat.number} expired. Please select your seats again.`,
        };
      }
      if (seat.status === 'held' && seat.lockedBy && seat.lockedBy !== sessionId) {
        return {
          valid: false,
          conflictSeat: seat.number,
          message: `Seat ${seat.number} is currently held by another passenger.`,
        };
      }
    }

    return { valid: true };
  },

  lockSeat: async (seatId: string) => {
    await delay(100);
    return { data: { seatId, lockedUntil: Date.now() + 300000 } };
  },

  createBooking: async (payload: {
    routeId: string;
    busType: BusType;
    seatIds: string[];
    passengerInfo: PassengerInfo;
    paymentMethod: PaymentMethod;
    sessionId?: string;
    idempotencyKey?: string;
    transactionId?: string;
    paymentStatus?: PaymentStatus;
    status?: BookingStatus;
    travelDate?: string;
  }) => {
    await delay(400);

    // Idempotency check: if request was already processed, return existing booking
    if (payload.idempotencyKey && idempotencyStore[payload.idempotencyKey]) {
      return { data: idempotencyStore[payload.idempotencyKey] };
    }

    // Atomically revalidate before booking
    const reval = await bookingService.revalidateSeats(
      payload.routeId,
      payload.busType,
      payload.seatIds,
      payload.sessionId || 'session'
    );
    if (!reval.valid) {
      throw new Error(reval.message || 'Seat conflict detected. Another passenger completed booking.');
    }

    const route = routes.find((r) => r.id === payload.routeId);
    if (!route) throw new Error('Route not found');

    const key = `${payload.routeId}-${payload.busType}`;
    const seatList = routeSeatState[key] || [];

    // Mark seats as booked atomically
    const bookedSeats: Seat[] = payload.seatIds.map((id, i) => {
      const foundSeat = seatList.find((s) => s.id === id);
      if (foundSeat) {
        foundSeat.status = 'booked';
        foundSeat.lockedUntil = undefined;
        foundSeat.lockedBy = undefined;
      }
      return {
        id,
        number: foundSeat ? foundSeat.number : `S${i + 1}`,
        status: 'booked' as const,
      };
    });

    // Server-verified fare calculation
    const multiplier = BUS_TYPE_FARES[payload.busType] || 1;
    const baseFare = Math.round(route.fare * multiplier * payload.seatIds.length);
    const terminalFee = 50 * payload.seatIds.length;
    const taxes = 0;
    const totalPayable = baseFare + terminalFee;

    // Separate booking status and payment status according to method
    let bookingStatus: BookingStatus = payload.status || 'confirmed';
    let paymentStatus: PaymentStatus = payload.paymentStatus || 'paid';
    let terminalPaymentDeadline: string | undefined;
    let psid: string | undefined;
    let transactionId = payload.transactionId;

    if (payload.paymentMethod === 'cash_terminal') {
      bookingStatus = 'pending';
      paymentStatus = 'unpaid';
      // Payment deadline: 30 mins before departure or 2 hours from now
      terminalPaymentDeadline = 'At departure terminal ticket bay at least 30 mins prior';
    } else if (payload.paymentMethod === 'bank') {
      bookingStatus = 'pending';
      paymentStatus = 'pending_verification';
      psid = '1001' + Math.floor(10000000000000 + Math.random() * 90000000000000).toString();
    } else {
      // Electronic payments: verified transaction
      if (!transactionId) {
        transactionId = `${payload.paymentMethod.toUpperCase()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      }
    }

    const operatorPrefix = route.operatorName
      ? route.operatorName.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase()
      : 'TPK';
    const serverPnr = generatePNR(operatorPrefix);
    const serverBookingId = generateServerBookingId();
    const verificationToken = `VT-${Math.random().toString(36).substring(2, 8).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://transitpk.asaan-safar.pk';
    const verificationUrl = `${origin}/verify-ticket?pnr=${serverPnr}&token=${verificationToken}`;

    const booking: Booking = {
      id: serverBookingId,
      pnr: serverPnr,
      routeId: payload.routeId,
      routeName: `${route.from} → ${route.to}`,
      operatorName: route.operatorName,
      departureTime: route.departureTime,
      departureTerminal: route.departureTerminal,
      arrivalTerminal: route.arrivalTerminal,
      busNumber: route.busNumber,
      travelDate: payload.travelDate || new Date().toISOString().split('T')[0],
      busType: payload.busType,
      seats: bookedSeats,
      passengerInfo: payload.passengerInfo,
      paymentMethod: payload.paymentMethod,
      status: bookingStatus,
      paymentStatus,
      transactionId,
      terminalPaymentDeadline,
      psid,
      fareBreakdown: {
        baseFare,
        terminalFee,
        taxes,
        totalPayable,
      },
      qrCode: verificationUrl,
      verificationToken,
      verificationUrl,
      bookingDate: new Date().toISOString(),
      totalFare: totalPayable,
      idempotencyKey: payload.idempotencyKey,
    };

    bookings.unshift(booking);
    if (payload.idempotencyKey) {
      idempotencyStore[payload.idempotencyKey] = booking;
    }
    persistBookings(bookings);

    return { data: booking };
  },

  getBookings: async () => {
    await delay(150);
    return { data: [...bookings] };
  },

  getBookingById: async (idOrPnr: string) => {
    await delay(150);
    const target = idOrPnr.trim().toUpperCase();
    const found = bookings.find(
      (b) => b.id.toUpperCase() === target || b.pnr.toUpperCase() === target
    );
    return { data: found || null };
  },

  findBooking: async (pnrOrId: string, verificationCode: string) => {
    await delay(250);
    const target = pnrOrId.trim().toUpperCase();
    const code = verificationCode.trim().replace(/\D/g, ''); // strip non-digits for phone/CNIC match

    const found = bookings.find(
      (b) => b.pnr.toUpperCase() === target || b.id.toUpperCase() === target
    );

    if (!found) {
      throw new Error(`Booking with reference "${pnrOrId}" was not found.`);
    }

    // Verify ownership via mobile or CNIC
    const passengerMobile = (found.passengerInfo.mobile || '').replace(/\D/g, '');
    const passengerCnic = (found.passengerInfo.cnic || '').replace(/\D/g, '');
    const rawToken = (found.verificationToken || '').toUpperCase();

    const matchesMobile = code.length >= 4 && passengerMobile.endsWith(code);
    const matchesCnic = code.length >= 4 && passengerCnic.endsWith(code);
    const matchesToken = verificationCode.trim().toUpperCase() === rawToken;

    if (!matchesMobile && !matchesCnic && !matchesToken) {
      throw new Error('Security Verification Failed: The mobile number or CNIC last 4 digits did not match the passenger record.');
    }

    return { data: found };
  },

  calculateRefundQuote: (booking: Booking): CancellationRefundQuote => {
    const travelDateStr = booking.travelDate || new Date().toISOString().split('T')[0];
    const departureTimeStr = booking.departureTime || '06:00';
    const depDateTime = new Date(`${travelDateStr}T${departureTimeStr}:00`);
    const now = new Date();
    const diffHours = (depDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    let refundPercentage = 0;
    let policyTier = 'Non-Refundable (Past or within 2h of departure)';

    if (diffHours >= 24) {
      refundPercentage = 100;
      policyTier = 'Full Base Refund (>24h prior to departure)';
    } else if (diffHours >= 12) {
      refundPercentage = 75;
      policyTier = '75% Base Refund (12h to 24h prior to departure)';
    } else if (diffHours >= 2) {
      refundPercentage = 50;
      policyTier = '50% Base Refund (2h to 12h prior to departure)';
    } else {
      refundPercentage = 0;
      policyTier = 'Non-Refundable (<2 hours prior to departure)';
    }

    const baseFare = booking.fareBreakdown?.baseFare || (booking.totalFare - (booking.seats.length * 50));
    const refundableBase = Math.round((baseFare * refundPercentage) / 100);
    const cancellationFee = booking.totalFare - refundableBase;

    return {
      hoursUntilDeparture: Math.max(0, Math.round(diffHours * 10) / 10),
      originalFare: booking.totalFare,
      refundPercentage,
      cancellationFee,
      refundableAmount: refundableBase,
      policyTier,
    };
  },

  cancelBooking: async (idOrPnr: string) => {
    await delay(250);
    const target = idOrPnr.trim().toUpperCase();
    const found = bookings.find((b) => b.id.toUpperCase() === target || b.pnr.toUpperCase() === target);
    if (!found) throw new Error('Booking reference not found');
    found.status = 'cancelled';
    if (found.paymentStatus === 'paid') {
      found.paymentStatus = 'refunded';
    }

    // Release seats
    const key = `${found.routeId}-${found.busType}`;
    if (routeSeatState[key]) {
      found.seats.forEach((seat) => {
        const s = routeSeatState[key].find((st) => st.id === seat.id);
        if (s) {
          s.status = 'available';
          s.lockedUntil = undefined;
          s.lockedBy = undefined;
        }
      });
    }

    persistBookings(bookings);
    return { data: found };
  },

  cancelBookingWithRefund: async (idOrPnr: string, reason?: string) => {
    await delay(300);
    const target = idOrPnr.trim().toUpperCase();
    const found = bookings.find((b) => b.id.toUpperCase() === target || b.pnr.toUpperCase() === target);
    if (!found) throw new Error('Booking reference not found');

    if (found.status === 'cancelled') {
      throw new Error('This booking has already been cancelled.');
    }

    const quote = bookingService.calculateRefundQuote(found);

    found.status = 'cancelled';
    if (found.paymentStatus === 'paid') {
      found.paymentStatus = 'refunded';
    }

    // Release seats back to availability pool
    const key = `${found.routeId}-${found.busType}`;
    if (routeSeatState[key]) {
      found.seats.forEach((seat) => {
        const s = routeSeatState[key].find((st) => st.id === seat.id);
        if (s) {
          s.status = 'available';
          s.lockedUntil = undefined;
          s.lockedBy = undefined;
        }
      });
    }

    persistBookings(bookings);
    return { data: { booking: found, refundQuote: quote, reason } };
  },
};

