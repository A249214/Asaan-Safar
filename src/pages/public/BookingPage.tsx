import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBookingStore } from '@/stores/booking.store';
import { bookingService } from '@/services/booking.service';
import { toast } from 'react-hot-toast';
import { Route, BusType, PaymentMethod } from '@/types/booking.types';
import { SeatSelection } from '@/components/booking/SeatSelection';
import { BookingStepIndicator } from '@/components/booking/BookingStepIndicator';
import { PaymentGatewayModal } from '@/components/booking/PaymentGatewayModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  formatCurrency, validateCNIC, validateMobile, maskCNIC, formatCNICInput, maskMobile
} from '@/lib/utils';
import { BUS_TYPE_FARES } from '@/lib/mock-data';
import { Link } from 'react-router-dom';
import { DigitalBoardingPass } from '@/components/ticket/DigitalBoardingPass';
import {
  Check, ChevronRight, Bus, Clock, ShieldCheck, MapPin, Printer, ArrowLeft, CreditCard,
  Smartphone, Banknote, AlertCircle, Lock, Building, Ticket
} from 'lucide-react';

const passengerSchema = z.object({
  cnic: z.string().refine(validateCNIC, 'Format: 12345-1234567-1 (13 digits)'),
  fullName: z.string().min(3, 'Full legal passenger name required (minimum 3 characters)'),
  mobile: z.string().refine(validateMobile, 'Format: 03XXXXXXXXX (11 digits Pakistani mobile)'),
  gender: z.enum(['male', 'female', 'other']),
  emergencyContact: z.string().refine(validateMobile, 'Format: 03XXXXXXXXX (Emergency contact mobile)'),
  specialAssistance: z.boolean().optional(),
  extraLuggage: z.boolean().optional(),
  notes: z.string().optional(),
});

type PassengerForm = z.infer<typeof passengerSchema>;

const steps = ['Route', 'Class', 'Seats', 'Passenger', 'Payment', 'Ticket'];

const busTypes = [
  {
    type: BusType.STANDARD,
    label: 'Standard Economy',
    desc: '45-seater AC Coach, reclining seats & filtered water',
    multiplier: 1.0,
  },
  {
    type: BusType.EXECUTIVE,
    label: 'Executive Express',
    desc: 'Comfortable 2+2 luxury seating, charging ports & refreshments',
    multiplier: 1.4,
  },
  {
    type: BusType.LUXURY,
    label: 'Luxury Starliner',
    desc: 'Extra wide 2+1 seating, individual multimedia screen & hot snacks',
    multiplier: 1.8,
  },
  {
    type: BusType.BUSINESS,
    label: 'Business Class',
    desc: '180° Sleeper recliners, meal box, priority boarding & attendant',
    multiplier: 2.2,
  },
];

const paymentMethods: {
  id: PaymentMethod;
  label: string;
  note: string;
  type: 'wallet' | 'card' | 'bank' | 'cash';
  badge: string;
}[] = [
  {
    id: 'easypaisa',
    label: 'EasyPaisa Mobile Wallet',
    note: 'Instant payment deduction via Telenor Microfinance Bank',
    type: 'wallet',
    badge: 'INSTANT VERIFICATION',
  },
  {
    id: 'jazzcash',
    label: 'JazzCash Mobile Account',
    note: 'Real-time OTP & MPIN debit via Mobilink Microfinance Bank',
    type: 'wallet',
    badge: 'INSTANT VERIFICATION',
  },
  {
    id: 'debit',
    label: 'Debit Card (PayPak / Visa / Mastercard)',
    note: 'Encrypted tokenized processing via Pakistani bank 3D-Secure',
    type: 'card',
    badge: '3DS OTP SECURED',
  },
  {
    id: 'credit',
    label: 'Credit Card (Visa / Mastercard)',
    note: 'State Bank compliant gateway — raw CVV/cards are never stored',
    type: 'card',
    badge: '3DS OTP SECURED',
  },
  {
    id: 'bank',
    label: '1Link 1Bill PSID Voucher',
    note: '18-digit PSID voucher payable via any Pakistani ATM or Banking App',
    type: 'bank',
    badge: '1LINK NETWORK',
  },
  {
    id: 'cash_terminal',
    label: 'Cash at Terminal Ticket Bay',
    note: 'Seat held until 30 mins before departure. Pay at terminal counter bay.',
    type: 'cash',
    badge: 'PAY AT COUNTER',
  },
];

import { useSearchParams } from 'react-router-dom';

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const routeIdParam = searchParams.get('routeId');
  const [routes, setRoutes] = useState<Route[]>([]);
  const {
    step, selectedRoute, selectedBusType, seats, selectedSeats,
    currentBooking, isLoading, passengerInfo,
    setRoute, setBusType, loadSeats, setPassengerInfo, setPaymentMethod,
    confirmBooking, resetBooking, proceedToPassengerInfo, setPassengerCountLimit,
  } = useBookingStore();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PassengerForm>({
    resolver: zodResolver(passengerSchema),
    defaultValues: {
      gender: 'male',
      specialAssistance: false,
      extraLuggage: false,
    },
  });

  // Interactive Payment Gateway Modal State
  const [activePaymentModal, setActivePaymentModal] = useState<PaymentMethod | null>(null);

  const dateParam = searchParams.get('date');
  const passengersParam = searchParams.get('passengers');

  useEffect(() => {
    if (passengersParam) {
      const parsed = parseInt(passengersParam, 10);
      if (!isNaN(parsed) && parsed > 0) {
        setPassengerCountLimit(parsed);
      }
    }
  }, [passengersParam, setPassengerCountLimit]);

  useEffect(() => {
    bookingService.getRoutes().then((r) => {
      setRoutes(r.data);
      if (routeIdParam && !selectedRoute) {
        const found = r.data.find((rt) => rt.id === routeIdParam);
        if (found) {
          if (found.availableSeats === 0 || found.isAvailable === false) {
            // Cannot proceed with unavailable or sold-out trip
          } else {
            setRoute(found);
          }
        }
      }
    });
  }, [routeIdParam, selectedRoute, setRoute]);

  useEffect(() => {
    if (selectedRoute && selectedBusType) loadSeats(selectedRoute.id, selectedBusType);
  }, [selectedRoute, selectedBusType, loadSeats]);

  const { singleSeatBaseFare, subtotalBaseFare, totalTerminalFee, totalFare } = useMemo(() => {
    const baseMultiplier = selectedBusType ? BUS_TYPE_FARES[selectedBusType] : 1;
    const single = selectedRoute ? Math.round(selectedRoute.fare * baseMultiplier) : 0;
    const subtotal = single * selectedSeats.length;
    const terminalFee = 50 * selectedSeats.length;
    return {
      singleSeatBaseFare: single,
      subtotalBaseFare: subtotal,
      totalTerminalFee: terminalFee,
      totalFare: subtotal + terminalFee,
    };
  }, [selectedBusType, selectedRoute, selectedSeats.length]);

  const hasLadiesSeatSelected = useMemo(
    () => selectedSeats.some((s) => s.status === 'female'),
    [selectedSeats]
  );

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#171A1D]">
      {/* Top Header Banner - Asphalt Black */}
      <div className="bg-[#171A1D] text-[#F5F1E8] border-b border-[#343A3C] py-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#20352F] border border-[#343A3C] text-[11px] font-mono text-[#C79A45] mb-2 uppercase tracking-wider">
                <Bus className="w-3.5 h-3.5" />
                <span>Online Bus Ticketing</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#F5F1E8]">
                Book Bus Seats
              </h1>
              <p className="text-sm text-[#DDD5C5]/90 mt-1">
                Choose your route and seats to get an instant digital boarding pass.
              </p>
            </div>

            {selectedRoute && (
              <div className="p-3 rounded-xl bg-[#22272A] border border-[#343A3C] text-right font-mono text-xs">
                <span className="text-[#A9A59B] block text-[10px]">SELECTED ROUTE</span>
                <span className="font-bold text-[#C79A45] text-sm">{selectedRoute.from} → {selectedRoute.to}</span>
                <span className="text-[#A9A59B] block">Dep: {selectedRoute.departureTime}</span>
                {dateParam && (
                  <span className="text-[11px] text-[#5F8F72] block mt-0.5">Date: {dateParam}</span>
                )}
                {passengersParam && (
                  <span className="text-[10px] text-[#A9A59B] block">Seats: {passengersParam}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-10 max-w-4xl">
        {/* Step Progress Stepper */}
        <BookingStepIndicator currentStep={step} steps={steps} />

        {/* Main Step Content Card - Warm Paper Surface */}
        <div className="card-warm p-6 sm:p-8 rounded-2xl border border-[#DDD5C5] shadow-card-warm">
          {/* STEP 1: ROUTE SELECTION */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD5C5]">
                <div>
                  <h2 className="text-xl font-display font-bold text-[#171A1D]">Select Route</h2>
                  <p className="text-xs text-[#66635C]">Daily schedules with live seat availability</p>
                </div>
                <span className="text-xs font-mono font-medium text-[#20352F]">
                  {routes.length} Active Routes
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {routes.map((route) => {
                  const isRouteAvailable = route.isAvailable !== false && route.availableSeats > 0;
                  return (
                    <button
                      key={route.id}
                      type="button"
                      disabled={!isRouteAvailable}
                      onClick={isRouteAvailable ? () => setRoute(route) : undefined}
                      className={`w-full p-4 rounded-xl text-left transition-all border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isRouteAvailable
                          ? 'bg-white hover:bg-[#FAF6ED] border-[#DDD5C5] hover:border-[#C79A45] shadow-sm hover:shadow-card-warm cursor-pointer group'
                          : 'bg-[#FAF7F1]/60 border-[#DDD5C5]/60 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-base text-[#171A1D]">
                            {route.from} <span className="text-[#C79A45] mx-1">⇄</span> {route.to}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#20352F] text-[#C79A45]">
                            {route.luxuryLevel}
                          </span>
                          {route.operatorName && (
                            <span className="text-xs text-[#66635C] font-mono">
                              • {route.operatorName}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#66635C] font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#C79A45]" /> {route.departureTime} - {route.arrivalTime}
                          </span>
                          <span>•</span>
                          {isRouteAvailable ? (
                            <span className="text-[#5F8F72] font-semibold">{route.availableSeats} Seats Open</span>
                          ) : (
                            <span className="text-[#D64545] font-semibold">Fully Booked / Unavailable</span>
                          )}
                        </div>
                      </div>

                      <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-[#DDD5C5]/60">
                        <span className="text-base sm:text-lg font-bold font-mono text-[#C79A45]">
                          {formatCurrency(route.fare)}
                        </span>
                        {isRouteAvailable ? (
                          <span className="text-xs text-[#20352F] font-medium group-hover:underline flex items-center gap-1">
                            Select Route <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="text-xs text-[#D64545] font-medium">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: BUS TYPE SELECTION */}
          {step === 2 && selectedRoute && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD5C5]">
                <div>
                  <h2 className="text-xl font-display font-bold text-[#171A1D]">Choose Coach Class</h2>
                  <p className="text-xs text-[#66635C]">
                    Route: <strong className="text-[#171A1D]">{selectedRoute.from} → {selectedRoute.to}</strong> ({selectedRoute.departureTime})
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => useBookingStore.setState({ step: 1 })}
                  className="!text-xs !bg-transparent !border-[#DDD5C5] !text-[#171A1D]"
                >
                  <ArrowLeft className="w-3 h-3 mr-1" /> Change Route
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {busTypes.map(({ type, label, desc, multiplier }) => {
                  const fare = Math.round(selectedRoute.fare * multiplier);
                  const isCurrent = selectedBusType === type;

                  return (
                    <button
                      key={type}
                      onClick={() => setBusType(type)}
                      className={`p-5 rounded-xl text-left transition-all border flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-[#20352F] text-[#F5F1E8] border-[#C79A45] ring-2 ring-[#C79A45]/30 shadow-card-warm'
                          : 'bg-white hover:bg-[#FAF6ED] text-[#171A1D] border-[#DDD5C5] hover:border-[#C79A45]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-display font-bold text-base">{label}</h3>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${isCurrent ? 'bg-[#C79A45] text-[#171A1D] font-bold' : 'bg-[#FAF7F1] text-[#20352F] border border-[#DDD5C5]'}`}>
                            {multiplier === 1 ? 'Base Fare' : `+${Math.round((multiplier - 1) * 100)}%`}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed mb-4 ${isCurrent ? 'text-[#A9A59B]' : 'text-[#66635C]'}`}>
                          {desc}
                        </p>
                      </div>

                      <div className={`pt-3 border-t flex items-center justify-between ${isCurrent ? 'border-[#343A3C]' : 'border-[#DDD5C5]'}`}>
                        <span className="text-xs uppercase font-mono tracking-wider opacity-70">Fare per seat</span>
                        <span className={`text-lg font-bold font-mono ${isCurrent ? 'text-[#C79A45]' : 'text-[#20352F]'}`}>
                          {formatCurrency(fare)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: SEAT SELECTION */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD5C5]">
                <div>
                  <h2 className="text-xl font-display font-bold text-[#171A1D]">Select Seats</h2>
                  <p className="text-xs text-[#66635C]">
                    Click on available seats to select. Selected seats are highlighted in gold.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => useBookingStore.setState({ step: 2 })}
                  className="!text-xs !bg-transparent !border-[#DDD5C5] !text-[#171A1D]"
                >
                  <ArrowLeft className="w-3 h-3 mr-1" /> Back to Classes
                </Button>
              </div>

              {/* Configurable vehicle blueprint layout */}
              <SeatSelection
                seats={seats}
                route={selectedRoute}
                targetPassengers={passengersParam ? parseInt(passengersParam, 10) : 1}
              />

              <div className="pt-4 border-t border-[#DDD5C5] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-[#66635C] block">Total Fare</span>
                  <span className="text-2xl font-bold font-mono text-[#C79A45]">
                    {formatCurrency(totalFare)}
                  </span>
                  <span className="text-[11px] text-[#A9A59B] block font-mono">
                    ({selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} × {selectedRoute && selectedBusType ? formatCurrency(Math.round(selectedRoute.fare * BUS_TYPE_FARES[selectedBusType])) : '0'})
                  </span>
                </div>

                <Button
                  size="lg"
                  disabled={selectedSeats.length === 0 || isLoading}
                  onClick={async () => {
                    await proceedToPassengerInfo();
                  }}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Holding Seats...</span>
                    </span>
                  ) : (
                    <>
                      <span>Continue to Passenger Details</span>
                      <ChevronRight className="w-4 h-4 ml-1.5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: PASSENGER INFORMATION */}
          {step === 4 && (
            <form onSubmit={handleSubmit((data: PassengerForm) => setPassengerInfo(data))} className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD5C5]">
                <div>
                  <h2 className="text-xl font-display font-bold text-[#171A1D]">Passenger Information</h2>
                  <p className="text-xs text-[#66635C]">
                    Required for ticket issuance and passenger manifest
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => useBookingStore.setState({ step: 3 })}
                  className="!text-xs !bg-transparent !border-[#DDD5C5] !text-[#171A1D]"
                >
                  <ArrowLeft className="w-3 h-3 mr-1" /> Change Seats
                </Button>
              </div>

              {/* NADRA Privacy & Verification Banner */}
              <div className="p-3.5 rounded-xl bg-white border border-[#DDD5C5] flex items-start gap-3 text-xs">
                <ShieldCheck className="w-5 h-5 text-[#5F8F72] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-[#171A1D]">Passenger Verification & Privacy</p>
                  <p className="text-[#66635C] text-[11px] leading-relaxed">
                    CNIC is required for terminal departure verification under transport regulations. For your privacy, CNIC numbers are masked on all tickets.
                  </p>
                </div>
              </div>

              {hasLadiesSeatSelected && (
                <div className="p-3.5 rounded-xl bg-[#FAF0ED] border border-[#E8B4A8] flex items-start gap-3 text-xs text-[#8A3828]">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#B85C4A]" />
                  <div>
                    <strong className="block font-bold">Operator Ladies Quota Policy Active</strong>
                    <span>
                      You have selected seats in the designated Ladies/Family row ({selectedRoute?.operatorPolicy?.ladiesQuotaRows?.join(', ') || 'Rows A & B'}). As per operator regulations, these seats are reserved for female passengers or accompanying families.
                    </span>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {/* CNIC Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#20352F]">
                      Pakistani CNIC Number *
                    </label>
                    <span className="text-[10px] font-mono text-[#5F8F72] flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Masked in Manifest
                    </span>
                  </div>
                  <input
                    placeholder="35201-1234567-1"
                    maxLength={15}
                    {...register('cnic', {
                      onChange: (e) => {
                        const formatted = formatCNICInput(e.target.value);
                        setValue('cnic', formatted);
                      },
                    })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD5C5] text-[#171A1D] text-sm font-mono focus:outline-none focus:border-[#C79A45] focus:ring-1 focus:ring-[#C79A45]"
                  />
                  {errors.cnic?.message && (
                    <p className="text-xs text-[#B85C4A] font-medium">{errors.cnic.message}</p>
                  )}
                  <p className="text-[10px] text-[#66635C]">Format: 13 digits with hyphens (e.g. 35201-1234567-1)</p>
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#20352F]">
                    Full Passenger Name *
                  </label>
                  <input
                    placeholder="Muhammad Bilal"
                    {...register('fullName')}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD5C5] text-[#171A1D] text-sm focus:outline-none focus:border-[#C79A45] focus:ring-1 focus:ring-[#C79A45]"
                  />
                  {errors.fullName?.message && (
                    <p className="text-xs text-[#B85C4A] font-medium">{errors.fullName.message}</p>
                  )}
                  <p className="text-[10px] text-[#66635C]">Must match government-issued identity card</p>
                </div>

                {/* Mobile Phone */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#20352F]">
                    Mobile Phone (WhatsApp / SMS) *
                  </label>
                  <input
                    placeholder="03001234567"
                    maxLength={11}
                    {...register('mobile')}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD5C5] text-[#171A1D] text-sm font-mono focus:outline-none focus:border-[#C79A45] focus:ring-1 focus:ring-[#C79A45]"
                  />
                  {errors.mobile?.message && (
                    <p className="text-xs text-[#B85C4A] font-medium">{errors.mobile.message}</p>
                  )}
                  <p className="text-[10px] text-[#66635C]">E-ticket QR code and departure SMS will be sent here</p>
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#20352F]">
                    Gender *
                  </label>
                  <select
                    {...register('gender')}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD5C5] text-[#171A1D] text-sm focus:outline-none focus:border-[#C79A45] focus:ring-1 focus:ring-[#C79A45]"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <p className="text-[10px] text-[#66635C]">Required for seat reservation & ladies quota policy compliance</p>
                </div>

                {/* Emergency Contact */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#20352F]">
                    Emergency Contact Number *
                  </label>
                  <input
                    placeholder="03219876543 (Relative / Guardian)"
                    maxLength={11}
                    {...register('emergencyContact')}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD5C5] text-[#171A1D] text-sm font-mono focus:outline-none focus:border-[#C79A45] focus:ring-1 focus:ring-[#C79A45]"
                  />
                  {errors.emergencyContact?.message && (
                    <p className="text-xs text-[#B85C4A] font-medium">{errors.emergencyContact.message}</p>
                  )}
                  <p className="text-[10px] text-[#66635C]">Immediate relative or guardian reachable in emergencies</p>
                </div>

                {/* Optional Operator Preferences */}
                <div className="md:col-span-2 pt-2 border-t border-[#DDD5C5]/60 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#20352F] block">
                    Additional Journey Preferences
                  </span>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <label className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-[#DDD5C5] cursor-pointer hover:border-[#C79A45]">
                      <input
                        type="checkbox"
                        {...register('extraLuggage')}
                        className="mt-0.5 rounded text-[#20352F] focus:ring-[#C79A45]"
                      />
                      <div className="text-xs">
                        <span className="font-semibold text-[#171A1D] block">Extra Luggage Allowance</span>
                        <span className="text-[#66635C] text-[11px]">Cargo tag for baggage exceeding standard 20kg</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-[#DDD5C5] cursor-pointer hover:border-[#C79A45]">
                      <input
                        type="checkbox"
                        {...register('specialAssistance')}
                        className="mt-0.5 rounded text-[#20352F] focus:ring-[#C79A45]"
                      />
                      <div className="text-xs">
                        <span className="font-semibold text-[#171A1D] block">Boarding / Ramp Assistance</span>
                        <span className="text-[#66635C] text-[11px]">Senior citizen or wheelchair boarding aid at bay</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#DDD5C5] flex justify-end">
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  <span>Continue to Payment</span>
                  <ChevronRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </form>
          )}

          {/* STEP 5: PRE-CONFIRMATION BOOKING SUMMARY & PAYMENT */}
          {step === 5 && selectedRoute && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD5C5]">
                <div>
                  <h2 className="text-xl font-display font-bold text-[#171A1D]">Review & Pay</h2>
                  <p className="text-xs text-[#66635C]">
                    Review your trip details and select a payment method
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => useBookingStore.setState({ step: 4 })}
                  className="!text-xs !bg-transparent !border-[#DDD5C5] !text-[#171A1D]"
                >
                  <ArrowLeft className="w-3 h-3 mr-1" /> Back to Passenger Info
                </Button>
              </div>

              {/* Comprehensive Pre-Confirmation Booking Summary Card */}
              <div className="p-5 rounded-2xl bg-white border border-[#DDD5C5] shadow-card-warm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DDD5C5]">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-[#A9A59B] block">ROUTE & OPERATOR</span>
                    <h3 className="text-xl font-display font-bold text-[#171A1D]">
                      {selectedRoute.from} → {selectedRoute.to}
                    </h3>
                    <p className="text-xs text-[#66635C]">
                      Operated by <strong className="text-[#20352F]">{selectedRoute.operatorName}</strong> ({selectedRoute.vehicleType})
                    </p>
                  </div>
                  <div className="sm:text-right font-mono">
                    <span className="text-xs text-[#66635C] block">Scheduled Departure</span>
                    <span className="text-lg font-bold text-[#C79A45]">{selectedRoute.departureTime}</span>
                    <span className="text-[11px] text-[#A9A59B] block">
                      Travel Date: {dateParam || new Date().toISOString().split('T')[0]}
                    </span>
                  </div>
                </div>

                {/* Terminals & Boarding Bay Details */}
                <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#FAF7F1] border border-[#DDD5C5]/60 space-y-1">
                    <span className="text-[10px] text-[#66635C] flex items-center gap-1 uppercase tracking-wider">
                      <MapPin className="w-3 h-3 text-[#C79A45]" /> Departure Terminal
                    </span>
                    <p className="font-bold text-[#171A1D]">{selectedRoute.departureTerminal || 'Central Terminal Bay'}</p>
                    <span className="text-[11px] text-[#5F8F72] block">Boarding Platform: {selectedRoute.platform || 'Bay 01'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF7F1] border border-[#DDD5C5]/60 space-y-1">
                    <span className="text-[10px] text-[#66635C] flex items-center gap-1 uppercase tracking-wider">
                      <MapPin className="w-3 h-3 text-[#20352F]" /> Arrival Terminal
                    </span>
                    <p className="font-bold text-[#171A1D]">{selectedRoute.arrivalTerminal || 'City Terminal'}</p>
                    <span className="text-[11px] text-[#A9A59B] block">Estimated Duration: {selectedRoute.duration}</span>
                  </div>
                </div>

                {/* Passenger & Masked Identity Verification */}
                <div className="p-3.5 rounded-xl bg-[#20352F]/5 border border-[#20352F]/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#171A1D]">{passengerInfo?.fullName}</span>
                      <span className="px-2 py-0.5 rounded bg-[#5F8F72]/20 text-[#20352F] text-[10px] font-mono font-bold uppercase">
                        VERIFIED IDENTITY
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#66635C] font-mono">
                      <span>CNIC: <strong>{maskCNIC(passengerInfo?.cnic || '')}</strong></span>
                      <span>•</span>
                      <span>Mobile: <strong>{maskMobile(passengerInfo?.mobile || '')}</strong></span>
                      <span>•</span>
                      <span>Gender: <strong>{passengerInfo?.gender?.toUpperCase()}</strong></span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#66635C] block uppercase">Selected Seats ({selectedSeats.length})</span>
                    <div className="flex flex-wrap gap-1.5 mt-1 justify-end">
                      {selectedSeats.map((seat) => (
                        <span key={seat.id} className="px-2.5 py-1 rounded-md bg-[#20352F] text-[#C79A45] font-mono font-bold text-xs">
                          {seat.number}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Itemized Dynamic Fare Breakdown */}
                <div className="pt-3 border-t border-[#DDD5C5] space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-[#66635C]">
                    <span>Base Fare ({selectedSeats.length} × {formatCurrency(singleSeatBaseFare)})</span>
                    <span>{formatCurrency(subtotalBaseFare)}</span>
                  </div>
                  <div className="flex justify-between text-[#66635C]">
                    <span>Terminal Fee ({selectedSeats.length} × Rs. 50)</span>
                    <span>{formatCurrency(totalTerminalFee)}</span>
                  </div>
                  <div className="flex justify-between text-[#66635C]">
                    <span>Taxes</span>
                    <span className="text-[#5F8F72]">Included</span>
                  </div>
                  <div className="border-t border-[#DDD5C5] pt-3 flex justify-between items-center font-bold text-base text-[#171A1D]">
                    <span>Total Fare</span>
                    <span className="text-xl text-[#C79A45] font-mono">{formatCurrency(totalFare)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-[#171A1D]">Select Payment Method</h3>
                  <span className="text-[11px] font-mono text-[#5F8F72] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Secure Checkout
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-3.5">
                  {paymentMethods.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => {
                        setPaymentMethod(pm.id);
                        setActivePaymentModal(pm.id);
                      }}
                      disabled={isLoading}
                      className="p-4 rounded-xl bg-white hover:bg-[#FAF6ED] border border-[#DDD5C5] hover:border-[#C79A45] text-left transition-all flex flex-col justify-between group shadow-sm hover:shadow-card-warm"
                    >
                      <div className="flex items-start justify-between w-full mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#20352F] text-[#C79A45] flex items-center justify-center shrink-0">
                            {pm.type === 'wallet' ? (
                              <Smartphone className="w-5 h-5" />
                            ) : pm.type === 'cash' ? (
                              <Banknote className="w-5 h-5" />
                            ) : pm.type === 'bank' ? (
                              <Building className="w-5 h-5" />
                            ) : (
                              <CreditCard className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[#171A1D] group-hover:text-[#20352F]">
                              {pm.label}
                            </p>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FAF7F1] text-[#20352F] border border-[#DDD5C5]">
                              {pm.badge}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#A9A59B] group-hover:text-[#C79A45]" />
                      </div>
                      <p className="text-[11px] text-[#66635C] leading-relaxed">
                        {pm.note}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* INTERACTIVE VERIFIED PAYMENT GATEWAY MODAL */}
          <PaymentGatewayModal
            activePaymentModal={activePaymentModal}
            onClose={() => setActivePaymentModal(null)}
            totalFare={totalFare}
            selectedSeats={selectedSeats}
            dateParam={dateParam}
            defaultMobile={passengerInfo?.mobile}
            defaultCardHolder={passengerInfo?.fullName}
            confirmBooking={confirmBooking}
          />

          {/* STEP 6: BOOKING CONFIRMATION & BOARDING PASS */}
          {step === 6 && currentBooking && (
            <div className="space-y-6">
              <div className="text-center max-w-md mx-auto">
                {currentBooking.paymentStatus === 'paid' ? (
                  <>
                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#5F8F72]/15 border border-[#5F8F72]/30 flex items-center justify-center">
                      <Check className="w-8 h-8 text-[#5F8F72]" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-[#171A1D]">
                      Booking Confirmed
                    </h2>
                    <p className="text-xs text-[#66635C] mt-1">
                      Your seats are reserved. An SMS confirmation with your e-ticket has been sent to your mobile.
                    </p>
                  </>
                ) : currentBooking.paymentMethod === 'cash_terminal' ? (
                  <>
                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#C79A45]/15 border border-[#C79A45]/30 flex items-center justify-center">
                      <Banknote className="w-8 h-8 text-[#C79A45]" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-[#171A1D]">
                      Seats Reserved — Pay at Terminal
                    </h2>
                    <p className="text-xs text-[#66635C] mt-1">
                      Present your reservation code at the terminal counter before departure.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#20352F]/15 border border-[#20352F]/30 flex items-center justify-center">
                      <Building className="w-8 h-8 text-[#20352F]" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-[#171A1D]">
                      1Bill Voucher Generated
                    </h2>
                    <p className="text-xs text-[#66635C] mt-1">
                      Pay using your mobile banking app or ATM under 1Bill Invoices.
                    </p>
                  </>
                )}
              </div>

              {/* Official Digital Boarding Pass */}
              <DigitalBoardingPass booking={currentBooking} />

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <Link to={`/ticket/${currentBooking.pnr || currentBooking.id}`}>
                  <Button className="flex items-center gap-2 bg-[#20352F] hover:bg-[#162521] text-[#F5F1E8] shadow-brass">
                    <Ticket className="w-4 h-4 text-[#C79A45]" />
                    <span>View Full Ticket</span>
                  </Button>
                </Link>
                <Button onClick={() => window.print()} variant="outline" className="flex items-center gap-2 !bg-white !border-[#DDD5C5] !text-[#171A1D]">
                  <Printer className="w-4 h-4" />
                  <span>Print Ticket</span>
                </Button>
                <Button variant="outline" onClick={resetBooking} className="!bg-white !border-[#DDD5C5] !text-[#171A1D]">
                  Book Another Trip
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
