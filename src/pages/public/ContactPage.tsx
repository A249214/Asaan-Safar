import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send, Clock, ShieldCheck, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Your message has been received! Our customer service team will get back to you shortly.');
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#171A1D]">
      {/* Header Banner - Asphalt Black */}
      <div className="bg-[#171A1D] text-[#F5F1E8] border-b border-[#343A3C] py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#20352F] border border-[#343A3C] text-[11px] font-mono text-[#C79A45] mb-2 uppercase tracking-wider">
            <Phone className="w-3.5 h-3.5" />
            <span>24/7 Passenger Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#F5F1E8]">
            Contact Support
          </h1>
          <p className="text-sm text-[#DDD5C5]/90 mt-1.5 max-w-2xl leading-relaxed">
            Need help with your booking, schedule, or terminal directions? Our support team is available 24/7.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12 max-w-5xl">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Inquiry Form - Warm Card */}
          <div className="lg:col-span-7">
            <div className="card-warm p-6 sm:p-8 rounded-2xl border border-[#DDD5C5] shadow-card-warm">
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-[#DDD5C5]">
                <div className="w-10 h-10 rounded-xl bg-[#20352F] text-[#C79A45] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-[#171A1D]">Send a Message</h2>
                  <p className="text-xs text-[#66635C]">We typically respond within 30 minutes</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#20352F]">
                      Your Name *
                    </label>
                    <input
                      required
                      placeholder="e.g. Tariq Mehmood"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD5C5] text-[#171A1D] text-sm focus:outline-none focus:border-[#C79A45] focus:ring-1 focus:ring-[#C79A45]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#20352F]">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tariq@example.pk"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD5C5] text-[#171A1D] text-sm focus:outline-none focus:border-[#C79A45] focus:ring-1 focus:ring-[#C79A45]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#20352F]">
                    Subject *
                  </label>
                  <select
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD5C5] text-[#171A1D] text-sm focus:outline-none focus:border-[#C79A45] focus:ring-1 focus:ring-[#C79A45]"
                  >
                    <option value="booking">Ticket & Booking Question</option>
                    <option value="schedule">Schedule & Delays</option>
                    <option value="baggage">Lost Property & Baggage</option>
                    <option value="corporate">Charter Coach Booking</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#20352F]">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide your PNR number or journey details if applicable..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DDD5C5] text-[#171A1D] text-sm focus:outline-none focus:border-[#C79A45] focus:ring-1 focus:ring-[#C79A45]"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2 shadow-brass">
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column: Terminal Hubs Directory */}
          <div className="lg:col-span-5 space-y-4">
            {/* Quick Contact Card */}
            <div className="card-warm p-5 rounded-2xl border border-[#DDD5C5] shadow-card-warm space-y-4">
              <h3 className="font-display font-bold text-sm tracking-wide uppercase text-[#20352F] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C79A45]" /> Helplines
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#DDD5C5]">
                  <div className="w-9 h-9 rounded-lg bg-[#20352F] text-[#C79A45] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#66635C] block uppercase font-mono">UAN Toll-Free</span>
                    <strong className="text-sm font-mono text-[#171A1D]">+92 42 111 000 000</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#DDD5C5]">
                  <div className="w-9 h-9 rounded-lg bg-[#20352F] text-[#C79A45] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#66635C] block uppercase font-mono">Support Email</span>
                    <strong className="text-xs text-[#171A1D]">support@asaansafar.pk</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#DDD5C5]">
                  <div className="w-9 h-9 rounded-lg bg-[#20352F] text-[#C79A45] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#66635C] block uppercase font-mono">Operating Hours</span>
                    <strong className="text-xs text-[#171A1D]">24 Hours / 7 Days a Week</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Terminal Addresses */}
            <div className="card-warm p-5 rounded-2xl border border-[#DDD5C5] shadow-card-warm space-y-3">
              <h3 className="font-display font-bold text-sm tracking-wide uppercase text-[#20352F] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C79A45]" /> Major Terminals
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-white border border-[#DDD5C5]">
                  <strong className="text-[#171A1D] block">Lahore Central Terminal</strong>
                  <p className="text-[#66635C] text-[11px] mt-0.5">Thokar Niaz Baig Interchange, Multan Road</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#DDD5C5]">
                  <strong className="text-[#171A1D] block">Islamabad / Rawalpindi Express</strong>
                  <p className="text-[#66635C] text-[11px] mt-0.5">Faizabad Interchange Terminal, Murree Road</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#DDD5C5]">
                  <strong className="text-[#171A1D] block">Karachi Executive Hub</strong>
                  <p className="text-[#66635C] text-[11px] mt-0.5">Sohrab Goth, Super Highway (M-9)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
