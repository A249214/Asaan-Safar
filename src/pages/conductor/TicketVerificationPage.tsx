import { useState } from 'react';
import { useTicketStore } from '@/stores/ticket.store';
import { TicketStatus } from '@/types/ticket.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Search, CheckCircle2, XCircle, UserCheck, ShieldCheck, Bus, Smartphone, ArrowRight } from 'lucide-react';

const statusVariant: Record<TicketStatus, 'success' | 'warning' | 'default' | 'danger'> = {
  valid: 'success',
  expired: 'warning',
  used: 'default',
  refunded: 'danger',
  cancelled: 'danger',
  unpaid_reservation: 'warning',
  invalid: 'danger',
};

export default function TicketVerificationPage() {
  const { currentTicket, validationResult, isLoading, validateTicket, boardPassenger, lookupPassenger } = useTicketStore();
  const [qrInput, setQrInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Awaited<ReturnType<typeof lookupPassenger>>>([]);

  const handleValidate = () => {
    if (qrInput.trim()) validateTicket(qrInput.trim());
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const results = await lookupPassenger(searchQuery.trim());
      setSearchResults(results);
    }
  };

  const handleQuickSample = (code: string) => {
    setQrInput(code);
    validateTicket(code);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Handheld Terminal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#343A3C]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#20352F] border border-[#343A3C] text-[11px] font-mono text-[#C79A45] mb-2 uppercase tracking-wider">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Gate Scanner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#F5F1E8] flex items-center gap-2.5">
            <QrCode className="w-7 h-7 text-[#C79A45]" />
            <span>Ticket Verification</span>
          </h1>
          <p className="text-xs text-[#A9A59B] mt-1 font-mono">
            Gate 04 • Thokar Niaz Baig Terminal
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#5F8F72] bg-[#5F8F72]/10 px-3 py-1.5 rounded-lg border border-[#5F8F72]/30">
          <span className="w-2 h-2 rounded-full bg-[#5F8F72] animate-ping" />
          <span>Scanner Ready</span>
        </div>
      </div>

      {/* QR Scanner / Manual ID Validation Card */}
      <div className="rounded-2xl bg-[#22272A] border border-[#343A3C] p-6 shadow-card-dark space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-sm text-[#F5F1E8] flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#C79A45]" /> Scan Ticket or Enter Booking ID
          </h2>
          <span className="text-[11px] font-mono text-[#A9A59B]">Auto Verification</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              placeholder="Scan QR or enter Booking ID (e.g. BK-2024-001)"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
              className="w-full px-4 py-3 rounded-xl bg-[#171A1D] border border-[#343A3C] text-[#F5F1E8] text-sm font-mono placeholder:text-[#A9A59B]/50 focus:outline-none focus:border-[#C79A45] focus:ring-1 focus:ring-[#C79A45]"
            />
          </div>
          <Button onClick={handleValidate} disabled={isLoading} size="lg" className="sm:w-36 font-semibold shadow-brass">
            {isLoading ? 'Checking...' : 'Verify Ticket'}
          </Button>
        </div>

        {/* Quick Sample Test Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
          <span className="text-[#A9A59B] text-[11px] font-mono">Sample Tickets:</span>
          <button
            type="button"
            onClick={() => handleQuickSample('QR-BK-2024-001')}
            className="px-2.5 py-1 rounded bg-[#171A1D] border border-[#343A3C] hover:border-[#C79A45] text-[#C79A45] font-mono text-[11px] transition-colors"
          >
            QR-BK-2024-001 (Valid)
          </button>
          <button
            type="button"
            onClick={() => handleQuickSample('BK-2024-002')}
            className="px-2.5 py-1 rounded bg-[#171A1D] border border-[#343A3C] hover:border-[#C79A45] text-[#C79A45] font-mono text-[11px] transition-colors"
          >
            BK-2024-002 (Boarded)
          </button>
        </div>
      </div>

      {/* Validation Result State Card */}
      {validationResult && currentTicket && (
        <div
          className={`rounded-2xl p-6 border shadow-card-dark transition-all duration-300 ${
            validationResult.valid
              ? 'bg-[#20352F]/70 border-[#5F8F72] ring-1 ring-[#5F8F72]/30'
              : 'bg-[#B85C4A]/10 border-[#B85C4A] ring-1 ring-[#B85C4A]/30'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#343A3C]">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  validationResult.valid
                    ? 'bg-[#5F8F72]/20 text-[#5F8F72] border border-[#5F8F72]/40'
                    : 'bg-[#B85C4A]/20 text-[#B85C4A] border border-[#B85C4A]/40'
                }`}
              >
                {validationResult.valid ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : (
                  <XCircle className="w-7 h-7" />
                )}
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-[#F5F1E8]">
                  {validationResult.message}
                </h3>
                <p className="text-xs text-[#A9A59B] font-mono">
                  Booking ID: {currentTicket.id}
                </p>
              </div>
            </div>

            <Badge variant={statusVariant[currentTicket.status]}>
              Status: {currentTicket.status}
            </Badge>
          </div>

          {/* Passenger & Journey Schematic Info */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#171A1D]/80 border border-[#343A3C]">
              <span className="text-[#A9A59B] block text-[10px]">PASSENGER NAME</span>
              <strong className="text-sm font-sans font-bold text-[#F5F1E8]">
                {currentTicket.passengerName}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-[#171A1D]/80 border border-[#343A3C]">
              <span className="text-[#A9A59B] block text-[10px]">CNIC</span>
              <strong className="text-sm font-bold text-[#C79A45]">
                {currentTicket.cnic}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-[#171A1D]/80 border border-[#343A3C]">
              <span className="text-[#A9A59B] block text-[10px]">SEAT NUMBER</span>
              <strong className="text-lg font-bold text-[#5F8F72]">
                Seat {currentTicket.seatNumber}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-[#171A1D]/80 border border-[#343A3C]">
              <span className="text-[#A9A59B] block text-[10px]">ROUTE</span>
              <span className="text-xs font-bold text-[#F5F1E8]">
                {currentTicket.route}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#171A1D]/80 border border-[#343A3C]">
              <span className="text-[#A9A59B] block text-[10px]">DEPARTURE TIME</span>
              <span className="text-xs font-bold text-[#C79A45]">
                {currentTicket.departureTime}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#171A1D]/80 border border-[#343A3C]">
              <span className="text-[#A9A59B] block text-[10px]">STATUS</span>
              <span className="text-xs font-bold text-[#F5F1E8] uppercase">
                {currentTicket.boardingStatus}
              </span>
            </div>
          </div>

          {/* Action Trigger */}
          {validationResult.valid && currentTicket.boardingStatus !== 'boarded' && (
            <div className="mt-5 pt-4 border-t border-[#343A3C] flex justify-end">
              <Button
                size="lg"
                className="w-full sm:w-auto font-bold bg-[#5F8F72] hover:bg-[#7AA78C] text-[#171A1D] border-[#5F8F72] flex items-center justify-center gap-2"
                onClick={() => boardPassenger(currentTicket.id)}
              >
                <UserCheck className="w-5 h-5" />
                <span>Check-In Passenger</span>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Passenger Manual Lookup Card */}
      <div className="rounded-2xl bg-[#22272A] border border-[#343A3C] p-6 shadow-card-dark space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#343A3C]">
          <h2 className="font-display font-bold text-sm text-[#F5F1E8] flex items-center gap-2">
            <Search className="w-4 h-4 text-[#C79A45]" /> Search Passenger List
          </h2>
          <span className="text-[11px] font-mono text-[#A9A59B]">Name, CNIC, or Booking ID</span>
        </div>

        <div className="flex gap-3">
          <input
            placeholder="Search name, CNIC, or Booking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#171A1D] border border-[#343A3C] text-[#F5F1E8] text-sm focus:outline-none focus:border-[#C79A45]"
          />
          <Button onClick={handleSearch} variant="secondary">
            Search
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-2 pt-2">
            {searchResults.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => handleQuickSample(ticket.id)}
                className="p-3.5 rounded-xl bg-[#171A1D] hover:bg-[#20352F] border border-[#343A3C] hover:border-[#C79A45] cursor-pointer transition-all flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-sm text-[#F5F1E8]">{ticket.passengerName}</p>
                  <p className="text-[#A9A59B] font-mono text-[11px] mt-0.5">
                    {ticket.route} • Seat {ticket.seatNumber} • CNIC: {ticket.cnic}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusVariant[ticket.status]}>{ticket.status}</Badge>
                  <ArrowRight className="w-4 h-4 text-[#C79A45]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
