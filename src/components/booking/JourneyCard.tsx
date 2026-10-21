import { Link } from 'react-router-dom';
import {
  Clock,
  MapPin,
  Star,
  Wifi,
  Zap,
  Coffee,
  Armchair,
  Tv,
  Droplets,
  DoorOpen,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Ban,
  Bus,
} from 'lucide-react';
import { Route, Amenity } from '@/types/booking.types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface JourneyCardProps {
  route: Route;
  searchDate?: string;
  passengers?: number;
}

const AMENITY_CONFIG: Record<
  Amenity,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  wifi: { label: 'Wi-Fi', icon: Wifi },
  usb_charging: { label: 'USB Port', icon: Zap },
  ac: { label: 'Air Conditioning', icon: Zap },
  reclining_seats: { label: 'Reclining Seats', icon: Armchair },
  refreshments: { label: 'Refreshments', icon: Coffee },
  multimedia: { label: 'Multimedia', icon: Tv },
  washroom: { label: 'Washroom', icon: DoorOpen },
  water: { label: 'Water Bottle', icon: Droplets },
  reading_light: { label: 'Reading Light', icon: BookOpen },
};

export function JourneyCard({ route, searchDate, passengers = 1 }: JourneyCardProps) {
  const isAvailable = route.isAvailable !== false && route.availableSeats >= passengers;
  const isSoldOut = route.availableSeats === 0;
  const isInsufficientSeats = !isSoldOut && route.availableSeats < passengers;

  // Booking target URL preserving all selected journey parameters
  const bookingParams = new URLSearchParams({
    routeId: route.id,
    ...(searchDate ? { date: searchDate } : {}),
    ...(passengers ? { passengers: String(passengers) } : {}),
  });

  const totalFare = route.fare * passengers;

  return (
    <div
      className={`card-warm p-5 sm:p-6 rounded-2xl border transition-all ${
        isAvailable
          ? 'hover:border-[#C79A45]/70 hover:shadow-card-warm'
          : 'opacity-75 bg-[#F5F1E8]/60 border-[#DDD5C5]/70'
      }`}
    >
      {/* Top Bar: Operator Name, Fleet Rating, Luxury Class & Availability */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#DDD5C5]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#20352F] border border-[#343A3C] text-[#C79A45] flex items-center justify-center font-bold text-sm shrink-0">
            {route.operatorName ? route.operatorName.charAt(0) : 'D'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base text-[#171A1D]">
                {route.operatorName || 'Daewoo Express'}
              </h3>
              {route.operatorRating && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#EBE5D8] text-[#20352F]">
                  <Star className="w-3 h-3 fill-[#C79A45] text-[#C79A45]" />
                  {route.operatorRating.toFixed(1)}
                </span>
              )}
            </div>
            <p className="text-xs text-[#66635C] font-mono mt-0.5">
              {route.vehicleType || 'Executive Bus'}
            </p>
          </div>
        </div>

        {/* Status & Luxury Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase bg-[#20352F] text-[#C79A45] border border-[#343A3C]">
            {route.luxuryLevel} Class
          </span>
          <span className="px-2.5 py-1 rounded text-[10px] font-mono font-medium uppercase bg-[#EBE5D8] text-[#20352F]">
            {route.journeyType === 'local' ? 'Urban' : 'Motorway'}
          </span>
          {isAvailable ? (
            <span className={`px-2.5 py-1 rounded text-xs font-semibold border flex items-center gap-1.5 ${
              route.availableSeats <= 4
                ? 'bg-[#C79A45]/15 text-[#8C6B28] border-[#C79A45]/30'
                : 'bg-[#5F8F72]/15 text-[#5F8F72] border-[#5F8F72]/30'
            }`}>
              <span className={`w-2 h-2 rounded-full ${route.availableSeats <= 4 ? 'bg-[#C79A45]' : 'bg-[#5F8F72]'}`} />
              {route.availableSeats <= 4 ? `Only ${route.availableSeats} Seats Left` : `${route.availableSeats} Seats Available`}
            </span>
          ) : isSoldOut ? (
            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-[#D64545]/15 text-[#D64545] border border-[#D64545]/30 flex items-center gap-1">
              <Ban className="w-3.5 h-3.5" />
              Fully Booked
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-[#C79A45]/20 text-[#8C6B28] border border-[#C79A45]/40 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Only {route.availableSeats} left (need {passengers})
            </span>
          )}
        </div>
      </div>

      {/* Middle Grid: Departure & Arrival Trajectory */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-2">
        {/* Departure Details */}
        <div className="md:col-span-4 space-y-1">
          <span className="text-[11px] font-mono text-[#66635C] uppercase block">Departure</span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#171A1D]">
              {route.departureTime}
            </span>
            <span className="text-xs font-mono font-semibold text-[#C79A45]">
              {route.platform || 'Platform TBD'}
            </span>
          </div>
          <p className="font-bold text-sm text-[#171A1D]">{route.from}</p>
          <p className="text-xs text-[#66635C] leading-tight flex items-start gap-1">
            <MapPin className="w-3 h-3 text-[#C79A45] shrink-0 mt-0.5" />
            <span>{route.departureTerminal || `${route.from} Terminal`}</span>
          </p>
        </div>

        {/* Trajectory Duration Visual */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center px-2">
          <span className="text-xs font-mono text-[#20352F] font-bold mb-1.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#C79A45]" />
            {route.duration || '4h 30m'}
          </span>
          <div className="w-full flex items-center gap-1.5 my-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#C79A45]" />
            <div className="h-[2px] flex-1 bg-[#DDD5C5] relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#FAF7F1] border border-[#C79A45] flex items-center justify-center shadow-xs">
                <Bus className="w-3 h-3 text-[#20352F]" />
              </div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#5F8F72]" />
          </div>
          <span className="text-[10px] font-mono text-[#66635C] mt-1">
            {route.journeyType === 'local' ? 'Urban Route' : 'Motorway Route'}
          </span>
        </div>

        {/* Arrival Details */}
        <div className="md:col-span-4 text-left md:text-right space-y-1">
          <span className="text-[11px] font-mono text-[#66635C] uppercase block">
            Estimated Arrival
          </span>
          <div className="flex items-baseline md:justify-end gap-2">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#171A1D]">
              {route.arrivalTime}
            </span>
          </div>
          <p className="font-bold text-sm text-[#171A1D]">{route.to}</p>
          <p className="text-xs text-[#66635C] leading-tight flex items-start md:justify-end gap-1">
            <MapPin className="w-3 h-3 text-[#5F8F72] shrink-0 mt-0.5" />
            <span>{route.arrivalTerminal || `${route.to} Terminal`}</span>
          </p>
        </div>
      </div>

      {/* Intermediate Stops Pill */}
      {route.stops && route.stops.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#DDD5C5]/80 flex flex-wrap items-center gap-1.5 text-xs text-[#66635C]">
          <span className="font-semibold text-[#20352F] text-[11px] font-mono uppercase">
            Stops:
          </span>
          <span className="truncate">{route.stops.join(' • ')}</span>
        </div>
      )}

      {/* Verified Amenities Row */}
      {route.amenities && route.amenities.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {route.amenities.map((amenity) => {
            const config = AMENITY_CONFIG[amenity];
            if (!config) return null;
            const Icon = config.icon;
            return (
              <span
                key={amenity}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF7F1] border border-[#DDD5C5] text-[11px] font-medium text-[#20352F]"
              >
                <Icon className="w-3 h-3 text-[#C79A45]" />
                <span>{config.label}</span>
              </span>
            );
          })}
        </div>
      )}

      {/* Bottom Bar: Price Breakdown & Select Seats Action */}
      <div className="mt-5 pt-4 border-t border-[#DDD5C5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <div>
            <span className="text-[10px] text-[#66635C] block uppercase font-mono">
              Per Seat Fare
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-[#C79A45]">
                {formatCurrency(route.fare)}
              </span>
              <span className="text-xs text-[#66635C] font-mono">/ passenger</span>
            </div>
          </div>

          {passengers > 1 && (
            <div className="pl-3 border-l border-[#DDD5C5]">
              <span className="text-[10px] text-[#66635C] block uppercase font-mono">
                Total ({passengers} Seats)
              </span>
              <span className="text-lg font-bold font-mono text-[#171A1D]">
                {formatCurrency(totalFare)}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div>
          {isAvailable ? (
            <Link to={`/booking?${bookingParams.toString()}`}>
              <Button
                size="md"
                className="w-full sm:w-auto px-6 text-xs font-semibold shadow-brass flex items-center justify-center gap-2"
              >
                <span>Select Seats</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : isSoldOut ? (
            <Button
              disabled
              size="md"
              variant="outline"
              className="w-full sm:w-auto px-6 text-xs font-semibold !bg-[#FAF7F1] !text-[#66635C] !border-[#DDD5C5] cursor-not-allowed opacity-60"
            >
              <span>Sold Out</span>
            </Button>
          ) : (
            <Button
              disabled
              size="md"
              variant="outline"
              className="w-full sm:w-auto px-6 text-xs font-semibold !bg-[#FAF7F1] !text-[#66635C] !border-[#DDD5C5] cursor-not-allowed opacity-60"
            >
              <span>Not Enough Seats</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
