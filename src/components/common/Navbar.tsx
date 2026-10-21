import { Link, useLocation } from 'react-router-dom';
import { Bus, Moon, Sun, Menu, X, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useThemeStore } from '@/stores/theme.store';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/routes', label: 'Routes & Timetable' },
  { to: '/tracking', label: 'Live Tracking' },
  { to: '/booking', label: 'Book Ticket' },
  { to: '/find-booking', label: 'Find Ticket' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#171A1D]/95 backdrop-blur-md border-b border-[#343A3C]">
      <div className="container mx-auto px-4 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Identity */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#20352F] to-[#162521] border border-[#343A3C] flex items-center justify-center text-[#C79A45] transition-all group-hover:border-[#C79A45] group-hover:shadow-brass">
            <Bus className="w-5 h-5 transition-transform group-hover:scale-110" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg tracking-tight text-[#F5F1E8]">Asaan<span className="text-[#C79A45]">Safar</span></span>
              <span className="text-[11px] font-bold text-[#5F8F72] px-1.5 py-0.2 rounded bg-[#20352F] border border-[#343A3C]">آسان سفر</span>
            </div>
            <span className="text-[10px] tracking-widest uppercase font-mono text-[#A9A59B] -mt-0.5">
              Intercity Bus Service
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'relative px-3.5 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'text-[#C79A45] font-semibold'
                    : 'text-[#A9A59B] hover:text-[#F5F1E8] hover:bg-[#20352F]/40'
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-[#C79A45] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[#A9A59B] hover:text-[#F5F1E8] hover:bg-[#22272A] border border-transparent hover:border-[#343A3C] transition-all"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#C79A45]" /> : <Moon className="w-4 h-4" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {(user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'manager') && (
                <Link to="/admin">
                  <Button size="sm" variant="secondary" className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C79A45]" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
              )}
              {user?.role === 'conductor' && (
                <Link to="/conductor">
                  <Button size="sm" variant="secondary">
                    Check-In
                  </Button>
                </Link>
              )}
              <Link to="/my-bookings">
                <Button size="sm" variant="outline" className="text-xs border-[#343A3C] text-[#F5F1E8]">
                  My Trips
                </Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={logout} className="text-xs">
                {user?.name?.split(' ')[0]} (Sign Out)
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="hidden sm:inline-block">
                <Button size="sm" variant="ghost">Staff Login</Button>
              </Link>
              <Link to="/booking">
                <Button size="sm" variant="default">
                  Book a Seat
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-[#F5F1E8] hover:bg-[#22272A] border border-[#343A3C]"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden bg-[#171A1D] border-t border-[#343A3C] px-4 py-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={cn(
                  'block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#20352F] text-[#C79A45] font-semibold'
                    : 'text-[#A9A59B] hover:text-[#F5F1E8] hover:bg-[#22272A]'
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {!isAuthenticated && (
            <div className="pt-2 border-t border-[#343A3C]">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm text-[#A9A59B] hover:text-[#F5F1E8]"
              >
                Staff Login
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
