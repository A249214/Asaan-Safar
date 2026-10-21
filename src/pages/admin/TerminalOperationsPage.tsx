import { useEffect, useState } from 'react';
import { TerminalPlatform, adminService } from '@/services/admin.service';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Clock,
  Bus,
  Volume2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Users,
  Building,
  Radio,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const bayStatusVariant: Record<TerminalPlatform['status'], 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  boarding: 'success',
  'on-time': 'info',
  delayed: 'danger',
  departed: 'default',
  maintenance_hold: 'warning',
};

export default function TerminalOperationsPage() {
  const { user } = useAuthStore();
  const [selectedTerminal, setSelectedTerminal] = useState('Thokar Niaz Baig Central, Lahore');
  const [platforms, setPlatforms] = useState<TerminalPlatform[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Bay Modal
  const [activeBay, setActiveBay] = useState<TerminalPlatform | null>(null);
  const [editStatus, setEditStatus] = useState<TerminalPlatform['status']>('boarding');
  const [editBus, setEditBus] = useState('');

  const loadPlatforms = async (term: string) => {
    setIsLoading(true);
    try {
      const res = await adminService.getTerminalPlatforms(term);
      setPlatforms(res.data);
    } catch {
      toast.error('Failed to load terminal bays');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlatforms(selectedTerminal);
  }, [selectedTerminal]);

  const handleUpdateBay = async () => {
    if (!activeBay) return;
    try {
      await adminService.updatePlatformBay(
        activeBay.id,
        {
          status: editStatus,
          busNumber: editBus || activeBay.busNumber,
        },
        user?.role
      );
      toast.success(`${activeBay.bayNumber} updated to ${editStatus.toUpperCase()}`);
      setActiveBay(null);
      loadPlatforms(selectedTerminal);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      toast.error(msg);
    }
  };

  const handleAnnounceCall = (bay: TerminalPlatform) => {
    toast.success(
      `📢 PA Dispatch Call: ${bay.assignedRouteName || 'All passengers'} at ${bay.bayNumber} please proceed to boarding gate!`,
      { duration: 4000 }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#343A3C]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#20352F] border border-[#343A3C] text-[11px] font-mono text-[#C79A45] mb-2 uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-[#5F8F72] animate-pulse" />
            <span>Terminal Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#F5F1E8]">
            Terminal Bay Operations
          </h1>
          <p className="text-xs text-[#A9A59B] mt-1">
            Manage departure bays, boarding status, and passenger announcements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTerminal}
            onChange={(e) => setSelectedTerminal(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[#22272A] border border-[#343A3C] text-xs font-semibold text-[#F5F1E8] focus:border-[#C79A45] focus:outline-none"
          >
            <option value="Thokar Niaz Baig Central, Lahore">Thokar Niaz Baig Central (Lahore)</option>
            <option value="Faizabad Interchange Terminal, Islamabad">Faizabad Terminal (Islamabad)</option>
          </select>
        </div>
      </div>

      {/* Terminal Station Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#22272A] border border-[#343A3C]">
          <span className="text-[11px] font-mono text-[#A9A59B] uppercase block">Total Bays</span>
          <strong className="text-xl font-bold font-mono text-[#F5F1E8]">{platforms.length} Gates</strong>
        </div>
        <div className="p-4 rounded-xl bg-[#22272A] border border-[#343A3C]">
          <span className="text-[11px] font-mono text-[#A9A59B] uppercase block">Boarding</span>
          <strong className="text-xl font-bold font-mono text-[#5F8F72]">
            {platforms.filter((p) => p.status === 'boarding').length}
          </strong>
        </div>
        <div className="p-4 rounded-xl bg-[#22272A] border border-[#343A3C]">
          <span className="text-[11px] font-mono text-[#A9A59B] uppercase block">Scheduled</span>
          <strong className="text-xl font-bold font-mono text-[#C79A45]">
            {platforms.filter((p) => p.status === 'on-time').length}
          </strong>
        </div>
        <div className="p-4 rounded-xl bg-[#22272A] border border-[#343A3C]">
          <span className="text-[11px] font-mono text-[#A9A59B] uppercase block">Maintenance</span>
          <strong className="text-xl font-bold font-mono text-[#B85C4A]">
            {platforms.filter((p) => p.status === 'maintenance_hold').length}
          </strong>
        </div>
      </div>

      {/* Platform Bays Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {platforms.map((platform) => {
          const isMaintenance = platform.status === 'maintenance_hold';
          const pctBoarded =
            platform.totalSeats > 0 ? Math.round((platform.boardedCount / platform.totalSeats) * 100) : 0;

          return (
            <div
              key={platform.id}
              className="rounded-2xl bg-[#22272A] border border-[#343A3C] p-5 shadow-card-dark hover:border-[#C79A45]/40 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Bay Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#343A3C]">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-display font-extrabold text-[#C79A45]">
                      {platform.bayNumber}
                    </span>
                    <span className="text-[11px] text-[#A9A59B] font-mono">• Bay</span>
                  </div>
                  <Badge variant={bayStatusVariant[platform.status]}>
                    {platform.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                {/* Assigned Coach & Route */}
                {isMaintenance ? (
                  <div className="py-6 text-center space-y-2">
                    <AlertTriangle className="w-8 h-8 text-[#B85C4A] mx-auto" />
                    <p className="font-semibold text-xs text-[#F5F1E8]">Bay Closed</p>
                    <p className="text-[11px] text-[#A9A59B]">Maintenance in progress</p>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs font-mono">
                    <div>
                      <span className="text-[#A9A59B] block text-[10px] uppercase">Assigned Route</span>
                      <strong className="text-[#F5F1E8] font-sans text-sm block">
                        {platform.assignedRouteName || 'Unassigned'}
                      </strong>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-[#A9A59B]">
                      <div>
                        <span>Bus Number:</span>
                        <strong className="text-[#F5F1E8] block">{platform.busNumber || 'BT-4521'}</strong>
                      </div>
                      <div>
                        <span>Driver:</span>
                        <span className="text-[#F5F1E8] block truncate">{platform.driverName || 'Assigned'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1 font-bold text-[#F5F1E8]">
                        <Clock className="w-3.5 h-3.5 text-[#5F8F72]" />
                        {platform.departureTime}
                      </span>
                      <span className="text-[10px] text-[#C79A45]">Departure</span>
                    </div>

                    {/* Boarding Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-[#A9A59B]">Boarding Progress</span>
                        <span className="font-bold text-[#5F8F72]">
                          {platform.boardedCount} / {platform.totalSeats} ({pctBoarded}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#171A1D] overflow-hidden border border-[#343A3C]">
                        <div
                          className="h-full bg-gradient-to-r from-[#C79A45] to-[#5F8F72] rounded-full transition-all duration-300"
                          style={{ width: `${pctBoarded}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#343A3C] flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setActiveBay(platform);
                    setEditStatus(platform.status);
                    setEditBus(platform.busNumber || '');
                  }}
                  className="w-1/2 text-xs bg-[#20352F] hover:bg-[#2C4941] text-[#F5F1E8] border border-[#343A3C]"
                >
                  Manage Bay
                </Button>

                {!isMaintenance && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAnnounceCall(platform)}
                    className="w-1/2 text-xs border-[#343A3C] text-[#C79A45] hover:text-[#D9B56A]"
                  >
                    <Volume2 className="w-3.5 h-3.5 mr-1" />
                    PA Announcement
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MANAGE BAY MODAL */}
      {activeBay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-[#22272A] border border-[#343A3C] p-6 space-y-4 text-[#F5F1E8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#343A3C]">
              <h3 className="font-display font-bold text-base">
                Edit {activeBay.bayNumber}
              </h3>
              <button onClick={() => setActiveBay(null)} className="text-[#A9A59B] hover:text-[#F5F1E8]">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#A9A59B] font-mono uppercase block mb-1">Bay Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as TerminalPlatform['status'])}
                  className="w-full px-3 py-2 rounded-lg bg-[#171A1D] border border-[#343A3C] text-xs text-[#F5F1E8]"
                >
                  <option value="boarding">Boarding (Gate Open)</option>
                  <option value="on-time">On-Time (Standby)</option>
                  <option value="delayed">Delayed</option>
                  <option value="departed">Departed (Clear Bay)</option>
                  <option value="maintenance_hold">Maintenance Hold (Bay Closed)</option>
                </select>
              </div>

              <div>
                <label className="text-[#A9A59B] font-mono uppercase block mb-1">Bus Number</label>
                <input
                  value={editBus}
                  onChange={(e) => setEditBus(e.target.value.toUpperCase())}
                  placeholder="e.g. BT-4521"
                  className="w-full px-3 py-2 rounded-lg bg-[#171A1D] border border-[#343A3C] text-xs font-mono text-[#F5F1E8]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#343A3C]">
              <Button size="sm" variant="ghost" onClick={() => setActiveBay(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleUpdateBay} className="bg-[#C79A45] text-[#171A1D] font-bold">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
