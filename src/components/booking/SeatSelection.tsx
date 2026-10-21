import { useEffect, useState } from 'react';
import { Seat, SeatLayoutType, Route } from '@/types/booking.types';
import { useBookingStore } from '@/stores/booking.store';
import { cn, formatCurrency } from '@/lib/utils';
import { BUS_TYPE_FARES } from '@/lib/mock-data';
import {
  Compass,
  ShieldCheck,
  DoorOpen,
  Check,
  Clock,
  AlertCircle,
  Info,
  Armchair,
  Bed,
  Car,
  Lock,
} from 'lucide-react';

interface SeatSelectionProps {
  seats: Seat[];
  route?: Route | null;
  targetPassengers?: number;
}

export function SeatSelection({ seats, route, targetPassengers = 1 }: SeatSelectionProps) {
  const { selectedSeats, toggleSeat, holdExpiresAt, selectedBusType } = useBookingStore();
  const [activeDeck, setActiveDeck] = useState<'lower' | 'upper'>('lower');
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);

  // Live Hold Expiry Countdown Timer
  useEffect(() => {
    if (!holdExpiresAt) {
      setSecondsRemaining(null);
      return;
    }
    const updateCountdown = () => {
      const left = Math.max(0, Math.floor((holdExpiresAt - Date.now()) / 1000));
      setSecondsRemaining(left);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [holdExpiresAt]);

  const layout: SeatLayoutType = route?.seatLayout || 'coach_2x2';
  const policy = route?.operatorPolicy;

  // Fare calculations
  const multiplier = selectedBusType ? BUS_TYPE_FARES[selectedBusType] : 1;
  const singleSeatFare = route ? Math.round(route.fare * multiplier) : 0;
  const totalCalculatedFare = singleSeatFare * selectedSeats.length;

  // Styling helper for seats
  const getSeatVisuals = (seat: Seat) => {
    const isSelected = selectedSeats.some((s) => s.id === seat.id);

    if (isSelected) {
      return {
        classes:
          'bg-[#C79A45] text-[#171A1D] border-[#C79A45] ring-2 ring-[#C79A45]/40 font-bold shadow-brass scale-[1.04]',
        label: 'Selected',
      };
    }

    if (seat.status === 'booked') {
      return {
        classes:
          'bg-[#22272A] text-[#A9A59B]/50 border-[#343A3C] cursor-not-allowed line-through opacity-60',
        label: 'Booked',
      };
    }

    if (seat.status === 'held') {
      return {
        classes:
          'bg-[#C79A45]/20 text-[#8C6B28] border-[#C79A45]/60 hover:border-[#C79A45] cursor-not-allowed',
        label: 'Temporarily Held',
      };
    }

    if (seat.status === 'reserved') {
      return {
        classes:
          'bg-[#EBE5D8] text-[#A9A59B] border-[#DDD5C5] cursor-not-allowed opacity-75',
        label: 'Reserved',
      };
    }

    if (seat.status === 'female') {
      return {
        classes:
          'bg-[#F9EFEA] text-[#9E4D3E] border-[#B85C4A]/50 hover:border-[#B85C4A] hover:bg-[#F5E2DC]',
        label: 'Ladies Quota',
      };
    }

    if (seat.status === 'vip') {
      return {
        classes:
          'bg-[#20352F] text-[#F5F1E8] border-[#C79A45] hover:bg-[#2C4941]',
        label: 'VIP Recliner',
      };
    }

    // Default Available
    return {
      classes:
        'bg-[#FAF7F1] text-[#171A1D] border-[#DDD5C5] hover:border-[#C79A45] hover:bg-white',
      label: 'Available',
    };
  };

  const handleKeyDown = (e: React.KeyboardEvent, seat: Seat) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleSeat(seat);
    }
  };

  // Format seconds to mm:ss
  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Operator Policy Notice Banner */}
      {policy?.policyNotice && (
        <div className="p-3.5 rounded-xl bg-[#20352F]/10 border border-[#20352F]/20 text-xs text-[#20352F] flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#C79A45] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold font-mono uppercase tracking-wider block text-[10px]">
              Seating Policy:
            </span>
            <p className="text-xs leading-relaxed">{policy.policyNotice}</p>
          </div>
        </div>
      )}

      {/* Legend & Seat Status Guide */}
      <div className="p-3.5 rounded-xl bg-[#FAF7F1] border border-[#DDD5C5] text-[#171A1D]">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#DDD5C5] text-[11px] font-mono uppercase text-[#66635C]">
          <span>Seat Legend</span>
          <span>Bus Layout</span>
        </div>
        <div className="flex gap-4 sm:gap-6 flex-wrap text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#FAF7F1] border border-[#DDD5C5]" />
            <span className="font-medium text-xs">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#C79A45] border border-[#C79A45] flex items-center justify-center text-[#171A1D]">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span className="font-bold text-xs text-[#20352F]">Your Selection</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#22272A] border border-[#343A3C]" />
            <span className="text-[#A9A59B] text-xs">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#C79A45]/20 border border-[#C79A45]/60 flex items-center justify-center">
              <Lock className="w-2.5 h-2.5 text-[#C79A45]" />
            </div>
            <span className="text-[#8C6B28] text-xs font-medium">Temporary Hold</span>
          </div>
          {policy?.allowsLadiesQuota && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#F9EFEA] border border-[#B85C4A]/50" />
              <span className="text-[#9E4D3E] text-xs font-medium">Ladies Quota</span>
            </div>
          )}
          {policy?.allowsVipSeats && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#20352F] border border-[#C79A45]" />
              <span className="text-[#20352F] text-xs font-medium">VIP Recliner</span>
            </div>
          )}
        </div>
      </div>

      {/* Temporary Hold Countdown */}
      {secondsRemaining !== null && secondsRemaining > 0 && (
        <div className="p-3 rounded-xl bg-[#C79A45]/15 border border-[#C79A45]/40 text-[#8C6B28] text-xs flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C79A45] animate-spin-slow" />
            <span>
              <strong>Seat Hold Active:</strong> Your selected seats are reserved for checkout.
            </span>
          </div>
          <span className="font-mono font-bold text-sm text-[#171A1D] px-2.5 py-0.5 rounded bg-white border border-[#C79A45]">
            {formatTimer(secondsRemaining)}
          </span>
        </div>
      )}

      {/* Sleeper Deck Switcher (for sleeper_1x1 layout) */}
      {layout === 'sleeper_1x1' && (
        <div className="flex justify-center mb-2">
          <div className="inline-flex p-1 rounded-xl bg-[#EBE5D8] border border-[#DDD5C5]">
            <button
              type="button"
              onClick={() => setActiveDeck('lower')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeDeck === 'lower'
                  ? 'bg-[#20352F] text-[#F5F1E8] shadow-xs'
                  : 'text-[#66635C] hover:text-[#171A1D]'
              }`}
            >
              Lower Deck
            </button>
            <button
              type="button"
              onClick={() => setActiveDeck('upper')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeDeck === 'upper'
                  ? 'bg-[#20352F] text-[#F5F1E8] shadow-xs'
                  : 'text-[#66635C] hover:text-[#171A1D]'
              }`}
            >
              Upper Deck
            </button>
          </div>
        </div>
      )}

      {/* Main Vehicle Chassis Blueprint Shell */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF7F1] border-2 border-[#DDD5C5] shadow-card-warm max-w-lg mx-auto relative overflow-hidden">
        {/* Exterior Bus Body Profile Header */}
        <div className="text-center pb-3 border-b border-[#DDD5C5] text-[10px] font-mono uppercase text-[#A9A59B] tracking-widest flex items-center justify-between">
          <span>FRONT</span>
          <span className="text-[#C79A45] font-bold">
            {layout === 'van_coaster'
              ? 'COASTER 14-SEATER'
              : layout === 'executive_2x1'
              ? '2+1 EXECUTIVE COACH'
              : layout === 'sleeper_1x1'
              ? 'SLEEPER COACH'
              : '2+2 STANDARD COACH'}
          </span>
          <span>TRAVEL DIRECTION ↑</span>
        </div>

        {/* Driver Area & Passenger Entrance Door */}
        <div className="py-4 my-2 border-b-2 border-dashed border-[#DDD5C5] flex items-center justify-between">
          {/* Driver Cabin */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#20352F] border border-[#343A3C] text-[#C79A45] shadow-xs">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <div className="text-left font-mono leading-tight">
              <span className="block text-[11px] font-bold">DRIVER</span>
              <span className="block text-[9px] text-[#A9A59B]">CABIN</span>
            </div>
          </div>

          {/* Passenger Entrance Door */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#DDD5C5] text-[#20352F] text-xs font-mono shadow-2xs">
            <DoorOpen className="w-4 h-4 text-[#5F8F72]" />
            <div className="text-right leading-tight">
              <span className="block text-[11px] font-bold text-[#5F8F72]">ENTRANCE</span>
              <span className="block text-[9px] text-[#66635C]">DOOR</span>
            </div>
          </div>
        </div>

        {/* Emergency Exit Callout Badge */}
        <div className="flex justify-between items-center px-1 py-1 text-[10px] font-mono text-[#A9A59B]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#5F8F72]" /> Emergency Exit
          </span>
          <span className="flex items-center gap-1">
            Emergency Exit <ShieldCheck className="w-3 h-3 text-[#5F8F72]" />
          </span>
        </div>

        {/* SEAT GRID RENDERING BY LAYOUT TYPE */}

        {/* 1. VAN / COASTER (Toyota Coaster arrangement: F1 in front, 1+2 rows, 4 rear) */}
        {layout === 'van_coaster' && (
          <div className="space-y-3 py-4">
            {/* Front Row (F1 next to driver) */}
            <div className="flex justify-end pr-2">
              {seats
                .filter((s) => s.number === 'F1')
                .map((seat) => {
                  const visuals = getSeatVisuals(seat);
                  const isSelected = selectedSeats.some((s) => s.id === seat.id);
                  const disabled = seat.status === 'booked' || seat.status === 'held';
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      role="checkbox"
                      aria-checked={isSelected}
                      aria-label={`Seat ${seat.number}, ${visuals.label}`}
                      disabled={disabled}
                      onClick={() => toggleSeat(seat)}
                      onKeyDown={(e) => handleKeyDown(e, seat)}
                      className={cn(
                        'w-11 h-11 rounded-xl text-xs font-mono font-bold transition-all border flex flex-col items-center justify-center shadow-xs focus-visible:ring-2 focus-visible:ring-[#C79A45] focus-visible:outline-none',
                        visuals.classes
                      )}
                    >
                      {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : seat.number}
                    </button>
                  );
                })}
            </div>

            {/* Middle Rows (A, B, C: 1 left, Aisle, 2 right) */}
            {['A', 'B', 'C'].map((row) => {
              const rowSeats = seats.filter((s) => s.rowName === row);
              return (
                <div key={row} className="flex items-center justify-between gap-3">
                  {/* Left Single Seat */}
                  <div className="w-12">
                    {rowSeats
                      .filter((s) => s.colIndex === 0)
                      .map((seat) => {
                        const visuals = getSeatVisuals(seat);
                        const isSelected = selectedSeats.some((s) => s.id === seat.id);
                        const disabled = seat.status === 'booked' || seat.status === 'held';
                        return (
                          <button
                            key={seat.id}
                            type="button"
                            role="checkbox"
                            aria-checked={isSelected}
                            aria-label={`Seat ${seat.number}, ${visuals.label}`}
                            disabled={disabled}
                            onClick={() => toggleSeat(seat)}
                            onKeyDown={(e) => handleKeyDown(e, seat)}
                            className={cn(
                              'w-11 h-11 rounded-xl text-xs font-mono font-bold transition-all border flex flex-col items-center justify-center shadow-xs focus-visible:ring-2 focus-visible:ring-[#C79A45] focus-visible:outline-none',
                              visuals.classes
                            )}
                          >
                            {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : seat.number}
                          </button>
                        );
                      })}
                  </div>

                  {/* Central Aisle */}
                  <div className="flex-1 text-center text-[10px] font-mono text-[#DDD5C5] tracking-widest select-none">
                    • AISLE •
                  </div>

                  {/* Right Pair */}
                  <div className="grid grid-cols-2 gap-2">
                    {rowSeats
                      .filter((s) => s.colIndex !== 0)
                      .map((seat) => {
                        const visuals = getSeatVisuals(seat);
                        const isSelected = selectedSeats.some((s) => s.id === seat.id);
                        const disabled = seat.status === 'booked' || seat.status === 'held';
                        return (
                          <button
                            key={seat.id}
                            type="button"
                            role="checkbox"
                            aria-checked={isSelected}
                            aria-label={`Seat ${seat.number}, ${visuals.label}`}
                            disabled={disabled}
                            onClick={() => toggleSeat(seat)}
                            onKeyDown={(e) => handleKeyDown(e, seat)}
                            className={cn(
                              'w-11 h-11 rounded-xl text-xs font-mono font-bold transition-all border flex flex-col items-center justify-center shadow-xs focus-visible:ring-2 focus-visible:ring-[#C79A45] focus-visible:outline-none',
                              visuals.classes
                            )}
                          >
                            {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : seat.number}
                          </button>
                        );
                      })}
                  </div>
                </div>
              );
            })}

            {/* Rear Row R: 4 seats across */}
            <div className="pt-2 border-t border-dashed border-[#DDD5C5]">
              <div className="grid grid-cols-4 gap-2">
                {seats
                  .filter((s) => s.rowName === 'R')
                  .map((seat) => {
                    const visuals = getSeatVisuals(seat);
                    const isSelected = selectedSeats.some((s) => s.id === seat.id);
                    const disabled = seat.status === 'booked' || seat.status === 'held';
                    return (
                      <button
                        key={seat.id}
                        type="button"
                        role="checkbox"
                        aria-checked={isSelected}
                        aria-label={`Seat ${seat.number}, ${visuals.label}`}
                        disabled={disabled}
                        onClick={() => toggleSeat(seat)}
                        onKeyDown={(e) => handleKeyDown(e, seat)}
                        className={cn(
                          'w-full h-11 rounded-xl text-xs font-mono font-bold transition-all border flex flex-col items-center justify-center shadow-xs focus-visible:ring-2 focus-visible:ring-[#C79A45] focus-visible:outline-none',
                          visuals.classes
                        )}
                      >
                        {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : seat.number}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* 2. EXECUTIVE 2+1 (1 left, central aisle, 2 right) */}
        {layout === 'executive_2x1' && (
          <div className="space-y-2.5 py-4">
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].map((row) => {
              const rowSeats = seats.filter((s) => s.rowName === row);
              const leftSeat = rowSeats.find((s) => s.colIndex === 0);
              const rightAisle = rowSeats.find((s) => s.colIndex === 1);
              const rightWindow = rowSeats.find((s) => s.colIndex === 2);

              return (
                <div key={row} className="flex items-center justify-between gap-3">
                  {/* Left Single Recliner */}
                  <div className="w-12">
                    {leftSeat && (
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={selectedSeats.some((s) => s.id === leftSeat.id)}
                        aria-label={`Seat ${leftSeat.number}, ${getSeatVisuals(leftSeat).label}`}
                        disabled={leftSeat.status === 'booked' || leftSeat.status === 'held'}
                        onClick={() => toggleSeat(leftSeat)}
                        onKeyDown={(e) => handleKeyDown(e, leftSeat)}
                        className={cn(
                          'w-11 h-11 rounded-xl text-xs font-mono font-bold transition-all border flex flex-col items-center justify-center shadow-xs focus-visible:ring-2 focus-visible:ring-[#C79A45] focus-visible:outline-none',
                          getSeatVisuals(leftSeat).classes
                        )}
                      >
                        {selectedSeats.some((s) => s.id === leftSeat.id) ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          leftSeat.number
                        )}
                      </button>
                    )}
                  </div>

                  {/* Central Aisle */}
                  <div className="flex-1 text-center text-[10px] font-mono text-[#DDD5C5] tracking-widest select-none">
                    • AISLE •
                  </div>

                  {/* Right Pair Recliners */}
                  <div className="grid grid-cols-2 gap-2">
                    {[rightAisle, rightWindow].filter(Boolean).map((seat) => {
                      if (!seat) return null;
                      const visuals = getSeatVisuals(seat);
                      const isSelected = selectedSeats.some((s) => s.id === seat.id);
                      const disabled = seat.status === 'booked' || seat.status === 'held';
                      return (
                        <button
                          key={seat.id}
                          type="button"
                          role="checkbox"
                          aria-checked={isSelected}
                          aria-label={`Seat ${seat.number}, ${visuals.label}`}
                          disabled={disabled}
                          onClick={() => toggleSeat(seat)}
                          onKeyDown={(e) => handleKeyDown(e, seat)}
                          className={cn(
                            'w-11 h-11 rounded-xl text-xs font-mono font-bold transition-all border flex flex-col items-center justify-center shadow-xs focus-visible:ring-2 focus-visible:ring-[#C79A45] focus-visible:outline-none',
                            visuals.classes
                          )}
                        >
                          {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : seat.number}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. SLEEPER 1+1 (Flat Berths: Left and Right separated by corridor) */}
        {layout === 'sleeper_1x1' && (
          <div className="space-y-3 py-4">
            {seats
              .filter((s) => !s.deck || s.deck === activeDeck)
              .reduce<Seat[][]>((acc, seat, i, arr) => {
                if (i % 2 === 0) acc.push(arr.slice(i, i + 2));
                return acc;
              }, [])
              .map((pair, pIdx) => (
                <div key={pIdx} className="flex items-center justify-between gap-4">
                  {/* Left Berth */}
                  {pair[0] && (
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={selectedSeats.some((s) => s.id === pair[0].id)}
                      aria-label={`Berth ${pair[0].number}, ${getSeatVisuals(pair[0]).label}`}
                      disabled={pair[0].status === 'booked' || pair[0].status === 'held'}
                      onClick={() => toggleSeat(pair[0])}
                      onKeyDown={(e) => handleKeyDown(e, pair[0])}
                      className={cn(
                        'flex-1 h-12 rounded-xl text-xs font-mono font-bold transition-all border flex items-center justify-center gap-1.5 shadow-xs focus-visible:ring-2 focus-visible:ring-[#C79A45] focus-visible:outline-none',
                        getSeatVisuals(pair[0]).classes
                      )}
                    >
                      <Bed className="w-3.5 h-3.5 opacity-70" />
                      <span>{pair[0].number}</span>
                      {selectedSeats.some((s) => s.id === pair[0].id) && (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      )}
                    </button>
                  )}

                  {/* Central Corridor */}
                  <div className="w-8 text-center text-[10px] font-mono text-[#DDD5C5] tracking-widest select-none">
                    •
                  </div>

                  {/* Right Berth */}
                  {pair[1] && (
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={selectedSeats.some((s) => s.id === pair[1].id)}
                      aria-label={`Berth ${pair[1].number}, ${getSeatVisuals(pair[1]).label}`}
                      disabled={pair[1].status === 'booked' || pair[1].status === 'held'}
                      onClick={() => toggleSeat(pair[1])}
                      onKeyDown={(e) => handleKeyDown(e, pair[1])}
                      className={cn(
                        'flex-1 h-12 rounded-xl text-xs font-mono font-bold transition-all border flex items-center justify-center gap-1.5 shadow-xs focus-visible:ring-2 focus-visible:ring-[#C79A45] focus-visible:outline-none',
                        getSeatVisuals(pair[1]).classes
                      )}
                    >
                      <Bed className="w-3.5 h-3.5 opacity-70" />
                      <span>{pair[1].number}</span>
                      {selectedSeats.some((s) => s.id === pair[1].id) && (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      )}
                    </button>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* 4. COMMON 2+2 COACH (Default luxury arrangement, 40 seats across rows A to J) */}
        {layout === 'coach_2x2' && (
          <div className="space-y-2.5 py-4">
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((row) => {
              const rowSeats = seats.filter((s) => s.rowName === row);
              const leftSeats = rowSeats.slice(0, 2);
              const rightSeats = rowSeats.slice(2, 4);

              return (
                <div key={row} className="flex items-center justify-between gap-3">
                  {/* Left Pair (Window + Aisle) */}
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    {leftSeats.map((seat) => {
                      const visuals = getSeatVisuals(seat);
                      const isSelected = selectedSeats.some((s) => s.id === seat.id);
                      const disabled = seat.status === 'booked' || seat.status === 'held';
                      return (
                        <button
                          key={seat.id}
                          type="button"
                          role="checkbox"
                          aria-checked={isSelected}
                          aria-label={`Seat ${seat.number}, ${visuals.label}`}
                          disabled={disabled}
                          onClick={() => toggleSeat(seat)}
                          onKeyDown={(e) => handleKeyDown(e, seat)}
                          className={cn(
                            'h-11 rounded-xl text-xs font-mono font-bold transition-all border flex flex-col items-center justify-center shadow-xs focus-visible:ring-2 focus-visible:ring-[#C79A45] focus-visible:outline-none',
                            visuals.classes
                          )}
                        >
                          {isSelected ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <span>{seat.number}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Central Aisle */}
                  <div className="w-6 text-center text-[10px] font-mono text-[#DDD5C5] tracking-widest select-none">
                    •
                  </div>

                  {/* Right Pair (Aisle + Window) */}
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    {rightSeats.map((seat) => {
                      const visuals = getSeatVisuals(seat);
                      const isSelected = selectedSeats.some((s) => s.id === seat.id);
                      const disabled = seat.status === 'booked' || seat.status === 'held';
                      return (
                        <button
                          key={seat.id}
                          type="button"
                          role="checkbox"
                          aria-checked={isSelected}
                          aria-label={`Seat ${seat.number}, ${visuals.label}`}
                          disabled={disabled}
                          onClick={() => toggleSeat(seat)}
                          onKeyDown={(e) => handleKeyDown(e, seat)}
                          className={cn(
                            'h-11 rounded-xl text-xs font-mono font-bold transition-all border flex flex-col items-center justify-center shadow-xs focus-visible:ring-2 focus-visible:ring-[#C79A45] focus-visible:outline-none',
                            visuals.classes
                          )}
                        >
                          {isSelected ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <span>{seat.number}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Rear Engine Bulkhead & Washroom Indicator */}
        <div className="mt-4 pt-3 border-t-2 border-dashed border-[#DDD5C5] flex items-center justify-between text-[10px] font-mono text-[#A9A59B] uppercase tracking-wider">
          <span>BACK ROW</span>
          {route?.amenities?.includes('washroom') ? (
            <span className="text-[#5F8F72] font-semibold">WASHROOM</span>
          ) : (
            <span>REAR</span>
          )}
          <span>ENGINE</span>
        </div>
      </div>

      {/* Selected Seats Summary & Fare Card */}
      <div className="p-5 rounded-2xl bg-[#20352F] border border-[#343A3C] text-[#F5F1E8] shadow-card-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Armchair className="w-4 h-4 text-[#C79A45]" />
            <span className="text-xs font-mono uppercase text-[#A9A59B]">
              Selected Seats ({selectedSeats.length} of {targetPassengers})
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-bold text-lg text-[#C79A45]">
              {selectedSeats.length > 0
                ? selectedSeats.map((s) => s.number).join(', ')
                : 'No seats selected'}
            </span>
          </div>
          {selectedSeats.length < targetPassengers && (
            <p className="text-[11px] text-[#A9A59B] mt-0.5">
              Please select {targetPassengers - selectedSeats.length} more seat
              {targetPassengers - selectedSeats.length > 1 ? 's' : ''} to continue.
            </p>
          )}
        </div>

        <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-[#343A3C]">
          <span className="text-[11px] font-mono text-[#A9A59B] block uppercase">
            Total Fare
          </span>
          <span className="text-2xl font-bold font-mono text-[#F5F1E8]">
            {formatCurrency(totalCalculatedFare)}
          </span>
          <span className="text-[10px] text-[#A9A59B] block font-mono">
            {selectedSeats.length} × {formatCurrency(singleSeatFare)}
          </span>
        </div>
      </div>
    </div>
  );
}
