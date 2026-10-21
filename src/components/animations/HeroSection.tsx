import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Bus, ShieldCheck, ArrowRight, Clock, QrCode } from 'lucide-react';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { TERMINAL_STATS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current?.children ?? [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
      );
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, delay: 0.15, ease: 'power3.out' }
        );
      }
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.3, ease: 'power2.out' }
        );
      }
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#171A1D] pt-24 pb-16"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(23, 26, 29, 0.95) 0%, rgba(23, 26, 29, 0.82) 48%, rgba(23, 26, 29, 0.50) 100%), url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Highway lane accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] highway-divider opacity-25 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Brand Statement */}
          <div className="lg:col-span-7 space-y-6">
            {/* National Transport Authority Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#20352F] border border-[#343A3C] text-xs font-mono tracking-wider text-[#C79A45]">
              <span className="w-2 h-2 rounded-full bg-[#5F8F72]" />
              <span>آسان اور محفوظ سفر • Intercity Bus Service</span>
            </div>

            <h1 ref={titleRef} className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#F5F1E8] leading-[1.12] tracking-tight">
              <span className="block text-[#A9A59B] text-lg sm:text-xl font-mono uppercase tracking-widest font-normal mb-2">
                Asaan Safar • Intercity Travel
              </span>
              <span>Reliable Intercity Travel </span>
              <span className="text-[#C79A45]">Across Pakistan.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#DDD5C5]/90 max-w-xl leading-relaxed">
              Book bus tickets on M-1, M-2, M-3, M-5, and GT Road. Compare operators, choose your seats, and get an instant digital boarding pass.
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#search-widget">
                <Button size="lg" className="flex items-center gap-2 shadow-brass font-semibold">
                  <span>Find a Bus</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <Link to="/routes">
                <Button variant="outline" size="lg" className="flex items-center gap-2 !bg-[#22272A]/80 !border-[#343A3C] !text-[#F5F1E8] hover:!border-[#C79A45]">
                  <Clock className="w-4 h-4 text-[#C79A45]" />
                  <span>View Schedules</span>
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-xs text-[#A9A59B]">
                <ShieldCheck className="w-4 h-4 text-[#5F8F72]" />
                <span>NHA & PTA Monitored</span>
              </div>
            </div>
          </div>

          {/* Right Column: Executive Boarding Pass Preview & Live Counters */}
          <div className="lg:col-span-5 space-y-5">
            {/* Physical Boarding Pass Card */}
            <div
              ref={cardRef}
              className="rounded-2xl bg-[#22272A] border border-[#343A3C] p-6 shadow-card-dark relative overflow-hidden"
            >
              {/* Top Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#343A3C]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#20352F] border border-[#343A3C] flex items-center justify-center text-[#C79A45]">
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-sm text-[#F5F1E8]">Executive Starliner Express</h2>
                    <p className="text-xs text-[#A9A59B] font-mono">Service # PK-702 • Motorway M-2</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#5F8F72]/15 text-[#5F8F72] text-[11px] font-mono font-medium border border-[#5F8F72]/30">
                  ON SCHEDULE
                </span>
              </div>

              {/* Route Trajectory Visual */}
              <div className="py-5 grid grid-cols-3 items-center text-center">
                <div className="text-left">
                  <span className="text-xs text-[#A9A59B]">Origin</span>
                  <h3 className="font-display text-xl font-bold text-[#F5F1E8]">LHE</h3>
                  <p className="text-[11px] text-[#A9A59B]">Lahore Central</p>
                  <p className="text-xs font-mono font-semibold text-[#C79A45] mt-1">08:00 AM</p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-mono text-[#A9A59B] mb-1">4h 30m</span>
                  <div className="w-full flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#C79A45]" />
                    <div className="h-[2px] flex-1 bg-[#343A3C] relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#20352F] border border-[#C79A45] flex items-center justify-center">
                        <Bus className="w-2.5 h-2.5 text-[#C79A45]" />
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-[#5F8F72]" />
                  </div>
                  <span className="text-[10px] font-mono text-[#5F8F72] mt-1">M-2 Salt Range</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#A9A59B]">Destination</span>
                  <h3 className="font-display text-xl font-bold text-[#F5F1E8]">ISB</h3>
                  <p className="text-[11px] text-[#A9A59B]">Faizabad Terminal</p>
                  <p className="text-xs font-mono font-semibold text-[#C79A45] mt-1">12:30 PM</p>
                </div>
              </div>

              {/* Perforated ticket boundary */}
              <div className="relative py-2 my-2">
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#171A1D] border-r border-[#343A3C]" />
                <div className="border-t border-dashed border-[#343A3C] w-full" />
                <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#171A1D] border-l border-[#343A3C]" />
              </div>

              {/* Boarding Details */}
              <div className="grid grid-cols-4 gap-2 pt-2 text-xs">
                <div>
                  <span className="text-[#A9A59B] block text-[10px]">PLATFORM</span>
                  <strong className="text-[#F5F1E8] font-mono">P-01</strong>
                </div>
                <div>
                  <span className="text-[#A9A59B] block text-[10px]">SEATS LEFT</span>
                  <strong className="text-[#5F8F72] font-mono">14 Avail.</strong>
                </div>
                <div>
                  <span className="text-[#A9A59B] block text-[10px]">FARE (PKR)</span>
                  <strong className="text-[#C79A45] font-mono">Rs. 2,500</strong>
                </div>
                <div className="text-right flex justify-end items-center">
                  <QrCode className="w-7 h-7 text-[#C79A45] opacity-80" />
                </div>
              </div>
            </div>

            {/* Live Terminal Statistics Counters */}
            <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Daily Travelers', value: TERMINAL_STATS.dailyPassengers },
                { label: 'Active Coaches', value: TERMINAL_STATS.activeBuses },
                { label: 'Routes Today', value: TERMINAL_STATS.routesToday },
                { label: 'On-Time Dispatch', value: TERMINAL_STATS.onTimeRate, suffix: '%' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-3 rounded-xl bg-[#22272A] border border-[#343A3C] text-center shadow-sm"
                >
                  <p className="text-[11px] text-[#A9A59B] truncate mb-0.5">{stat.label}</p>
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    className="text-lg font-bold font-mono text-[#C79A45]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
