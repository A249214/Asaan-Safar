import { useEffect, useState, useCallback } from 'react';
import { Booking } from '@/types/booking.types';
import { UserRole } from '@/types/auth.types';
import { adminService } from '@/services/admin.service';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Ticket,
  Search,
  Filter,
  UserCheck,
  XCircle,
  Download,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Bus,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function BookingsManagementPage() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<(Booking & { isCnicMasked: boolean; isPhoneMasked: boolean })[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'unpaid' | 'cancelled'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Supervisor Action Modal
  const [overrideModalBooking, setOverrideModalBooking] = useState<Booking | null>(null);
  const [overrideAction, setOverrideAction] = useState<'confirm' | 'cancel' | 'refund'>('refund');
  const [overrideReason, setOverrideReason] = useState('Customer terminal counter cancellation request');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getAdminBookings(user?.role);
      setBookings(res.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load bookings';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleCheckIn = async (idOrPnr: string) => {
    try {
      const res = await adminService.checkInPassenger(idOrPnr, user?.role);
      toast.success(res.message);
      loadBookings();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Check-in failed';
      toast.error(msg);
    }
  };

  const handleExecuteSupervisorOverride = async () => {
    if (!overrideModalBooking) return;
    setIsSubmitting(true);
    try {
      await adminService.supervisorOverrideBooking(
        overrideModalBooking.id,
        overrideAction,
        overrideReason,
        user?.role
      );
      toast.success(`Booking ${overrideModalBooking.pnr} status updated to ${overrideAction.toUpperCase()}!`);
      setOverrideModalBooking(null);
      loadBookings();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Override failed';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const csvHeader = 'PNR,PassengerName,CNIC,Mobile,Route,Seats,DepartureTime,TravelDate,Fare,PaymentStatus,BookingStatus\n';
    const csvRows = filteredBookings
      .map(
        (b) =>
          `"${b.pnr}","${b.passengerInfo.fullName}","${b.passengerInfo.cnic}","${b.passengerInfo.mobile}","${b.routeName}","${b.seats.map((s) => s.number).join(' ')}","${b.departureTime}","${b.travelDate}","${b.totalFare}","${b.paymentStatus}","${b.status}"`
      )
      .join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Asaan_Safar_Bookings_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success('Bookings exported to CSV');
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.pnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.passengerInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.passengerInfo.mobile && b.passengerInfo.mobile.includes(searchTerm));

    if (!matchesSearch) return false;

    if (statusFilter === 'confirmed') return b.status === 'confirmed' && b.paymentStatus === 'paid';
    if (statusFilter === 'unpaid') return b.paymentStatus === 'unpaid';
    if (statusFilter === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed' && b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalFare, 0);

  const isConductor = user?.role === UserRole.CONDUCTOR;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#343A3C]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#20352F] border border-[#343A3C] text-[11px] font-mono text-[#C79A45] mb-2 uppercase tracking-wider">
            <Ticket className="w-3.5 h-3.5" />
            <span>Bookings Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#F5F1E8]">
            Bookings
          </h1>
          <p className="text-xs text-[#A9A59B] mt-1">
            Search reservations, perform passenger check-in, and manage bookings.
          </p>
        </div>

        <Button
          onClick={handleExportCSV}
          className="bg-[#20352F] hover:bg-[#2C4941] text-[#C79A45] border border-[#343A3C] shadow-sm flex items-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4 text-[#5F8F72]" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Role-Based PII Disclosure Banner */}
      <div className="p-3.5 rounded-xl bg-[#22272A] border border-[#343A3C] flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          {isConductor ? (
            <ShieldAlert className="w-4 h-4 text-[#C79A45] shrink-0" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-[#5F8F72] shrink-0" />
          )}
          <span className="text-[#A9A59B]">
            {isConductor ? (
              <>
                <strong className="text-[#C79A45]">Conductor Mode:</strong> Passenger CNIC & mobile numbers are masked for privacy.
              </>
            ) : (
              <>
                <strong className="text-[#5F8F72]">Admin Mode:</strong> Full booking records with unmasked details.
              </>
            )}
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#A9A59B] px-2 py-0.5 rounded bg-[#171A1D] uppercase">
          Role: {user?.role || 'Guest'}
        </span>
      </div>

      {/* Operational KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#22272A] border border-[#343A3C]">
          <span className="text-[11px] font-mono text-[#A9A59B] uppercase block">Total Bookings</span>
          <strong className="text-xl font-bold font-mono text-[#F5F1E8]">{bookings.length}</strong>
        </div>
        <div className="p-4 rounded-xl bg-[#22272A] border border-[#343A3C]">
          <span className="text-[11px] font-mono text-[#A9A59B] uppercase block">Confirmed</span>
          <strong className="text-xl font-bold font-mono text-[#5F8F72]">
            {bookings.filter((b) => b.status === 'confirmed' && b.paymentStatus === 'paid').length}
          </strong>
        </div>
        <div className="p-4 rounded-xl bg-[#22272A] border border-[#343A3C]">
          <span className="text-[11px] font-mono text-[#A9A59B] uppercase block">Unpaid</span>
          <strong className="text-xl font-bold font-mono text-[#C79A45]">
            {bookings.filter((b) => b.paymentStatus === 'unpaid').length}
          </strong>
        </div>
        <div className="p-4 rounded-xl bg-[#22272A] border border-[#343A3C]">
          <span className="text-[11px] font-mono text-[#A9A59B] uppercase block">Total Revenue</span>
          <strong className="text-lg font-bold font-mono text-[#F5F1E8] truncate block">
            {formatCurrency(totalRevenue)}
          </strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#A9A59B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Search by PNR, passenger name, route, or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#22272A] border border-[#343A3C] text-[#F5F1E8] focus:border-[#C79A45] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs">
          {[
            { id: 'all', label: 'All Bookings' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'unpaid', label: 'Unpaid / Counter' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-[#C79A45] text-[#171A1D]'
                  : 'bg-[#22272A] border border-[#343A3C] text-[#A9A59B] hover:text-[#F5F1E8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Manifest Table */}
      <div className="rounded-2xl bg-[#22272A] border border-[#343A3C] shadow-card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#343A3C] bg-[#171A1D]/80 text-[#A9A59B] font-mono uppercase text-[10px]">
                <th className="py-3 px-4">PNR / Ref</th>
                <th className="py-3 px-4">Passenger</th>
                <th className="py-3 px-4">Route & Dep</th>
                <th className="py-3 px-4">Seats</th>
                <th className="py-3 px-4">Fare (PKR)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#343A3C]/60 font-mono">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#A9A59B]">
                    No bookings found matching current search or filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const isPaid = b.paymentStatus === 'paid' && b.status === 'confirmed';
                  const isUnpaid = b.paymentStatus === 'unpaid';
                  const isCancelled = b.status === 'cancelled';

                  return (
                    <tr key={b.id} className="hover:bg-[#20352F]/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <strong className="text-[#C79A45] text-sm block">{b.pnr}</strong>
                        <span className="text-[10px] text-[#A9A59B] block">{b.id}</span>
                      </td>

                      <td className="py-3.5 px-4 font-sans">
                        <strong className="text-[#F5F1E8] block">{b.passengerInfo.fullName}</strong>
                        <span className="text-[11px] font-mono text-[#A9A59B]">
                          CNIC: {b.passengerInfo.cnic}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[#F5F1E8] font-bold block">{b.routeName}</span>
                        <span className="text-[11px] text-[#A9A59B] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#5F8F72]" />
                          {b.departureTime} • {b.travelDate}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-[#171A1D] border border-[#343A3C] text-[#F5F1E8] font-bold">
                          {b.seats.map((s) => s.number).join(', ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <strong className="text-[#F5F1E8]">{formatCurrency(b.totalFare)}</strong>
                        <span className="text-[10px] text-[#A9A59B] block uppercase">
                          {b.paymentMethod}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {isPaid && (
                          <span className="px-2 py-0.5 rounded bg-[#5F8F72]/20 text-[#5F8F72] text-[10px] font-bold uppercase border border-[#5F8F72]/30">
                            CONFIRMED
                          </span>
                        )}
                        {isUnpaid && (
                          <span className="px-2 py-0.5 rounded bg-[#C79A45]/20 text-[#C79A45] text-[10px] font-bold uppercase border border-[#C79A45]/30">
                            UNPAID
                          </span>
                        )}
                        {isCancelled && (
                          <span className="px-2 py-0.5 rounded bg-[#B85C4A]/20 text-[#B85C4A] text-[10px] font-bold uppercase border border-[#B85C4A]/30">
                            CANCELLED
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPaid && (
                            <Button
                              size="sm"
                              onClick={() => handleCheckIn(b.id)}
                              className="text-[10px] py-1 px-2.5 bg-[#5F8F72] hover:bg-[#4E7A60] text-[#171A1D] font-bold"
                              title="Check-In"
                            >
                              <UserCheck className="w-3 h-3 mr-1" />
                              Check-In
                            </Button>
                          )}

                          <Link to={`/ticket/${b.pnr || b.id}`} target="_blank">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[10px] py-1 px-2 border-[#343A3C] text-[#A9A59B] hover:text-[#F5F1E8]"
                              title="View Ticket"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </Link>

                          {!isCancelled && !isConductor && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setOverrideModalBooking(b)}
                              className="text-[10px] py-1 px-2 text-[#B85C4A] hover:bg-[#B85C4A]/10"
                              title="Override"
                            >
                              <XCircle className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUPERVISOR OVERRIDE MODAL */}
      {overrideModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#22272A] border border-[#343A3C] p-6 space-y-5 text-[#F5F1E8]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B85C4A]/20 text-[#B85C4A] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[#F5F1E8]">
                  Booking Override
                </h3>
                <p className="text-xs text-[#A9A59B]">
                  PNR: <strong className="text-[#C79A45]">{overrideModalBooking.pnr}</strong> • Passenger: {overrideModalBooking.passengerInfo.fullName}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#A9A59B] font-mono uppercase block mb-1">Select Action *</label>
                <select
                  value={overrideAction}
                  onChange={(e) => setOverrideAction(e.target.value as 'confirm' | 'cancel' | 'refund')}
                  className="w-full px-3 py-2 rounded-lg bg-[#171A1D] border border-[#343A3C] text-xs text-[#F5F1E8]"
                >
                  <option value="refund">Cancel & Issue Full Refund</option>
                  <option value="confirm">Confirm & Mark as Paid</option>
                  <option value="cancel">Cancel Booking (No Refund)</option>
                </select>
              </div>

              <div>
                <label className="text-[#A9A59B] font-mono uppercase block mb-1">
                  Reason for Action *
                </label>
                <input
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#171A1D] border border-[#343A3C] text-xs text-[#F5F1E8]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#343A3C]">
              <Button size="sm" variant="ghost" onClick={() => setOverrideModalBooking(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleExecuteSupervisorOverride}
                disabled={isSubmitting}
                className="bg-[#B85C4A] hover:bg-[#A34B3A] text-white font-bold"
              >
                {isSubmitting ? 'Updating...' : 'Confirm Override'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
