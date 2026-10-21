import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bus,
  MapPin,
  Calendar,
  Users,
  ArrowLeftRight,
  Search,
  AlertCircle,
  CheckCircle2,
  Navigation,
  ShieldCheck,
} from 'lucide-react';
import { INTERCITY_CITIES, LOCAL_STOPS } from '@/lib/mock-data';
import { JourneyType } from '@/types/booking.types';
import { Button } from '@/components/ui/button';

interface JourneySearchPanelProps {
  initialJourneyType?: JourneyType;
  initialFrom?: string;
  initialTo?: string;
  initialDate?: string;
  initialPassengers?: number;
  compact?: boolean;
}

export function JourneySearchPanel({
  initialJourneyType = 'intercity',
  initialFrom,
  initialTo,
  initialDate,
  initialPassengers = 1,
  compact = false,
}: JourneySearchPanelProps) {
  const navigate = useNavigate();

  const [journeyType, setJourneyType] = useState<JourneyType>(initialJourneyType);
  const [from, setFrom] = useState(
    initialFrom || (initialJourneyType === 'intercity' ? 'Lahore' : 'Thokar Niaz Baig')
  );
  const [to, setTo] = useState(
    initialTo || (initialJourneyType === 'intercity' ? 'Islamabad' : 'Railway Station')
  );
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(initialDate || todayStr);
  const [passengers, setPassengers] = useState(initialPassengers);

  // Search dropdown states
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [swapAnim, setSwapAnim] = useState(false);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  // Available locations based on journey type
  const availableLocations = journeyType === 'intercity' ? INTERCITY_CITIES : LOCAL_STOPS;

  // Handle switching journey type
  const handleTypeChange = (newType: JourneyType) => {
    if (newType === journeyType) return;
    setJourneyType(newType);
    if (newType === 'intercity') {
      setFrom('Lahore');
      setTo('Islamabad');
    } else {
      setFrom('Thokar Niaz Baig');
      setTo('Railway Station');
    }
    setIsFromOpen(false);
    setIsToOpen(false);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) {
        setIsFromOpen(false);
      }
      if (toRef.current && !toRef.current.contains(e.target as Node)) {
        setIsToOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Validation
  const isIdentical =
    from.trim().toLowerCase() !== '' &&
    to.trim().toLowerCase() !== '' &&
    from.trim().toLowerCase() === to.trim().toLowerCase();

  const isPastDate = Boolean(date && date < todayStr);
  const isInvalidPassengers = passengers < 1 || passengers > 6;
  const isFormValid =
    from.trim() !== '' &&
    to.trim() !== '' &&
    !isIdentical &&
    !isPastDate &&
    !isInvalidPassengers;

  // Filtered suggestions
  const fromSuggestions = availableLocations.filter((item) =>
    item.toLowerCase().includes(from.toLowerCase())
  );
  const toSuggestions = availableLocations.filter((item) =>
    item.toLowerCase().includes(to.toLowerCase())
  );

  // Swap action
  const handleSwap = () => {
    setSwapAnim(true);
    setTimeout(() => setSwapAnim(false), 350);
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const params = new URLSearchParams({
      type: journeyType,
      from: from.trim(),
      to: to.trim(),
      date,
      passengers: String(passengers),
    });

    navigate(`/routes?${params.toString()}`);
  };

  return (
    <div
      id="search-widget"
      className={`rounded-2xl bg-[#FAF7F1] border border-[#DDD5C5] shadow-card-warm text-[#171A1D] scroll-mt-24 ${
        compact ? 'p-4 sm:p-5' : 'p-6 sm:p-8'
      }`}
    >
      {/* Top Header & Journey Type Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#DDD5C5]">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#20352F] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#C79A45]" />
            آسان سفر • Bus Search
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-[#171A1D] mt-0.5">
            Find a Bus
          </h2>
        </div>

        {/* Journey Type Toggle Pills */}
        <div className="flex items-center p-1 rounded-xl bg-[#EBE5D8] border border-[#DDD5C5] self-start sm:self-auto">
          <button
            type="button"
            id="search-journey-intercity"
            onClick={() => handleTypeChange('intercity')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              journeyType === 'intercity'
                ? 'bg-[#20352F] text-[#F5F1E8] shadow-sm'
                : 'text-[#66635C] hover:text-[#171A1D]'
            }`}
          >
            <Bus className={`w-3.5 h-3.5 ${journeyType === 'intercity' ? 'text-[#C79A45]' : ''}`} />
            <span>Intercity Express</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                journeyType === 'intercity'
                  ? 'bg-[#171A1D] text-[#C79A45]'
                  : 'bg-[#DDD5C5] text-[#66635C]'
              }`}
            >
              Motorways
            </span>
          </button>

          <button
            type="button"
            id="search-journey-local"
            onClick={() => handleTypeChange('local')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              journeyType === 'local'
                ? 'bg-[#20352F] text-[#F5F1E8] shadow-sm'
                : 'text-[#66635C] hover:text-[#171A1D]'
            }`}
          >
            <Navigation className={`w-3.5 h-3.5 ${journeyType === 'local' ? 'text-[#C79A45]' : ''}`} />
            <span>Local Metro Feeder</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                journeyType === 'local'
                  ? 'bg-[#171A1D] text-[#C79A45]'
                  : 'bg-[#DDD5C5] text-[#66635C]'
              }`}
            >
              Intra-City
            </span>
          </button>
        </div>
      </div>

      {/* Validation Alert Banner */}
      {isIdentical && (
        <div className="mb-5 p-3 rounded-xl bg-[#D64545]/10 border border-[#D64545]/30 text-[#D64545] text-xs flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            <strong>Invalid Journey:</strong> Origin and destination cannot be the same terminal or
            city. Please pick different locations.
          </span>
        </div>
      )}

      {isPastDate && (
        <div className="mb-5 p-3 rounded-xl bg-[#C79A45]/15 border border-[#C79A45]/40 text-[#8C6B28] text-xs flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            <strong>Invalid Travel Date:</strong> You have selected a past date. Please choose today
            or a future travel date.
          </span>
        </div>
      )}

      {/* Form Fields Grid */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Origin Searchable Input */}
          <div ref={fromRef} className="relative md:col-span-4 space-y-1.5">
            <label
              htmlFor="search-from-input"
              className="text-xs font-semibold uppercase tracking-wider text-[#20352F] flex items-center justify-between"
            >
              <span>{journeyType === 'intercity' ? 'Departure City' : 'Boarding Stop'}</span>
              <span className="text-[10px] font-mono text-[#66635C] font-normal">Origin</span>
            </label>
            <div className="relative">
              <input
                id="search-from-input"
                type="text"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setIsFromOpen(true);
                }}
                onFocus={() => setIsFromOpen(true)}
                placeholder={journeyType === 'intercity' ? 'e.g. Lahore, Karachi...' : 'e.g. Thokar, Kalma...'}
                className={`w-full pl-9 pr-3.5 py-2.5 text-xs font-semibold rounded-lg bg-white border text-[#171A1D] placeholder-[#A9A59B] transition-colors focus:outline-none ${
                  isIdentical
                    ? 'border-[#D64545] focus:border-[#D64545]'
                    : 'border-[#DDD5C5] focus:border-[#C79A45]'
                }`}
                autoComplete="off"
              />
              <MapPin className="w-4 h-4 text-[#C79A45] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Suggestions Dropdown */}
            {isFromOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-30 max-h-56 overflow-y-auto rounded-xl bg-white border border-[#DDD5C5] shadow-lg py-1">
                <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase text-[#66635C] bg-[#FAF7F1] border-b border-[#DDD5C5]">
                  Select {journeyType === 'intercity' ? 'Intercity Hub' : 'Metro Terminal'}
                </div>
                {fromSuggestions.length === 0 ? (
                  <div className="px-3 py-3 text-xs text-[#66635C] italic text-center">
                    No configured terminal matching "{from}"
                  </div>
                ) : (
                  fromSuggestions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setFrom(item);
                        setIsFromOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#F5F1E8] transition-colors ${
                        item.toLowerCase() === from.toLowerCase()
                          ? 'font-bold text-[#20352F] bg-[#F5F1E8]/70'
                          : 'text-[#171A1D]'
                      }`}
                    >
                      <span>{item}</span>
                      <span className="text-[10px] font-mono text-[#5F8F72]">
                        {journeyType === 'intercity' ? 'Motorway Bay' : 'Feeder Bay'}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Swap Origin & Destination Button */}
          <div className="md:col-span-1 flex justify-center pb-0.5">
            <button
              type="button"
              id="search-swap-btn"
              onClick={handleSwap}
              title="Swap Origin and Destination"
              aria-label="Swap Origin and Destination"
              className={`w-10 h-10 rounded-xl bg-white border border-[#DDD5C5] hover:border-[#C79A45] text-[#20352F] hover:text-[#C79A45] flex items-center justify-center transition-all shadow-sm ${
                swapAnim ? 'rotate-180 scale-110 text-[#C79A45]' : ''
              }`}
            >
              <ArrowLeftRight className="w-4 h-4 transition-transform duration-300" />
            </button>
          </div>

          {/* Destination Searchable Input */}
          <div ref={toRef} className="relative md:col-span-4 space-y-1.5">
            <label
              htmlFor="search-to-input"
              className="text-xs font-semibold uppercase tracking-wider text-[#20352F] flex items-center justify-between"
            >
              <span>{journeyType === 'intercity' ? 'Arrival City' : 'Drop-off Stop'}</span>
              <span className="text-[10px] font-mono text-[#66635C] font-normal">Destination</span>
            </label>
            <div className="relative">
              <input
                id="search-to-input"
                type="text"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setIsToOpen(true);
                }}
                onFocus={() => setIsToOpen(true)}
                placeholder={journeyType === 'intercity' ? 'e.g. Islamabad, Peshawar...' : 'e.g. Secretariat, Airport...'}
                className={`w-full pl-9 pr-3.5 py-2.5 text-xs font-semibold rounded-lg bg-white border text-[#171A1D] placeholder-[#A9A59B] transition-colors focus:outline-none ${
                  isIdentical
                    ? 'border-[#D64545] focus:border-[#D64545]'
                    : 'border-[#DDD5C5] focus:border-[#C79A45]'
                }`}
                autoComplete="off"
              />
              <MapPin className="w-4 h-4 text-[#5F8F72] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Suggestions Dropdown */}
            {isToOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-30 max-h-56 overflow-y-auto rounded-xl bg-white border border-[#DDD5C5] shadow-lg py-1">
                <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase text-[#66635C] bg-[#FAF7F1] border-b border-[#DDD5C5]">
                  Select {journeyType === 'intercity' ? 'Destination City' : 'Drop-off Stop'}
                </div>
                {toSuggestions.length === 0 ? (
                  <div className="px-3 py-3 text-xs text-[#66635C] italic text-center">
                    No configured terminal matching "{to}"
                  </div>
                ) : (
                  toSuggestions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setTo(item);
                        setIsToOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#F5F1E8] transition-colors ${
                        item.toLowerCase() === to.toLowerCase()
                          ? 'font-bold text-[#20352F] bg-[#F5F1E8]/70'
                          : 'text-[#171A1D]'
                      }`}
                    >
                      <span>{item}</span>
                      <span className="text-[10px] font-mono text-[#5F8F72]">
                        {journeyType === 'intercity' ? 'Motorway Terminus' : 'Metro Bay'}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Date Picker */}
          <div className="md:col-span-3 space-y-1.5">
            <label
              htmlFor="search-date-input"
              className="text-xs font-semibold uppercase tracking-wider text-[#20352F] flex items-center justify-between"
            >
              <span>Travel Date</span>
              <span className="text-[10px] font-mono text-[#66635C] font-normal">Depart</span>
            </label>
            <div className="relative">
              <input
                id="search-date-input"
                type="date"
                min={todayStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full pl-9 pr-3.5 py-2.5 text-xs font-semibold rounded-lg bg-white border text-[#171A1D] transition-colors focus:outline-none ${
                  isPastDate
                    ? 'border-[#D64545] focus:border-[#D64545]'
                    : 'border-[#DDD5C5] focus:border-[#C79A45]'
                }`}
              />
              <Calendar className="w-4 h-4 text-[#C79A45] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Second Row: Passenger Count & Submit Button */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end pt-2">
          {/* Passenger Count Selector */}
          <div className="sm:col-span-5 space-y-1.5">
            <label
              htmlFor="search-passengers-select"
              className="text-xs font-semibold uppercase tracking-wider text-[#20352F] flex items-center justify-between"
            >
              <span>Passenger Seats</span>
              <span className="text-[10px] font-mono text-[#66635C] font-normal">Max 6 per booking</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  id="search-passengers-select"
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs font-semibold rounded-lg bg-white border border-[#DDD5C5] text-[#171A1D] focus:outline-none focus:border-[#C79A45]"
                >
                  <option value={1}>1 Passenger (Single Seat)</option>
                  <option value={2}>2 Passengers (Pair / Companion)</option>
                  <option value={3}>3 Passengers (Family / Group)</option>
                  <option value={4}>4 Passengers (Full Row)</option>
                  <option value={5}>5 Passengers</option>
                  <option value={6}>6 Passengers (Maximum Online)</option>
                </select>
                <Users className="w-4 h-4 text-[#C79A45] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Quick Stepper Buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPassengers(Math.max(1, passengers - 1))}
                  disabled={passengers <= 1}
                  className="w-9 h-[38px] rounded-lg bg-white border border-[#DDD5C5] text-sm font-bold text-[#171A1D] hover:border-[#C79A45] disabled:opacity-40 transition-colors"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setPassengers(Math.min(6, passengers + 1))}
                  disabled={passengers >= 6}
                  className="w-9 h-[38px] rounded-lg bg-white border border-[#DDD5C5] text-sm font-bold text-[#171A1D] hover:border-[#C79A45] disabled:opacity-40 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Quick Route Shortcuts */}
          <div className="sm:col-span-4 space-y-1 hidden lg:block">
            <span className="text-[10px] font-mono font-semibold uppercase text-[#66635C] block">
              Popular Quick Pick:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {journeyType === 'intercity' ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setFrom('Lahore');
                      setTo('Islamabad');
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white border border-[#DDD5C5] hover:border-[#C79A45] text-[#20352F] transition-colors"
                  >
                    Lahore ⇄ Islamabad
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFrom('Lahore');
                      setTo('Karachi');
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white border border-[#DDD5C5] hover:border-[#C79A45] text-[#20352F] transition-colors"
                  >
                    Lahore ⇄ Karachi
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setFrom('Thokar Niaz Baig');
                      setTo('Railway Station');
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white border border-[#DDD5C5] hover:border-[#C79A45] text-[#20352F] transition-colors"
                  >
                    Thokar ⇄ Railway Stn
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFrom('Faizabad Metro Hub');
                      setTo('Pakistan Secretariat');
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white border border-[#DDD5C5] hover:border-[#C79A45] text-[#20352F] transition-colors"
                  >
                    Faizabad ⇄ Secretariat
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Search Button */}
          <div className="sm:col-span-7 lg:col-span-3 flex justify-end">
            <Button
              type="submit"
              id="search-submit-btn"
              disabled={!isFormValid}
              size="md"
              className="w-full h-[40px] flex items-center justify-center gap-2 text-xs font-semibold shadow-brass disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="w-4 h-4" />
              <span>Search Buses</span>
            </Button>
          </div>
        </div>
      </form>

      {/* Footer Feature Note */}
      <div className="mt-5 pt-3.5 border-t border-[#DDD5C5] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#66635C] font-mono">
        <span className="flex items-center gap-1.5 text-[#5F8F72] font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Verified departures across Motorways & Metro corridors
        </span>
        <span className="text-[#C79A45] flex items-center gap-1.5 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C79A45]" />
          Zero booking fees • CNIC verified tickets
        </span>
      </div>
    </div>
  );
}
