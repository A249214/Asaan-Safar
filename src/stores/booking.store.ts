import { create } from 'zustand';
import { Route, BusType, Seat, Booking, PassengerInfo, PaymentMethod } from '@/types/booking.types';
import { bookingService } from '@/services/booking.service';
import { toast } from 'react-hot-toast';

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'session_server';
  let id = sessionStorage.getItem('transit_session_id');
  if (!id) {
    id = 'sess_' + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem('transit_session_id', id);
  }
  return id;
}

interface BookingState {
  sessionId: string;
  step: number;
  selectedRoute: Route | null;
  selectedBusType: BusType | null;
  seats: Seat[];
  selectedSeats: Seat[];
  passengerCountLimit: number;
  holdExpiresAt: number | null;
  passengerInfo: PassengerInfo | null;
  paymentMethod: PaymentMethod | null;
  currentBooking: Booking | null;
  isLoading: boolean;

  setStep: (step: number) => void;
  setRoute: (route: Route) => void;
  setBusType: (type: BusType) => void;
  setPassengerCountLimit: (limit: number) => void;
  loadSeats: (routeId: string, busType: BusType) => Promise<void>;
  toggleSeat: (seat: Seat) => Promise<void>;
  proceedToPassengerInfo: () => Promise<boolean>;
  setPassengerInfo: (info: PassengerInfo) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  confirmBooking: (paymentOptions?: {
    method?: PaymentMethod;
    transactionId?: string;
    travelDate?: string;
  }) => Promise<boolean>;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  sessionId: getOrCreateSessionId(),
  step: 1,
  selectedRoute: null,
  selectedBusType: null,
  seats: [],
  selectedSeats: [],
  passengerCountLimit: 5,
  holdExpiresAt: null,
  passengerInfo: null,
  paymentMethod: null,
  currentBooking: null,
  isLoading: false,

  setStep: (step) => set({ step }),
  setRoute: (route) => set({ selectedRoute: route, step: 2 }),
  setBusType: (type) => set({ selectedBusType: type, step: 3 }),
  setPassengerCountLimit: (limit) => set({ passengerCountLimit: limit }),

  loadSeats: async (routeId, busType) => {
    set({ isLoading: true });
    try {
      const response = await bookingService.getSeats(routeId, busType);
      set({ seats: response.data, isLoading: false });
    } catch {
      set({ isLoading: false });
      toast.error('Failed to load seat layout');
    }
  },

  toggleSeat: async (seat: Seat) => {
    const state = get();
    if (!state.selectedRoute || !state.selectedBusType) return;
    if (seat.status === 'booked' || seat.status === 'reserved') return;

    const exists = state.selectedSeats.some((s) => s.id === seat.id);
    if (exists) {
      // Release seat hold on backend
      await bookingService.releaseSeat(
        state.selectedRoute.id,
        state.selectedBusType,
        seat.id,
        state.sessionId
      );
      const remaining = state.selectedSeats.filter((s) => s.id !== seat.id);
      set({
        selectedSeats: remaining,
        holdExpiresAt: remaining.length === 0 ? null : state.holdExpiresAt,
      });
      return;
    }

    // Apply passenger limits and enforce operator limits
    const limit = state.passengerCountLimit || state.selectedRoute.operatorPolicy?.maxSeatsPerBooking || 5;
    if (state.selectedSeats.length >= limit) {
      toast.error(`Maximum selection limit of ${limit} seat${limit > 1 ? 's' : ''} reached`);
      return;
    }

    // Check operator policy for ladies-only seats
    if (seat.status === 'female') {
      const policyMsg =
        state.selectedRoute.operatorPolicy?.policyNotice ||
        'This row is designated for solo female passengers and families by operator policy.';
      toast(policyMsg, { icon: 'ℹ️', duration: 4000 });
    }

    // Atomic hold via backend
    const res = await bookingService.holdSeat(
      state.selectedRoute.id,
      state.selectedBusType,
      seat.id,
      state.sessionId
    );

    if (!res.success) {
      toast.error(res.message || 'Seat is no longer available');
      // Refresh inventory to reflect changes
      const refreshed = await bookingService.getSeats(state.selectedRoute.id, state.selectedBusType);
      set({ seats: refreshed.data });
      return;
    }

    set({
      selectedSeats: [...state.selectedSeats, seat],
      holdExpiresAt: res.lockedUntil || Date.now() + 300000,
    });
  },

  proceedToPassengerInfo: async () => {
    const state = get();
    if (!state.selectedRoute || !state.selectedBusType) return false;
    if (state.selectedSeats.length === 0) {
      toast.error('Please select at least one seat to continue');
      return false;
    }

    set({ isLoading: true });
    // Revalidate seats atomically with backend
    const reval = await bookingService.revalidateSeats(
      state.selectedRoute.id,
      state.selectedBusType,
      state.selectedSeats.map((s) => s.id),
      state.sessionId
    );
    set({ isLoading: false });

    if (!reval.valid) {
      toast.error(reval.message || 'A conflicting booking occurred. Please choose another seat.');
      const refreshed = await bookingService.getSeats(state.selectedRoute.id, state.selectedBusType);
      const stillValid = state.selectedSeats.filter(
        (s) => !reval.conflictSeat || s.number !== reval.conflictSeat
      );
      set({ seats: refreshed.data, selectedSeats: stillValid });
      return false;
    }

    set({ step: 4 });
    return true;
  },

  setPassengerInfo: (info) => set({ passengerInfo: info, step: 5 }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),

  confirmBooking: async (paymentOptions?: {
    method?: PaymentMethod;
    transactionId?: string;
    travelDate?: string;
  }) => {
    const state = get();
    if (
      !state.selectedRoute ||
      !state.selectedBusType ||
      state.selectedSeats.length === 0 ||
      !state.passengerInfo
    ) {
      toast.error('Please complete all previous steps');
      return false;
    }

    const method = paymentOptions?.method || state.paymentMethod;
    if (!method) {
      toast.error('Please select a valid payment method');
      return false;
    }

    // Stable idempotency key tied to session, route, and seat set
    const seatHash = state.selectedSeats.map((s) => s.id).sort().join('-');
    const idempotencyKey = `idem_${state.sessionId}_${state.selectedRoute.id}_${seatHash}`;

    set({ isLoading: true });
    try {
      const response = await bookingService.createBooking({
        routeId: state.selectedRoute.id,
        busType: state.selectedBusType,
        seatIds: state.selectedSeats.map((s) => s.id),
        passengerInfo: state.passengerInfo,
        paymentMethod: method,
        sessionId: state.sessionId,
        idempotencyKey,
        transactionId: paymentOptions?.transactionId,
        travelDate: paymentOptions?.travelDate,
      });

      set({
        currentBooking: response.data,
        paymentMethod: method,
        isLoading: false,
        step: 6,
      });

      if (response.data.status === 'confirmed') {
        toast.success(`Booking ${response.data.pnr} confirmed!`);
      } else {
        toast('Seat held! Please complete payment at terminal counter before departure.', {
          icon: 'ℹ️',
          duration: 5000,
        });
      }
      return true;
    } catch (err: unknown) {
      set({ isLoading: false });
      const msg = err instanceof Error ? err.message : 'Booking failed';
      toast.error(msg);
      // Reload seats to synchronize
      const refreshed = await bookingService.getSeats(state.selectedRoute.id, state.selectedBusType);
      set({ seats: refreshed.data });
      return false;
    }
  },

  resetBooking: () =>
    set({
      step: 1,
      selectedRoute: null,
      selectedBusType: null,
      seats: [],
      selectedSeats: [],
      holdExpiresAt: null,
      passengerInfo: null,
      paymentMethod: null,
      currentBooking: null,
    }),
}));
