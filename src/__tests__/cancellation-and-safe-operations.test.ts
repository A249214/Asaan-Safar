import { describe, it, expect } from 'vitest';
import { bookingService } from '@/services/booking.service';
import { adminService } from '@/services/admin.service';
import { Booking, BusType } from '@/types/booking.types';
import { UserRole } from '@/types/auth.types';

describe('Phase 8 — Cancellation, Tiered Refunds & Safe Operations Tests', () => {
  describe('Tiered Cancellation & Refund Calculator', () => {
    const baseMockBooking: Booking = {
      id: 'BK-REFUND-001',
      pnr: 'TPK-REF001',
      routeId: 'r1',
      routeName: 'Lahore → Islamabad',
      operatorName: 'TransitPK Express',
      departureTime: '12:00',
      departureTerminal: 'Thokar Niaz Baig Central Bay 01, Lahore',
      arrivalTerminal: 'Faizabad Terminal Bay 03, Islamabad',
      busNumber: 'BT-4521',
      travelDate: '2026-10-30', // Far in future (> 24 hours)
      busType: BusType.EXECUTIVE,
      seats: [{ id: 's-1', number: 'A1', status: 'booked' }],
      passengerInfo: {
        fullName: 'Zainab Bibi',
        cnic: '35201-1111111-1',
        mobile: '03001111111',
        gender: 'female',
        emergencyContact: '03211111111',
      },
      paymentMethod: 'easypaisa',
      status: 'confirmed',
      paymentStatus: 'paid',
      totalFare: 3550, // Base fare 3500 + Terminal fee 50
      qrCode: 'https://transitpk.asaan-safar.pk/verify-ticket?pnr=TPK-REF001&token=VT-TEST',
      bookingDate: '2026-10-18T10:00:00.000Z',
      fareBreakdown: {
        baseFare: 3500,
        terminalFee: 50,
        taxes: 0,
        totalPayable: 3550,
      },
    };

    it('calculates 100% base fare refund when cancelled more than 24 hours prior', () => {
      // Future date > 24 hours
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const booking = {
        ...baseMockBooking,
        travelDate: futureDate.toISOString().split('T')[0],
      };

      const quote = bookingService.calculateRefundQuote(booking);
      expect(quote.refundPercentage).toBe(100);
      expect(quote.refundableAmount).toBe(3500); // 100% of 3500 base fare
      expect(quote.cancellationFee).toBe(50); // Rs. 50 terminal cess retained
      expect(quote.policyTier).toContain('>24h');
    });

    it('calculates 0% refund (non-refundable) when departure is within 2 hours or in the past', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const booking = {
        ...baseMockBooking,
        travelDate: pastDate.toISOString().split('T')[0],
        departureTime: '06:00',
      };

      const quote = bookingService.calculateRefundQuote(booking);
      expect(quote.refundPercentage).toBe(0);
      expect(quote.refundableAmount).toBe(0);
      expect(quote.cancellationFee).toBe(3550);
      expect(quote.policyTier).toContain('Non-Refundable');
    });
  });

  describe('Safe Vehicle Replacement Safeguard', () => {
    it('prevents capacity deficit: throws error if replacement vehicle capacity is less than active booked seats', async () => {
      // Route r1 has active bookings
      // Attempting to replace with a mini-coach of only 1 seat
      await expect(
        adminService.replaceVehicleSafely('r1', 'BT-MINI-01', 0, UserRole.ADMIN)
      ).rejects.toThrow(/Capacity Deficit Conflict/i);
    });

    it('safely reassigns bus number when replacement vehicle capacity is sufficient', async () => {
      const res = await adminService.replaceVehicleSafely('r1', 'BT-REPLACEMENT-99', 45, UserRole.ADMIN);
      expect(res.data.route.busNumber).toBe('BT-REPLACEMENT-99');
      expect(res.data.route.availableSeats).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Safe Departure Cancellation Operation', () => {
    it('cancels scheduled departure safely and marks affected tickets for refund processing', async () => {
      const cancelRes = await adminService.cancelDepartureSafely(
        'r1',
        'Severe motorway fog and advisory notice',
        UserRole.ADMIN
      );

      expect(cancelRes.data.route.status).toBe('delayed');
      expect(cancelRes.data.route.isAvailable).toBe(false);
      expect(cancelRes.data.cancelledBookingsCount).toBeGreaterThanOrEqual(0);
    });
  });
});
