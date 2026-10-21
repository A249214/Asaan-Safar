import { Ticket, TicketStatus, TicketValidationResult } from '@/types/ticket.types';
import { MOCK_TICKETS } from '@/lib/mock-data';
import { bookingService } from '@/services/booking.service';
import { Booking } from '@/types/booking.types';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const boardedTicketIds = new Set<string>(['BK-2024-003', 't3']);

function convertBookingToTicket(b: Booking, overrideStatus?: TicketStatus): Ticket {
  const isBoarded = boardedTicketIds.has(b.id) || boardedTicketIds.has(b.pnr);
  let status: TicketStatus = overrideStatus || 'valid';
  if (isBoarded) {
    status = 'used';
  } else if (b.status === 'cancelled') {
    status = 'refunded';
  } else if (b.paymentStatus === 'unpaid') {
    status = 'unpaid_reservation';
  } else if (b.status === 'confirmed' && b.paymentStatus === 'paid') {
    status = 'valid';
  }

  return {
    id: b.id,
    bookingId: b.id,
    pnr: b.pnr,
    passengerName: b.passengerInfo.fullName,
    cnic: b.passengerInfo.cnic,
    maskedCnic: b.passengerInfo.cnic,
    mobile: b.passengerInfo.mobile,
    route: b.routeName,
    operatorName: b.operatorName,
    seatNumber: b.seats.map((s) => s.number).join(', '),
    seatList: b.seats.map((s) => s.number),
    departureTime: b.departureTime || '06:00',
    departureTerminal: b.departureTerminal,
    arrivalTerminal: b.arrivalTerminal,
    travelDate: b.travelDate || '2026-10-20',
    status,
    qrCode: b.qrCode,
    verificationToken: b.verificationToken || 'VT-VERIFIED',
    verificationUrl: b.verificationUrl,
    boardingStatus: isBoarded ? 'boarded' : 'pending',
    fare: b.totalFare,
    terminalFee: b.fareBreakdown?.terminalFee || 50,
    totalPaid: b.fareBreakdown?.totalPayable || b.totalFare,
    paymentMethod: b.paymentMethod,
    paymentStatus: b.paymentStatus,
    bookingDate: b.bookingDate,
    busNumber: b.busNumber,
    vehicleType: b.busType,
  };
}

export const ticketService = {
  getTickets: async (): Promise<{ data: Ticket[] }> => {
    await delay(150);
    const { data: bookings } = await bookingService.getBookings();
    const fromBookings = bookings.map((b) => convertBookingToTicket(b));
    return { data: fromBookings };
  },

  validateTicket: async (rawInput: string): Promise<{ data: TicketValidationResult }> => {
    await delay(250);
    const query = rawInput.trim();
    if (!query) {
      return {
        data: {
          valid: false,
          ticket: null,
          message: 'No ticket reference or QR payload provided.',
        },
      };
    }

    // Extract PNR or token if a URL or QR string was passed
    let searchPnr = query;
    let searchToken = '';
    if (query.includes('pnr=')) {
      try {
        const url = new URL(query);
        searchPnr = url.searchParams.get('pnr') || query;
        searchToken = url.searchParams.get('token') || '';
      } catch {
        const pnrMatch = query.match(/pnr=([A-Z0-9-]+)/i);
        if (pnrMatch) searchPnr = pnrMatch[1];
        const tokenMatch = query.match(/token=([A-Z0-9-]+)/i);
        if (tokenMatch) searchToken = tokenMatch[1];
      }
    } else if (query.startsWith('QR-')) {
      // e.g. QR-TPK-93A8B1-BK-2024-001
      const parts = query.split('-');
      if (parts.length >= 3) {
        searchPnr = `${parts[1]}-${parts[2]}`;
      }
    }

    const { data: bookings } = await bookingService.getBookings();
    const cleanSearch = searchPnr.toUpperCase();

    // Check against bookings
    const matchedBooking = bookings.find(
      (b) =>
        b.pnr.toUpperCase() === cleanSearch ||
        b.id.toUpperCase() === cleanSearch ||
        (searchToken && b.verificationToken?.toUpperCase() === searchToken.toUpperCase()) ||
        b.qrCode === query
    );

    if (matchedBooking) {
      const ticket = convertBookingToTicket(matchedBooking);

      if (ticket.status === 'used' || ticket.boardingStatus === 'boarded') {
        return {
          data: {
            valid: false,
            ticket,
            message: 'TICKET ALREADY SCANNED & BOARDED: Passenger was admitted previously.',
            verificationTimestamp: new Date().toISOString(),
            scannerStation: 'GATE-04 THOKAR TERMINAL',
          },
        };
      }

      if (ticket.status === 'refunded' || matchedBooking.status === 'cancelled') {
        return {
          data: {
            valid: false,
            ticket,
            message: 'TICKET VOID / REFUNDED: Booking was cancelled and seats released.',
            verificationTimestamp: new Date().toISOString(),
            scannerStation: 'GATE-04 THOKAR TERMINAL',
          },
        };
      }

      if (ticket.status === 'unpaid_reservation' || matchedBooking.paymentStatus === 'unpaid') {
        return {
          data: {
            valid: false,
            ticket,
            message: 'UNPAID TERMINAL RESERVATION: Passenger must pay at Terminal Bay Ticket Counter prior to boarding.',
            verificationTimestamp: new Date().toISOString(),
            scannerStation: 'GATE-04 THOKAR TERMINAL',
          },
        };
      }

      return {
        data: {
          valid: true,
          ticket,
          message: 'VALID BOARDING PASS: Passenger identity and seats verified for dispatch.',
          verificationTimestamp: new Date().toISOString(),
          scannerStation: 'GATE-04 THOKAR TERMINAL',
        },
      };
    }

    // Check fallback legacy mock tickets
    const legacy = MOCK_TICKETS.find(
      (t) => t.qrCode === query || t.bookingId === query || t.id === query
    );
    if (legacy) {
      const converted: Ticket = {
        ...legacy,
        pnr: legacy.bookingId,
        verificationToken: `VT-${legacy.bookingId}`,
        travelDate: '2026-10-20',
        fare: 3500,
      };
      if (legacy.status === 'used') {
        return {
          data: {
            valid: false,
            ticket: converted,
            message: 'TICKET ALREADY USED: Passenger has already boarded.',
          },
        };
      }
      return {
        data: {
          valid: true,
          ticket: converted,
          message: 'VALID TICKET: Authorized boarding pass verified.',
        },
      };
    }

    return {
      data: {
        valid: false,
        ticket: null,
        message: `Ticket not found: Reference "${query}" was not found.`,
        verificationTimestamp: new Date().toISOString(),
      },
    };
  },

  boardPassenger: async (ticketIdOrPnr: string): Promise<{ data: Ticket }> => {
    await delay(200);
    const { data: bookings } = await bookingService.getBookings();
    const target = ticketIdOrPnr.toUpperCase();
    const matched = bookings.find(
      (b) => b.id.toUpperCase() === target || b.pnr.toUpperCase() === target
    );

    if (matched) {
      boardedTicketIds.add(matched.id);
      boardedTicketIds.add(matched.pnr);
      const ticket = convertBookingToTicket(matched, 'used');
      ticket.boardingStatus = 'boarded';
      return { data: ticket };
    }

    boardedTicketIds.add(ticketIdOrPnr);
    const legacy = MOCK_TICKETS.find((t) => t.id === ticketIdOrPnr || t.bookingId === ticketIdOrPnr);
    if (!legacy) throw new Error('Ticket not found');
    legacy.status = 'used';
    legacy.boardingStatus = 'boarded';
    return { data: { ...legacy, pnr: legacy.bookingId, verificationToken: `VT-${legacy.id}`, travelDate: '2026-10-20', fare: 3500 } };
  },

  lookupPassenger: async (query: string): Promise<Ticket[]> => {
    await delay(150);
    const { data: all } = await ticketService.getTickets();
    const q = query.toLowerCase().trim();
    return all.filter(
      (t) =>
        t.passengerName.toLowerCase().includes(q) ||
        t.pnr.toLowerCase().includes(q) ||
        t.bookingId.toLowerCase().includes(q) ||
        (t.mobile && t.mobile.includes(q)) ||
        (t.cnic && t.cnic.includes(q))
    );
  },
};
