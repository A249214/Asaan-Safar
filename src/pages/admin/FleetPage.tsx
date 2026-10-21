import { useEffect, useState } from 'react';
import { useFleetStore } from '@/stores/fleet.store';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bus, Plus, Wrench, RefreshCw } from 'lucide-react';
import { BusStatus } from '@/types/fleet.types';

const statusVariant: Record<BusStatus, 'success' | 'info' | 'warning' | 'danger' | 'default'> = {
  active: 'success',
  available: 'info',
  under_maintenance: 'warning',
  out_of_service: 'danger',
  broken: 'danger',
};

export default function FleetPage() {
  const { buses, drivers, fetchBuses, fetchDrivers, addBus, deleteBus, markMaintenance, replaceVehicle, assignDriver, assignRoute } = useFleetStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ registrationNumber: '', model: '', capacity: 45 });

  useEffect(() => {
    fetchBuses();
    fetchDrivers();
  }, [fetchBuses, fetchDrivers]);

  const handleAdd = async () => {
    await addBus({
      ...form,
      status: 'available',
      insuranceExpiry: '2027-01-01',
      registrationExpiry: '2027-06-01',
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextMaintenance: '2026-09-01',
      fuelLevel: 100,
    });
    setShowForm(false);
    setForm({ registrationNumber: '', model: '', capacity: 45 });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#343A3C]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#20352F] border border-[#343A3C] text-[11px] font-mono text-[#C79A45] mb-2 uppercase tracking-wider">
            <Bus className="w-3.5 h-3.5" />
            <span>Fleet Inventory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#F5F1E8]">
            Fleet Management
          </h1>
          <p className="text-xs text-[#A9A59B] mt-1">
            Manage buses, driver assignments, routes, and vehicle status.
          </p>
        </div>

        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 shadow-brass shrink-0">
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Cancel' : 'Add Bus'}</span>
        </Button>
      </div>

      {/* Quick Fleet Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#22272A] border border-[#343A3C]">
          <span className="text-[11px] font-mono text-[#A9A59B] uppercase block">Total Buses</span>
          <strong className="text-xl font-bold font-mono text-[#F5F1E8]">{buses.length}</strong>
        </div>
        <div className="p-4 rounded-xl bg-[#22272A] border border-[#343A3C]">
          <span className="text-[11px] font-mono text-[#A9A59B] uppercase block">On Route</span>
          <strong className="text-xl font-bold font-mono text-[#5F8F72]">
            {buses.filter((b) => b.status === 'active').length}
          </strong>
        </div>
        <div className="p-4 rounded-xl bg-[#22272A] border border-[#343A3C]">
          <span className="text-[11px] font-mono text-[#A9A59B] uppercase block">Available</span>
          <strong className="text-xl font-bold font-mono text-[#C79A45]">
            {buses.filter((b) => b.status === 'available').length}
          </strong>
        </div>
        <div className="p-4 rounded-xl bg-[#22272A] border border-[#343A3C]">
          <span className="text-[11px] font-mono text-[#A9A59B] uppercase block">Maintenance</span>
          <strong className="text-xl font-bold font-mono text-[#B85C4A]">
            {buses.filter((b) => b.status === 'under_maintenance' || b.status === 'broken').length}
          </strong>
        </div>
      </div>

      {/* Add New Bus Modal / Form */}
      {showForm && (
        <div className="rounded-2xl bg-[#22272A] border border-[#C79A45]/40 p-6 shadow-card-dark space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#343A3C]">
            <h3 className="font-display font-bold text-base text-[#F5F1E8] flex items-center gap-2">
              <Bus className="w-4 h-4 text-[#C79A45]" /> Add Bus to Fleet
            </h3>
            <span className="text-xs font-mono text-[#C79A45]">Bus Details</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#A9A59B] uppercase block">Registration Number *</label>
              <input
                placeholder="e.g. LHE-9821"
                value={form.registrationNumber}
                onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-mono rounded-lg bg-[#171A1D] border border-[#343A3C] text-[#F5F1E8] focus:outline-none focus:border-[#C79A45]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#A9A59B] uppercase block">Bus Model *</label>
              <input
                placeholder="e.g. Yutong Master 2024"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-lg bg-[#171A1D] border border-[#343A3C] text-[#F5F1E8] focus:outline-none focus:border-[#C79A45]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#A9A59B] uppercase block">Seating Capacity *</label>
              <input
                type="number"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs font-mono rounded-lg bg-[#171A1D] border border-[#343A3C] text-[#F5F1E8] focus:outline-none focus:border-[#C79A45]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button size="sm" onClick={handleAdd}>Save Bus</Button>
          </div>
        </div>
      )}

      {/* Bus Inventory Grid */}
      <div className="grid gap-4">
        {buses.map((bus) => {
          const driver = drivers.find((d) => d.id === bus.driverId);
          return (
            <div
              key={bus.id}
              className="rounded-2xl bg-[#22272A] border border-[#343A3C] p-5 shadow-card-dark hover:border-[#C79A45]/40 transition-all space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Vehicle Identity */}
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#20352F] border border-[#343A3C] flex items-center justify-center text-[#C79A45] shrink-0">
                    <Bus className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-display font-bold text-lg text-[#F5F1E8] font-mono">
                        {bus.registrationNumber}
                      </h3>
                      <Badge variant={statusVariant[bus.status]}>
                        {bus.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#A9A59B] mt-0.5">
                      {bus.model} • {bus.capacity} Seats
                    </p>
                  </div>
                </div>

                {/* Fuel & Maintenance Telemetry */}
                <div className="flex items-center gap-6 text-xs font-mono">
                  <div>
                    <span className="text-[#A9A59B] block text-[10px]">FUEL</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-20 h-2 bg-[#171A1D] rounded-full overflow-hidden border border-[#343A3C]">
                        <div
                          className={`h-full rounded-full ${
                            bus.fuelLevel > 50 ? 'bg-[#5F8F72]' : bus.fuelLevel > 20 ? 'bg-[#C79A45]' : 'bg-[#B85C4A]'
                          }`}
                          style={{ width: `${bus.fuelLevel}%` }}
                        />
                      </div>
                      <span className="font-bold text-[#F5F1E8]">{bus.fuelLevel}%</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[#A9A59B] block text-[10px]">NEXT SERVICE</span>
                    <span className="text-[#F5F1E8] font-semibold">{bus.nextMaintenance}</span>
                  </div>
                </div>
              </div>

              {/* Assignments & Dispatch Actions */}
              <div className="pt-3 border-t border-[#343A3C]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                {/* Assignment Selectors */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    className="px-3 py-1.5 rounded-lg bg-[#171A1D] border border-[#343A3C] text-[#F5F1E8] text-xs focus:outline-none focus:border-[#C79A45]"
                    value={bus.driverId ?? ''}
                    onChange={(e) => assignDriver(bus.id, e.target.value)}
                  >
                    <option value="">Assign Driver</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.phone})
                      </option>
                    ))}
                  </select>

                  <select
                    className="px-3 py-1.5 rounded-lg bg-[#171A1D] border border-[#343A3C] text-[#F5F1E8] text-xs focus:outline-none focus:border-[#C79A45]"
                    value={bus.routeId ?? ''}
                    onChange={(e) => assignRoute(bus.id, e.target.value)}
                  >
                    <option value="">Assign Route</option>
                    <option value="r1">LHE ⇄ ISB (M-2)</option>
                    <option value="r2">LHE ⇄ KHI (M-5)</option>
                    <option value="r3">ISB ⇄ PSH (M-1)</option>
                  </select>
                </div>

                {/* Status Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markMaintenance(bus.id, 'Reported for maintenance')}
                    className="flex items-center gap-1.5 text-xs text-[#D9B56A]"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Send to Maintenance</span>
                  </Button>

                  {(bus.status === 'under_maintenance' || bus.status === 'broken') && bus.routeId && (
                    <Button
                      size="sm"
                      onClick={() => replaceVehicle(bus.id)}
                      className="flex items-center gap-1.5 text-xs bg-[#5F8F72] text-[#171A1D] font-bold hover:bg-[#7AA78C]"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Replace Bus</span>
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteBus(bus.id)}
                    className="text-[#B85C4A] hover:bg-[#B85C4A]/10 text-xs"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
