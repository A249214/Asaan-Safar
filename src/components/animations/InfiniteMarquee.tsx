import { ShieldCheck, Bus } from 'lucide-react';

const OPERATORS = [
  { name: 'Faisal Movers', type: 'Super Executive & Business' },
  { name: 'Daewoo Express', type: 'Gold Class & Sleeper' },
  { name: 'Bilal Travels', type: 'Executive Luxury' },
  { name: 'Sania Express', type: 'Sleeper Cruiser' },
  { name: 'Warraich Express', type: 'Executive Coach' },
  { name: 'Niazi Express', type: 'Executive AC Coach' },
];

export function InfiniteMarquee() {
  return (
    <div className="py-4 border-y border-[#343A3C] bg-[#1A1E21] text-[#F5F1E8]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#A9A59B] uppercase tracking-wider shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#C79A45]" />
            <span>Authorized Bus Operators</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            {OPERATORS.map((op) => (
              <div key={op.name} className="flex items-center gap-2 text-[#DDD5C5]/90">
                <Bus className="w-3.5 h-3.5 text-[#C79A45]" />
                <span className="font-semibold text-sm text-[#F5F1E8]">{op.name}</span>
                <span className="text-[10px] text-[#A9A59B] font-mono hidden sm:inline">({op.type})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
