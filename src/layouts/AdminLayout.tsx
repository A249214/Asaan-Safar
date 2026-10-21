import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Bus, Wrench, Shield, Ticket, LogOut, Menu, X, ArrowLeft, ShieldAlert,
  MapPin, Radio, FileText
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { OfflineBanner } from '@/components/common/OfflineBanner';

const sidebarLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/routes', icon: MapPin, label: 'Routes & Schedules' },
  { to: '/admin/fleet', icon: Bus, label: 'Fleet' },
  { to: '/admin/bookings', icon: FileText, label: 'Bookings' },
  { to: '/admin/terminals', icon: Radio, label: 'Terminal Bays' },
  { to: '/admin/maintenance', icon: Wrench, label: 'Maintenance' },
  { to: '/admin/audit', icon: Shield, label: 'Audit Logs' },
  { to: '/conductor', icon: Ticket, label: 'Conductor Check-In' },
];

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const { user, logout } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (sidebarRef.current) {
      gsap.from(sidebarRef.current, { x: -60, opacity: 0, duration: 0.5, ease: 'power3.out' });
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex bg-[#171A1D] text-[#F5F1E8]">
      {/* Sidebar - Deep Forest Background (#20352F) */}
      <aside
        ref={sidebarRef}
        className={cn(
          'fixed lg:sticky top-0 h-screen bg-[#20352F] border-r border-[#343A3C] z-40 transition-all duration-300 flex flex-col justify-between shadow-card-dark',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div>
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-[#343A3C]">
            {!collapsed && (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#171A1D] border border-[#343A3C] flex items-center justify-center text-[#C79A45]">
                  <Bus className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-display font-bold text-sm tracking-tight text-[#F5F1E8]">Asaan<span className="text-[#C79A45]">Safar</span></span>
                  <span className="text-[10px] block font-mono text-[#A9A59B] -mt-0.5">TERMINAL ADMIN</span>
                </div>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg text-[#A9A59B] hover:text-[#F5F1E8] hover:bg-[#171A1D] transition-colors"
              aria-label="Toggle sidebar"
            >
              {collapsed ? <Menu className="w-5 h-5 text-[#C79A45]" /> : <X className="w-5 h-5" />}
            </button>
          </div>

          {/* Nav links */}
          <nav className="p-3 space-y-1">
            {sidebarLinks.map(({ to, icon: Icon, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150',
                    isActive
                      ? 'bg-[#171A1D] text-[#C79A45] font-semibold border border-[#C79A45]/40 shadow-sm'
                      : 'text-[#A9A59B] hover:text-[#F5F1E8] hover:bg-[#171A1D]/60'
                  )}
                  title={collapsed ? label : undefined}
                >
                  <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-[#C79A45]' : 'text-[#A9A59B]')} />
                  {!collapsed && <span>{label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 space-y-2 border-t border-[#343A3C]">
          <Link
            to="/"
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#A9A59B] hover:text-[#F5F1E8] hover:bg-[#171A1D]/60 transition-colors',
              collapsed && 'justify-center'
            )}
            title="Back to Public Site"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {!collapsed && <span>View Public Site</span>}
          </Link>

          {!collapsed && user && (
            <div className="px-3 py-2 rounded-lg bg-[#171A1D] border border-[#343A3C] text-[11px]">
              <p className="font-semibold text-[#F5F1E8] truncate">{user.name}</p>
              <p className="text-[#C79A45] font-mono text-[10px] uppercase">{user.role}</p>
            </div>
          )}

          <button
            onClick={logout}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg w-full text-xs text-[#B85C4A] hover:bg-[#B85C4A]/10 transition-colors',
              collapsed && 'justify-center'
            )}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Admin Content Canvas - Asphalt Black */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto bg-[#171A1D]">
        <Outlet />
      </main>
      <OfflineBanner />
    </div>
  </ErrorBoundary>
);
}
