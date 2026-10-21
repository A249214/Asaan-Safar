import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '@/services/booking.service';
import { Booking } from '@/types/booking.types';
import { Button } from '@/components/ui/button';
import {
  Search,
  Ticket,
  Lock,
  Printer,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency, maskCNIC } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function FindBookingPage() {
  const navigate = useNavigate();
  const [pnrInput, setPnrInput] = useState('');
  const [verifyInput, setVerifyInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<Booking | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSearchResult(null);

    if (!pnrInput.trim()) {
      toast.error('Please enter a Booking Reference or PNR');
      return;
    }
    if (!verifyInput.trim()) {
      toast.error('Please enter the registered mobile number or CNIC last 4 digits');
      return;
    }

    setIsSearching(true);
    try {
      const res = await bookingService.findBooking(pnrInput.trim(), verifyInput.trim());
      setSearchResult(res.data);
      toast.success('Booking verified successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lookup failed';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickSample = (pnr: string, verify: string) => {
    setPnrInput(pnr);
    setVerifyInput(verify);
    setErrorMsg(null);
    bookingService.findBooking(pnr, verify).then((res) => {
      setSearchResult(res.data);
      toast.success('Sample booking verified!');
    }).catch((err) => {
      setErrorMsg(err.message);
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] py-10 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#20352F]/10 border border-[#20352F]/20 text-xs font-mono text-[#20352F]">
            <Lock className="w-3.5 h-3.5 text-[#C79A45]" />
            <span>Ticket Verification</span>
          </div>
          <h1 className="text-3xl font-display font-black text-[#171A1D]">
            Find Your Ticket
          </h1>
          <p className="text-sm text-[#66635C] max-w-md mx-auto">
            Enter your PNR reference and registered mobile number or CNIC to view your e-ticket.
          </p>
        </div>

        {/* Verification Form Card */}
        <div className="rounded-3xl bg-white border border-[#DDD5C5] shadow-card-warm p-6 sm:p-8 space-y-6">
          <form onSubmit={handleLookup} className="space-y-4">
            {/* PNR Field */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold uppercase tracking-wider text-[#20352F] flex items-center justify-between">
                <span>Booking Reference / PNR *</span>
                <span className="text-[10px] text-[#A9A59B] font-mono">e.g. TPK-93A8B1</span>
              </label>
              <input
                placeholder="Enter PNR code or Booking ID (e.g. TPK-93A8B1)"
                value={pnrInput}
                onChange={(e) => setPnrInput(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF7F1] border border-[#DDD5C5] text-sm font-mono uppercase text-[#171A1D] focus:border-[#C79A45] focus:outline-none"
              />
            </div>

            {/* Verification Challenge */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold uppercase tracking-wider text-[#20352F] flex items-center justify-between">
                <span>Passenger Verification (Mobile or CNIC) *</span>
                <span className="text-[10px] text-[#A9A59B]">Verification</span>
              </label>
              <input
                placeholder="Enter registered mobile number (03001234567) or CNIC last 4 digits"
                value={verifyInput}
                onChange={(e) => setVerifyInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF7F1] border border-[#DDD5C5] text-sm font-mono text-[#171A1D] focus:border-[#C79A45] focus:outline-none"
              />
              <p className="text-[10px] text-[#66635C]">
                Enter the mobile number or CNIC provided during booking.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSearching}
              className="w-full py-3.5 bg-[#20352F] hover:bg-[#162521] text-[#F5F1E8] font-semibold shadow-brass text-sm"
            >
              <Search className="w-4 h-4 mr-2 text-[#C79A45]" />
              {isSearching ? 'Finding Ticket...' : 'Find Ticket'}
            </Button>
          </form>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-[#B85C4A]/10 border border-[#B85C4A]/30 flex items-start gap-3 text-xs text-[#B85C4A] animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Verification Failed</strong>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          {/* Quick Demo Test Chips */}
          <div className="pt-4 border-t border-[#DDD5C5]/70 space-y-2 text-xs">
            <span className="text-[10px] font-mono text-[#66635C] block">
              Quick Test Credentials:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickSample('TPK-93A8B1', '03001234567')}
                className="px-2.5 py-1 rounded-lg bg-[#FAF7F1] border border-[#DDD5C5] hover:border-[#C79A45] font-mono text-[11px] text-[#20352F] transition-colors"
              >
                TPK-93A8B1 (03001234567)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSample('SNR-418K02', '03217654321')}
                className="px-2.5 py-1 rounded-lg bg-[#FAF7F1] border border-[#DDD5C5] hover:border-[#C79A45] font-mono text-[11px] text-[#20352F] transition-colors"
              >
                SNR-418K02 (03217654321)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSample('RAW-782M99', '03339876543')}
                className="px-2.5 py-1 rounded-lg bg-[#FAF7F1] border border-[#DDD5C5] hover:border-[#C79A45] font-mono text-[11px] text-[#20352F] transition-colors"
              >
                RAW-782M99 (03339876543)
              </button>
            </div>
          </div>
        </div>

        {/* Found Result Preview Card */}
        {searchResult && (
          <div className="rounded-3xl bg-white border-2 border-[#5F8F72] shadow-xl p-6 sm:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-[#DDD5C5]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#5F8F72]">
                <CheckCircle2 className="w-5 h-5" />
                <span>BOOKING FOUND</span>
              </div>
              <span className="font-mono font-extrabold text-sm text-[#C79A45]">
                {searchResult.pnr || searchResult.id}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#66635C] uppercase block">Route</span>
                <p className="font-bold text-base text-[#171A1D]">{searchResult.routeName}</p>
                <p className="text-[#66635C]">{searchResult.operatorName}</p>
              </div>

              <div className="space-y-1 sm:text-right">
                <span className="text-[10px] font-mono text-[#66635C] uppercase block">Schedule</span>
                <p className="font-bold text-[#171A1D]">{searchResult.departureTime || '06:00'} HRS</p>
                <p className="font-mono text-[#66635C]">{searchResult.travelDate || 'Today'}</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#DDD5C5]/60">
                <span className="text-[10px] font-mono text-[#66635C] uppercase block">Passenger</span>
                <p className="font-bold text-[#171A1D]">{searchResult.passengerInfo.fullName}</p>
                <p className="font-mono text-[#66635C]">CNIC: {maskCNIC(searchResult.passengerInfo.cnic)}</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#DDD5C5]/60 sm:text-right">
                <span className="text-[10px] font-mono text-[#66635C] uppercase block">Seats & Fare</span>
                <p className="font-bold text-[#171A1D]">
                  Seats: {searchResult.seats.map((s) => s.number).join(', ')}
                </p>
                <p className="font-mono text-[#5F8F72] font-semibold">
                  {formatCurrency(searchResult.totalFare)} ({searchResult.paymentStatus.toUpperCase()})
                </p>
              </div>
            </div>

            {/* Call to action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate(`/ticket/${searchResult.pnr || searchResult.id}`)}
                className="w-full sm:w-1/2 py-3 bg-[#20352F] hover:bg-[#162521] text-[#F5F1E8] font-semibold shadow-brass text-xs"
              >
                <Ticket className="w-4 h-4 mr-2 text-[#C79A45]" />
                View Boarding Pass
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/ticket/${searchResult.pnr || searchResult.id}`)}
                className="w-full sm:w-1/2 py-3 border-[#DDD5C5] text-xs text-[#171A1D]"
              >
                <Printer className="w-4 h-4 mr-2" />
                View Receipt
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
