import { Search, Armchair, CreditCard, QrCode, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const STEPS = [
  {
    step: '01',
    title: 'Search Routes',
    subtitle: 'Intercity & Local Shuttles',
    description:
      'Choose your departure and arrival cities or local metro stops. Compare departure times, bus operators, and available seats.',
    icon: Search,
    highlight: 'No terminal queues',
  },
  {
    step: '02',
    title: 'Choose Seats',
    subtitle: 'Window, Aisle & Family Areas',
    description:
      'View the real-time seat layout. Select your preferred seat, including dedicated family and female-reserved seating zones.',
    icon: Armchair,
    highlight: 'Live 5-min seat lock',
  },
  {
    step: '03',
    title: 'Enter Details & Pay',
    subtitle: 'JazzCash, EasyPaisa & Cards',
    description:
      'Enter passenger details and CNIC number. Pay securely via mobile wallet or debit card with immediate confirmation.',
    icon: CreditCard,
    highlight: 'Secure checkout',
  },
  {
    step: '04',
    title: 'Board Your Bus',
    subtitle: 'Digital QR Boarding Pass',
    description:
      'Receive instant SMS confirmation and an e-ticket with a QR code. Show your ticket at the terminal bay to board.',
    icon: QrCode,
    highlight: 'Instant e-ticket',
  },
];

export function HowBookingWorks() {
  return (
    <section className="py-20 bg-[#F5F1E8] text-[#171A1D] border-b border-[#DDD5C5]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="px-3 py-1 rounded-full bg-[#EBE5D8] border border-[#DDD5C5] text-xs font-mono font-semibold text-[#20352F] uppercase tracking-wider">
            Booking Guide
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#171A1D] mt-3 mb-4">
            How to Book Your Ticket
          </h2>
          <p className="text-sm sm:text-base text-[#66635C] leading-relaxed">
            Reserve your seat and receive an e-ticket in four simple steps.
          </p>
        </div>

        {/* 4-Step Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map(({ step, title, subtitle, description, icon: Icon, highlight }, idx) => (
            <div
              key={step}
              className="card-warm p-6 rounded-2xl flex flex-col justify-between relative group hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                {/* Step badge & Icon */}
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-3xl font-black text-[#DDD5C5] group-hover:text-[#C79A45] transition-colors">
                    {step}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-[#20352F] border border-[#343A3C] text-[#C79A45] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Subtitle & Title */}
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#5F8F72] font-semibold block mb-1">
                  {subtitle}
                </span>
                <h3 className="font-display font-bold text-lg text-[#171A1D] mb-3">
                  {title}
                </h3>
                <p className="text-xs text-[#66635C] leading-relaxed mb-6">
                  {description}
                </p>
              </div>

              {/* Card Footer Highlight */}
              <div className="pt-3 border-t border-[#DDD5C5] flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#20352F] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#5F8F72]" />
                  {highlight}
                </span>
                <span className="text-xs text-[#C79A45] font-bold">Step {idx + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-12 p-6 rounded-2xl bg-[#FAF7F1] border border-[#DDD5C5] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-[#20352F] text-[#C79A45] flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-[#171A1D]">
                Already have a booking?
              </p>
              <p className="text-xs text-[#66635C]">
                Check departure status, download your e-ticket, or view your terminal bay number.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/find-booking">
              <Button variant="outline" size="sm" className="!bg-white !border-[#DDD5C5] text-xs">
                Find Ticket
              </Button>
            </Link>
            <Link to="/booking">
              <Button size="sm" className="text-xs flex items-center gap-1.5">
                <span>Book a Seat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
