import { useEffect, useRef } from 'react';
import { useTrackingStore } from '@/stores/tracking.store';
import { CITY_COORDS } from '@/lib/mock-data';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

// Highway corridors connecting cities
const HIGHWAY_CORRIDORS = [
  { from: 'Peshawar', to: 'Islamabad', label: 'M-1' },
  { from: 'Islamabad', to: 'Lahore', label: 'M-2' },
  { from: 'Lahore', to: 'Faisalabad', label: 'M-3' },
  { from: 'Faisalabad', to: 'Multan', label: 'M-4' },
  { from: 'Multan', to: 'Karachi', label: 'M-5 / M-9' },
  { from: 'Karachi', to: 'Hyderabad', label: 'M-9' },
  { from: 'Quetta', to: 'Multan', label: 'N-70' },
  { from: 'Islamabad', to: 'Rawalpindi', label: 'Metro' },
];

export function TrackingMap() {
  const busRefs = useRef<Record<string, SVGGElement | null>>({});
  const buses = useTrackingStore((s) => s.buses);
  const selectedBusId = useTrackingStore((s) => s.selectedBusId);
  const setSelectedBus = useTrackingStore((s) => s.setSelectedBus);

  useEffect(() => {
    buses.forEach((bus) => {
      const from = CITY_COORDS[bus.from];
      const to = CITY_COORDS[bus.to];
      if (!from || !to) return;
      const x = from.x + (to.x - from.x) * bus.progress;
      const y = from.y + (to.y - from.y) * bus.progress;
      const el = busRefs.current[bus.id];
      if (el) {
        gsap.to(el, { attr: { transform: `translate(${x}, ${y})` }, duration: 1, ease: 'power1.out' });
      }
    });
  }, [buses]);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#171A1D] border border-[#343A3C] shadow-card-dark">
      {/* Live Map Header */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#22272A]/90 backdrop-blur-sm border border-[#343A3C] text-xs font-mono text-[#F5F1E8]">
        <span className="w-2 h-2 rounded-full bg-[#5F8F72] animate-ping" />
        <span className="text-[#C79A45] font-bold">LIVE BUS TRACKING</span>
        <span className="text-[#A9A59B]">| MOTORWAY NETWORK</span>
      </div>

      <svg viewBox="0 0 600 550" className="w-full h-auto">
        <defs>
          {/* Subtle grid pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#343A3C" strokeWidth="0.5" strokeOpacity="0.4" />
          </pattern>
          {/* Brass glow filter */}
          <filter id="brassGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#C79A45" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Map Canvas Background */}
        <rect width="600" height="550" fill="#171A1D" />
        <rect width="600" height="550" fill="url(#grid)" />

        {/* Highway Corridors Lines */}
        {HIGHWAY_CORRIDORS.map((corridor, idx) => {
          const from = CITY_COORDS[corridor.from];
          const to = CITY_COORDS[corridor.to];
          if (!from || !to) return null;

          return (
            <g key={idx}>
              {/* Outer motorway track */}
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#20352F"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Center dashed line */}
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#C79A45"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                strokeOpacity="0.6"
              />
              {/* Midpoint Corridor Code */}
              <text
                x={(from.x + to.x) / 2}
                y={(from.y + to.y) / 2 - 6}
                className="text-[8px] font-mono fill-[#A9A59B] text-anchor-middle"
                textAnchor="middle"
              >
                {corridor.label}
              </text>
            </g>
          );
        })}

        {/* City Terminal Hubs */}
        {Object.entries(CITY_COORDS).map(([city, coords]) => (
          <g key={city} className="select-none">
            {/* Terminal Beacon */}
            <circle cx={coords.x} cy={coords.y} r="8" fill="#20352F" stroke="#C79A45" strokeWidth="1.5" />
            <circle cx={coords.x} cy={coords.y} r="3" fill="#C79A45" />
            {/* Terminal Label */}
            <rect
              x={coords.x + 12}
              y={coords.y - 10}
              width={city.length * 6.5 + 10}
              height="18"
              rx="4"
              fill="#22272A"
              stroke="#343A3C"
              strokeWidth="0.8"
            />
            <text
              x={coords.x + 17}
              y={coords.y + 2}
              className="text-[9px] font-mono font-bold fill-[#F5F1E8]"
            >
              {city}
            </text>
          </g>
        ))}

        {/* Live Buses Telemetry */}
        {buses.map((bus) => {
          const from = CITY_COORDS[bus.from];
          const to = CITY_COORDS[bus.to];
          if (!from || !to) return null;
          const x = from.x + (to.x - from.x) * bus.progress;
          const y = from.y + (to.y - from.y) * bus.progress;
          const isSelected = selectedBusId === bus.id;
          const isDelayed = bus.status === 'delayed';

          return (
            <g
              key={bus.id}
              ref={(el) => { busRefs.current[bus.id] = el; }}
              transform={`translate(${x}, ${y})`}
              onClick={() => setSelectedBus(bus.id)}
              className="cursor-pointer group"
            >
              {/* Pulsing ring for active or selected bus */}
              {isSelected && (
                <circle
                  r="18"
                  fill="none"
                  stroke="#C79A45"
                  strokeWidth="1.5"
                  className="animate-ping"
                />
              )}
              {/* Bus marker body */}
              <circle
                r={isSelected ? 13 : 9}
                fill={isDelayed ? '#B85C4A' : '#5F8F72'}
                stroke={isSelected ? '#C79A45' : '#171A1D'}
                strokeWidth="2"
                filter={isSelected ? 'url(#brassGlow)' : undefined}
                className="transition-all"
              />
              {/* Bus label tag */}
              <rect
                x="14"
                y="-9"
                width={bus.id.length * 7 + 12}
                height="16"
                rx="4"
                fill={isSelected ? '#C79A45' : '#22272A'}
                stroke={isSelected ? '#D9B56A' : '#343A3C'}
                strokeWidth="1"
              />
              <text
                x="20"
                y="3"
                className={cn(
                  'text-[9px] font-mono font-bold',
                  isSelected ? 'fill-[#171A1D]' : 'fill-[#F5F1E8]'
                )}
              >
                {bus.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
