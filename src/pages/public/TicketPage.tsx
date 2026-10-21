import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Booking } from '@/types/booking.types';
import { bookingService } from '@/services/booking.service';
import { DigitalBoardingPass } from '@/components/ticket/DigitalBoardingPass';
import { OfficialReceipt } from '@/components/ticket/OfficialReceipt';
import { CancellationModal } from '@/components/ticket/CancellationModal';
import { Button } from '@/components/ui/button';
import {
  Printer,
  ShieldCheck,
  ArrowLeft,
  XCircle,
  FileText,
  Ticket as TicketIcon,
  HelpCircle,
  Search,
  Share2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function TicketPage() {
  const { pnrOrId } = useParams<{ pnrOrId?: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pass' | 'receipt' | 'policy'>('pass');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [manualQuery, setManualQuery] = useState('');

  const loadBooking = async (targetId: string) => {
    setIsLoading(true);
    try {
      const res = await bookingService.getBookingById(targetId);
      if (res.data) {
        setBooking(res.data);
      } else {
        setBooking(null);
      }
    } catch {
      setBooking(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (pnrOrId) {
      loadBooking(pnrOrId);
    } else {
      // Look up most recent booking from service
      bookingService.getBookings().then(({ data }) => {
        if (data && data.length > 0) {
          setBooking(data[0]);
        }
        setIsLoading(false);
      });
    }
  }, [pnrOrId]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Ticket link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation / Actions Bar (Hidden during Print) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDD5C5] print:hidden">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/booking')}
              className="gap-1.5 text-xs bg-white text-[#171A1D] border-[#DDD5C5] hover:bg-[#FAF7F1]"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Book Another Trip
            </Button>
            <Link to="/find-booking" className="text-xs text-[#20352F] hover:text-[#C79A45] font-semibold transition-colors">
              Find Another Ticket
            </Link>
          </div>

          {booking && (
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-1.5 text-xs bg-white text-[#171A1D] border-[#DDD5C5] hover:bg-[#FAF7F1]"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </Button>

              <Button
                size="sm"
                onClick={handlePrint}
                className="gap-1.5 text-xs bg-[#20352F] hover:bg-[#162521] text-[#F5F1E8] shadow-brass"
              >
                <Printer className="w-3.5 h-3.5 text-[#C79A45]" /> Print Ticket
              </Button>

              {booking.status !== 'cancelled' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCancelModalOpen(true)}
                  className="gap-1.5 text-xs bg-white text-[#B85C4A] border-[#B85C4A]/40 hover:bg-[#B85C4A]/10"
                >
                  <XCircle className="w-3.5 h-3.5" /> Cancel Booking
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#DDD5C5] space-y-3">
            <div className="w-10 h-10 border-3 border-[#C79A45] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-[#171A1D]">Loading ticket details...</p>
          </div>
        )}

        {/* Not Found View */}
        {!isLoading && !booking && (
          <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-[#DDD5C5] shadow-card-warm text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#B85C4A]/10 border border-[#B85C4A]/20 flex items-center justify-center text-[#B85C4A] mx-auto">
              <Search className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-display font-bold text-[#171A1D]">Ticket Not Found</h2>
            <p className="text-xs text-[#66635C]">
              No active booking found matching reference &quot;{pnrOrId}&quot;. Please verify the PNR code from your confirmation SMS.
            </p>
            <div className="flex gap-2">
              <input
                placeholder="Enter PNR (e.g. TPK-93A8B1)"
                value={manualQuery}
                onChange={(e) => setManualQuery(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-[#FAF7F1] border border-[#DDD5C5] text-xs font-mono uppercase"
              />
              <Button
                size="sm"
                onClick={() => {
                  if (manualQuery.trim()) navigate(`/ticket/${manualQuery.trim().toUpperCase()}`);
                }}
              >
                Find Ticket
              </Button>
            </div>
          </div>
        )}

        {/* Content with View Tabs */}
        {!isLoading && booking && (
          <div className="space-y-6">
            {/* View Switcher Tabs (Hidden during Print) */}
            <div className="flex justify-center print:hidden">
              <div className="inline-flex p-1.5 rounded-2xl bg-white border border-[#DDD5C5] shadow-sm">
                <button
                  type="button"
                  onClick={() => setActiveTab('pass')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'pass'
                      ? 'bg-[#20352F] text-[#F5F1E8] shadow-sm'
                      : 'text-[#66635C] hover:text-[#171A1D]'
                  }`}
                >
                  <TicketIcon className="w-3.5 h-3.5 text-[#C79A45]" />
                  <span>Boarding Pass</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('receipt')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'receipt'
                      ? 'bg-[#20352F] text-[#F5F1E8] shadow-sm'
                      : 'text-[#66635C] hover:text-[#171A1D]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-[#C79A45]" />
                  <span>Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('policy')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'policy'
                      ? 'bg-[#20352F] text-[#F5F1E8] shadow-sm'
                      : 'text-[#66635C] hover:text-[#171A1D]'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#C79A45]" />
                  <span>Refund Policy</span>
                </button>
              </div>
            </div>

            {/* TAB 1: BOARDING PASS */}
            {activeTab === 'pass' && <DigitalBoardingPass booking={booking} />}

            {/* TAB 2: OFFICIAL TAX INVOICE & RECEIPT */}
            {activeTab === 'receipt' && <OfficialReceipt booking={booking} />}

            {/* TAB 3: POLICY & FAQS */}
            {activeTab === 'policy' && (
              <div className="max-w-2xl mx-auto rounded-3xl bg-white border border-[#DDD5C5] p-6 sm:p-8 space-y-6 shadow-card-warm text-xs text-[#171A1D]">
                <div className="flex items-center gap-3 pb-4 border-b border-[#DDD5C5]">
                  <div className="w-10 h-10 rounded-xl bg-[#20352F]/10 border border-[#20352F]/20 flex items-center justify-center text-[#20352F]">
                    <ShieldCheck className="w-5 h-5 text-[#C79A45]" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base">
                      Cancellation & Refund Policy
                    </h3>
                    <p className="text-[11px] text-[#66635C]">
                      Terms for {booking.operatorName || 'Daewoo Express'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#FAF7F1] border border-[#DDD5C5] space-y-2">
                    <span className="font-bold text-[#171A1D] block">Refund Slabs</span>
                    <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                      <div className="p-2 rounded bg-white border border-[#DDD5C5]">
                        <span className="block text-[#66635C]">&gt; 24h prior:</span>
                        <strong className="text-[#5F8F72]">100% Base Fare</strong>
                      </div>
                      <div className="p-2 rounded bg-white border border-[#DDD5C5]">
                        <span className="block text-[#66635C]">12h to 24h:</span>
                        <strong className="text-[#20352F]">75% Base Fare</strong>
                      </div>
                      <div className="p-2 rounded bg-white border border-[#DDD5C5]">
                        <span className="block text-[#66635C]">2h to 12h:</span>
                        <strong className="text-[#C79A45]">50% Base Fare</strong>
                      </div>
                      <div className="p-2 rounded bg-white border border-[#DDD5C5]">
                        <span className="block text-[#66635C]">&lt; 2h / Missed:</span>
                        <strong className="text-[#B85C4A]">Non-Refundable</strong>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-[#66635C] leading-relaxed">
                    <p>
                      <strong>Terminal Check-In:</strong> Passengers must arrive at the terminal 15 minutes before scheduled departure. Unpaid reservations are released 30 minutes before departure.
                    </p>
                    <p>
                      <strong>Identity Verification:</strong> Every passenger must carry their original CNIC or valid government photo ID for gate verification.
                    </p>
                    <p>
                      <strong>Baggage Allowance:</strong> Standard ticket includes 1 checked bag up to 20kg. Hazardous or undeclared commercial freight is not permitted.
                    </p>
                  </div>

                  {booking.status !== 'cancelled' && (
                    <div className="pt-4 border-t border-[#DDD5C5] flex justify-end">
                      <Button
                        onClick={() => setIsCancelModalOpen(true)}
                        className="bg-[#B85C4A] hover:bg-[#A34B3A] text-white text-xs"
                      >
                        Cancel Booking
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cancellation Modal */}
        {booking && (
          <CancellationModal
            booking={booking}
            isOpen={isCancelModalOpen}
            onClose={() => setIsCancelModalOpen(false)}
            onSuccess={(updated) => {
              setBooking(updated);
            }}
          />
        )}
      </div>
    </div>
  );
}
