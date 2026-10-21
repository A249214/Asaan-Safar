import { describe, it, expect, beforeEach } from 'vitest';
import { bookingService } from '@/services/booking.service';
import { BusType, PassengerInfo } from '@/types/booking.types';

describe('Phase 8 — Booking Flow, Concurrency & Idempotency Tests', () => {
  const samplePassenger: PassengerInfo = {
    fullName: 'Hamza Tariq',
    cnic: '35202-9876543-1',
    mobile: '03001234567',
    gender: 'male',
    emergencyContact: '03219876543',
  };

  beforeEach(() => {
    // Reset any state if necessary
  });

  it('1. Searches routes and filters available departures accurately', async () => {
    const res = await bookingService.getRoutes({
      from: 'Lahore',
      to: 'Islamabad',
    });
    expect(res.data).toBeDefined();
    expect(res.data.length).toBeGreaterThan(0);
    const firstRoute = res.data[0];
    expect(firstRoute.from).toContain('Lahore');
    expect(firstRoute.to).toContain('Islamabad');
    expect(firstRoute.fare).toBeGreaterThan(0);
  });

  it('2. Atomically holds a seat for a valid session', async () => {
    const seatRes = await bookingService.getSeats('r1', BusType.EXECUTIVE);
    const availableSeat = seatRes.data.find((s) => s.status === 'available');
    expect(availableSeat).toBeDefined();

    const holdRes = await bookingService.holdSeat('r1', BusType.EXECUTIVE, availableSeat!.id, 'session_user_A');
    expect(holdRes.success).toBe(true);
    expect(holdRes.seat?.status).toBe('held');
    expect(holdRes.lockedUntil).toBeGreaterThan(Date.now());
  });

  it('3. Prevents concurrent conflict: Session B cannot hold a seat held by Session A', async () => {
    const seatRes = await bookingService.getSeats('r1', BusType.EXECUTIVE);
    const availableSeat = seatRes.data.find((s) => s.status === 'available');
    expect(availableSeat).toBeDefined();

    // Session A holds the seat
    const holdA = await bookingService.holdSeat('r1', BusType.EXECUTIVE, availableSeat!.id, 'session_user_A');
    expect(holdA.success).toBe(true);

    // Session B tries to hold the same seat simultaneously
    const holdB = await bookingService.holdSeat('r1', BusType.EXECUTIVE, availableSeat!.id, 'session_user_B');
    expect(holdB.success).toBe(false);
    expect(holdB.error).toBe('ALREADY_HELD');
    expect(holdB.message).toContain('temporarily held by another passenger');
  });

  it('4. Successfully books held seats and transitions seat status to booked', async () => {
    const seatRes = await bookingService.getSeats('r1', BusType.EXECUTIVE);
    const availableSeat = seatRes.data.find((s) => s.status === 'available');
    expect(availableSeat).toBeDefined();

    await bookingService.holdSeat('r1', BusType.EXECUTIVE, availableSeat!.id, 'session_user_A');

    const bookingRes = await bookingService.createBooking({
      routeId: 'r1',
      busType: BusType.EXECUTIVE,
      seatIds: [availableSeat!.id],
      passengerInfo: samplePassenger,
      paymentMethod: 'easypaisa',
      sessionId: 'session_user_A',
      travelDate: '2026-10-25',
    });

    expect(bookingRes.data).toBeDefined();
    expect(bookingRes.data.pnr).toMatch(/^[A-Z0-9]{3,}-[A-Z0-9]+$/);
    expect(bookingRes.data.status).toBe('confirmed');
    expect(bookingRes.data.paymentStatus).toBe('paid');
    expect(bookingRes.data.seats[0].status).toBe('booked');

    // Verify opaque QR code does not expose sensitive personal info directly
    expect(bookingRes.data.verificationUrl).toContain('/verify-ticket?pnr=');
    expect(bookingRes.data.verificationUrl).toContain('&token=');
    expect(bookingRes.data.verificationUrl).not.toContain(samplePassenger.cnic);
    expect(bookingRes.data.verificationUrl).not.toContain(samplePassenger.mobile);
  });

  it('5. Prevents double-booking: Attempting to book an already booked seat is rejected', async () => {
    const seatRes = await bookingService.getSeats('r1', BusType.EXECUTIVE);
    const availableSeat = seatRes.data.find((s) => s.status === 'available');
    expect(availableSeat).toBeDefined();

    // User A books the seat
    await bookingService.holdSeat('r1', BusType.EXECUTIVE, availableSeat!.id, 'session_user_A');
    await bookingService.createBooking({
      routeId: 'r1',
      busType: BusType.EXECUTIVE,
      seatIds: [availableSeat!.id],
      passengerInfo: samplePassenger,
      paymentMethod: 'jazzcash',
      sessionId: 'session_user_A',
      travelDate: '2026-10-25',
    });

    // User B tries to book the same seat
    await expect(
      bookingService.createBooking({
        routeId: 'r1',
        busType: BusType.EXECUTIVE,
        seatIds: [availableSeat!.id],
        passengerInfo: { ...samplePassenger, fullName: 'Other Passenger' },
        paymentMethod: 'debit',
        sessionId: 'session_user_B',
        travelDate: '2026-10-25',
      })
    ).rejects.toThrow(/conflict|booked/i);
  });

  it('6. Enforces Idempotency: Duplicate request with identical idempotencyKey returns existing booking without duplicate processing', async () => {
    const seatRes = await bookingService.getSeats('r2', BusType.BUSINESS);
    const availableSeat = seatRes.data.find((s) => s.status === 'available');
    expect(availableSeat).toBeDefined();

    const idempotencyKey = 'IDEM-TEST-' + Math.random().toString(36).substring(2, 9);

    await bookingService.holdSeat('r2', BusType.BUSINESS, availableSeat!.id, 'session_idem');

    // First submission
    const res1 = await bookingService.createBooking({
      routeId: 'r2',
      busType: BusType.BUSINESS,
      seatIds: [availableSeat!.id],
      passengerInfo: samplePassenger,
      paymentMethod: 'debit',
      sessionId: 'session_idem',
      idempotencyKey,
      travelDate: '2026-10-26',
    });

    // Replay submission with same idempotency key (e.g. network retry or double click)
    const res2 = await bookingService.createBooking({
      routeId: 'r2',
      busType: BusType.BUSINESS,
      seatIds: [availableSeat!.id],
      passengerInfo: samplePassenger,
      paymentMethod: 'debit',
      sessionId: 'session_idem',
      idempotencyKey,
      travelDate: '2026-10-26',
    });

    expect(res1.data.pnr).toBe(res2.data.pnr);
    expect(res1.data.id).toBe(res2.data.id);
    expect(res1.data.fareBreakdown.totalPayable).toBe(res2.data.fareBreakdown.totalPayable);
  });

  it('7. Handles Cash at Terminal payment method with separate pending status & payment deadline', async () => {
    const seatRes = await bookingService.getSeats('r3', BusType.STANDARD);
    const availableSeat = seatRes.data.find((s) => s.status === 'available');
    expect(availableSeat).toBeDefined();

    await bookingService.holdSeat('r3', BusType.STANDARD, availableSeat!.id, 'session_cash');

    const res = await bookingService.createBooking({
      routeId: 'r3',
      busType: BusType.STANDARD,
      seatIds: [availableSeat!.id],
      passengerInfo: samplePassenger,
      paymentMethod: 'cash_terminal',
      sessionId: 'session_cash',
      travelDate: '2026-10-27',
    });

    expect(res.data.status).toBe('pending');
    expect(res.data.paymentStatus).toBe('unpaid');
    expect(res.data.terminalPaymentDeadline).toBeDefined();
    expect(res.data.terminalPaymentDeadline).toContain('departure terminal');
  });
});
