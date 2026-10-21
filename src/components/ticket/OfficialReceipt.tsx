import { Booking } from '@/types/booking.types';
import { formatCurrency, maskCNIC, maskMobile } from '@/lib/utils';
import { Building, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';

interface OfficialReceiptProps {
  booking: Booking;
}

export function OfficialReceipt({ booking }: OfficialReceiptProps) {
  const invoiceNumber = `INV-${booking.bookingDate ? booking.bookingDate.slice(0, 10).replace(/-/g, '') : '20261019'}-${booking.id.slice(-4)}`;
  const invoiceDate = booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }) : '19 Oct 2026';
  const seatCount = booking.seats?.length || 1;
  const baseFareTotal = booking.fareBreakdown?.baseFare || (booking.totalFare - seatCount * 50);
  const terminalFeeTotal = booking.fareBreakdown?.terminalFee || (seatCount * 50);
  const taxesTotal = booking.fareBreakdown?.taxes || 0;
  const grandTotal = booking.totalFare;

  return (
    <div className="max-w-2xl mx-auto rounded-3xl bg-white border border-[#DDD5C5] shadow-card-warm p-6 sm:p-10 font-sans text-[#171A1D] print:shadow-none print:border-black print:rounded-none">
      {/* Top Invoice Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-[#171A1D]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-2xl tracking-tight text-[#171A1D]">
              Asaan<span className="text-[#C79A45]">Safar</span>
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#20352F] text-[#C79A45] font-mono font-bold">
              TAX INVOICE
            </span>
          </div>
          <p className="text-xs text-[#66635C] mt-1">
            Asaan Safar Intercity Bus Services Ltd.
          </p>
          <div className="text-[11px] font-mono text-[#66635C] mt-1 space-y-0.5">
            <p>NTN: 8492019-3 • STRN: 32778761234</p>
            <p>HQ: 14-B Motorway Commercial Arcade, Thokar Niaz Baig, Lahore</p>
          </div>
        </div>

        <div className="sm:text-right font-mono text-xs space-y-1">
          <div>
            <span className="text-[#66635C] block text-[10px] uppercase">Invoice Number</span>
            <strong className="text-[#171A1D] text-sm">{invoiceNumber}</strong>
          </div>
          <div>
            <span className="text-[#66635C] block text-[10px] uppercase">Date of Issuance</span>
            <span>{invoiceDate}</span>
          </div>
          <div>
            <span className="text-[#66635C] block text-[10px] uppercase">Booking Reference / PNR</span>
            <strong className="text-[#C79A45]">{booking.pnr || booking.id}</strong>
          </div>
        </div>
      </div>

      {/* Bill To & Journey Summary */}
      <div className="grid sm:grid-cols-2 gap-6 py-6 border-b border-[#DDD5C5] text-xs">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#66635C] block mb-1">
            BILLED TO (PASSENGER)
          </span>
          <p className="font-bold text-sm text-[#171A1D]">{booking.passengerInfo.fullName}</p>
          <p className="font-mono text-[#66635C]">CNIC: {maskCNIC(booking.passengerInfo.cnic)}</p>
          <p className="font-mono text-[#66635C]">Contact: {maskMobile(booking.passengerInfo.mobile)}</p>
          {booking.passengerInfo.emergencyContact && (
            <p className="font-mono text-[#66635C]">Emergency: {booking.passengerInfo.emergencyContact}</p>
          )}
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#66635C] block mb-1">
            TRAVEL & ROUTE SUMMARY
          </span>
          <p className="font-bold text-sm text-[#171A1D]">{booking.routeName}</p>
          <p className="text-[#66635C]">Operator: {booking.operatorName || 'Daewoo Express'}</p>
          <p className="font-mono text-[#66635C]">
            Departure: {booking.departureTime || '06:00'} • {booking.travelDate || 'Today'}
          </p>
          <p className="font-mono text-[#66635C]">
            Seats: <strong className="text-[#171A1D]">{booking.seats.map((s) => s.number).join(', ')}</strong> ({seatCount} passenger{seatCount > 1 ? 's' : ''})
          </p>
        </div>
      </div>

      {/* Itemized Fare Table */}
      <div className="py-6">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-[#DDD5C5] text-[10px] uppercase font-mono text-[#66635C]">
              <th className="pb-2">Description</th>
              <th className="pb-2 text-center">Qty / Seats</th>
              <th className="pb-2 text-right">Unit Rate</th>
              <th className="pb-2 text-right">Amount (PKR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDD5C5]/60 font-mono">
            <tr>
              <td className="py-3 font-sans">
                <span className="font-semibold block text-[#171A1D]">Intercity Coach Passenger Fare</span>
                <span className="text-[11px] text-[#66635C]">
                  {booking.routeName} ({booking.busType} class)
                </span>
              </td>
              <td className="py-3 text-center">{seatCount}</td>
              <td className="py-3 text-right">{formatCurrency(Math.round(baseFareTotal / seatCount))}</td>
              <td className="py-3 text-right font-bold">{formatCurrency(baseFareTotal)}</td>
            </tr>
            <tr>
              <td className="py-3 font-sans">
                <span className="font-semibold block text-[#171A1D]">Terminal Infrastructure Fee</span>
                <span className="text-[11px] text-[#66635C]">
                  Terminal facility fee (Rs. 50 / seat)
                </span>
              </td>
              <td className="py-3 text-center">{seatCount}</td>
              <td className="py-3 text-right">Rs. 50</td>
              <td className="py-3 text-right font-bold">{formatCurrency(terminalFeeTotal)}</td>
            </tr>
            <tr>
              <td className="py-3 font-sans">
                <span className="font-semibold block text-[#171A1D]">Sales Tax / FED</span>
                <span className="text-[11px] text-[#66635C]">
                  Passenger transport exemption
                </span>
              </td>
              <td className="py-3 text-center">-</td>
              <td className="py-3 text-right">0%</td>
              <td className="py-3 text-right font-bold">Rs. 0</td>
            </tr>
          </tbody>
        </table>

        {/* Totals Calculation */}
        <div className="pt-4 border-t border-[#171A1D] flex justify-end">
          <div className="w-64 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-[#66635C]">
              <span>Subtotal:</span>
              <span>{formatCurrency(baseFareTotal)}</span>
            </div>
            <div className="flex justify-between text-[#66635C]">
              <span>Terminal Fee:</span>
              <span>{formatCurrency(terminalFeeTotal)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#171A1D] pt-2 border-t border-[#DDD5C5]">
              <span>Total Paid:</span>
              <span className="text-[#20352F]">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Settlement Information Block */}
      <div className="p-4 rounded-2xl bg-[#FAF7F1] border border-[#DDD5C5] text-xs space-y-2 font-mono">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-sans font-bold text-[#20352F]">
            <CheckCircle2 className="w-4 h-4 text-[#5F8F72]" />
            <span>PAYMENT SETTLEMENT RECEIPT</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#5F8F72]/20 text-[#5F8F72] text-[10px] font-bold uppercase">
            {booking.paymentStatus === 'paid' ? 'TRANSACTION SETTLED' : booking.paymentStatus.toUpperCase()}
          </span>
        </div>
        <div className="grid sm:grid-cols-3 gap-2 text-[11px] text-[#66635C] pt-1">
          <div>
            <span className="block text-[10px] uppercase">Payment Method</span>
            <strong className="text-[#171A1D] uppercase">{booking.paymentMethod}</strong>
          </div>
          <div>
            <span className="block text-[10px] uppercase">Transaction / Auth Code</span>
            <span className="text-[#171A1D]">{booking.transactionId || 'COUNTER-CASH'}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase">Settlement Network</span>
            <span className="text-[#171A1D]">1Link / SBP Cleared</span>
          </div>
        </div>
      </div>

      {/* Official Stamp & Sign Off */}
      <div className="mt-8 pt-6 border-t border-[#DDD5C5] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-[#A9A59B]">
        <p>This is a computer-generated tax invoice and booking receipt.</p>
        <div className="text-right">
          <span className="block text-[#171A1D] font-bold">ASAAN SAFAR TICKETING</span>
          <span>Digital Signature • Valid without physical stamp</span>
        </div>
      </div>
    </div>
  );
}
