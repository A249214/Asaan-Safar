import { Link } from 'react-router-dom';
import { Bus, Facebook, Twitter, Instagram, Mail, Phone, MapPin, ShieldCheck, Clock, Award } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#343A3C] bg-[#171A1D] text-[#F5F1E8]">
      {/* Top feature banner */}
      <div className="border-b border-[#343A3C] bg-[#20352F]/40 py-6">
        <div className="container mx-auto px-4 lg:px-8 grid sm:grid-cols-3 gap-6 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#20352F] border border-[#343A3C] flex items-center justify-center text-[#C79A45] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-[#F5F1E8]">Safety & Reliability</p>
              <p className="text-xs text-[#A9A59B]">GPS tracked fleet and experienced drivers</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#20352F] border border-[#343A3C] flex items-center justify-center text-[#C79A45] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-[#F5F1E8]">Scheduled Departures</p>
              <p className="text-xs text-[#A9A59B]">Daily express schedules across all motorways</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#20352F] border border-[#343A3C] flex items-center justify-center text-[#C79A45] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-[#F5F1E8]">Comfortable Travel</p>
              <p className="text-xs text-[#A9A59B]">Air conditioning, recliners & onboard refreshments</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Company Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#20352F] to-[#162521] border border-[#343A3C] flex items-center justify-center text-[#C79A45]">
                <Bus className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl tracking-tight text-[#F5F1E8]">
                  Asaan<span className="text-[#C79A45]">Safar</span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A9A59B]">
                  Online Bus Ticketing
                </span>
              </div>
            </div>
            <p className="text-sm text-[#A9A59B] leading-relaxed">
              Online bus ticket booking and terminal departures for major routes across Pakistan. Compare operators, reserve your seats, and travel with ease.
            </p>
            <div className="flex gap-2.5 pt-2">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-[#22272A] border border-[#343A3C] flex items-center justify-center text-[#A9A59B] hover:text-[#C79A45] hover:border-[#C79A45]/60 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Routes & Navigation */}
          <div>
            <h4 className="font-display font-semibold text-sm tracking-wider uppercase text-[#F5F1E8] mb-4">
              Intercity Routes
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A9A59B]">
              <li><Link to="/routes" className="hover:text-[#C79A45] transition-colors">Lahore ⇄ Islamabad (M-2)</Link></li>
              <li><Link to="/routes" className="hover:text-[#C79A45] transition-colors">Lahore ⇄ Karachi (M-5 / M-9)</Link></li>
              <li><Link to="/routes" className="hover:text-[#C79A45] transition-colors">Islamabad ⇄ Peshawar (M-1)</Link></li>
              <li><Link to="/routes" className="hover:text-[#C79A45] transition-colors">Lahore ⇄ Faisalabad (M-3)</Link></li>
              <li><Link to="/routes" className="hover:text-[#C79A45] transition-colors">Multan ⇄ Rawalpindi</Link></li>
            </ul>
          </div>

          {/* Terminal Hubs */}
          <div>
            <h4 className="font-display font-semibold text-sm tracking-wider uppercase text-[#F5F1E8] mb-4">
              Major Terminals
            </h4>
            <ul className="space-y-3 text-xs text-[#A9A59B]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C79A45] shrink-0 mt-0.5" />
                <span><strong className="text-[#F5F1E8]">Lahore:</strong> Thokar Niaz Baig, Multan Road</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C79A45] shrink-0 mt-0.5" />
                <span><strong className="text-[#F5F1E8]">Islamabad:</strong> Faizabad Interchange Terminal</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C79A45] shrink-0 mt-0.5" />
                <span><strong className="text-[#F5F1E8]">Karachi:</strong> Sohrab Goth, Super Highway</span>
              </li>
            </ul>
          </div>

          {/* Dispatch Helpline */}
          <div>
            <h4 className="font-display font-semibold text-sm tracking-wider uppercase text-[#F5F1E8] mb-4">
              24/7 Helpline
            </h4>
            <div className="p-4 rounded-xl bg-[#22272A] border border-[#343A3C] space-y-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C79A45]" />
                <span className="font-mono text-sm font-semibold text-[#F5F1E8]">+92 42 111 000 000</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#A9A59B]">
                <Mail className="w-4 h-4 text-[#C79A45]" />
                <span>support@asaansafar.pk</span>
              </div>
              <p className="text-[11px] text-[#A9A59B] border-t border-[#343A3C] pt-2">
                Helpline active for seat reservations, schedules, and passenger inquiries.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#343A3C] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A9A59B]">
          <p>© {new Date().getFullYear()} Asaan Safar. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <Link to="/find-booking" className="hover:text-[#F5F1E8]">Find Ticket</Link>
            <Link to="/verify-ticket" className="hover:text-[#F5F1E8]">Verify Ticket</Link>
            <Link to="/my-bookings" className="hover:text-[#F5F1E8]">My Trips</Link>
            <Link to="/routes" className="hover:text-[#F5F1E8]">Routes</Link>
            <Link to="/tracking" className="hover:text-[#F5F1E8]">Live Tracking</Link>
            <Link to="/login" className="hover:text-[#F5F1E8]">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
