import { TrackingMap } from '@/components/tracking/TrackingMap';
import { Badge } from '@/components/ui/badge';
import { useTrackingStore } from '@/stores/tracking.store';
import { useWebSocket } from '@/hooks/use-websocket';
import { Bell, Bus, Navigation, Clock, User, ShieldCheck, Activity } from 'lucide-react';

export default function LiveTrackingPage() {
  useWebSocket();
  const buses = useTrackingStore((s) => s.buses);
  const selectedBusId = useTrackingStore((s) => s.selectedBusId);
  const setSelectedBus = useTrackingStore((s) => s.setSelectedBus);
  const notifications = useTrackingStore((s) => s.notifications);
  const selectedBus = buses.find((b) => b.id === selectedBusId);

  return (
    <div className="min-h-screen bg-[#171A1D] text-[#F5F1E8] py-10">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#20352F] border border-[#343A3C] text-[11px] font-mono text-[#C79A45] mb-2 uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-[#5F8F72]" />
            <span>Live GPS Tracking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#F5F1E8]">
            Live Bus Tracking
          </h1>
          <p className="text-sm text-[#DDD5C5]/90 mt-1 max-w-2xl leading-relaxed">
            View real-time bus locations, route progress, and estimated arrival times across motorway routes.
          </p>
        </div>

        {/* Map & Telemetry Dashboard */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main Map Visualizer */}
          <div className="lg:col-span-8">
            <TrackingMap />
          </div>

          {/* Right Column: Selected Bus & Feed */}
          <div className="lg:col-span-4 space-y-4">
            {/* Selected Coach Telemetry Card */}
            {selectedBus ? (
              <div className="rounded-2xl bg-[#22272A] border border-[#343A3C] p-5 shadow-card-dark space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#343A3C]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#20352F] border border-[#343A3C] flex items-center justify-center text-[#C79A45]">
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-[#F5F1E8]">Bus {selectedBus.id}</h3>
                      <p className="text-[11px] text-[#A9A59B] font-mono">{selectedBus.route}</p>
                    </div>
                  </div>
                  <Badge variant={selectedBus.status === 'delayed' ? 'danger' : 'success'}>
                    {selectedBus.status}{selectedBus.delayMinutes ? ` (+${selectedBus.delayMinutes}m)` : ''}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#343A3C]/40">
                    <span className="text-[#A9A59B] flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-[#C79A45]" /> Route
                    </span>
                    <strong className="text-[#F5F1E8] font-mono">{selectedBus.from} → {selectedBus.to}</strong>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#343A3C]/40">
                    <span className="text-[#A9A59B] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#C79A45]" /> Driver
                    </span>
                    <span className="text-[#F5F1E8]">{selectedBus.driver}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#343A3C]/40">
                    <span className="text-[#A9A59B] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C79A45]" /> Estimated Arrival
                    </span>
                    <strong className="text-[#C79A45] font-mono">{selectedBus.eta}</strong>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-[#A9A59B]">Route Completed</span>
                    <span className="text-[#5F8F72] font-mono font-bold">
                      {Math.round(selectedBus.progress * 100)}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="h-2 bg-[#171A1D] rounded-full overflow-hidden border border-[#343A3C]">
                    <div
                      className="h-full bg-[#C79A45] rounded-full transition-all duration-500 shadow-brass"
                      style={{ width: `${selectedBus.progress * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-[#A9A59B]">
                    <span>{selectedBus.from}</span>
                    <span>{selectedBus.to}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-[#22272A] border border-[#343A3C] p-6 text-center text-xs text-[#A9A59B]">
                <Bus className="w-8 h-8 text-[#C79A45] mx-auto mb-2 opacity-60" />
                <p>Select any bus on the map to view route progress and estimated arrival.</p>
              </div>
            )}

            {/* Live Telematics Feed */}
            <div className="rounded-2xl bg-[#22272A] border border-[#343A3C] p-5 shadow-card-dark">
              <h3 className="font-display font-semibold text-xs tracking-wider uppercase text-[#F5F1E8] mb-3 flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#C79A45]" /> Route Updates
              </h3>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#A9A59B]">Waiting for live updates...</p>
                ) : (
                  notifications.map((n, i) => (
                    <div
                      key={i}
                      className="text-xs text-[#F5F1E8]/80 border-l-2 border-[#C79A45] pl-3 py-1 bg-[#171A1D]/60 rounded-r"
                    >
                      {n}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Active Buses Quick Selector */}
            <div className="rounded-2xl bg-[#22272A] border border-[#343A3C] p-5 shadow-card-dark">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#343A3C]">
                <h3 className="font-display font-semibold text-xs tracking-wider uppercase text-[#F5F1E8]">
                  Active Buses
                </h3>
                <span className="text-[10px] font-mono text-[#5F8F72]">{buses.length} Active</span>
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {buses.map((bus) => (
                  <button
                    key={bus.id}
                    onClick={() => setSelectedBus(bus.id)}
                    className={`w-full flex justify-between items-center p-2 rounded-lg text-xs transition-colors ${
                      selectedBusId === bus.id
                        ? 'bg-[#20352F] text-[#C79A45] font-semibold border border-[#C79A45]'
                        : 'bg-[#171A1D] hover:bg-[#171A1D]/80 text-[#F5F1E8] border border-[#343A3C]'
                    }`}
                  >
                    <span className="font-mono">
                      {bus.id}: {bus.from} → {bus.to}
                    </span>
                    <Badge variant={bus.status === 'delayed' ? 'danger' : 'success'}>
                      {bus.status}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
