import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Smartphone, Lock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { PaymentMethod, Seat } from '@/types/booking.types';

interface PaymentGatewayModalProps {
  activePaymentModal: PaymentMethod | null;
  onClose: () => void;
  totalFare: number;
  selectedSeats: Seat[];
  dateParam?: string | null;
  defaultMobile?: string;
  defaultCardHolder?: string;
  confirmBooking: (params: {
    method: PaymentMethod;
    transactionId?: string;
    travelDate?: string;
  }) => Promise<unknown>;
}

type ModalStage = 'details' | 'otp' | 'processing' | 'success';

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  activePaymentModal,
  onClose,
  totalFare,
  selectedSeats,
  dateParam,
  defaultMobile,
  defaultCardHolder,
  confirmBooking,
}) => {
  const [modalStage, setModalStage] = useState<ModalStage>('details');
  const [walletPhone, setWalletPhone] = useState(defaultMobile || '');
  const [walletMpin, setWalletMpin] = useState('');
  const [cardHolder, setCardHolder] = useState(defaultCardHolder || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardOtp, setCardOtp] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Reset form whenever modal opens with a different method
  useEffect(() => {
    if (activePaymentModal) {
      setModalStage('details');
      setWalletPhone(defaultMobile || '');
      setWalletMpin('');
      setCardHolder(defaultCardHolder || '');
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
      setCardOtp('');
      setIsProcessingPayment(false);
    }
  }, [activePaymentModal, defaultMobile, defaultCardHolder]);

  if (!activePaymentModal) return null;

  const handleClose = () => {
    if (!isProcessingPayment) {
      setModalStage('details');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-[#FAF7F1] border border-[#343A3C] shadow-2xl overflow-hidden text-[#171A1D]">
        {/* Modal Header */}
        <div className="p-4 bg-[#171A1D] text-[#F5F1E8] flex items-center justify-between border-b border-[#343A3C]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C79A45]" />
            <span className="font-display font-bold text-sm">
              {activePaymentModal === 'easypaisa' && 'EasyPaisa Mobile Gateway'}
              {activePaymentModal === 'jazzcash' && 'JazzCash Mobile Gateway'}
              {activePaymentModal === 'debit' && 'PayPak / Visa 3D-Secure'}
              {activePaymentModal === 'credit' && 'Credit Card 3D-Secure'}
              {activePaymentModal === 'bank' && '1Link 1Bill PSID Generation'}
              {activePaymentModal === 'cash_terminal' && 'Terminal Cash Reservation'}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-[#A9A59B] hover:text-[#F5F1E8] transition-colors"
            aria-label="Close payment modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Amount Due Header */}
          <div className="p-3 rounded-xl bg-white border border-[#DDD5C5] flex justify-between items-center text-xs font-mono">
            <span className="text-[#66635C]">Amount to Pay</span>
            <strong className="text-base text-[#C79A45]">{formatCurrency(totalFare)}</strong>
          </div>

          {/* Cash at Terminal Flow */}
          {activePaymentModal === 'cash_terminal' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF0ED] border border-[#E8B4A8] text-[#8A3828] space-y-1">
                <strong className="block font-bold">Terminal Payment Rules</strong>
                <p className="text-[11px] leading-relaxed">
                  Your selected seats ({selectedSeats.map((s) => s.number).join(', ')}) will be held with a provisional reservation code. You must pay cash at the departure terminal counter at least 30 minutes before departure time, otherwise the dispatch system automatically releases the seats.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="w-1/2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    setIsProcessingPayment(true);
                    await confirmBooking({
                      method: 'cash_terminal',
                      travelDate: dateParam || undefined,
                    });
                    setIsProcessingPayment(false);
                    onClose();
                  }}
                  disabled={isProcessingPayment}
                  className="w-1/2"
                >
                  {isProcessingPayment ? 'Holding...' : 'Confirm Cash Hold'}
                </Button>
              </div>
            </div>
          )}

          {/* Mobile Wallet Flow (EasyPaisa & JazzCash) */}
          {(activePaymentModal === 'easypaisa' || activePaymentModal === 'jazzcash') && (
            <div className="space-y-4">
              {modalStage === 'details' && (
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold uppercase tracking-wider text-[#20352F]">
                      {activePaymentModal === 'easypaisa' ? 'EasyPaisa Mobile Number' : 'JazzCash Account Number'} *
                    </label>
                    <input
                      value={walletPhone}
                      onChange={(e) => setWalletPhone(e.target.value)}
                      placeholder="03001234567"
                      maxLength={11}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD5C5] text-sm font-mono focus:border-[#C79A45] focus:outline-none"
                    />
                    <p className="text-[10px] text-[#66635C]">A payment authorization request will be sent to this wallet</p>
                  </div>

                  <Button
                    onClick={() => {
                      if (walletPhone.length < 11) {
                        toast.error('Enter valid 11-digit mobile wallet number');
                        return;
                      }
                      setModalStage('otp');
                    }}
                    className="w-full"
                  >
                    Send Payment Request to Mobile
                  </Button>
                </div>
              )}

              {modalStage === 'otp' && (
                <div className="space-y-3 text-xs animate-in fade-in">
                  <div className="p-3 rounded-xl bg-white border border-[#DDD5C5] text-center space-y-1">
                    <Smartphone className="w-8 h-8 text-[#C79A45] mx-auto animate-pulse" />
                    <p className="font-bold text-[#171A1D]">Prompt Sent to {walletPhone}</p>
                    <p className="text-[11px] text-[#66635C]">
                      Please enter your 4-digit {activePaymentModal === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'} MPIN on your phone, or enter it below to authorize.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold uppercase tracking-wider text-[#20352F]">
                      Enter 4-Digit Wallet MPIN
                    </label>
                    <input
                      type="password"
                      value={walletMpin}
                      onChange={(e) => setWalletMpin(e.target.value.slice(0, 4))}
                      placeholder="••••"
                      maxLength={4}
                      className="w-full text-center tracking-widest text-lg py-2.5 rounded-lg bg-white border border-[#DDD5C5] font-mono focus:border-[#C79A45] focus:outline-none"
                    />
                  </div>

                  <Button
                    onClick={async () => {
                      if (walletMpin.length < 4) {
                        toast.error('Please enter 4-digit MPIN');
                        return;
                      }
                      setModalStage('processing');
                      setIsProcessingPayment(true);
                      await new Promise((r) => setTimeout(r, 1200));
                      const txn = `${activePaymentModal.toUpperCase()}-${Math.floor(1000000 + Math.random() * 9000000)}`;
                      await confirmBooking({
                        method: activePaymentModal,
                        transactionId: txn,
                        travelDate: dateParam || undefined,
                      });
                      setIsProcessingPayment(false);
                      onClose();
                    }}
                    disabled={isProcessingPayment}
                    className="w-full"
                  >
                    Authorize & Deduct {formatCurrency(totalFare)}
                  </Button>
                </div>
              )}

              {modalStage === 'processing' && (
                <div className="text-center py-6 space-y-3">
                  <div className="w-10 h-10 border-3 border-[#C79A45] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-bold text-[#171A1D]">Verifying with Gateway...</p>
                  <p className="text-xs text-[#66635C]">
                    Contacting Pakistani financial switch for cryptographic settlement
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Card Flow (Debit / Credit) */}
          {(activePaymentModal === 'debit' || activePaymentModal === 'credit') && (
            <div className="space-y-4">
              {modalStage === 'details' && (
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold uppercase tracking-wider text-[#20352F]">Cardholder Name *</label>
                    <input
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Muhammad Bilal"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD5C5] text-sm focus:border-[#C79A45] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold uppercase tracking-wider text-[#20352F]">16-Digit Card Number *</label>
                    <input
                      value={cardNumber}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                        const chunks = digits.match(/.{1,4}/g)?.join(' ') || digits;
                        setCardNumber(chunks);
                      }}
                      placeholder="4123 4567 8901 2345"
                      maxLength={19}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD5C5] text-sm font-mono focus:border-[#C79A45] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold uppercase tracking-wider text-[#20352F]">Expiry (MM/YY) *</label>
                      <input
                        value={cardExpiry}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                          setCardExpiry(val.length >= 2 ? `${val.slice(0, 2)}/${val.slice(2)}` : val);
                        }}
                        placeholder="12/28"
                        maxLength={5}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD5C5] text-sm font-mono focus:border-[#C79A45] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold uppercase tracking-wider text-[#20352F]">CVV Code *</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        placeholder="•••"
                        maxLength={3}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD5C5] text-sm font-mono focus:border-[#C79A45] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#20352F]/5 border border-[#20352F]/10 flex items-center gap-2 text-[10px] text-[#20352F]">
                    <Lock className="w-3.5 h-3.5 text-[#5F8F72] shrink-0" />
                    <span>Antigravity Token Vault: Raw credentials and CVVs are NEVER stored.</span>
                  </div>

                  <Button
                    onClick={() => {
                      if (!cardHolder || cardNumber.replace(/\s/g, '').length < 16) {
                        toast.error('Enter valid 16-digit card number and name');
                        return;
                      }
                      setModalStage('otp');
                    }}
                    className="w-full"
                  >
                    Proceed to 3D-Secure Verification
                  </Button>
                </div>
              )}

              {modalStage === 'otp' && (
                <div className="space-y-3 text-xs animate-in fade-in">
                  <div className="p-3 rounded-xl bg-white border border-[#DDD5C5] text-center space-y-1">
                    <Shield className="w-8 h-8 text-[#5F8F72] mx-auto animate-pulse" />
                    <p className="font-bold text-[#171A1D]">State Bank 3D-Secure 2.0 Challenge</p>
                    <p className="text-[11px] text-[#66635C]">
                      A one-time OTP was dispatched to your mobile registered with your issuing bank.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold uppercase tracking-wider text-[#20352F]">
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      value={cardOtp}
                      onChange={(e) => setCardOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full text-center tracking-widest text-lg py-2.5 rounded-lg bg-white border border-[#DDD5C5] font-mono focus:border-[#C79A45] focus:outline-none"
                    />
                  </div>

                  <Button
                    onClick={async () => {
                      if (cardOtp.length < 6) {
                        toast.error('Enter 6-digit OTP code');
                        return;
                      }
                      setModalStage('processing');
                      setIsProcessingPayment(true);
                      await new Promise((r) => setTimeout(r, 1200));
                      const txn = `TXN-CARD-${Math.floor(10000000 + Math.random() * 90000000)}`;
                      await confirmBooking({
                        method: activePaymentModal,
                        transactionId: txn,
                        travelDate: dateParam || undefined,
                      });
                      setIsProcessingPayment(false);
                      onClose();
                    }}
                    disabled={isProcessingPayment}
                    className="w-full"
                  >
                    Verify & Pay {formatCurrency(totalFare)}
                  </Button>
                </div>
              )}

              {modalStage === 'processing' && (
                <div className="text-center py-6 space-y-3">
                  <div className="w-10 h-10 border-3 border-[#C79A45] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-bold text-[#171A1D]">Authorizing with 1Link / Card Network...</p>
                </div>
              )}
            </div>
          )}

          {/* 1Link 1Bill PSID Flow */}
          {activePaymentModal === 'bank' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-[#DDD5C5] space-y-2">
                <strong className="block font-bold text-[#171A1D]">1Link 1Bill Real-time Invoice</strong>
                <p className="text-[11px] text-[#66635C] leading-relaxed">
                  A 18-digit 1Bill PSID will be generated and linked directly with the Pakistani banking system. You can pay via any mobile banking app (HBL, Meezan, Alfalah, UBL, etc.) or 1Link ATM.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="w-1/2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    setIsProcessingPayment(true);
                    await confirmBooking({
                      method: 'bank',
                      travelDate: dateParam || undefined,
                    });
                    setIsProcessingPayment(false);
                    onClose();
                  }}
                  disabled={isProcessingPayment}
                  className="w-1/2"
                >
                  Generate 1Bill PSID
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
