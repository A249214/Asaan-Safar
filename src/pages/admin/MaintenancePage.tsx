import { useEffect } from 'react';
import { useFleetStore } from '@/stores/fleet.store';
import { Badge } from '@/components/ui/badge';
import { Wrench, DollarSign, Bus, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { formatCurrency } from '@/lib/utils';

export default function MaintenancePage() {
  const { buses, maintenanceLogs, fetchBuses } = useFleetStore();

  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  const maintenanceBuses = buses.filter(
    (b) => b.status === 'under_maintenance' || b.status === 'broken' || b.status === 'out_of_service'
  );
  const totalCost = maintenanceLogs.reduce((sum, log) => sum + log.cost, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-[#343A3C]">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#20352F] border border-[#343A3C] text-[11px] font-mono text-[#C79A45] mb-2 uppercase tracking-wider">
          <Wrench className="w-3.5 h-3.5" />
          <span>Depot Operations</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#F5F1E8]">
          Maintenance Logs
        </h1>
        <p className="text-xs text-[#A9A59B] mt-1">
          Track bus inspections, repairs, and workshop costs.
        </p>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#22272A] border border-[#343A3C] shadow-card-dark flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase text-[#A9A59B]">Buses in Workshop</p>
            <AnimatedCounter
              value={maintenanceBuses.length}
              className="text-3xl font-bold font-mono text-[#D9B56A] mt-1 block"
            />
            <span className="text-[10px] text-[#A9A59B]">Under active repair</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#20352F] text-[#C79A45] flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#22272A] border border-[#343A3C] shadow-card-dark flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase text-[#A9A59B]">Completed Repairs</p>
            <AnimatedCounter
              value={maintenanceLogs.length}
              className="text-3xl font-bold font-mono text-[#5F8F72] mt-1 block"
            />
            <span className="text-[10px] text-[#A9A59B]">Total maintenance jobs</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#20352F] text-[#5F8F72] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#22272A] border border-[#343A3C] shadow-card-dark flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase text-[#A9A59B]">Total Maintenance Cost</p>
            <span className="text-2xl font-bold font-mono text-[#C79A45] mt-1 block">
              {formatCurrency(totalCost)}
            </span>
            <span className="text-[10px] text-[#A9A59B]">Repair expenses</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#20352F] text-[#C79A45] flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Vehicles Currently Under Service */}
      <div className="rounded-2xl bg-[#22272A] border border-[#343A3C] p-6 shadow-card-dark space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#343A3C]">
          <h2 className="font-display font-bold text-base text-[#F5F1E8] flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#C79A45]" /> Buses Under Service
          </h2>
          <span className="text-xs font-mono text-[#A9A59B]">{maintenanceBuses.length} in workshop</span>
        </div>

        {maintenanceBuses.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#5F8F72] flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>All buses are operational and ready for service.</span>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {maintenanceBuses.map((bus) => (
              <div
                key={bus.id}
                className="p-4 rounded-xl bg-[#171A1D] border border-[#343A3C] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#20352F] text-[#D9B56A] flex items-center justify-center shrink-0">
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-sm text-[#F5F1E8]">{bus.registrationNumber}</h3>
                    <p className="text-xs text-[#A9A59B]">{bus.model}</p>
                  </div>
                </div>
                <Badge variant="warning">{bus.status.replace('_', ' ')}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workshop Service History Log */}
      <div className="rounded-2xl bg-[#22272A] border border-[#343A3C] p-6 shadow-card-dark space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#343A3C]">
          <h2 className="font-display font-bold text-base text-[#F5F1E8] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C79A45]" /> Maintenance History
          </h2>
          <span className="text-xs font-mono text-[#A9A59B]">Latest Work Orders</span>
        </div>

        {maintenanceLogs.length === 0 ? (
          <p className="text-xs text-[#A9A59B] py-6 text-center">
            No maintenance records found.
          </p>
        ) : (
          <div className="space-y-3">
            {maintenanceLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-[#171A1D] border border-[#343A3C] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#F5F1E8]">Bus: {log.busId}</span>
                    <Badge variant={log.status === 'completed' ? 'success' : 'warning'}>
                      {log.status}
                    </Badge>
                  </div>
                  <p className="text-[#A9A59B]">{log.description}</p>
                  <p className="text-[10px] text-[#A9A59B]/60 font-mono">
                    Logged: {new Date(log.reportedAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-[#343A3C]">
                  <span className="text-[10px] font-mono uppercase text-[#A9A59B] block">Cost</span>
                  <span className="text-sm font-bold font-mono text-[#C79A45]">
                    {formatCurrency(log.cost)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
