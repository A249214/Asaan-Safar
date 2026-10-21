import { useEffect, useRef } from 'react';
import { useDashboardStore } from '@/stores/dashboard.store';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { GlassCard } from '@/components/ui/glass-card';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import gsap from 'gsap';

export default function DashboardPage() {
  const { stats, revenueData, passengerData, peakHoursData, fleetUsageData, fetchStats, isLoading } = useDashboardStore();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (!isLoading && cardRefs.current.length) {
      gsap.from(cardRefs.current.filter(Boolean), {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      });
    }
  }, [isLoading]);

  const statItems = [
    { label: 'Daily Revenue', value: stats.dailyRevenue, prefix: 'Rs. ' },
    { label: 'Weekly Revenue', value: stats.weeklyRevenue, prefix: 'Rs. ' },
    { label: 'Monthly Revenue', value: stats.monthlyRevenue, prefix: 'Rs. ' },
    { label: 'Active Buses', value: stats.activeBuses },
    { label: 'Active Routes', value: stats.activeRoutes },
    { label: 'Passengers Today', value: stats.passengerCount },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#343A3C]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#20352F] border border-[#343A3C] text-[11px] font-mono text-[#C79A45] mb-2 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#5F8F72] animate-pulse" />
            <span>Operations Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#F5F1E8]">
            Operations Dashboard
          </h1>
          <p className="text-xs text-[#A9A59B] mt-1">
            Real-time passenger bookings, revenue performance, and fleet utilization.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-[#22272A] border border-[#343A3C] text-right font-mono text-xs">
          <span className="text-[#A9A59B] block text-[10px]">FISCAL YEAR</span>
          <span className="font-bold text-[#C79A45] text-sm">FY 2024-25</span>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statItems.map((item, i) => (
          <div key={item.label} ref={(el) => { cardRefs.current[i] = el; }}>
            <div className="rounded-2xl bg-[#22272A] border border-[#343A3C] p-5 shadow-card-dark hover:border-[#C79A45]/40 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-[#A9A59B] tracking-wider">{item.label}</span>
                <span className="w-2 h-2 rounded-full bg-[#C79A45] opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <AnimatedCounter
                value={item.value}
                prefix={item.prefix}
                className="text-2xl font-bold font-mono text-[#C79A45] block tracking-tight"
              />
              <span className="text-[10px] text-[#5F8F72] font-mono mt-1 block">
                • Live data
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <h2 className="font-semibold mb-4 text-[#F5F1E8]">Weekly Revenue Trend (PKR)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#343A3C" strokeOpacity={0.6} />
              <XAxis dataKey="date" stroke="#A9A59B" />
              <YAxis stroke="#A9A59B" />
              <Tooltip contentStyle={{ background: '#22272A', border: '1px solid #343A3C', borderRadius: 8, color: '#F5F1E8' }} />
              <Line type="monotone" dataKey="revenue" stroke="#C79A45" strokeWidth={2.5} dot={{ fill: '#C79A45', r: 4 }} activeDot={{ r: 6, fill: '#D9B56A' }} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard>
          <h2 className="font-semibold mb-4 text-[#F5F1E8]">Passenger Volume by Corridor</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={passengerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#343A3C" strokeOpacity={0.6} />
              <XAxis dataKey="route" stroke="#A9A59B" />
              <YAxis stroke="#A9A59B" />
              <Tooltip contentStyle={{ background: '#22272A', border: '1px solid #343A3C', borderRadius: 8, color: '#F5F1E8' }} />
              <Bar dataKey="passengers" fill="#20352F" stroke="#C79A45" strokeWidth={1} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard>
          <h2 className="font-semibold mb-4 text-[#F5F1E8]">Peak Departure Hours</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={peakHoursData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#343A3C" strokeOpacity={0.6} />
              <XAxis dataKey="hour" stroke="#A9A59B" />
              <YAxis stroke="#A9A59B" />
              <Tooltip contentStyle={{ background: '#22272A', border: '1px solid #343A3C', borderRadius: 8, color: '#F5F1E8' }} />
              <Area type="monotone" dataKey="passengers" stroke="#5F8F72" strokeWidth={2} fill="#5F8F72" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard>
          <h2 className="font-semibold mb-4 text-[#F5F1E8]">Fleet Utilization Rate (%)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={fleetUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#343A3C" strokeOpacity={0.6} />
              <XAxis dataKey="date" stroke="#A9A59B" />
              <YAxis stroke="#A9A59B" domain={[0, 100]} />
              <Tooltip contentStyle={{ background: '#22272A', border: '1px solid #343A3C', borderRadius: 8, color: '#F5F1E8' }} />
              <Bar dataKey="usage" fill="#C79A45" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
}
