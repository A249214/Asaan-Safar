import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ticketService } from '@/services/ticket.service';
import { TicketValidationResult } from '@/types/ticket.types';
import { Button } from '@/components/ui/button';
import {
  QrCode,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { formatCurrency, maskCNIC } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function PublicVerificationPage() {
  const [searchParams] = useSearchParams();
  const urlPnr = searchParams.get('pnr') || '';
  const urlToken = searchParams.get('token') || '';

  const [inputVal, setInputVal] = useState(urlPnr || (urlToken ? `token=${urlToken}` : ''));
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState<TicketValidationResult | null>(null);

  const runValidation = async (query: string) => {
    if (!query.trim()) return;
    setIsValidating(true);
    try {
      const res = await ticketService.validateTicket(query.trim());
      setResult(res.data);
      if (res.data.valid) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed';
      toast.error(msg);
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    if (urlPnr || urlToken) {
      const query = urlPnr ? (urlToken ? `pnr=${urlPnr}&token=${urlToken}` : urlPnr) : urlToken;
      runValidation(query);
    }
  }, [urlPnr, urlToken]);

  const handleBoardPassenger = async (ticketId: string) => {
    try {
      const res = await ticketService.boardPassenger(ticketId);
      toast.success(`Passenger ${res.data.passengerName} boarded!`);
      if (result) {
        setResult({
          ...result,
          valid: false,
          ticket: res.data,
          message: 'TICKET SCANNED & BOARDED: Passenger admitted at departure gate.',
        });
      }
    } catch {
      toast.error('Failed to board passenger');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] py-10 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#20352F]/10 border border-[#20352F]/20 text-xs font-mono text-[#20352F]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C79A45]" />
            <span>Ticket Verification</span>
          </div>
          <h1 className="text-3xl font-display font-black text-[#171A1D]">
            Verify Ticket
          </h1>
          <p className="text-sm text-[#66635C] max-w-md mx-auto">
            Scan QR code or enter PNR to verify ticket status and passenger details.
          </p>
        </div>

        {/* Verification Input Card */}
        <div className="rounded-3xl bg-white border border-[#DDD5C5] shadow-card-warm p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                placeholder="Scan QR payload or enter PNR (e.g. TPK-93A8B1)"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runValidation(inputVal)}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF7F1] border border-[#DDD5C5] text-sm font-mono text-[#171A1D] focus:border-[#C79A45] focus:outline-none"
              />
            </div>
            <Button
              onClick={() => runValidation(inputVal)}
              disabled={isValidating}
              className="py-3 px-6 bg-[#20352F] hover:bg-[#162521] text-[#F5F1E8] font-semibold shadow-brass text-sm"
            >
              <QrCode className="w-4 h-4 mr-2 text-[#C79A45]" />
              {isValidating ? 'Verifying...' : 'Verify Ticket'}
            </Button>
          </div>

          {/* Quick Test Samples */}
          <div className="flex items-center gap-2 flex-wrap pt-2 text-xs">
            <span className="text-[10px] font-mono text-[#66635C]">Quick Test Samples:</span>
            <button
              type="button"
              onClick={() => {
                setInputVal('TPK-93A8B1');
                runValidation('TPK-93A8B1');
              }}
              className="px-2.5 py-1 rounded bg-[#FAF7F1] border border-[#DDD5C5] hover:border-[#C79A45] font-mono text-[11px] text-[#20352F] transition-colors"
            >
              TPK-93A8B1 (Valid)
            </button>
            <button
              type="button"
              onClick={() => {
                setInputVal('SNR-418K02');
                runValidation('SNR-418K02');
              }}
              className="px-2.5 py-1 rounded bg-[#FAF7F1] border border-[#DDD5C5] hover:border-[#C79A45] font-mono text-[11px] text-[#20352F] transition-colors"
            >
              SNR-418K02 (Valid)
            </button>
            <button
              type="button"
              onClick={() => {
                setInputVal('BK-2024-003');
                runValidation('BK-2024-003');
              }}
              className="px-2.5 py-1 rounded bg-[#FAF7F1] border border-[#DDD5C5] hover:border-[#C79A45] font-mono text-[11px] text-[#20352F] transition-colors"
            >
              BK-2024-003 (Used/Boarded)
            </button>
          </div>
        </div>

        {/* Verification Result Display */}
        {result && (
          <div className="rounded-3xl bg-white border border-[#DDD5C5] shadow-card-warm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Status Banner */}
            {result.valid ? (
              <div className="p-5 bg-[#5F8F72]/15 border-b border-[#5F8F72]/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#5F8F72] text-white flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#171A1D]">
                      Valid Ticket
                    </h3>
                    <p className="text-xs text-[#5F8F72] font-semibold">{result.message}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#5F8F72] text-white text-xs font-mono font-bold uppercase">
                  ACTIVE
                </span>
              </div>
            ) : result.ticket?.status === 'refunded' ? (
              <div className="p-5 bg-[#B85C4A]/15 border-b border-[#B85C4A]/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#B85C4A] text-white flex items-center justify-center">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#B85C4A]">
                      Cancelled Ticket
                    </h3>
                    <p className="text-xs text-[#66635C]">{result.message}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#B85C4A] text-white text-xs font-mono font-bold uppercase">
                  VOID
                </span>
              </div>
            ) : result.ticket?.status === 'used' || result.ticket?.boardingStatus === 'boarded' ? (
              <div className="p-5 bg-[#20352F]/10 border-b border-[#20352F]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#20352F] text-white flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-[#C79A45]" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#171A1D]">
                      Passenger Boarded
                    </h3>
                    <p className="text-xs text-[#66635C]">{result.message}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#20352F] text-[#C79A45] text-xs font-mono font-bold uppercase">
                  BOARDED
                </span>
              </div>
            ) : (
              <div className="p-5 bg-[#B85C4A]/15 border-b border-[#B85C4A]/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#B85C4A] text-white flex items-center justify-center">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#B85C4A]">
                      Invalid Ticket
                    </h3>
                    <p className="text-xs text-[#66635C]">{result.message}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#B85C4A] text-white text-xs font-mono font-bold uppercase">
                  INVALID
                </span>
              </div>
            )}

            {/* Ticket Details (If ticket exists) */}
            {result.ticket && (
              <div className="p-6 sm:p-8 space-y-6 text-xs text-[#171A1D]">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-[#FAF7F1] border border-[#DDD5C5] space-y-1">
                    <span className="text-[10px] font-mono text-[#66635C] uppercase block">
                      Passenger
                    </span>
                    <p className="font-bold text-sm text-[#171A1D]">{result.ticket.passengerName}</p>
                    <p className="font-mono text-[#66635C]">CNIC: {maskCNIC(result.ticket.cnic)}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF7F1] border border-[#DDD5C5] space-y-1 sm:text-right">
                    <span className="text-[10px] font-mono text-[#66635C] uppercase block">
                      Seats
                    </span>
                    <p className="font-bold text-xl font-display text-[#171A1D]">
                      {result.ticket.seatNumber}
                    </p>
                    <p className="font-mono text-[#5F8F72] font-semibold">
                      Fare: {formatCurrency(result.ticket.fare)}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF7F1] border border-[#DDD5C5] space-y-1">
                    <span className="text-[10px] font-mono text-[#66635C] uppercase block">
                      Route & Operator
                    </span>
                    <p className="font-bold text-[#171A1D]">{result.ticket.route}</p>
                    <p className="text-[#66635C]">{result.ticket.operatorName || 'Daewoo Express'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF7F1] border border-[#DDD5C5] space-y-1 sm:text-right">
                    <span className="text-[10px] font-mono text-[#66635C] uppercase block">
                      Departure
                    </span>
                    <p className="font-bold text-[#171A1D]">{result.ticket.departureTime}</p>
                    <p className="font-mono text-[#66635C]">{result.ticket.travelDate}</p>
                  </div>
                </div>

                {/* Authorized Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#DDD5C5]">
                  <Link
                    to={`/ticket/${result.ticket.pnr || result.ticket.bookingId}`}
                    className="text-xs text-[#20352F] hover:text-[#C79A45] font-semibold underline"
                  >
                    View Full Ticket →
                  </Link>

                  {result.valid && result.ticket.boardingStatus !== 'boarded' && (
                    <Button
                      onClick={() => handleBoardPassenger(result.ticket!.id)}
                      className="w-full sm:w-auto bg-[#5F8F72] hover:bg-[#4E7A60] text-white text-xs font-bold"
                    >
                      <UserCheck className="w-4 h-4 mr-1.5" />
                      Check-In Passenger
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
