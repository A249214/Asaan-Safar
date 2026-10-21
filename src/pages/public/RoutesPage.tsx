import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { bookingService } from '@/services/booking.service';
import {
  Route,
  DepartureBoardEntry,
  JourneyType,
  DeparturePeriod,
  RouteSortOption,
  Amenity,
} from '@/types/booking.types';
import {
  DEPARTURE_BOARD,
  INTERCITY_CITIES,
  LOCAL_STOPS,
  OPERATORS,
} from '@/lib/mock-data';
import {
  Bus,
  MapPin,
  Radio,
  ArrowLeftRight,
  Calendar,
  X,
  Navigation,
  AlertCircle,
  Activity,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  Zap,
  Wifi,
  DoorOpen,
  Coffee,
  Armchair,
} from 'lucide-react';
import { useDepartureBoardUpdates } from '@/hooks/use-websocket';
import { EmptyState } from '@/components/ui/empty-state';
import { DepartureStatusBadge } from '@/components/ui/status-badge';
import { RouteCardSkeleton } from '@/components/ui/skeleton';
import { JourneyCard } from '@/components/booking/JourneyCard';

export default function RoutesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [board] = useState<DepartureBoardEntry[]>(DEPARTURE_BOARD);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Derive active filters directly from URL searchParams
  const filters = useMemo(() => {
    const rawAmen = searchParams.get('amenities');
    return {
      journeyType: searchParams.get('type') || 'all',
      from: searchParams.get('from') || '',
      to: searchParams.get('to') || '',
      date: searchParams.get('date') || '',
      passengers: searchParams.get('passengers') || '1',
      city: searchParams.get('city') || '',
      luxury: searchParams.get('luxury') || '',
      operatorId: searchParams.get('operator') || 'all',
      departurePeriod: (searchParams.get('period') as DeparturePeriod) || 'all',
      minFare: searchParams.get('minFare') || '',
      maxFare: searchParams.get('maxFare') || '',
      maxDurationMinutes: searchParams.get('maxDuration') || '',
      sortBy: (searchParams.get('sort') as RouteSortOption) || 'departure_asc',
      selectedAmenities: rawAmen ? (rawAmen.split(',') as Amenity[]) : ([] as Amenity[]),
    };
  }, [searchParams]);

  const {
    journeyType,
    from,
    to,
    date,
    passengers,
    city,
    luxury,
    operatorId,
    departurePeriod,
    minFare,
    maxFare,
    maxDurationMinutes,
    sortBy,
    selectedAmenities,
  } = filters;

  const todayStr = new Date().toISOString().split('T')[0];
  const isIdentical =
    from.trim() !== '' &&
    to.trim() !== '' &&
    from.trim().toLowerCase() === to.trim().toLowerCase();

  useDepartureBoardUpdates();

  // Fetch routes based on active filters and sorting
  useEffect(() => {
    setIsLoading(true);
    bookingService
      .getRoutes({
        journeyType: journeyType !== 'all' ? (journeyType as JourneyType) : undefined,
        from: from || undefined,
        to: to || undefined,
        city: city || undefined,
        luxury: luxury || undefined,
        operatorId: operatorId !== 'all' ? operatorId : undefined,
        departurePeriod: departurePeriod !== 'all' ? departurePeriod : undefined,
        minFare: minFare ? Number(minFare) : undefined,
        maxFare: maxFare ? Number(maxFare) : undefined,
        maxDurationMinutes: maxDurationMinutes ? Number(maxDurationMinutes) : undefined,
        passengers: passengers ? Number(passengers) : undefined,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
        sortBy,
      })
      .then((r) => {
        setRoutes(r.data);
        setIsLoading(false);
      });
  }, [
    journeyType,
    from,
    to,
    city,
    luxury,
    operatorId,
    departurePeriod,
    minFare,
    maxFare,
    maxDurationMinutes,
    passengers,
    selectedAmenities,
    sortBy,
  ]);

  // Apply updates to URL query string
  const applyFiltersToUrl = (updates: Record<string, string | null>) => {
    const current = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (!val || val === 'all' || val === '') {
        current.delete(key);
      } else {
        current.set(key, val);
      }
    });
    setSearchParams(current, { replace: true });
  };

  // Swap Origin and Destination
  const handleSwap = () => {
    applyFiltersToUrl({ from: to, to: from });
  };

  // Toggle single amenity
  const handleToggleAmenity = (amenity: Amenity) => {
    const next = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];
    applyFiltersToUrl({ amenities: next.length > 0 ? next.join(',') : null });
  };

  // Clear all filters
  const handleClearAll = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // Autocomplete suggestions based on journey type
  const availableLocations = useMemo(() => {
    if (journeyType === 'intercity') return INTERCITY_CITIES;
    if (journeyType === 'local') return LOCAL_STOPS;
    return [...INTERCITY_CITIES, ...LOCAL_STOPS];
  }, [journeyType]);

  // Active query badges
  const activeFilters = useMemo(() => {
    const list: { key: string; label: string; value: string }[] = [];
    if (journeyType && journeyType !== 'all') {
      list.push({
        key: 'type',
        label: 'Type',
        value: journeyType === 'intercity' ? 'Intercity Motorway' : 'Local Metro',
      });
    }
    if (from) list.push({ key: 'from', label: 'From', value: from });
    if (to) list.push({ key: 'to', label: 'To', value: to });
    if (date) list.push({ key: 'date', label: 'Date', value: date });
    if (passengers && passengers !== '1') {
      list.push({ key: 'passengers', label: 'Seats', value: `${passengers} Seats` });
    }
    if (operatorId && operatorId !== 'all') {
      const op = OPERATORS.find((o) => o.id === operatorId);
      list.push({ key: 'operator', label: 'Operator', value: op ? op.name : operatorId });
    }
    if (departurePeriod && departurePeriod !== 'all') {
      const periodLabels: Record<string, string> = {
        morning: 'Morning (05:00 - 12:00)',
        afternoon: 'Afternoon (12:00 - 17:00)',
        evening: 'Evening (17:00 - 21:00)',
        night: 'Night (21:00 - 05:00)',
      };
      list.push({
        key: 'period',
        label: 'Period',
        value: periodLabels[departurePeriod] || departurePeriod,
      });
    }
    if (luxury) list.push({ key: 'luxury', label: 'Class', value: luxury });
    if (minFare) list.push({ key: 'minFare', label: 'Min Fare', value: `≥ Rs. ${minFare}` });
    if (maxFare) list.push({ key: 'maxFare', label: 'Max Fare', value: `≤ Rs. ${maxFare}` });
    if (maxDurationMinutes) {
      list.push({
        key: 'maxDuration',
        label: 'Duration',
        value: `≤ ${Math.round(Number(maxDurationMinutes) / 60)}h`,
      });
    }
    if (selectedAmenities.length > 0) {
      list.push({
        key: 'amenities',
        label: 'Amenities',
        value: `${selectedAmenities.length} selected`,
      });
    }
    return list;
  }, [
    journeyType,
    from,
    to,
    date,
    passengers,
    operatorId,
    departurePeriod,
    luxury,
    minFare,
    maxFare,
    maxDurationMinutes,
    selectedAmenities,
  ]);

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#171A1D]">
      {/* Top Banner: Highway Dispatch Identity */}
      <div className="bg-[#171A1D] text-[#F5F1E8] border-b border-[#343A3C] py-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#20352F] border border-[#343A3C] text-[11px] font-mono text-[#C79A45] mb-2 uppercase tracking-wider">
              <Bus className="w-3.5 h-3.5" />
              <span>آسان سفر • Intercity Corridor Timetables</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#F5F1E8]">
              Intercity Bus Schedules & Departures
            </h1>
            <p className="text-sm text-[#DDD5C5]/90 mt-1">
              Compare verified bus operators, departure times, terminal bays, and fares across Pakistan
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Journey Type Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="inline-flex p-1 rounded-xl bg-[#EBE5D8] border border-[#DDD5C5]">
            <button
              type="button"
              id="filter-type-all"
              onClick={() => applyFiltersToUrl({ type: 'all' })}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                journeyType === 'all'
                  ? 'bg-[#20352F] text-[#F5F1E8] shadow-sm'
                  : 'text-[#66635C] hover:text-[#171A1D]'
              }`}
            >
              All Departures
            </button>
            <button
              type="button"
              id="filter-type-intercity"
              onClick={() => applyFiltersToUrl({ type: 'intercity' })}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                journeyType === 'intercity'
                  ? 'bg-[#20352F] text-[#F5F1E8] shadow-sm'
                  : 'text-[#66635C] hover:text-[#171A1D]'
              }`}
            >
              <Bus className="w-3.5 h-3.5 text-[#C79A45]" />
              <span>Intercity Motorway</span>
            </button>
            <button
              type="button"
              id="filter-type-local"
              onClick={() => applyFiltersToUrl({ type: 'local' })}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                journeyType === 'local'
                  ? 'bg-[#20352F] text-[#F5F1E8] shadow-sm'
                  : 'text-[#66635C] hover:text-[#171A1D]'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-[#C79A45]" />
              <span>Local Metro Feeder</span>
            </button>
          </div>

          {/* Quick Counter */}
          <div className="text-xs font-mono text-[#66635C] flex items-center gap-2">
            <span>
              Showing <strong className="text-[#171A1D]">{routes.length}</strong> matching departures
            </span>
            {routes.some((r) => r.availableSeats === 0 || r.isAvailable === false) && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#D64545]/10 text-[#D64545] font-semibold border border-[#D64545]/20">
                Some departures full
              </span>
            )}
          </div>
        </div>

        {/* Invalid Journey Alert (Origin === Destination) */}
        {isIdentical && (
          <div className="mb-6 p-4 rounded-xl bg-[#D64545]/10 border border-[#D64545]/30 text-[#D64545] text-xs flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                <strong>Invalid Route Selection:</strong> Departure ({from}) and Arrival ({to})
                cannot be the same terminal or city. Please choose different locations.
              </span>
            </div>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs underline font-semibold hover:text-[#171A1D]"
            >
              Reset
            </button>
          </div>
        )}

        {/* Search & Filter Hub - Warm Paper Canvas */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F1] border border-[#DDD5C5] shadow-card-warm mb-8">
          {/* Top Row: Origin, Destination, Date, Seats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
            {/* Origin */}
            <div className="lg:col-span-3 space-y-1">
              <label className="text-[11px] font-semibold text-[#66635C] uppercase block">
                Origin / Departure
              </label>
              <div className="relative">
                <input
                  list="locations-from-list"
                  id="routes-filter-from"
                  placeholder="e.g. Lahore, Thokar..."
                  value={from}
                  onChange={(e) => applyFiltersToUrl({ from: e.target.value })}
                  className={`w-full pl-8 pr-3 py-2 text-xs font-semibold rounded-lg bg-white border text-[#171A1D] focus:outline-none ${
                    isIdentical ? 'border-[#D64545]' : 'border-[#DDD5C5] focus:border-[#C79A45]'
                  }`}
                />
                <MapPin className="w-3.5 h-3.5 text-[#C79A45] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <datalist id="locations-from-list">
                  {availableLocations.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Swap Button */}
            <div className="lg:col-span-1 flex justify-center pb-0.5">
              <button
                type="button"
                id="routes-swap-btn"
                onClick={handleSwap}
                title="Swap Origin and Destination"
                className="w-9 h-9 rounded-lg bg-white border border-[#DDD5C5] hover:border-[#C79A45] text-[#20352F] hover:text-[#C79A45] flex items-center justify-center transition-all shadow-xs"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Destination */}
            <div className="lg:col-span-3 space-y-1">
              <label className="text-[11px] font-semibold text-[#66635C] uppercase block">
                Destination / Drop-off
              </label>
              <div className="relative">
                <input
                  list="locations-to-list"
                  id="routes-filter-to"
                  placeholder="e.g. Islamabad, Secretariat..."
                  value={to}
                  onChange={(e) => applyFiltersToUrl({ to: e.target.value })}
                  className={`w-full pl-8 pr-3 py-2 text-xs font-semibold rounded-lg bg-white border text-[#171A1D] focus:outline-none ${
                    isIdentical ? 'border-[#D64545]' : 'border-[#DDD5C5] focus:border-[#C79A45]'
                  }`}
                />
                <MapPin className="w-3.5 h-3.5 text-[#5F8F72] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <datalist id="locations-to-list">
                  {availableLocations.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Travel Date */}
            <div className="lg:col-span-2 space-y-1">
              <label className="text-[11px] font-semibold text-[#66635C] uppercase block">
                Travel Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={todayStr}
                  id="routes-filter-date"
                  value={date}
                  onChange={(e) => applyFiltersToUrl({ date: e.target.value })}
                  className="w-full pl-8 pr-2.5 py-2 text-xs font-semibold rounded-lg bg-white border border-[#DDD5C5] text-[#171A1D] focus:outline-none focus:border-[#C79A45]"
                />
                <Calendar className="w-3.5 h-3.5 text-[#C79A45] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Passenger Count */}
            <div className="lg:col-span-1 space-y-1">
              <label className="text-[11px] font-semibold text-[#66635C] uppercase block">
                Seats
              </label>
              <select
                id="routes-filter-passengers"
                value={passengers}
                onChange={(e) => applyFiltersToUrl({ passengers: e.target.value })}
                className="w-full px-2 py-2 text-xs font-semibold rounded-lg bg-white border border-[#DDD5C5] text-[#171A1D] focus:outline-none focus:border-[#C79A45]"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="lg:col-span-2 space-y-1">
              <label className="text-[11px] font-semibold text-[#66635C] uppercase block flex items-center justify-between">
                <span>Sort Schedules</span>
                <ArrowUpDown className="w-3 h-3 text-[#C79A45]" />
              </label>
              <select
                id="routes-sort-select"
                value={sortBy}
                onChange={(e) => applyFiltersToUrl({ sort: e.target.value as RouteSortOption })}
                className="w-full px-2.5 py-2 text-xs font-semibold rounded-lg bg-white border border-[#DDD5C5] text-[#171A1D] focus:outline-none focus:border-[#C79A45]"
              >
                <option value="departure_asc">Departure: Earliest First</option>
                <option value="departure_desc">Departure: Latest First</option>
                <option value="fare_asc">Fare: Lowest First</option>
                <option value="fare_desc">Fare: Highest First</option>
                <option value="duration_asc">Duration: Fastest First</option>
                <option value="seats_desc">Available: Most Seats</option>
                <option value="price-asc" className="hidden">Fare: Lowest First</option>
                <option value="price-desc" className="hidden">Fare: Highest First</option>
              </select>
            </div>
          </div>

          {/* Secondary Row: Departure Periods Pills & Advanced Filters Toggle */}
          <div className="mt-4 pt-3.5 border-t border-[#DDD5C5] flex flex-wrap items-center justify-between gap-3">
            {/* Departure Period Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono font-semibold uppercase text-[#66635C] mr-1">
                Departure Time:
              </span>
              {(
                [
                  { id: 'all', label: 'All Day' },
                  { id: 'morning', label: 'Morning (05:00 - 12:00)' },
                  { id: 'afternoon', label: 'Afternoon (12:00 - 17:00)' },
                  { id: 'evening', label: 'Evening (17:00 - 21:00)' },
                  { id: 'night', label: 'Night (21:00 - 05:00)' },
                ] as const
              ).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  id={`period-btn-${p.id}`}
                  onClick={() => applyFiltersToUrl({ period: p.id === 'all' ? null : p.id })}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    departurePeriod === p.id
                      ? 'bg-[#20352F] text-[#F5F1E8] font-bold shadow-2xs'
                      : 'bg-white border border-[#DDD5C5] text-[#66635C] hover:text-[#171A1D] hover:border-[#C79A45]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Toggle Advanced Filters Button */}
            <button
              type="button"
              id="toggle-advanced-filters"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#DDD5C5] text-[#20352F] hover:border-[#C79A45] transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C79A45]" />
              <span>{showAdvancedFilters ? 'Hide Filters' : 'More Filters'}</span>
            </button>
          </div>

          {/* Advanced Filters Expandable Drawer */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-[#DDD5C5] space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Operator Filter */}
                <div>
                  <label className="text-[11px] font-semibold text-[#66635C] uppercase block mb-1">
                    Operator
                  </label>
                  <select
                    id="filter-operator-select"
                    value={operatorId}
                    onChange={(e) => applyFiltersToUrl({ operator: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#DDD5C5] text-[#171A1D] focus:outline-none focus:border-[#C79A45]"
                  >
                    <option value="all">All Operators</option>
                    {OPERATORS.map((op) => (
                      <option key={op.id} value={op.id}>
                        {op.name} ({op.rating}★)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Luxury Coach Class */}
                <div>
                  <label className="text-[11px] font-semibold text-[#66635C] uppercase block mb-1">
                    Bus Class
                  </label>
                  <select
                    id="filter-luxury-select"
                    value={luxury}
                    onChange={(e) => applyFiltersToUrl({ luxury: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#DDD5C5] text-[#171A1D] focus:outline-none focus:border-[#C79A45]"
                  >
                    <option value="">All Classes</option>
                    <option value="standard">Standard Economy</option>
                    <option value="executive">Executive Express</option>
                    <option value="luxury">Luxury Starliner</option>
                    <option value="business">Business Class Sleeper</option>
                  </select>
                </div>

                {/* Max Duration */}
                <div>
                  <label className="text-[11px] font-semibold text-[#66635C] uppercase block mb-1">
                    Max Duration
                  </label>
                  <select
                    id="filter-duration-select"
                    value={maxDurationMinutes}
                    onChange={(e) => applyFiltersToUrl({ maxDuration: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#DDD5C5] text-[#171A1D] focus:outline-none focus:border-[#C79A45]"
                  >
                    <option value="">Any Duration</option>
                    <option value="180">Up to 3 Hours</option>
                    <option value="300">Up to 5 Hours</option>
                    <option value="600">Up to 10 Hours</option>
                    <option value="900">Up to 15 Hours</option>
                  </select>
                </div>

                {/* Fare Range Inputs */}
                <div>
                  <label className="text-[11px] font-semibold text-[#66635C] uppercase block mb-1">
                    Max Fare (PKR)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 3000"
                    value={maxFare}
                    onChange={(e) => applyFiltersToUrl({ maxFare: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#DDD5C5] text-[#171A1D] focus:outline-none focus:border-[#C79A45]"
                  />
                </div>
              </div>

              {/* Amenities Filter Pills */}
              <div>
                <span className="text-[11px] font-semibold text-[#66635C] uppercase block mb-1.5">
                  Verified Onboard Amenities Required:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { id: 'wifi', label: '4G Wi-Fi', icon: Wifi },
                      { id: 'ac', label: 'AC Climate Control', icon: Zap },
                      { id: 'reclining_seats', label: 'Recliners', icon: Armchair },
                      { id: 'refreshments', label: 'Complimentary Snacks', icon: Coffee },
                      { id: 'washroom', label: 'Washroom Onboard', icon: DoorOpen },
                      { id: 'usb_charging', label: 'USB Fast Charging', icon: Zap },
                    ] as const
                  ).map(({ id, label, icon: Icon }) => {
                    const isSelected = selectedAmenities.includes(id as Amenity);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleToggleAmenity(id as Amenity)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                          isSelected
                            ? 'bg-[#20352F] text-[#F5F1E8] font-bold border border-[#20352F]'
                            : 'bg-white border border-[#DDD5C5] text-[#66635C] hover:border-[#C79A45]'
                        }`}
                      >
                        <Icon
                          className={`w-3.5 h-3.5 ${isSelected ? 'text-[#C79A45]' : 'text-[#66635C]'}`}
                        />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Active Query Badges Bar */}
          {activeFilters.length > 0 && (
            <div className="mt-4 pt-3.5 border-t border-[#DDD5C5] flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold uppercase text-[#66635C] mr-1">
                  Active Filter Criteria:
                </span>
                {activeFilters.map((f) => (
                  <span
                    key={f.key}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#DDD5C5] text-xs font-medium text-[#171A1D] shadow-2xs"
                  >
                    <span className="text-[#66635C] font-normal">{f.label}:</span>
                    <strong className="text-[#20352F]">{f.value}</strong>
                    <button
                      type="button"
                      onClick={() => applyFiltersToUrl({ [f.key]: null })}
                      className="hover:text-[#D64545] ml-0.5"
                      title={`Remove ${f.label}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <button
                type="button"
                id="reset-all-filters-btn"
                onClick={handleClearAll}
                className="text-xs font-mono font-semibold text-[#D64545] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Results Main Layout */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column: Journey Cards List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDD5C5]">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-display font-bold text-[#171A1D]">
                  Available Buses
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#EBE5D8] text-[#20352F]">
                  {routes.length} options
                </span>
              </div>
              <span className="text-xs text-[#66635C] font-mono">
                Live seat availability
              </span>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <RouteCardSkeleton />
                <RouteCardSkeleton />
                <RouteCardSkeleton />
              </div>
            ) : routes.length === 0 ? (
              <EmptyState
                title="No Matching Scheduled Departures Found"
                description={
                  from && to
                    ? `No configured direct departures found between ${from} and ${to} with your current filter criteria. Try expanding the departure time, clearing operator filters, or swapping direction (${to} ⇄ ${from}).`
                    : 'No routes match your specific filter criteria. Reset your filters to view all scheduled motorway corridors and city metro feeder lines.'
                }
                actionLabel="View All Configured Routes"
                onAction={handleClearAll}
              />
            ) : (
              routes.map((route) => (
                <JourneyCard
                  key={route.id}
                  route={route}
                  searchDate={date}
                  passengers={Number(passengers) || 1}
                />
              ))
            )}
          </div>

          {/* Right Column: Terminal Departure Board */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-[#22272A] border border-[#343A3C] shadow-card-dark text-[#F5F1E8]">
              <div className="flex items-center justify-between pb-3 border-b border-[#343A3C] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#5F8F72] animate-pulse" />
                  <h3 className="font-display font-bold text-sm text-[#F5F1E8]">
                    Terminal Departures Board
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#C79A45] flex items-center gap-1">
                  <Radio className="w-3 h-3" /> Live Updates
                </span>
              </div>

              <div className="space-y-3">
                {board.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3.5 rounded-xl bg-[#171A1D] border border-[#343A3C] space-y-2 hover:border-[#C79A45]/40 transition-colors"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="px-2 py-0.5 rounded bg-[#20352F] text-[#C79A45] font-mono font-bold text-[11px] border border-[#343A3C]">
                        {entry.platform}
                      </span>
                      <DepartureStatusBadge status={entry.status} />
                    </div>

                    <div>
                      <p className="font-semibold text-sm text-[#F5F1E8]">{entry.route}</p>
                      <p className="text-[11px] text-[#A9A59B] font-mono mt-0.5">
                        Bus: <strong className="text-[#F5F1E8]">{entry.busNumber}</strong> • Captain: {entry.driver}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#343A3C]/60 flex justify-between items-center text-xs font-mono">
                      <span className="text-[#A9A59B] text-[10px]">SCHEDULED DEP</span>
                      <span className="text-[#C79A45] font-bold">{entry.departureTime}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#343A3C] flex items-center justify-between text-[11px] text-[#A9A59B]">
                <span className="flex items-center gap-1 text-[#5F8F72]">
                  <Activity className="w-3 h-3" /> GPS Synchronized
                </span>
                <Link to="/tracking" className="text-[#C79A45] hover:underline font-mono">
                  Live Tracking Map →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
