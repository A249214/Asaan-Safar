import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Star,
  ArrowRight,
  Clock,
  Bus,
} from 'lucide-react';

import { HeroSection } from '@/components/animations/HeroSection';
import { InfiniteMarquee } from '@/components/animations/InfiniteMarquee';
import { JourneySearchPanel } from '@/components/home/JourneySearchPanel';
import { HowBookingWorks } from '@/components/home/HowBookingWorks';
import { ServiceInfoSection } from '@/components/home/ServiceInfoSection';
import { POPULAR_ROUTES } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const corridors = [
  {
    code: 'M-2',
    name: 'Lahore ⇄ Islamabad Motorway Express',
    duration: '4h 15m',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
    description:
      'Executive buses via Bhera service area with onboard Wi-Fi, USB ports, and refreshments.',
    dailyBuses: 24,
    fare: 'Rs. 2,500',
  },
  {
    code: 'M-5 / M-9',
    name: 'Lahore ⇄ Karachi Super Highway',
    duration: '14h Overnight',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188fe7?w=800&q=80',
    description:
      'Sleeper buses with reclining seats, onboard washrooms, and dual certified drivers.',
    dailyBuses: 12,
    fare: 'Rs. 4,500',
  },
  {
    code: 'M-1',
    name: 'Islamabad ⇄ Peshawar Khyber Route',
    duration: '2h 10m',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    description:
      'Frequent bus service connecting Faizabad to Peshawar Cantt and Ring Road terminals.',
    dailyBuses: 18,
    fare: 'Rs. 1,800',
  },
];

const testimonials = [
  {
    name: 'Chaudhry Tariq Mehmood',
    city: 'Lahore → Islamabad',
    route: 'M-2 Executive Express',
    text:
      'Travel between Lahore and Islamabad weekly for business. The punctuality at Thokar Niaz Baig and the smooth M-2 journey is the best in Pakistan.',
    rating: 5,
  },
  {
    name: 'Dr. Samina Rizvi',
    city: 'Karachi → Lahore',
    route: 'Sleeper Coach Class',
    text:
      'Safe, clean, and extremely comfortable for female travelers. The QR verification and family seating options give complete peace of mind.',
    rating: 5,
  },
  {
    name: 'Zubair Shah',
    city: 'Peshawar → Rawalpindi',
    route: 'M-1 Shuttle Service',
    text:
      'Live GPS tracking shared with my family while traveling is a game changer. The buses are brand new Yutong coaches with spotless interiors.',
    rating: 5,
  },
];

export default function HomePage() {
  const routesRef = useRef<HTMLDivElement>(null);
  const [activeRouteTab, setActiveRouteTab] = useState<'all' | 'intercity' | 'local'>('intercity');

  // Filter routes according to selected tab
  const displayedRoutes = POPULAR_ROUTES.filter((r) => {
    if (activeRouteTab === 'all') return true;
    return r.journeyType === activeRouteTab;
  });

  return (
    <div className="bg-[#171A1D] text-[#F5F1E8]">
      {/* 1. DARK HERO WITH REAL BUS IMAGE */}
      <HeroSection />

      {/* Corridor Ticker */}
      <InfiniteMarquee />

      {/* 2. JOURNEY SEARCH PANEL (Local & Intercity, Searchable Suggestions, URL Sharing) */}
      <section className="py-12 bg-[#F5F1E8] text-[#171A1D] border-b border-[#DDD5C5]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <JourneySearchPanel initialJourneyType="intercity" />
          </div>
        </div>
      </section>

      {/* 3. POPULAR CONFIGURED ROUTES (Intercity & Local City Metro Feeders) */}
      <section className="py-20 bg-[#F5F1E8] text-[#171A1D]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#DDD5C5]">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#20352F] flex items-center gap-1.5">
                <Bus className="w-3.5 h-3.5 text-[#C79A45]" />
                Daily Schedules
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#171A1D] mt-1">
                Popular Routes
              </h2>
              <p className="text-sm text-[#66635C] mt-1">
                Daily departures on motorways and local city feeder routes
              </p>
            </div>

            {/* Route Type Tabs */}
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <div className="inline-flex p-1 rounded-xl bg-[#EBE5D8] border border-[#DDD5C5]">
                <button
                  type="button"
                  id="tab-popular-intercity"
                  onClick={() => setActiveRouteTab('intercity')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeRouteTab === 'intercity'
                      ? 'bg-[#20352F] text-[#F5F1E8] shadow-xs'
                      : 'text-[#66635C] hover:text-[#171A1D]'
                  }`}
                >
                  Intercity Express
                </button>
                <button
                  type="button"
                  id="tab-popular-local"
                  onClick={() => setActiveRouteTab('local')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeRouteTab === 'local'
                      ? 'bg-[#20352F] text-[#F5F1E8] shadow-xs'
                      : 'text-[#66635C] hover:text-[#171A1D]'
                  }`}
                >
                  Local Metro Feeder
                </button>
                <button
                  type="button"
                  id="tab-popular-all"
                  onClick={() => setActiveRouteTab('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeRouteTab === 'all'
                      ? 'bg-[#20352F] text-[#F5F1E8] shadow-xs'
                      : 'text-[#66635C] hover:text-[#171A1D]'
                  }`}
                >
                  All
                </button>
              </div>

              <Link to="/routes">
                <Button
                  variant="outline"
                  size="sm"
                  className="!bg-[#FAF7F1] !border-[#DDD5C5] !text-[#171A1D] hover:!border-[#C79A45]"
                >
                  <span>All Routes</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 text-[#C79A45]" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Routes Cards Grid */}
          <div ref={routesRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedRoutes.map((route) => (
              <div
                key={route.id}
                className="card-warm p-5 rounded-xl flex flex-col justify-between hover:border-[#C79A45]/60 hover:shadow-card-warm transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-[#20352F] text-[#C79A45]">
                        {route.luxuryLevel} Class
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase bg-[#EBE5D8] text-[#20352F]">
                        {route.journeyType === 'local' ? 'Metro Feeder' : 'Intercity'}
                      </span>
                    </div>
                    <span className="text-xs text-[#5F8F72] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5F8F72]" />
                      {route.availableSeats} Seats Open
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-display font-bold text-lg text-[#171A1D]">
                      {route.from} <span className="text-[#C79A45] font-normal mx-1">⇄</span> {route.to}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#66635C] mb-3 font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#C79A45]" />
                    <span>Dep: {route.departureTime}</span>
                    <span>•</span>
                    <span>Arr: {route.arrivalTime}</span>
                  </div>

                  {route.stops && route.stops.length > 0 && (
                    <div className="text-[11px] text-[#66635C] mb-4">
                      <span className="font-semibold text-[#20352F]">Stops: </span>
                      <span className="truncate">{route.stops.slice(0, 3).join(', ')}</span>
                      {route.stops.length > 3 && (
                        <span className="text-[#C79A45]"> +{route.stops.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#DDD5C5] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#66635C] block uppercase font-mono">
                      Standard Fare
                    </span>
                    <span className="text-lg font-bold font-mono text-[#C79A45]">
                      {formatCurrency(route.fare)}
                    </span>
                  </div>
                  <Link to={`/booking?routeId=${route.id}`}>
                    <Button size="sm" className="text-xs font-semibold px-4 shadow-brass">
                      Select Seats
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW BOOKING WORKS (4-Step Visual Flow) */}
      <HowBookingWorks />

      {/* 5. SERVICE INFORMATION & PASSENGER AMENITIES */}
      <ServiceInfoSection />

      {/* 6. HIGHWAY NETWORK CORRIDORS & TESTIMONIALS */}
      <section className="py-20 bg-[#F5F1E8] text-[#171A1D] border-b border-[#DDD5C5]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono font-bold tracking-widest text-[#20352F] uppercase">
              Motorway Corridors
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#171A1D] mt-2 mb-3">
              Major Motorway Routes
            </h2>
            <p className="text-sm text-[#66635C]">
              Direct intercity connections with verified departures, modern coaches, and scheduled rest stops.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {corridors.map((c) => (
              <div
                key={c.code}
                className="card-warm rounded-xl overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#171A1D]/90 backdrop-blur-sm border border-[#343A3C] text-xs font-mono font-bold text-[#C79A45]">
                      {c.code}
                    </span>
                    <span className="absolute bottom-3 right-3 text-xs font-mono text-[#F5F1E8] bg-[#20352F]/90 px-2 py-0.5 rounded border border-[#343A3C]">
                      {c.duration}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-base text-[#171A1D] mb-2">{c.name}</h3>
                    <p className="text-xs text-[#66635C] leading-relaxed mb-4">{c.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[#DDD5C5] flex items-center justify-between text-xs font-mono text-[#66635C]">
                  <span>{c.dailyBuses} Daily Buses</span>
                  <span className="text-[#C79A45] font-bold text-sm">From {c.fare}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Passenger Reviews on Warm Canvas */}
          <div className="pt-8 border-t border-[#DDD5C5]">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-mono font-bold tracking-widest text-[#20352F] uppercase">
                Passenger Feedback
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#171A1D] mt-1">
                Passenger Reviews
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="card-warm p-6 rounded-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#C79A45] text-[#C79A45]" />
                      ))}
                    </div>
                    <p className="text-sm text-[#171A1D]/90 italic leading-relaxed mb-5">
                      "{t.text}"
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#DDD5C5]">
                    <p className="font-bold text-sm text-[#171A1D]">{t.name}</p>
                    <p className="text-xs text-[#C79A45] font-mono">{t.route}</p>
                    <p className="text-[11px] text-[#66635C]">{t.city}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. DARK CALL TO ACTION */}
      <section className="py-16 bg-[#171A1D] text-[#F5F1E8] border-t border-[#343A3C] relative">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-2xl">
          <div className="w-12 h-12 rounded-xl bg-[#20352F] border border-[#343A3C] text-[#C79A45] mx-auto flex items-center justify-center mb-4">
            <Bus className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-display font-bold text-[#F5F1E8] mb-3">
            Book Your Bus Seat
          </h2>
          <p className="text-sm text-[#DDD5C5]/90 mb-8 leading-relaxed">
            Select your seats, pay easily with JazzCash, Easypaisa, card, or cash at the terminal, and get your digital ticket.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/booking">
              <Button size="lg" className="flex items-center gap-2 shadow-brass">
                <span>Book a Seat</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/routes">
              <Button variant="outline" size="lg" className="!bg-[#22272A]/80 !border-[#343A3C] !text-[#F5F1E8] hover:!border-[#C79A45]">
                View Schedules
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
