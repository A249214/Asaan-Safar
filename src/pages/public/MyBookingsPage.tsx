import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { bookingService } from '@/services/booking.service';
import { Booking } from '@/types/booking.types';
import { Button } from '@/components/ui/button';
import {
  Bus,
  Calendar,
  Clock,
  Ticket,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  PlusCircle,
} from 'lucide-react';
import { formatCurrency, maskCNIC } from '@/lib/utils';

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'unpaid' | 'cancelled'>('all');

  useEffect(() => {
    bookingService.getBookings().then((res) => {
      setBookings(res.data);
      setIsLoading(false);
    });
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'confirmed') return b.status === 'confirmed' && b.paymentStatus === 'paid';
    if (filter === 'unpaid') return b.paymentStatus === 'unpaid';
    if (filter === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F5F1E8] py-10 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDD5C5]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#20352F]/10 border border-[#20352F]/20 text-xs font-mono text-[#20352F] mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C79A45]" />
              <span>My Bookings</span>
            </div>
            <h1 className="text-3xl font-display font-black text-[#171A1D]">
              My Bookings
            </h1>
            <p className="text-xs text-[#66635C] mt-1 font-mono">
              {isAuthenticated ? `Logged in as ${user?.name} (${user?.email})` : 'Recent Bookings'}
            </p>
          </div>

          <Link to="/booking">
            <Button className="bg-[#20352F] hover:bg-[#162521] text-[#F5F1E8] shadow-brass text-xs">
              <PlusCircle className="w-4 h-4 mr-1.5 text-[#C79A45]" /> Book a Seat
            </Button>
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: `All (${bookings.length})` },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'unpaid', label: 'Pay at Terminal' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-[#20352F] text-[#F5F1E8] shadow-sm'
                  : 'bg-white border border-[#DDD5C5] text-[#66635C] hover:text-[#171A1D]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#DDD5C5] space-y-3">
            <div className="w-10 h-10 border-3 border-[#C79A45] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-[#171A1D]">Loading bookings...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredBookings.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#DDD5C5] shadow-card-warm space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF7F1] border border-[#DDD5C5] flex items-center justify-center text-[#A9A59B] mx-auto">
              <Ticket className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-display font-bold text-[#171A1D]">
              No Bookings Found
            </h3>
            <p className="text-xs text-[#66635C] max-w-sm mx-auto">
              You do not have any bookings matching this filter.
            </p>
            <Button
              onClick={() => navigate('/booking')}
              className="bg-[#20352F] hover:bg-[#162521] text-[#F5F1E8] text-xs shadow-brass"
            >
              Find a Bus
            </Button>
          </div>
        )}

        {/* Bookings List */}
        {!isLoading && filteredBookings.length > 0 && (
          <div className="space-y-4">
            {filteredBookings.map((b) => {
              const isPaid = b.paymentStatus === 'paid' && b.status === 'confirmed';
              const isUnpaid = b.paymentStatus === 'unpaid';
              const isCancelled = b.status === 'cancelled';

              return (
                <div
                  key={b.id}
                  className="rounded-3xl bg-white border border-[#DDD5C5] shadow-card-warm p-6 space-y-4 hover:border-[#C79A45] transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DDD5C5]/70">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#20352F]/10 border border-[#20352F]/20 flex items-center justify-center text-[#20352F]">
                        <Bus className="w-5 h-5 text-[#C79A45]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-base text-[#171A1D]">
                            {b.routeName}
                          </h3>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#FAF7F1] border border-[#DDD5C5] text-[#20352F]">
                            {b.busType}
                          </span>
                        </div>
                        <p className="text-xs text-[#66635C]">{b.operatorName || 'Daewoo Express'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isPaid && (
                        <span className="px-2.5 py-1 rounded-full bg-[#5F8F72]/15 text-[#5F8F72] text-[10px] font-mono font-bold uppercase border border-[#5F8F72]/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> CONFIRMED
                        </span>
                      )}
                      {isUnpaid && (
                        <span className="px-2.5 py-1 rounded-full bg-[#C79A45]/20 text-[#C79A45] text-[10px] font-mono font-bold uppercase border border-[#C79A45]/30 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> PAY AT TERMINAL
                        </span>
                      )}
                      {isCancelled && (
                        <span className="px-2.5 py-1 rounded-full bg-[#B85C4A]/15 text-[#B85C4A] text-[10px] font-mono font-bold uppercase border border-[#B85C4A]/30 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> CANCELLED
                        </span>
                      )}
                      <span className="text-xs font-mono font-bold text-[#171A1D] px-2 py-1 rounded bg-[#FAF7F1] border border-[#DDD5C5]">
                        {b.pnr || b.id}
                      </span>
                    </div>
                  </div>

                  {/* Journey details grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-[#66635C] uppercase block">Travel Date</span>
                      <p className="font-semibold text-[#171A1D] flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C79A45]" />
                        {b.travelDate || 'Today'}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-[#66635C] uppercase block">Departure</span>
                      <p className="font-semibold text-[#171A1D] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-[#5F8F72]" />
                        {b.departureTime || '06:00'}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-[#66635C] uppercase block">Passenger</span>
                      <p className="font-semibold text-[#171A1D] truncate mt-0.5">
                        {b.passengerInfo.fullName}
                      </p>
                      <span className="text-[10px] font-mono text-[#66635C]">
                        {maskCNIC(b.passengerInfo.cnic)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-[#66635C] uppercase block">Seats & Fare</span>
                      <p className="font-bold text-[#171A1D] mt-0.5">
                        Seats: {b.seats.map((s) => s.number).join(', ')}
                      </p>
                      <p className="text-[#5F8F72] font-mono font-semibold">
                        {formatCurrency(b.totalFare)}
                      </p>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-3 border-t border-[#DDD5C5]/60 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-[#66635C] font-mono">
                      Booked: {new Date(b.bookingDate).toLocaleDateString('en-PK')}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/ticket/${b.pnr || b.id}`)}
                        className="text-xs bg-[#20352F] hover:bg-[#162521] text-[#F5F1E8]"
                      >
                        <Ticket className="w-3.5 h-3.5 mr-1 text-[#C79A45]" /> View Ticket
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/verify-ticket?pnr=${b.pnr || b.id}`)}
                        className="text-xs bg-white text-[#171A1D] border-[#DDD5C5] hover:bg-[#FAF7F1]"
                      >
                        Verify Ticket
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
