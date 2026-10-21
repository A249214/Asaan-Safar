import { useState } from 'react';
import { Booking } from '@/types/booking.types';
import { CancellationRefundQuote } from '@/types/ticket.types';
import { bookingService } from '@/services/booking.service';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, HelpCircle, ShieldAlert, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CancellationModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: Booking, quote: CancellationRefundQuote) => void;
}

export function CancellationModal({ booking, isOpen, onClose, onSuccess }: CancellationModalProps) {
  const [reason, setReason] = useState('Change of travel plan');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const quote = bookingService.calculateRefundQuote(booking);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const res = await bookingService.cancelBookingWithRefund(booking.id, reason);
      toast.success(
        quote.refundableAmount > 0
          ? `Booking cancelled. Refund of ${formatCurrency(quote.refundableAmount)} initiated!`
          : 'Booking cancelled. Seats released.'
      );
      onSuccess(res.data.booking, res.data.refundQuote);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Cancellation failed';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#DDD5C5] shadow-2xl p-6 sm:p-8 space-y-6 text-[#171A1D]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#FAF7F1] text-[#66635C] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#B85C4A]/15 border border-[#B85C4A]/30 flex items-center justify-center text-[#B85C4A] shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-[#171A1D]">
              Cancel Booking
            </h3>
            <p className="text-xs text-[#66635C] font-mono">
              PNR: <strong className="text-[#C79A45]">{booking.pnr || booking.id}</strong> • {booking.routeName}
            </p>
          </div>
        </div>

        {/* Dynamic Refund Quote Calculator */}
        <div className="p-4 rounded-xl bg-[#FAF7F1] border border-[#DDD5C5] space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#DDD5C5]">
            <span className="font-semibold text-[#66635C] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#C79A45]" /> Time until Departure:
            </span>
            <span className="font-mono font-bold text-sm text-[#171A1D]">
              {quote.hoursUntilDeparture} Hours
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between text-[#66635C]">
              <span>Applicable Policy:</span>
              <span className="font-semibold text-[#171A1D]">{quote.policyTier}</span>
            </div>
            <div className="flex justify-between text-[#66635C]">
              <span>Original Fare Paid:</span>
              <span>{formatCurrency(quote.originalFare)}</span>
            </div>
            <div className="flex justify-between text-[#B85C4A]">
              <span>Cancellation Fee:</span>
              <span>-{formatCurrency(quote.cancellationFee)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#DDD5C5] text-sm font-bold text-[#5F8F72]">
              <span>Net Refundable Amount:</span>
              <span>{formatCurrency(quote.refundableAmount)}</span>
            </div>
          </div>
        </div>

        {/* Policy Summary Notice */}
        <div className="p-3 rounded-lg bg-[#20352F]/5 border border-[#20352F]/10 text-[11px] text-[#20352F] space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#C79A45]" />
            Cancellation Policy:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-[#66635C]">
            <li>&gt; 24h prior: 100% Base Fare refund</li>
            <li>12h to 24h prior: 75% Base Fare refund</li>
            <li>2h to 12h prior: 50% Base Fare refund</li>
            <li>&lt; 2h prior: Non-refundable</li>
          </ul>
        </div>

        {/* Cancellation Reason Selector */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold uppercase tracking-wider text-[#20352F]">
            Reason for Cancellation *
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD5C5] text-sm focus:outline-none focus:border-[#C79A45]"
          >
            <option value="Change of travel plan">Change of travel plans</option>
            <option value="Emergency medical situation">Medical emergency</option>
            <option value="Accidental duplicate booking">Duplicate booking</option>
            <option value="Weather or road closure concern">Weather or road conditions</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-1/2"
          >
            Keep Booking
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-1/2 bg-[#B85C4A] hover:bg-[#A34B3A] text-white"
          >
            {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
          </Button>
        </div>
      </div>
    </div>
  );
}
