import {
  Luggage,
  ShieldCheck,
  Wifi,
  Coffee,
  Clock,
  PhoneCall,
} from 'lucide-react';

const SERVICES = [
  {
    icon: Luggage,
    title: 'Generous Luggage Allowance',
    desc: 'Up to 30kg complimentary checked baggage and 7kg cabin baggage per passenger, sealed with barcode luggage tags.',
    badge: '30kg Checked Baggage',
  },
  {
    icon: ShieldCheck,
    title: 'Certified Drivers',
    desc: 'Long-distance routes feature certified dual drivers for safety on motorway journeys.',
    badge: 'Motorway Certified',
  },
  {
    icon: Wifi,
    title: 'Onboard 4G Wi-Fi & USB Power',
    desc: 'Wi-Fi connectivity across major routes and USB charging ports at each seat.',
    badge: 'Stay Connected',
  },
  {
    icon: Coffee,
    title: 'Terminal Waiting Lounges',
    desc: 'Air-conditioned waiting areas, clean washrooms, and comfortable terminal seating.',
    badge: 'Waiting Lounges',
  },
  {
    icon: Clock,
    title: 'Scheduled Departures',
    desc: 'Buses depart according to published timetables with real-time platform tracking.',
    badge: 'Timetable Tracking',
  },
  {
    icon: PhoneCall,
    title: '24/7 Helpline & Support',
    desc: 'Emergency assistance and continuous route monitoring across all major highway corridors.',
    badge: 'Helpline Support',
  },
];

export function ServiceInfoSection() {
  return (
    <section className="py-20 bg-[#20352F] text-[#F5F1E8] border-y border-[#343A3C] relative overflow-hidden">
      {/* Background road accent */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#C79A45]/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-2xl mb-14">
          <span className="px-3 py-1 rounded-full bg-[#171A1D] border border-[#343A3C] text-xs font-mono font-medium text-[#C79A45] uppercase tracking-wider">
            Passenger Amenities
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#F5F1E8] mt-3 mb-4">
            Travel Comfort & <span className="text-[#C79A45]">Service Standards</span>
          </h2>
          <p className="text-sm sm:text-base text-[#A9A59B] leading-relaxed">
            Reliable intercity transport with comfortable seating, verified luggage handling, and professional drivers.
          </p>
        </div>

        {/* 6-Grid Amenities */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(({ icon: Icon, title, desc, badge }) => (
            <div
              key={title}
              className="p-6 rounded-2xl bg-[#171A1D] border border-[#343A3C] hover:border-[#C79A45]/50 transition-all duration-300 flex flex-col justify-between group shadow-card-dark"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#20352F] border border-[#343A3C] flex items-center justify-center text-[#C79A45] group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-[#20352F] text-[#A9A59B] border border-[#343A3C]">
                    {badge}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-base text-[#F5F1E8] mb-2">{title}</h3>
                <p className="text-xs text-[#A9A59B] leading-relaxed">{desc}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#343A3C]/60 flex items-center gap-1.5 text-xs text-[#C79A45] font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5F8F72]" />
                <span>Asaan Safar Service Standard</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
