import { useEffect, useState } from 'react';
import { Route, BusType } from '@/types/booking.types';
import { adminService } from '@/services/admin.service';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Clock,
  Bus,
  Plus,
  RefreshCw,
  AlertTriangle,
  XCircle,
  Edit,
  ShieldCheck,
  Search,
  CheckCircle2,
  DollarSign,
  Users,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function RoutesManagementPage() {
  const { user } = useAuthStore();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [replaceModalRoute, setReplaceModalRoute] = useState<Route | null>(null);
  const [cancelModalRoute, setCancelModalRoute] = useState<Route | null>(null);

  // Replacement Form
  const [replacementBusNumber, setReplacementBusNumber] = useState('BT-9900');
  const [replacementCapacity, setReplacementCapacity] = useState(45);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cancellation Form
  const [cancellationReason, setCancellationReason] = useState('Severe weather / Motorway fog closure');

  // Add Route Form
  const [newRouteForm, setNewRouteForm] = useState({
    from: 'Lahore',
    to: 'Rawalpindi',
    departureTime: '09:00',
    arrivalTime: '13:30',
    fare: 2800,
    busType: BusType.EXECUTIVE,
    availableSeats: 40,
    busNumber: 'BT-3321',
    platform: 'Bay 04',
    stops: 'Bhera Service Area, Kalar Kahar',
  });

  const loadRoutes = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getRoutes();
      setRoutes(res.data);
    } catch {
      toast.error('Failed to load routes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await adminService.createRoute(
        {
          ...newRouteForm,
          stops: newRouteForm.stops.split(',').map((s) => s.trim()),
          luxuryLevel: newRouteForm.busType.toLowerCase() as Route['luxuryLevel'],
          journeyType: 'intercity',
        },
        user?.role
      );
      toast.success('Route schedule created successfully');
      setShowAddModal(false);
      loadRoutes();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create route';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExecuteReplacement = async () => {
    if (!replaceModalRoute) return;
    setIsSubmitting(true);
    try {
      const res = await adminService.replaceVehicleSafely(
        replaceModalRoute.id,
        replacementBusNumber,
        replacementCapacity,
        user?.role
      );
      toast.success(
        `Bus replaced with ${replacementBusNumber}. Transferred ${res.data.remappedBookingsCount} bookings.`
      );
      setReplaceModalRoute(null);
      loadRoutes();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Replacement rejected';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExecuteCancelDeparture = async () => {
    if (!cancelModalRoute) return;
    setIsSubmitting(true);
    try {
      const res = await adminService.cancelDepartureSafely(
        cancelModalRoute.id,
        cancellationReason,
        user?.role
      );
      toast.success(
        `Departure cancelled. ${res.data.cancelledBookingsCount} bookings queued for refund.`
      );
      setCancelModalRoute(null);
      loadRoutes();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Cancellation failed';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRoutes = routes.filter(
    (r) =>
      r.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.operatorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.busNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#343A3C]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#20352F] border border-[#343A3C] text-[11px] font-mono text-[#C79A45] mb-2 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Routes & Schedules</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#F5F1E8]">
            Route Schedules
          </h1>
          <p className="text-xs text-[#A9A59B] mt-1">
            Manage routes, departure times, fares, bays, and vehicle replacements.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-[#C79A45] hover:bg-[#D9B56A] text-[#171A1D] font-bold shadow-brass flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Route</span>
        </Button>
      </div>

      {/* Search & Statistics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-[#A9A59B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Search routes, bus numbers, cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#22272A] border border-[#343A3C] text-xs text-[#F5F1E8] focus:border-[#C79A45] focus:outline-none"
          />
        </div>

        <div className="p-3 rounded-xl bg-[#22272A] border border-[#343A3C] flex items-center justify-between text-xs font-mono">
          <span className="text-[#A9A59B]">Total Routes:</span>
          <strong className="text-[#C79A45] text-sm">{routes.length} Active</strong>
        </div>
      </div>

      {/* Routes List */}
      {isLoading ? (
        <div className="p-12 text-center rounded-2xl bg-[#22272A] border border-[#343A3C] space-y-3">
          <div className="w-8 h-8 border-2 border-[#C79A45] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#A9A59B]">Loading routes...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRoutes.map((route) => {
            const isDelayed = route.status === 'delayed';

            return (
              <div
                key={route.id}
                className="rounded-2xl bg-[#22272A] border border-[#343A3C] p-5 shadow-card-dark hover:border-[#C79A45]/40 transition-all space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Route Corridor Info */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#20352F] border border-[#343A3C] flex items-center justify-center text-[#C79A45] shrink-0">
                      <Bus className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-display font-bold text-lg text-[#F5F1E8]">
                          {route.from} → {route.to}
                        </h3>
                        <Badge variant={isDelayed ? 'danger' : 'success'}>
                          {route.status?.toUpperCase() || 'ON-TIME'}
                        </Badge>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171A1D] border border-[#343A3C] text-[#C79A45] uppercase">
                          {route.busType}
                        </span>
                      </div>
                      <p className="text-xs text-[#A9A59B] mt-0.5">
                        {route.operatorName || 'Daewoo Express'} • Bus Number:{' '}
                        <strong className="text-[#F5F1E8] font-mono">{route.busNumber || 'BT-4521'}</strong>
                      </p>
                      {route.stops && route.stops.length > 0 && (
                        <p className="text-[11px] text-[#A9A59B]/80 font-mono mt-1">
                          Stops: {route.stops.join(' • ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Schedule, Platform, and Fares */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-[#A9A59B] block text-[10px] uppercase">Departure</span>
                      <strong className="text-[#F5F1E8] text-sm flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#5F8F72]" /> {route.departureTime}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[#A9A59B] block text-[10px] uppercase">Departure Bay</span>
                      <strong className="text-[#C79A45] text-sm block">
                        {route.platform || 'Bay 01'}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[#A9A59B] block text-[10px] uppercase">Base Fare</span>
                      <strong className="text-[#F5F1E8] text-sm block">
                        {formatCurrency(route.fare)}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[#A9A59B] block text-[10px] uppercase">Seat Layout</span>
                      <span className="text-[#5F8F72] text-xs font-bold block">
                        {route.seatLayout || 'coach_2x2'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Administrative Dispatch Actions */}
                <div className="pt-3 border-t border-[#343A3C]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <span className="text-[11px] font-mono text-[#A9A59B]">
                    Terminal: {route.departureTerminal}
                  </span>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      size="sm"
                      onClick={() => setReplaceModalRoute(route)}
                      className="text-xs bg-[#20352F] hover:bg-[#2C4941] text-[#C79A45] border border-[#343A3C] flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#5F8F72]" />
                      <span>Replace Bus</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => setCancelModalRoute(route)}
                      className="text-xs bg-[#B85C4A]/10 hover:bg-[#B85C4A]/20 text-[#B85C4A] border border-[#B85C4A]/30 flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel Departure</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SAFE REPLACEMENT VEHICLE MODAL */}
      {replaceModalRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#22272A] border border-[#343A3C] p-6 space-y-5 text-[#F5F1E8]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5F8F72]/20 text-[#5F8F72] flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base">
                  Replace Bus for Route
                </h3>
                <p className="text-xs text-[#A9A59B]">
                  Route: {replaceModalRoute.from} → {replaceModalRoute.to} ({replaceModalRoute.departureTime})
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#171A1D] border border-[#343A3C] text-xs space-y-2">
              <div className="flex items-center gap-2 text-[#C79A45] font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Booking Safeguard</span>
              </div>
              <p className="text-[11px] text-[#A9A59B] leading-relaxed">
                All confirmed passenger reservations will be moved to the replacement bus automatically.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#A9A59B] font-mono uppercase block mb-1">
                  Replacement Bus Plate *
                </label>
                <input
                  value={replacementBusNumber}
                  onChange={(e) => setReplacementBusNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. BT-9922"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#171A1D] border border-[#343A3C] text-xs font-mono text-[#F5F1E8] focus:border-[#C79A45] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#A9A59B] font-mono uppercase block mb-1">
                  Seating Capacity *
                </label>
                <input
                  type="number"
                  value={replacementCapacity}
                  onChange={(e) => setReplacementCapacity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#171A1D] border border-[#343A3C] text-xs font-mono text-[#F5F1E8] focus:border-[#C79A45] focus:outline-none"
                />
                <span className="text-[10px] text-[#A9A59B] mt-1 block">
                  Must be at least equal to booked passenger count
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#343A3C]">
              <Button size="sm" variant="ghost" onClick={() => setReplaceModalRoute(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleExecuteReplacement}
                disabled={isSubmitting}
                className="bg-[#5F8F72] hover:bg-[#4E7A60] text-[#171A1D] font-bold"
              >
                {isSubmitting ? 'Transferring...' : 'Confirm Replacement'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL DEPARTURE MODAL */}
      {cancelModalRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#22272A] border border-[#B85C4A]/40 p-6 space-y-5 text-[#F5F1E8]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B85C4A]/20 text-[#B85C4A] flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[#B85C4A]">
                  Cancel Departure
                </h3>
                <p className="text-xs text-[#A9A59B]">
                  Route: {cancelModalRoute.from} → {cancelModalRoute.to} ({cancelModalRoute.departureTime})
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <label className="text-[#A9A59B] font-mono uppercase block">
                Reason for Cancellation *
              </label>
              <select
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#171A1D] border border-[#343A3C] text-xs text-[#F5F1E8] focus:border-[#C79A45] focus:outline-none"
              >
                <option value="Severe weather / Motorway fog closure">Severe weather / Motorway fog closure</option>
                <option value="Mechanical breakdown with no standby replacement">Mechanical breakdown with no standby replacement</option>
                <option value="National Highway Authority road diversion">National Highway Authority road diversion</option>
                <option value="Administrative service consolidation">Administrative service consolidation</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#343A3C]">
              <Button size="sm" variant="ghost" onClick={() => setCancelModalRoute(null)}>
                Keep Departure
              </Button>
              <Button
                size="sm"
                onClick={handleExecuteCancelDeparture}
                disabled={isSubmitting}
                className="bg-[#B85C4A] hover:bg-[#A34B3A] text-white font-bold"
              >
                {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW ROUTE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-2xl bg-[#22272A] border border-[#343A3C] p-6 space-y-5 text-[#F5F1E8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#343A3C]">
              <h3 className="font-display font-bold text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#C79A45]" /> Add New Route
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#A9A59B] hover:text-[#F5F1E8]">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoute} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A9A59B] block mb-1">Origin City *</label>
                  <input
                    value={newRouteForm.from}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, from: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#171A1D] border border-[#343A3C] text-[#F5F1E8]"
                  />
                </div>
                <div>
                  <label className="text-[#A9A59B] block mb-1">Destination City *</label>
                  <input
                    value={newRouteForm.to}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, to: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#171A1D] border border-[#343A3C] text-[#F5F1E8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#A9A59B] block mb-1">Departure Time *</label>
                  <input
                    value={newRouteForm.departureTime}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, departureTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#171A1D] border border-[#343A3C] text-[#F5F1E8] font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#A9A59B] block mb-1">Arrival Time *</label>
                  <input
                    value={newRouteForm.arrivalTime}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, arrivalTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#171A1D] border border-[#343A3C] text-[#F5F1E8] font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#A9A59B] block mb-1">Fare (PKR) *</label>
                  <input
                    type="number"
                    value={newRouteForm.fare}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, fare: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#171A1D] border border-[#343A3C] text-[#F5F1E8] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#A9A59B] block mb-1">Class Tier *</label>
                  <select
                    value={newRouteForm.busType}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, busType: e.target.value as BusType })}
                    className="w-full px-3 py-2 rounded-lg bg-[#171A1D] border border-[#343A3C] text-[#F5F1E8]"
                  >
                    <option value={BusType.EXECUTIVE}>Executive</option>
                    <option value={BusType.BUSINESS}>Business</option>
                    <option value={BusType.STANDARD}>Standard</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#A9A59B] block mb-1">Bus Number *</label>
                  <input
                    value={newRouteForm.busNumber}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, busNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#171A1D] border border-[#343A3C] text-[#F5F1E8] font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#A9A59B] block mb-1">Departure Bay *</label>
                  <input
                    value={newRouteForm.platform}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, platform: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#171A1D] border border-[#343A3C] text-[#F5F1E8]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#A9A59B] block mb-1">Intermediate Stops (comma-separated)</label>
                <input
                  value={newRouteForm.stops}
                  onChange={(e) => setNewRouteForm({ ...newRouteForm, stops: e.target.value })}
                  placeholder="e.g. Bhera, Sukkur, Hyderabad"
                  className="w-full px-3 py-2 rounded-lg bg-[#171A1D] border border-[#343A3C] text-[#F5F1E8]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#343A3C]">
                <Button size="sm" variant="ghost" type="button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" disabled={isSubmitting} className="bg-[#C79A45] text-[#171A1D] font-bold">
                  {isSubmitting ? 'Saving...' : 'Save Route'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
