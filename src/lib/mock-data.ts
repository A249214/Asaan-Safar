import { UserRole } from '@/types/auth.types';
import { BusType, Route, DepartureBoardEntry, Operator, Amenity, OperatorPolicy, SeatLayoutType } from '@/types/booking.types';
import { Bus, Driver } from '@/types/fleet.types';
import { BusLocation } from '@/types/tracking.types';
import { Ticket } from '@/types/ticket.types';
import { DashboardStats, ChartDataPoint } from '@/types/dashboard.types';

export const DEMO_USERS = [
  { email: 'admin@transitpk.pk', password: 'admin123', role: UserRole.ADMIN, name: 'Admin User' },
  { email: 'conductor@transitpk.pk', password: 'conductor123', role: UserRole.CONDUCTOR, name: 'Ali Conductor' },
  { email: 'customer@transitpk.pk', password: 'customer123', role: UserRole.CUSTOMER, name: 'Ahmed Khan' },
];

export const INTERCITY_CITIES = [
  'Lahore', 'Islamabad', 'Karachi', 'Peshawar', 'Multan', 'Faisalabad', 'Rawalpindi', 'Quetta', 'Hyderabad'
];

export const LOCAL_STOPS = [
  'Thokar Niaz Baig', 'Kalma Chowk', 'Railway Station', 'Shahdara Metro',
  'Faizabad Metro Hub', 'Pakistan Secretariat', 'Saddar Rawalpindi', 'Centaurus Station',
  'Saddar Central', 'Jinnah Airport Terminal', 'Clifton Teen Talwar', 'Sohrab Goth Terminal'
];

export const DEFAULT_TRANSITPK_POLICY: OperatorPolicy = {
  allowsLadiesQuota: true,
  ladiesQuotaRows: ['A', 'B'],
  allowsVipSeats: true,
  vipSeatNumbers: ['C1', 'C2'],
  holdExpirySeconds: 300,
  maxSeatsPerBooking: 5,
  policyNotice: 'Standard Policy: Front rows A & B designated for solo female passengers and families.',
};

export const DEFAULT_DAEWOO_POLICY: OperatorPolicy = {
  allowsLadiesQuota: true,
  ladiesQuotaRows: ['A'],
  allowsVipSeats: true,
  vipSeatNumbers: ['B1'],
  holdExpirySeconds: 300,
  maxSeatsPerBooking: 5,
  policyNotice: 'Daewoo Policy: Row A reserved for female passengers. Column 1 offers solo luxury recliners.',
};

export const DEFAULT_SANIA_SLEEPER_POLICY: OperatorPolicy = {
  allowsLadiesQuota: true,
  ladiesQuotaRows: ['L1', 'L2'],
  allowsVipSeats: true,
  vipSeatNumbers: ['R1'],
  holdExpirySeconds: 300,
  maxSeatsPerBooking: 4,
  policyNotice: 'Sania Sleeper Policy: Berths L1 & L2 reserved for ladies traveling solo.',
};

export const DEFAULT_METRO_POLICY: OperatorPolicy = {
  allowsLadiesQuota: false,
  allowsVipSeats: false,
  holdExpirySeconds: 180,
  maxSeatsPerBooking: 4,
  policyNotice: 'Rapid Feeder Policy: Coaster shuttle seating, first-come first-served seating.',
};

export const OPERATORS: Operator[] = [
  { id: 'op-transitpk', name: 'TransitPK Express', code: 'TPK', rating: 4.9, totalReviews: 2840, fleetType: 'Yutong Master Starliner', logo: 'bus', policy: DEFAULT_TRANSITPK_POLICY },
  { id: 'op-faisal', name: 'Faisal Starliner', code: 'FSL', rating: 4.8, totalReviews: 1950, fleetType: 'Daewoo BV120 Executive', logo: 'shield', policy: DEFAULT_TRANSITPK_POLICY },
  { id: 'op-daewoo', name: 'Daewoo Express Transit', code: 'DWO', rating: 4.7, totalReviews: 3400, fleetType: 'Yutong Grand Cruiser', logo: 'bus', policy: DEFAULT_DAEWOO_POLICY },
  { id: 'op-sania', name: 'Sania Roadways Sleeper', code: 'SNI', rating: 4.8, totalReviews: 1560, fleetType: 'Hino 180° Flat Sleeper', logo: 'star', policy: DEFAULT_SANIA_SLEEPER_POLICY },
  { id: 'op-skyways', name: 'Skyways Super Shuttle', code: 'SKW', rating: 4.6, totalReviews: 1220, fleetType: 'Hino AK1J Executive', logo: 'navigation', policy: DEFAULT_TRANSITPK_POLICY },
  { id: 'op-metro', name: 'Metro Rapid Feeder', code: 'MTF', rating: 4.9, totalReviews: 4800, fleetType: 'BYD K9 Electric City Bus', logo: 'train', policy: DEFAULT_METRO_POLICY },
];


export const POPULAR_ROUTES: Route[] = [
  // --- Lahore ⇄ Islamabad Corridors (Multiple Timings & Operators) ---
  {
    id: 'r1',
    from: 'Lahore',
    to: 'Islamabad',
    departureTime: '06:00',
    arrivalTime: '10:30',
    duration: '4h 30m',
    durationMinutes: 270,
    fare: 2500,
    busType: BusType.EXECUTIVE,
    availableSeats: 32,
    luxuryLevel: 'executive',
    journeyType: 'intercity',
    seatLayout: 'coach_2x2',
    operatorPolicy: DEFAULT_TRANSITPK_POLICY,
    operatorId: 'op-transitpk',
    operatorName: 'TransitPK Express',
    operatorRating: 4.9,
    vehicleType: 'Yutong Master Starliner ZK6128',
    amenities: ['ac', 'wifi', 'usb_charging', 'reclining_seats', 'refreshments', 'water'],
    departureTerminal: 'Thokar Niaz Baig Central Bay 01, Lahore',
    arrivalTerminal: 'Faizabad Terminal Bay 03, Islamabad',
    isAvailable: true,
    platform: 'Bay 01',
    busNumber: 'BT-4521',
    driver: 'Muhammad Aslam',
    status: 'boarding',
    stops: ['Bhera Service Area', 'Kallar Kahar', 'Balkasar'],
  },
  {
    id: 'r1-faisal',
    from: 'Lahore',
    to: 'Islamabad',
    departureTime: '10:15',
    arrivalTime: '14:45',
    duration: '4h 30m',
    durationMinutes: 270,
    fare: 2400,
    busType: BusType.EXECUTIVE,
    availableSeats: 18,
    luxuryLevel: 'executive',
    journeyType: 'intercity',
    seatLayout: 'coach_2x2',
    operatorPolicy: DEFAULT_TRANSITPK_POLICY,
    operatorId: 'op-faisal',
    operatorName: 'Faisal Starliner',
    operatorRating: 4.8,
    vehicleType: 'Daewoo BV120 Executive Cruiser',
    amenities: ['ac', 'usb_charging', 'reclining_seats', 'multimedia', 'water'],
    departureTerminal: 'Band Road Terminal Bay 04, Lahore',
    arrivalTerminal: 'Faizabad Terminal Bay 07, Islamabad',
    isAvailable: true,
    platform: 'Bay 04',
    busNumber: 'BT-3388',
    driver: 'Tariq Mehmood',
    status: 'on-time',
    stops: ['Sukheke Service Area', 'Bhera Service Area'],
  },
  {
    id: 'r1-daewoo',
    from: 'Lahore',
    to: 'Islamabad',
    departureTime: '14:30',
    arrivalTime: '19:00',
    duration: '4h 30m',
    durationMinutes: 270,
    fare: 2800,
    busType: BusType.LUXURY,
    availableSeats: 14,
    luxuryLevel: 'luxury',
    journeyType: 'intercity',
    seatLayout: 'executive_2x1',
    operatorPolicy: DEFAULT_DAEWOO_POLICY,
    operatorId: 'op-daewoo',
    operatorName: 'Daewoo Express Transit',
    operatorRating: 4.7,
    vehicleType: 'Yutong Grand Cruiser 2+1 Luxury',
    amenities: ['ac', 'wifi', 'usb_charging', 'reclining_seats', 'refreshments', 'multimedia', 'washroom'],
    departureTerminal: 'Kalma Chowk Terminal, Lahore',
    arrivalTerminal: 'Motorway Chowk Terminal, Rawalpindi',
    isAvailable: true,
    platform: 'Bay 02',
    busNumber: 'BT-9900',
    driver: 'Sajjad Hussain',
    status: 'on-time',
    stops: ['Bhera Service Area', 'Kallar Kahar'],
  },
  {
    id: 'r-sania-sleeper',
    from: 'Lahore',
    to: 'Islamabad',
    departureTime: '21:00',
    arrivalTime: '02:00',
    duration: '5h 00m',
    durationMinutes: 300,
    fare: 3500,
    busType: BusType.BUSINESS,
    availableSeats: 16,
    luxuryLevel: 'business',
    journeyType: 'intercity',
    seatLayout: 'sleeper_1x1',
    operatorPolicy: DEFAULT_SANIA_SLEEPER_POLICY,
    operatorId: 'op-sania',
    operatorName: 'Sania Roadways Sleeper',
    operatorRating: 4.8,
    vehicleType: 'Hino 180° Flat Sleeper Liner',
    amenities: ['ac', 'wifi', 'usb_charging', 'reclining_seats', 'refreshments', 'washroom', 'reading_light'],
    departureTerminal: 'Thokar Niaz Baig Central Bay 03, Lahore',
    arrivalTerminal: 'Faizabad Terminal Bay 01, Islamabad',
    isAvailable: true,
    platform: 'Bay 03',
    busNumber: 'BT-7733',
    driver: 'Arshad Mehmood',
    status: 'on-time',
    stops: ['Bhera Service Area Non-Stop'],
  },
  {
    id: 'r1-night',
    from: 'Lahore',
    to: 'Islamabad',
    departureTime: '22:30',
    arrivalTime: '03:00',
    duration: '4h 30m',
    durationMinutes: 270,
    fare: 3200,
    busType: BusType.BUSINESS,
    availableSeats: 0,
    luxuryLevel: 'business',
    journeyType: 'intercity',
    seatLayout: 'sleeper_1x1',
    operatorPolicy: DEFAULT_SANIA_SLEEPER_POLICY,
    operatorId: 'op-sania',
    operatorName: 'Sania Roadways Sleeper',
    operatorRating: 4.8,
    vehicleType: 'Hino 180° Flat Sleeper Liner',
    amenities: ['ac', 'wifi', 'usb_charging', 'reclining_seats', 'refreshments', 'washroom', 'reading_light'],
    departureTerminal: 'Thokar Niaz Baig Central Bay 03, Lahore',
    arrivalTerminal: 'Faizabad Terminal Bay 01, Islamabad',
    isAvailable: false, // Sold Out demo test
    platform: 'Bay 03',
    busNumber: 'BT-7722',
    driver: 'Waqas Anwar',
    status: 'on-time',
    stops: ['Bhera Service Area Non-Stop'],
  },
  {
    id: 'r1-ret',
    from: 'Islamabad',
    to: 'Lahore',
    departureTime: '07:00',
    arrivalTime: '11:30',
    duration: '4h 30m',
    durationMinutes: 270,
    fare: 2500,
    busType: BusType.EXECUTIVE,
    availableSeats: 29,
    luxuryLevel: 'executive',
    journeyType: 'intercity',
    operatorId: 'op-transitpk',
    operatorName: 'TransitPK Express',
    operatorRating: 4.9,
    vehicleType: 'Yutong Master Starliner ZK6128',
    amenities: ['ac', 'wifi', 'usb_charging', 'reclining_seats', 'refreshments', 'water'],
    departureTerminal: 'Faizabad Terminal Bay 03, Islamabad',
    arrivalTerminal: 'Thokar Niaz Baig Central, Lahore',
    isAvailable: true,
    platform: 'Bay 03',
    busNumber: 'BT-4522',
    driver: 'Rashid Minhas',
    status: 'on-time',
    stops: ['Balkasar', 'Kallar Kahar', 'Bhera Service Area'],
  },
  {
    id: 'r1-ret-afternoon',
    from: 'Islamabad',
    to: 'Lahore',
    departureTime: '13:00',
    arrivalTime: '17:30',
    duration: '4h 30m',
    durationMinutes: 270,
    fare: 2400,
    busType: BusType.EXECUTIVE,
    availableSeats: 22,
    luxuryLevel: 'executive',
    journeyType: 'intercity',
    operatorId: 'op-faisal',
    operatorName: 'Faisal Starliner',
    operatorRating: 4.8,
    vehicleType: 'Daewoo BV120 Executive Cruiser',
    amenities: ['ac', 'usb_charging', 'reclining_seats', 'water'],
    departureTerminal: 'Faizabad Terminal Bay 05, Islamabad',
    arrivalTerminal: 'Band Road Terminal, Lahore',
    isAvailable: true,
    platform: 'Bay 05',
    busNumber: 'BT-6611',
    driver: 'Naveed Akhtar',
    status: 'on-time',
    stops: ['Bhera Service Area'],
  },

  // --- Lahore ⇄ Karachi Corridors ---
  {
    id: 'r2',
    from: 'Lahore',
    to: 'Karachi',
    departureTime: '08:00',
    arrivalTime: '22:00',
    duration: '14h 00m',
    durationMinutes: 840,
    fare: 4500,
    busType: BusType.LUXURY,
    availableSeats: 28,
    luxuryLevel: 'luxury',
    journeyType: 'intercity',
    operatorId: 'op-transitpk',
    operatorName: 'TransitPK Express',
    operatorRating: 4.9,
    vehicleType: 'Yutong Grand Cruiser Long-Haul',
    amenities: ['ac', 'wifi', 'usb_charging', 'reclining_seats', 'refreshments', 'washroom', 'water'],
    departureTerminal: 'Thokar Niaz Baig Bay 05, Lahore',
    arrivalTerminal: 'Sohrab Goth Super Highway, Karachi',
    isAvailable: true,
    platform: 'Bay 05',
    busNumber: 'BT-7832',
    driver: 'Hassan Raza',
    status: 'on-time',
    stops: ['Multan', 'Sukkur', 'Moro', 'Hyderabad'],
  },
  {
    id: 'r2-sleeper',
    from: 'Lahore',
    to: 'Karachi',
    departureTime: '19:30',
    arrivalTime: '09:30',
    duration: '14h 00m',
    durationMinutes: 840,
    fare: 5500,
    busType: BusType.BUSINESS,
    availableSeats: 16,
    luxuryLevel: 'business',
    journeyType: 'intercity',
    operatorId: 'op-sania',
    operatorName: 'Sania Roadways Sleeper',
    operatorRating: 4.8,
    vehicleType: 'Hino 180° Flat Sleeper Liner',
    amenities: ['ac', 'wifi', 'usb_charging', 'reclining_seats', 'refreshments', 'washroom', 'reading_light'],
    departureTerminal: 'Thokar Niaz Baig Bay 02, Lahore',
    arrivalTerminal: 'Sohrab Goth Executive Terminal, Karachi',
    isAvailable: true,
    platform: 'Bay 02',
    busNumber: 'BT-9012',
    driver: 'Ghulam Mustafa',
    status: 'on-time',
    stops: ['Multan By-Pass', 'Sukkur Interchange', 'Hyderabad'],
  },
  {
    id: 'r2-ret',
    from: 'Karachi',
    to: 'Lahore',
    departureTime: '09:00',
    arrivalTime: '23:00',
    duration: '14h 00m',
    durationMinutes: 840,
    fare: 4500,
    busType: BusType.LUXURY,
    availableSeats: 31,
    luxuryLevel: 'luxury',
    journeyType: 'intercity',
    operatorId: 'op-transitpk',
    operatorName: 'TransitPK Express',
    operatorRating: 4.9,
    vehicleType: 'Yutong Grand Cruiser Long-Haul',
    amenities: ['ac', 'wifi', 'usb_charging', 'reclining_seats', 'refreshments', 'washroom', 'water'],
    departureTerminal: 'Sohrab Goth Terminal Bay 01, Karachi',
    arrivalTerminal: 'Thokar Niaz Baig Central, Lahore',
    isAvailable: true,
    platform: 'Bay 01',
    busNumber: 'BT-7833',
    driver: 'Arshad Mehmood',
    status: 'on-time',
    stops: ['Hyderabad', 'Moro', 'Sukkur', 'Multan'],
  },

  // --- Islamabad ⇄ Peshawar Corridors ---
  {
    id: 'r3',
    from: 'Islamabad',
    to: 'Peshawar',
    departureTime: '07:30',
    arrivalTime: '09:40',
    duration: '2h 10m',
    durationMinutes: 130,
    fare: 1800,
    busType: BusType.STANDARD,
    availableSeats: 40,
    luxuryLevel: 'standard',
    journeyType: 'intercity',
    operatorId: 'op-skyways',
    operatorName: 'Skyways Super Shuttle',
    operatorRating: 4.6,
    vehicleType: 'Hino AK1J Executive Shuttle',
    amenities: ['ac', 'reclining_seats', 'water'],
    departureTerminal: 'Faizabad Intercity Bay 02, Islamabad',
    arrivalTerminal: 'Peshawar Cantt Terminal Bay 04',
    isAvailable: true,
    platform: 'Bay 02',
    busNumber: 'BT-1190',
    driver: 'Imran Shah',
    status: 'delayed',
    stops: ['Attock Bridge', 'Rashakai Interchange', 'Nowshera'],
  },
  {
    id: 'r3-ret',
    from: 'Peshawar',
    to: 'Islamabad',
    departureTime: '08:30',
    arrivalTime: '10:40',
    duration: '2h 10m',
    durationMinutes: 130,
    fare: 1800,
    busType: BusType.STANDARD,
    availableSeats: 36,
    luxuryLevel: 'standard',
    journeyType: 'intercity',
    operatorId: 'op-skyways',
    operatorName: 'Skyways Super Shuttle',
    operatorRating: 4.6,
    vehicleType: 'Hino AK1J Executive Shuttle',
    amenities: ['ac', 'reclining_seats', 'water'],
    departureTerminal: 'Peshawar Cantt Terminal Bay 01',
    arrivalTerminal: 'Faizabad Intercity Bay 02, Islamabad',
    isAvailable: true,
    platform: 'Bay 01',
    busNumber: 'BT-1191',
    driver: 'Zahid Khan',
    status: 'on-time',
    stops: ['Nowshera', 'Rashakai Interchange', 'Attock Bridge'],
  },

  // --- Multan ⇄ Lahore Corridors ---
  {
    id: 'r4',
    from: 'Multan',
    to: 'Lahore',
    departureTime: '09:00',
    arrivalTime: '13:00',
    duration: '4h 00m',
    durationMinutes: 240,
    fare: 1500,
    busType: BusType.STANDARD,
    availableSeats: 35,
    luxuryLevel: 'standard',
    journeyType: 'intercity',
    operatorId: 'op-faisal',
    operatorName: 'Faisal Starliner',
    operatorRating: 4.8,
    vehicleType: 'Daewoo BV120 Standard AC',
    amenities: ['ac', 'reclining_seats', 'water'],
    departureTerminal: 'Chungi No. 9 Terminal, Multan',
    arrivalTerminal: 'Thokar Niaz Baig, Lahore',
    isAvailable: true,
    platform: 'Bay 05',
    busNumber: 'BT-3344',
    driver: 'Kamran Ali',
    status: 'on-time',
    stops: ['Khanewal', 'Mian Channu', 'Sahiwal', 'Okara'],
  },
  {
    id: 'r4-ret',
    from: 'Lahore',
    to: 'Multan',
    departureTime: '10:00',
    arrivalTime: '14:00',
    duration: '4h 00m',
    durationMinutes: 240,
    fare: 1500,
    busType: BusType.STANDARD,
    availableSeats: 38,
    luxuryLevel: 'standard',
    journeyType: 'intercity',
    operatorId: 'op-faisal',
    operatorName: 'Faisal Starliner',
    operatorRating: 4.8,
    vehicleType: 'Daewoo BV120 Standard AC',
    amenities: ['ac', 'reclining_seats', 'water'],
    departureTerminal: 'Thokar Niaz Baig, Lahore',
    arrivalTerminal: 'Chungi No. 9 Terminal, Multan',
    isAvailable: true,
    platform: 'Bay 06',
    busNumber: 'BT-3345',
    driver: 'Liaquat Ali',
    status: 'on-time',
    stops: ['Okara', 'Sahiwal', 'Mian Channu', 'Khanewal'],
  },

  // --- Faisalabad ⇄ Rawalpindi Corridors ---
  {
    id: 'r5',
    from: 'Faisalabad',
    to: 'Rawalpindi',
    departureTime: '10:00',
    arrivalTime: '14:30',
    duration: '4h 30m',
    durationMinutes: 270,
    fare: 2000,
    busType: BusType.EXECUTIVE,
    availableSeats: 30,
    luxuryLevel: 'executive',
    journeyType: 'intercity',
    operatorId: 'op-transitpk',
    operatorName: 'TransitPK Express',
    operatorRating: 4.9,
    vehicleType: 'Yutong ZK6128 Executive',
    amenities: ['ac', 'wifi', 'usb_charging', 'reclining_seats', 'water'],
    departureTerminal: 'Kohinoor City Terminal, Faisalabad',
    arrivalTerminal: 'Pirwadhai Terminal Bay 04, Rawalpindi',
    isAvailable: true,
    platform: 'Bay 04',
    busNumber: 'BT-5567',
    driver: 'Usman Khan',
    status: 'departed',
    stops: ['Pindi Bhattian', 'Bhera Interchange', 'Chakwal'],
  },
  {
    id: 'r5-ret',
    from: 'Rawalpindi',
    to: 'Faisalabad',
    departureTime: '11:30',
    arrivalTime: '16:00',
    duration: '4h 30m',
    durationMinutes: 270,
    fare: 2000,
    busType: BusType.EXECUTIVE,
    availableSeats: 34,
    luxuryLevel: 'executive',
    journeyType: 'intercity',
    operatorId: 'op-transitpk',
    operatorName: 'TransitPK Express',
    operatorRating: 4.9,
    vehicleType: 'Yutong ZK6128 Executive',
    amenities: ['ac', 'wifi', 'usb_charging', 'reclining_seats', 'water'],
    departureTerminal: 'Pirwadhai Terminal Bay 04, Rawalpindi',
    arrivalTerminal: 'Kohinoor City Terminal, Faisalabad',
    isAvailable: true,
    platform: 'Bay 04',
    busNumber: 'BT-5568',
    driver: 'Babar Azam',
    status: 'on-time',
    stops: ['Chakwal', 'Bhera Interchange', 'Pindi Bhattian'],
  },

  // --- Karachi ⇄ Hyderabad Corridors ---
  {
    id: 'r6',
    from: 'Karachi',
    to: 'Hyderabad',
    departureTime: '11:00',
    arrivalTime: '13:30',
    duration: '2h 30m',
    durationMinutes: 150,
    fare: 1200,
    busType: BusType.BUSINESS,
    availableSeats: 24,
    luxuryLevel: 'business',
    journeyType: 'intercity',
    operatorId: 'op-daewoo',
    operatorName: 'Daewoo Express Transit',
    operatorRating: 4.7,
    vehicleType: 'Daewoo BV120 Gold Class',
    amenities: ['ac', 'wifi', 'usb_charging', 'reclining_seats', 'refreshments', 'water'],
    departureTerminal: 'Sohrab Goth Gold Terminal, Karachi',
    arrivalTerminal: 'Qasim Chowk Terminal, Hyderabad',
    isAvailable: true,
    platform: 'Bay 07',
    busNumber: 'BT-2200',
    driver: 'Bilal Ahmed',
    status: 'on-time',
    stops: ['Nooriabad Service Area', 'Jamshoro Interchange'],
  },
  {
    id: 'r6-ret',
    from: 'Hyderabad',
    to: 'Karachi',
    departureTime: '12:00',
    arrivalTime: '14:30',
    duration: '2h 30m',
    durationMinutes: 150,
    fare: 1200,
    busType: BusType.BUSINESS,
    availableSeats: 22,
    luxuryLevel: 'business',
    journeyType: 'intercity',
    operatorId: 'op-daewoo',
    operatorName: 'Daewoo Express Transit',
    operatorRating: 4.7,
    vehicleType: 'Daewoo BV120 Gold Class',
    amenities: ['ac', 'wifi', 'usb_charging', 'reclining_seats', 'refreshments', 'water'],
    departureTerminal: 'Qasim Chowk Terminal, Hyderabad',
    arrivalTerminal: 'Sohrab Goth Gold Terminal, Karachi',
    isAvailable: true,
    platform: 'Bay 08',
    busNumber: 'BT-2201',
    driver: 'Sultan Mehmood',
    status: 'on-time',
    stops: ['Jamshoro Interchange', 'Nooriabad Service Area'],
  },

  // --- Quetta ⇄ Multan Corridor ---
  {
    id: 'r7',
    from: 'Quetta',
    to: 'Multan',
    departureTime: '05:30',
    arrivalTime: '16:00',
    duration: '10h 30m',
    durationMinutes: 630,
    fare: 3800,
    busType: BusType.LUXURY,
    availableSeats: 26,
    luxuryLevel: 'luxury',
    journeyType: 'intercity',
    operatorId: 'op-transitpk',
    operatorName: 'TransitPK Express',
    operatorRating: 4.9,
    vehicleType: 'Yutong High-Deck Cruiser',
    amenities: ['ac', 'wifi', 'usb_charging', 'reclining_seats', 'refreshments', 'water'],
    departureTerminal: 'Saryab Road Terminal, Quetta',
    arrivalTerminal: 'Chungi No. 9 Terminal, Multan',
    isAvailable: true,
    platform: 'Bay 01',
    busNumber: 'BT-8899',
    driver: 'Tariq Mehmood',
    status: 'on-time',
    stops: ['Loralai', 'Dera Ghazi Khan'],
  },

  // --- Local City & Metro Feeder Routes ---
  {
    id: 'loc1',
    from: 'Thokar Niaz Baig',
    to: 'Railway Station',
    departureTime: '06:15',
    arrivalTime: '07:10',
    duration: '55m',
    durationMinutes: 55,
    fare: 60,
    busType: BusType.STANDARD,
    availableSeats: 22,
    luxuryLevel: 'standard',
    journeyType: 'local',
    seatLayout: 'van_coaster',
    operatorPolicy: DEFAULT_METRO_POLICY,
    operatorId: 'op-metro',
    operatorName: 'Metro Rapid Feeder',
    operatorRating: 4.9,
    vehicleType: 'Toyota Coaster Executive Feeder',
    amenities: ['ac', 'usb_charging'],
    departureTerminal: 'Thokar Feeder Terminal, Lahore',
    arrivalTerminal: 'Lahore Railway Station Metro Bay',
    isAvailable: true,
    platform: 'Feeder Bay 1',
    busNumber: 'MF-101',
    driver: 'Nadeem Abbas',
    status: 'on-time',
    stops: ['Canal Metro', 'Kalma Chowk', 'Ichhra', 'Qartaba Chowk'],
  },
  {
    id: 'loc1-ret',
    from: 'Railway Station',
    to: 'Thokar Niaz Baig',
    departureTime: '07:20',
    arrivalTime: '08:15',
    duration: '55m',
    durationMinutes: 55,
    fare: 60,
    busType: BusType.STANDARD,
    availableSeats: 40,
    luxuryLevel: 'standard',
    journeyType: 'local',
    operatorId: 'op-metro',
    operatorName: 'Metro Rapid Feeder',
    operatorRating: 4.9,
    vehicleType: 'BYD K9 Electric City Bus',
    amenities: ['ac', 'usb_charging'],
    departureTerminal: 'Lahore Railway Station Metro Bay',
    arrivalTerminal: 'Thokar Feeder Terminal, Lahore',
    isAvailable: true,
    platform: 'Feeder Bay 2',
    busNumber: 'MF-102',
    driver: 'Shoaib Akhtar',
    status: 'on-time',
    stops: ['Qartaba Chowk', 'Ichhra', 'Kalma Chowk', 'Canal Metro'],
  },
  {
    id: 'loc2',
    from: 'Kalma Chowk',
    to: 'Shahdara Metro',
    departureTime: '06:30',
    arrivalTime: '07:20',
    duration: '50m',
    durationMinutes: 50,
    fare: 70,
    busType: BusType.STANDARD,
    availableSeats: 42,
    luxuryLevel: 'standard',
    journeyType: 'local',
    operatorId: 'op-metro',
    operatorName: 'Metro Rapid Feeder',
    operatorRating: 4.9,
    vehicleType: 'BYD K9 Electric City Bus',
    amenities: ['ac', 'usb_charging'],
    departureTerminal: 'Kalma Chowk Metro Station',
    arrivalTerminal: 'Shahdara Metro Terminus',
    isAvailable: true,
    platform: 'Feeder Bay 3',
    busNumber: 'MF-201',
    driver: 'Kashif Mehmood',
    status: 'on-time',
    stops: ['Canal', 'MAO College', 'Bhatti Chowk', 'Azadi Chowk'],
  },
  {
    id: 'loc2-ret',
    from: 'Shahdara Metro',
    to: 'Kalma Chowk',
    departureTime: '07:35',
    arrivalTime: '08:25',
    duration: '50m',
    durationMinutes: 50,
    fare: 70,
    busType: BusType.STANDARD,
    availableSeats: 39,
    luxuryLevel: 'standard',
    journeyType: 'local',
    operatorId: 'op-metro',
    operatorName: 'Metro Rapid Feeder',
    operatorRating: 4.9,
    vehicleType: 'BYD K9 Electric City Bus',
    amenities: ['ac', 'usb_charging'],
    departureTerminal: 'Shahdara Metro Terminus',
    arrivalTerminal: 'Kalma Chowk Metro Station',
    isAvailable: true,
    platform: 'Feeder Bay 4',
    busNumber: 'MF-202',
    driver: 'Imtiaz Ahmed',
    status: 'on-time',
    stops: ['Azadi Chowk', 'Bhatti Chowk', 'MAO College', 'Canal'],
  },
  {
    id: 'loc3',
    from: 'Faizabad Metro Hub',
    to: 'Pakistan Secretariat',
    departureTime: '06:45',
    arrivalTime: '07:25',
    duration: '40m',
    durationMinutes: 40,
    fare: 60,
    busType: BusType.EXECUTIVE,
    availableSeats: 35,
    luxuryLevel: 'executive',
    journeyType: 'local',
    operatorId: 'op-metro',
    operatorName: 'Metro Rapid Feeder',
    operatorRating: 4.9,
    vehicleType: 'BYD K9 Electric City Bus',
    amenities: ['ac', 'usb_charging', 'wifi'],
    departureTerminal: 'Faizabad Metro Interchange',
    arrivalTerminal: 'Pakistan Secretariat Station',
    isAvailable: true,
    platform: 'Metro Gate 1',
    busNumber: 'ISB-101',
    driver: 'Farhan Zaidi',
    status: 'on-time',
    stops: ['I-8', 'Shamsabad', 'Chaman', 'Centaurus'],
  },
  {
    id: 'loc3-ret',
    from: 'Pakistan Secretariat',
    to: 'Faizabad Metro Hub',
    departureTime: '07:40',
    arrivalTime: '08:20',
    duration: '40m',
    durationMinutes: 40,
    fare: 60,
    busType: BusType.EXECUTIVE,
    availableSeats: 37,
    luxuryLevel: 'executive',
    journeyType: 'local',
    operatorId: 'op-metro',
    operatorName: 'Metro Rapid Feeder',
    operatorRating: 4.9,
    vehicleType: 'BYD K9 Electric City Bus',
    amenities: ['ac', 'usb_charging', 'wifi'],
    departureTerminal: 'Pakistan Secretariat Station',
    arrivalTerminal: 'Faizabad Metro Interchange',
    isAvailable: true,
    platform: 'Metro Gate 2',
    busNumber: 'ISB-102',
    driver: 'Tanveer Shah',
    status: 'on-time',
    stops: ['Centaurus', 'Chaman', 'Shamsabad', 'I-8'],
  },
  {
    id: 'loc4',
    from: 'Saddar Rawalpindi',
    to: 'Centaurus Station',
    departureTime: '07:00',
    arrivalTime: '07:40',
    duration: '40m',
    durationMinutes: 40,
    fare: 65,
    busType: BusType.STANDARD,
    availableSeats: 40,
    luxuryLevel: 'standard',
    journeyType: 'local',
    operatorId: 'op-metro',
    operatorName: 'Metro Rapid Feeder',
    operatorRating: 4.9,
    vehicleType: 'BYD K9 Electric City Bus',
    amenities: ['ac', 'usb_charging'],
    departureTerminal: 'Saddar Metro Station, Rawalpindi',
    arrivalTerminal: 'Centaurus Station, Islamabad',
    isAvailable: true,
    platform: 'Gate 3',
    busNumber: 'RWP-301',
    driver: 'Javed Iqbal',
    status: 'on-time',
    stops: ['Liaquat Bagh', 'Faizabad', 'Zero Point'],
  },
  {
    id: 'loc5',
    from: 'Saddar Central',
    to: 'Jinnah Airport Terminal',
    departureTime: '07:15',
    arrivalTime: '08:15',
    duration: '60m',
    durationMinutes: 60,
    fare: 100,
    busType: BusType.EXECUTIVE,
    availableSeats: 36,
    luxuryLevel: 'executive',
    journeyType: 'local',
    operatorId: 'op-metro',
    operatorName: 'Metro Rapid Feeder',
    operatorRating: 4.9,
    vehicleType: 'BYD K9 Electric City Bus',
    amenities: ['ac', 'usb_charging', 'wifi'],
    departureTerminal: 'Saddar Central Metro Bay, Karachi',
    arrivalTerminal: 'Jinnah International Airport Bay',
    isAvailable: true,
    platform: 'Airport Express Bay',
    busNumber: 'KHI-AP1',
    driver: 'Waseem Akram',
    status: 'on-time',
    stops: ['Regal Chowk', 'Karsaz', 'Drigh Road', 'Star Gate'],
  },
  {
    id: 'loc6',
    from: 'Clifton Teen Talwar',
    to: 'Sohrab Goth Terminal',
    departureTime: '07:30',
    arrivalTime: '08:45',
    duration: '1h 15m',
    durationMinutes: 75,
    fare: 90,
    busType: BusType.STANDARD,
    availableSeats: 44,
    luxuryLevel: 'standard',
    journeyType: 'local',
    operatorId: 'op-metro',
    operatorName: 'Metro Rapid Feeder',
    operatorRating: 4.9,
    vehicleType: 'BYD K9 Electric City Bus',
    amenities: ['ac', 'usb_charging'],
    departureTerminal: 'Teen Talwar Feeder Stop, Karachi',
    arrivalTerminal: 'Sohrab Goth Hub, Karachi',
    isAvailable: true,
    platform: 'Bay 12',
    busNumber: 'KHI-PB2',
    driver: 'Zulfiqar Ali',
    status: 'on-time',
    stops: ['Boat Basin', 'Frere Hall', 'Gulshan-e-Iqbal', 'Water Pump'],
  },
];


export const DEPARTURE_BOARD: DepartureBoardEntry[] = [
  { id: 'd1', platform: 'P-01', busNumber: 'BT-4521', driver: 'Muhammad Aslam', route: 'Lahore → Islamabad', departureTime: '06:00', status: 'boarding' },
  { id: 'd2', platform: 'P-03', busNumber: 'BT-7832', driver: 'Hassan Raza', route: 'Lahore → Karachi', departureTime: '08:00', status: 'on-time' },
  { id: 'd3', platform: 'P-02', busNumber: 'BT-1190', driver: 'Imran Shah', route: 'Islamabad → Peshawar', departureTime: '07:30', status: 'delayed' },
  { id: 'd4', platform: 'P-05', busNumber: 'BT-3344', driver: 'Kamran Ali', route: 'Multan → Lahore', departureTime: '09:00', status: 'on-time' },
  { id: 'd5', platform: 'P-04', busNumber: 'BT-5567', driver: 'Usman Khan', route: 'Faisalabad → Rawalpindi', departureTime: '10:00', status: 'departed' },
];

export const MOCK_DRIVERS: Driver[] = [
  { id: 'dr1', name: 'Muhammad Aslam', cnic: '35201-1234567-1', phone: '03001234567', licenseNumber: 'LIC-2024-001' },
  { id: 'dr2', name: 'Hassan Raza', cnic: '42101-7654321-2', phone: '03009876543', licenseNumber: 'LIC-2024-002' },
  { id: 'dr3', name: 'Imran Shah', cnic: '61101-9876543-3', phone: '03111234567', licenseNumber: 'LIC-2024-003' },
  { id: 'dr4', name: 'Kamran Ali', cnic: '37405-4567890-4', phone: '03221234567', licenseNumber: 'LIC-2024-004' },
];

export const MOCK_BUSES: Bus[] = [
  { id: 'b1', registrationNumber: 'BT-4521', model: 'Yutong ZK6128', capacity: 45, status: 'active', driverId: 'dr1', routeId: 'r1', insuranceExpiry: '2026-12-01', registrationExpiry: '2027-06-15', lastMaintenance: '2026-05-01', nextMaintenance: '2026-08-01', fuelLevel: 78 },
  { id: 'b2', registrationNumber: 'BT-7832', model: 'Hino AK1J', capacity: 50, status: 'active', driverId: 'dr2', routeId: 'r2', insuranceExpiry: '2026-11-15', registrationExpiry: '2027-03-20', lastMaintenance: '2026-04-15', nextMaintenance: '2026-07-15', fuelLevel: 65 },
  { id: 'b3', registrationNumber: 'BT-1190', model: 'Daewoo BV120', capacity: 40, status: 'under_maintenance', driverId: 'dr3', routeId: 'r3', insuranceExpiry: '2026-10-20', registrationExpiry: '2027-01-10', lastMaintenance: '2026-06-20', nextMaintenance: '2026-09-20', fuelLevel: 30 },
  { id: 'b4', registrationNumber: 'BT-9900', model: 'Yutong ZK6128', capacity: 45, status: 'available', insuranceExpiry: '2027-01-01', registrationExpiry: '2027-08-01', lastMaintenance: '2026-05-10', nextMaintenance: '2026-08-10', fuelLevel: 90 },
  { id: 'b5', registrationNumber: 'BT-3344', model: 'Hino AK1J', capacity: 50, status: 'active', driverId: 'dr4', routeId: 'r4', insuranceExpiry: '2026-09-30', registrationExpiry: '2027-02-28', lastMaintenance: '2026-03-01', nextMaintenance: '2026-06-01', fuelLevel: 55 },
  { id: 'b6', registrationNumber: 'BT-5567', model: 'Daewoo BV120', capacity: 40, status: 'out_of_service', insuranceExpiry: '2026-08-15', registrationExpiry: '2026-12-01', lastMaintenance: '2026-02-01', nextMaintenance: '2026-05-01', fuelLevel: 10 },
];

export const MOCK_TRACKING: BusLocation[] = [
  { id: 'B1', route: 'LHE-ISB', from: 'Lahore', to: 'Islamabad', progress: 0.45, lat: 32.5, lng: 73.2, driver: 'Muhammad Aslam', status: 'on-time', eta: '10:15' },
  { id: 'B2', route: 'LHE-KHI', from: 'Lahore', to: 'Karachi', progress: 0.62, lat: 28.8, lng: 70.5, driver: 'Hassan Raza', status: 'on-time', eta: '18:30' },
  { id: 'B3', route: 'ISB-PSH', from: 'Islamabad', to: 'Peshawar', progress: 0.25, lat: 33.9, lng: 72.5, driver: 'Imran Shah', status: 'delayed', eta: '11:45', delayMinutes: 15 },
  { id: 'B4', route: 'MUL-LHE', from: 'Multan', to: 'Lahore', progress: 0.78, lat: 31.2, lng: 73.8, driver: 'Kamran Ali', status: 'on-time', eta: '12:30' },
  { id: 'B5', route: 'FSD-RWP', from: 'Faisalabad', to: 'Rawalpindi', progress: 0.35, lat: 32.8, lng: 73.0, driver: 'Usman Khan', status: 'on-time', eta: '13:00' },
  { id: 'B6', route: 'QTA-MUL', from: 'Quetta', to: 'Multan', progress: 0.15, lat: 30.2, lng: 67.5, driver: 'Tariq Mehmood', status: 'on-time', eta: '14:00' },
  { id: 'B7', route: 'KHI-HYD', from: 'Karachi', to: 'Hyderabad', progress: 0.88, lat: 25.4, lng: 68.2, driver: 'Bilal Ahmed', status: 'on-time', eta: '13:30' },
];

export const CITY_COORDS: Record<string, { x: number; y: number }> = {
  Lahore: { x: 520, y: 280 },
  Islamabad: { x: 480, y: 200 },
  Karachi: { x: 350, y: 480 },
  Peshawar: { x: 420, y: 150 },
  Quetta: { x: 280, y: 350 },
  Multan: { x: 450, y: 340 },
  Faisalabad: { x: 490, y: 300 },
  Rawalpindi: { x: 475, y: 210 },
  Hyderabad: { x: 370, y: 450 },
};

export const MOCK_TICKETS: Ticket[] = [
  { id: 't1', bookingId: 'BK-2024-001', pnr: 'TPK-93A8B1', passengerName: 'Ahmed Khan', cnic: '35201-1234567-1', route: 'Lahore → Islamabad', seatNumber: 'A12', departureTime: '06:00', travelDate: '2026-10-20', status: 'valid', qrCode: 'QR-BK-2024-001', verificationToken: 'VT-93A8B101', boardingStatus: 'pending', fare: 3550 },
  { id: 't2', bookingId: 'BK-2024-002', pnr: 'SNR-418K02', passengerName: 'Fatima Ali', cnic: '42101-7654321-2', route: 'Lahore → Karachi', seatNumber: 'B05', departureTime: '08:00', travelDate: '2026-10-21', status: 'valid', qrCode: 'QR-BK-2024-002', verificationToken: 'VT-418K0202', boardingStatus: 'pending', fare: 5550 },
  { id: 't3', bookingId: 'BK-2024-003', pnr: 'RAW-782M99', passengerName: 'Usman Malik', cnic: '61101-9876543-3', route: 'Islamabad → Peshawar', seatNumber: 'C08', departureTime: '07:30', travelDate: '2026-10-19', status: 'used', qrCode: 'QR-BK-2024-003', verificationToken: 'VT-782M9903', boardingStatus: 'boarded', fare: 1550 },
];

export const MOCK_STATS: DashboardStats = {
  dailyRevenue: 485000,
  weeklyRevenue: 3240000,
  monthlyRevenue: 12850000,
  activeBuses: 42,
  activeRoutes: 28,
  passengerCount: 1850,
};

export const REVENUE_DATA: ChartDataPoint[] = [
  { date: 'Mon', revenue: 420000 },
  { date: 'Tue', revenue: 385000 },
  { date: 'Wed', revenue: 510000 },
  { date: 'Thu', revenue: 465000 },
  { date: 'Fri', revenue: 620000 },
  { date: 'Sat', revenue: 780000 },
  { date: 'Sun', revenue: 690000 },
];

export const PASSENGER_DATA: ChartDataPoint[] = [
  { route: 'LHE-ISB', passengers: 420 },
  { route: 'LHE-KHI', passengers: 380 },
  { route: 'ISB-PSH', passengers: 290 },
  { route: 'MUL-LHE', passengers: 210 },
  { route: 'FSD-RWP', passengers: 180 },
];

export const PEAK_HOURS_DATA: ChartDataPoint[] = [
  { hour: '06:00', passengers: 320 },
  { hour: '08:00', passengers: 450 },
  { hour: '10:00', passengers: 280 },
  { hour: '12:00', passengers: 190 },
  { hour: '14:00', passengers: 220 },
  { hour: '16:00', passengers: 380 },
  { hour: '18:00', passengers: 410 },
  { hour: '20:00', passengers: 150 },
];

export const FLEET_USAGE_DATA: ChartDataPoint[] = [
  { date: 'Week 1', usage: 72 },
  { date: 'Week 2', usage: 78 },
  { date: 'Week 3', usage: 85 },
  { date: 'Week 4', usage: 81 },
];

export const BUS_TYPE_FARES: Record<BusType, number> = {
  [BusType.STANDARD]: 1,
  [BusType.EXECUTIVE]: 1.4,
  [BusType.LUXURY]: 1.8,
  [BusType.BUSINESS]: 2.2,
};

export const TERMINAL_STATS = {
  dailyPassengers: 12500,
  activeBuses: 156,
  routesToday: 89,
  onTimeRate: 94.2,
};

export function generateSeatsForLayout(
  layout: import('@/types/booking.types').SeatLayoutType = 'coach_2x2',
  policy?: import('@/types/booking.types').OperatorPolicy
): import('@/types/booking.types').Seat[] {
  const seats: import('@/types/booking.types').Seat[] = [];
  const now = Date.now();

  if (layout === 'van_coaster') {
    // 14 passenger seats
    // Front passenger seat next to driver
    seats.push({
      id: 'seat-F1',
      number: 'F1',
      rowName: 'F',
      colIndex: 2,
      seatType: 'window',
      status: 'available',
    });

    // Rows A, B, C (3 rows of 3: col 0 Left Single, Aisle, col 1 Right Aisle, col 2 Right Window)
    const rows = ['A', 'B', 'C'];
    rows.forEach((row, rIdx) => {
      const isLadies = policy?.allowsLadiesQuota && policy.ladiesQuotaRows?.includes(row);
      // Left single
      seats.push({
        id: `seat-${row}1`,
        number: `${row}1`,
        rowName: row,
        colIndex: 0,
        seatType: 'single',
        status: isLadies ? 'female' : 'available',
      });
      // Right pair
      seats.push({
        id: `seat-${row}2`,
        number: `${row}2`,
        rowName: row,
        colIndex: 1,
        seatType: 'aisle',
        status: rIdx === 1 ? 'booked' : 'available',
      });
      seats.push({
        id: `seat-${row}3`,
        number: `${row}3`,
        rowName: row,
        colIndex: 2,
        seatType: 'window',
        status: isLadies ? 'female' : (rIdx === 2 ? 'held' : 'available'),
        lockedUntil: rIdx === 2 ? now + 120000 : undefined,
      });
    });

    // Rear row R: 4 seats across (R1, R2, R3, R4)
    ['R1', 'R2', 'R3', 'R4'].forEach((num, idx) => {
      seats.push({
        id: `seat-${num}`,
        number: num,
        rowName: 'R',
        colIndex: idx,
        seatType: idx === 0 || idx === 3 ? 'window' : 'aisle',
        status: idx === 1 ? 'booked' : 'available',
      });
    });

    return seats;
  }

  if (layout === 'executive_2x1') {
    // 27 seats: Rows A to I (9 rows of 3)
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    rows.forEach((row, rIdx) => {
      const isLadies = policy?.allowsLadiesQuota && policy.ladiesQuotaRows?.includes(row);
      const isVip = policy?.allowsVipSeats && policy.vipSeatNumbers?.includes(`${row}1`);
      // Left Single
      seats.push({
        id: `seat-${row}1`,
        number: `${row}1`,
        rowName: row,
        colIndex: 0,
        seatType: 'single',
        status: isLadies ? 'female' : isVip ? 'vip' : rIdx % 3 === 0 ? 'booked' : 'available',
      });
      // Right Aisle
      seats.push({
        id: `seat-${row}2`,
        number: `${row}2`,
        rowName: row,
        colIndex: 1,
        seatType: 'aisle',
        status: rIdx === 1 ? 'held' : (rIdx % 4 === 0 ? 'booked' : 'available'),
        lockedUntil: rIdx === 1 ? now + 150000 : undefined,
      });
      // Right Window
      seats.push({
        id: `seat-${row}3`,
        number: `${row}3`,
        rowName: row,
        colIndex: 2,
        seatType: 'window',
        status: isLadies ? 'female' : (rIdx % 5 === 0 ? 'booked' : 'available'),
      });
    });

    return seats;
  }

  if (layout === 'sleeper_1x1') {
    // 20 flat berths: Lower Deck (L1-L5, R1-R5), Upper Deck (L6-L10, R6-R10)
    for (let i = 1; i <= 10; i++) {
      const isLower = i <= 5;
      const isLadiesL = policy?.allowsLadiesQuota && policy.ladiesQuotaRows?.includes(`L${i}`);
      const isLadiesR = policy?.allowsLadiesQuota && policy.ladiesQuotaRows?.includes(`R${i}`);
      // Left Berth
      seats.push({
        id: `berth-L${i}`,
        number: `L${i}`,
        rowName: `Row ${i}`,
        colIndex: 0,
        deck: isLower ? 'lower' : 'upper',
        seatType: 'berth',
        status: isLadiesL ? 'female' : (i % 3 === 0 ? 'booked' : 'available'),
      });
      // Right Berth
      seats.push({
        id: `berth-R${i}`,
        number: `R${i}`,
        rowName: `Row ${i}`,
        colIndex: 1,
        deck: isLower ? 'lower' : 'upper',
        seatType: 'berth',
        status: isLadiesR ? 'female' : (i === 3 ? 'held' : i % 4 === 0 ? 'booked' : 'available'),
        lockedUntil: i === 3 ? now + 160000 : undefined,
      });
    }

    return seats;
  }

  // Default: coach_2x2 (40 seats across 10 rows: A to J)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  rows.forEach((row, rIdx) => {
    const isLadies = policy?.allowsLadiesQuota && policy.ladiesQuotaRows?.includes(row);

    for (let c = 1; c <= 4; c++) {
      const seatNum = `${row}${c}`;
      const isVip = policy?.allowsVipSeats && policy.vipSeatNumbers?.includes(seatNum);
      const isWindow = c === 1 || c === 4;

      let status: import('@/types/booking.types').Seat['status'] = 'available';
      let lockedUntil: number | undefined;

      if (isLadies) {
        status = 'female';
      } else if (isVip) {
        status = 'vip';
      }

      if ((rIdx * 4 + c) % 5 === 0) {
        status = 'booked';
      } else if (seatNum === 'C3') {
        status = 'held';
        lockedUntil = now + 180000;
      }

      seats.push({
        id: `seat-${seatNum}`,
        number: seatNum,
        rowName: row,
        colIndex: c - 1,
        seatType: isWindow ? 'window' : 'aisle',
        status,
        lockedUntil,
      });
    }
  });

  return seats;
}

export function generateSeats(count = 40): import('@/types/booking.types').Seat[] {
  return generateSeatsForLayout('coach_2x2');
}

