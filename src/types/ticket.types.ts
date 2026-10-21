export type TicketStatus = 'valid' | 'expired' | 'used' | 'refunded' | 'cancelled' | 'unpaid_reservation' | 'invalid';

export interface Ticket {
  id: string;
  bookingId: string;
  pnr: string;
  passengerName: string;
  cnic: string;
  maskedCnic?: string;
  mobile?: string;
  route: string;
  operatorName?: string;
  seatNumber: string; // e.g. "C1, B2"
  seatList?: string[];
  departureTime: string;
  departureTerminal?: string;
  arrivalTerminal?: string;
  travelDate: string;
  status: TicketStatus;
  qrCode: string;
  verificationToken: string;
  verificationUrl?: string;
  boardingStatus: 'pending' | 'boarded' | 'no-show';
  fare: number;
  terminalFee?: number;
  totalPaid?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  bookingDate?: string;
  busNumber?: string;
  vehicleType?: string;
}

export interface TicketValidationResult {
  valid: boolean;
  ticket: Ticket | null;
  message: string;
  verificationTimestamp?: string;
  scannerStation?: string;
}

export interface CancellationRefundQuote {
  hoursUntilDeparture: number;
  originalFare: number;
  refundPercentage: number;
  cancellationFee: number;
  refundableAmount: number;
  policyTier: string;
}
