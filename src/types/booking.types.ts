export enum BusType {
  STANDARD = 'standard',
  EXECUTIVE = 'executive',
  LUXURY = 'luxury',
  BUSINESS = 'business',
}

export type JourneyType = 'intercity' | 'local';

export type Amenity =
  | 'wifi'
  | 'usb_charging'
  | 'water'
  | 'ac'
  | 'reclining_seats'
  | 'refreshments'
  | 'multimedia'
  | 'washroom'
  | 'reading_light';

export type DeparturePeriod = 'all' | 'morning' | 'afternoon' | 'evening' | 'night';

export type RouteSortOption =
  | 'departure_asc'
  | 'departure_desc'
  | 'fare_asc'
  | 'fare_desc'
  | 'duration_asc'
  | 'seats_desc';

export type SeatLayoutType = 'coach_2x2' | 'executive_2x1' | 'van_coaster' | 'sleeper_1x1';

export interface OperatorPolicy {
  allowsLadiesQuota: boolean;
  ladiesQuotaRows?: string[];
  allowsVipSeats: boolean;
  vipSeatNumbers?: string[];
  holdExpirySeconds: number;
  maxSeatsPerBooking: number;
  policyNotice?: string;
}

export interface Operator {
  id: string;
  name: string;
  code: string;
  rating: number;
  totalReviews: number;
  fleetType: string;
  logo?: string;
  policy?: OperatorPolicy;
}

export interface RouteFilters {
  city?: string;
  from?: string;
  to?: string;
  journeyType?: JourneyType | 'all' | string;
  time?: string;
  luxury?: string;
  vehicleType?: string;
  operatorId?: string;
  departurePeriod?: DeparturePeriod;
  amenities?: Amenity[];
  minFare?: number;
  maxFare?: number;
  maxDurationMinutes?: number;
  passengers?: number;
  sortBy?: RouteSortOption;
}

export interface Route {
  id: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration?: string;
  durationMinutes?: number;
  fare: number;
  busType: BusType;
  availableSeats: number;
  luxuryLevel: 'standard' | 'executive' | 'luxury' | 'business';
  journeyType?: JourneyType;
  stops?: string[];
  platform?: string;
  busNumber?: string;
  driver?: string;
  status?: 'on-time' | 'delayed' | 'boarding' | 'departed';
  operatorId?: string;
  operatorName?: string;
  operatorRating?: number;
  vehicleType?: string;
  amenities?: Amenity[];
  departureTerminal?: string;
  arrivalTerminal?: string;
  isAvailable?: boolean;
  seatLayout?: SeatLayoutType;
  operatorPolicy?: OperatorPolicy;
  totalSeatCapacity?: number;
}

export interface Seat {
  id: string;
  number: string;
  status: 'available' | 'booked' | 'reserved' | 'female' | 'vip' | 'held';
  rowName?: string;
  colIndex?: number;
  deck?: 'lower' | 'upper';
  seatType?: 'window' | 'aisle' | 'single' | 'berth';
  passengerName?: string;
  lockedUntil?: number;
  lockedBy?: string;
}

export interface PassengerInfo {
  cnic: string;
  fullName: string;
  mobile: string;
  gender: 'male' | 'female' | 'other';
  emergencyContact: string;
  specialAssistance?: boolean;
  extraLuggage?: boolean;
  notes?: string;
}

export type PaymentMethod =
  | 'jazzcash'
  | 'easypaisa'
  | 'debit'
  | 'credit'
  | 'bank'
  | 'cash_terminal';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded';
export type PaymentStatus =
  | 'unpaid'
  | 'pending_verification'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface FareBreakdown {
  baseFare: number;
  terminalFee: number;
  taxes: number;
  totalPayable: number;
}

export interface Booking {
  id: string; // Server reference e.g. BK-20261019-XXXX
  pnr: string; // Passenger Name Record e.g. TPK-93A8B1
  routeId: string;
  routeName: string;
  operatorName?: string;
  departureTime?: string;
  departureTerminal?: string;
  arrivalTerminal?: string;
  busNumber?: string;
  travelDate?: string;
  busType: BusType;
  seats: Seat[];
  passengerInfo: PassengerInfo;
  paymentMethod: PaymentMethod;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  terminalPaymentDeadline?: string;
  psid?: string;
  fareBreakdown: FareBreakdown;
  qrCode: string;
  verificationToken?: string;
  verificationUrl?: string;
  bookingDate: string;
  totalFare: number;
  idempotencyKey?: string;
}

export interface DepartureBoardEntry {
  id: string;
  platform: string;
  busNumber: string;
  driver: string;
  route: string;
  departureTime: string;
  status: 'on-time' | 'delayed' | 'boarding' | 'departed';
}
