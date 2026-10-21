import { Booking } from '@/types/booking.types';
import { QRCodeCanvas } from './QRCodeCanvas';
import { Bus, MapPin, Calendar, Clock, User, ShieldCheck, AlertTriangle, CheckCircle, Info, Luggage, Accessibility } from 'lucide-react';
import { formatCurrency, maskCNIC, maskMobile } from '@/lib/utils';

interface DigitalBoardingPassProps {
  booking: Booking;
}

export function DigitalBoardingPass({ booking }: DigitalBoardingPassProps) {
  const isCancelled = booking.status === 'cancelled';
  const isUnpaid = booking.paymentStatus === 'unpaid';
  const isPaid = booking.paymentStatus === 'paid';
  const seatsFormatted = booking.seats?.map((s) => s.number).join(', ') || 'N/A';

  const verificationUrl =
    booking.verificationUrl ||
    `${typeof window !== 'undefined' ? window.location.origin : 'https://transitpk.asaan-safar.pk'}/verify-ticket?pnr=${booking.pnr}&token=${booking.verificationToken || 'VT-OFFICIAL'}`;

  return (
    <div className="relative max-w-2xl mx-auto rounded-3xl bg-white border border-[#DDD5C5] shadow-card-warm overflow-hidden transition-all print:shadow-none print:border-black print:rounded-none">
      {/* Void / Cancelled Stamp Overlay if cancelled */}
      {isCancelled && (
        <div className="absolute inset-0 bg-[#F5F1E8]/75 backdrop-blur-[2px] z-20 flex items-center justify-center p-6 select-none pointer-events-none">
          <div className="transform -rotate-12 border-4 border-[#B85C4A] text-[#B85C4A] px-8 py-3 rounded-2xl font-mono text-2xl md:text-3xl font-extrabold tracking-widest uppercase shadow-2xl bg-white/95">
            VOID • CANCELLED & REFUNDED
          </div>
        </div>
      )}

      {/* Unpaid Warning Banner */}
      {isUnpaid && (
        <div className="bg-[#C79A45]/15 border-b border-[#C79A45]/30 px-6 py-2.5 flex items-center justify-between text-xs text-[#171A1D] print:border-black">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-4 h-4 text-[#C79A45] shrink-0" />
            <span>PAYMENT DUE AT TERMINAL COUNTER</span>
          </div>
          <span className="font-mono text-[11px] text-[#20352F]">
            Pay at counter before: <strong className="text-[#171A1D]">{booking.departureTime || 'departure'}</strong>
          </span>
        </div>
      )}

      {/* Boarding Pass Header */}
      <div className="p-6 bg-[#171A1D] text-[#F5F1E8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:bg-black print:text-black print:border-b">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#20352F] to-[#162521] border border-[#343A3C] flex items-center justify-center text-[#C79A45] shadow-brass">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg text-[#F5F1E8]">Asaan<span className="text-[#C79A45]">Safar</span></span>
              <span className="text-[10px] font-bold text-[#5F8F72] px-1.5 py-0.5 rounded bg-[#20352F] border border-[#343A3C]">
                BOARDING PASS
              </span>
            </div>
            <p className="text-[11px] text-[#A9A59B] font-mono">
              Intercity Bus Service • Pakistan
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#A9A59B] block">
            Booking Reference / PNR
          </span>
          <span className="text-xl font-mono font-extrabold text-[#C79A45] tracking-wider">
            {booking.pnr || booking.id}
          </span>
          <span className="block text-[10px] text-[#A9A59B] font-mono">
            REF: {booking.id}
          </span>
        </div>
      </div>

      {/* Perforated divider with circular cutouts */}
      <div className="relative py-1 bg-[#FAF7F1] overflow-hidden print:hidden">
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F5F1E8] border-r border-[#DDD5C5]" />
        <div className="border-t-2 border-dashed border-[#DDD5C5] w-full" />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F5F1E8] border-l border-[#DDD5C5]" />
      </div>

      {/* Main Body */}
      <div className="p-6 sm:p-8 bg-[#FAF7F1] space-y-6">
        {/* Route & Schedule Row */}
        <div className="grid sm:grid-cols-3 gap-6 pb-6 border-b border-[#DDD5C5]/70">
          <div className="sm:col-span-2 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#66635C] block">
              ROUTE & OPERATOR
            </span>
            <h3 className="text-2xl font-display font-bold text-[#171A1D]">
              {booking.routeName}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#20352F]">
              <span className="font-semibold">{booking.operatorName || 'Daewoo Express'}</span>
              <span>•</span>
              <span className="capitalize font-mono px-2 py-0.5 rounded bg-white border border-[#DDD5C5] text-[11px]">
                {booking.busType}
              </span>
              {booking.busNumber && (
                <>
                  <span>•</span>
                  <span className="font-mono text-[#66635C]">Bus {booking.busNumber}</span>
                </>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#DDD5C5] space-y-2 text-right sm:text-right">
            <span className="text-[10px] font-mono uppercase text-[#66635C] block">
              SEATS
            </span>
            <div className="text-2xl font-display font-black text-[#171A1D] tracking-wider">
              {seatsFormatted}
            </div>
            <span className="text-[10px] text-[#5F8F72] font-semibold block">
              {booking.seats?.length || 1} Seat{(booking.seats?.length || 1) > 1 ? 's' : ''} Reserved
            </span>
          </div>
        </div>

        {/* Departure & Arrival Terminals */}
        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white border border-[#DDD5C5] space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-[#20352F]">
              <MapPin className="w-3.5 h-3.5 text-[#C79A45]" />
              <span>DEPARTURE TERMINAL</span>
            </div>
            <p className="font-semibold text-[#171A1D] text-sm">
              {booking.departureTerminal || 'Thokar Niaz Baig Central, Lahore'}
            </p>
            <div className="flex items-center gap-3 pt-1 text-[11px] text-[#66635C]">
              <span className="flex items-center gap-1 font-mono font-bold text-[#171A1D]">
                <Clock className="w-3.5 h-3.5 text-[#5F8F72]" />
                {booking.departureTime || '06:00'} HRS
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#C79A45]" />
                {booking.travelDate || 'Today'}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#DDD5C5] space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-[#20352F]">
              <MapPin className="w-3.5 h-3.5 text-[#5F8F72]" />
              <span>ARRIVAL TERMINAL</span>
            </div>
            <p className="font-semibold text-[#171A1D] text-sm">
              {booking.arrivalTerminal || 'Faizabad Terminal Bay 03, Islamabad'}
            </p>
            <p className="text-[11px] text-[#66635C] pt-1">
              Estimated travel duration
            </p>
          </div>
        </div>

        {/* Passenger Profile & QR Section */}
        <div className="grid sm:grid-cols-3 gap-6 items-center pt-2">
          {/* Passenger Details */}
          <div className="sm:col-span-2 space-y-3 text-xs">
            <div className="p-4 rounded-xl bg-white border border-[#DDD5C5] space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#66635C] block">
                PASSENGER DETAILS
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-base font-bold text-[#171A1D] block">
                    {booking.passengerInfo.fullName}
                  </span>
                  <span className="text-[11px] font-mono text-[#66635C]">
                    CNIC: <strong className="text-[#171A1D]">{maskCNIC(booking.passengerInfo.cnic)}</strong>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-[#66635C] block">
                    Mobile: {maskMobile(booking.passengerInfo.mobile)}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#FAF7F1] border border-[#DDD5C5] text-[#20352F]">
                    {booking.passengerInfo.gender || 'Verified'}
                  </span>
                </div>
              </div>

              {/* Special Badges */}
              {(booking.passengerInfo.extraLuggage || booking.passengerInfo.specialAssistance) && (
                <div className="pt-2 border-t border-[#DDD5C5]/60 flex flex-wrap gap-2">
                  {booking.passengerInfo.extraLuggage && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#20352F]/5 border border-[#20352F]/15 text-[10px] text-[#20352F] font-semibold">
                      <Luggage className="w-3 h-3 text-[#C79A45]" /> Extra Baggage
                    </span>
                  )}
                  {booking.passengerInfo.specialAssistance && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#5F8F72]/10 border border-[#5F8F72]/30 text-[10px] text-[#5F8F72] font-semibold">
                      <Accessibility className="w-3 h-3" /> Boarding Assistance
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Financial Status Banner */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white border border-[#DDD5C5] text-xs">
              <span className="font-semibold text-[#66635C]">Payment Status:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-[#171A1D]">
                  {formatCurrency(booking.totalFare)}
                </span>
                {isPaid ? (
                  <span className="px-2 py-0.5 rounded bg-[#5F8F72]/15 text-[#5F8F72] text-[10px] font-mono font-bold uppercase border border-[#5F8F72]/30">
                    PAID ({booking.paymentMethod.toUpperCase()})
                  </span>
                ) : isUnpaid ? (
                  <span className="px-2 py-0.5 rounded bg-[#C79A45]/20 text-[#C79A45] text-[10px] font-mono font-bold uppercase border border-[#C79A45]/30">
                    UNPAID RESERVATION
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-[#20352F]/10 text-[#20352F] text-[10px] font-mono font-bold uppercase">
                    {booking.paymentStatus}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* QR Code Column */}
          <div className="text-center p-4 rounded-2xl bg-white border border-[#DDD5C5] space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#66635C] block">
              E-TICKET QR CODE
            </span>
            <div className="flex justify-center">
              <QRCodeCanvas value={verificationUrl} size={135} />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-[#171A1D] block">
                {booking.pnr || booking.id}
              </span>
              <p className="text-[9px] text-[#A9A59B] leading-tight">
                Scan at the terminal gate or show to bus conductor
              </p>
            </div>
          </div>
        </div>

        {/* Boarding Notice Footer */}
        <div className="pt-4 border-t border-[#DDD5C5]/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#66635C]">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#C79A45] shrink-0" />
            <span>Please arrive at the terminal at least 15 minutes before departure.</span>
          </div>
          <span className="font-mono text-[10px] text-[#A9A59B]">
            Original CNIC required for boarding
          </span>
        </div>
      </div>
    </div>
  );
}
