import { useState } from 'react';
import { useAuditStore } from '@/stores/audit.store';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldCheck, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function AuditPage() {
  const entries = useAuditStore((s) => s.entries);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = entries.filter((e) =>
    e.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#343A3C]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#20352F] border border-[#343A3C] text-[11px] font-mono text-[#C79A45] mb-2 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#F5F1E8] flex items-center gap-2.5">
            <Shield className="w-7 h-7 text-[#C79A45]" />
            <span>Security & Audit Log</span>
          </h1>
          <p className="text-xs text-[#A9A59B] mt-1">
            System actions, supervisor overrides, fare changes, and dispatch records.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#5F8F72] bg-[#5F8F72]/10 px-3 py-1.5 rounded-lg border border-[#5F8F72]/30">
          <span className="w-2 h-2 rounded-full bg-[#5F8F72]" />
          <span>Audit Active</span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="rounded-2xl bg-[#22272A] border border-[#343A3C] p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#A9A59B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Search user, action, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#171A1D] border border-[#343A3C] text-[#F5F1E8] focus:outline-none focus:border-[#C79A45]"
          />
        </div>
        <span className="text-xs font-mono text-[#A9A59B]">
          Showing {filteredEntries.length} of {entries.length} entries
        </span>
      </div>

      {/* Audit Events Table */}
      <div className="rounded-2xl bg-[#22272A] border border-[#343A3C] shadow-card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#343A3C] bg-[#171A1D]/60 text-left text-[#A9A59B] font-mono uppercase text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Timestamp</th>
                <th className="py-3.5 px-4 font-semibold">User</th>
                <th className="py-3.5 px-4 font-semibold">Action</th>
                <th className="py-3.5 px-4 font-semibold">Resource</th>
                <th className="py-3.5 px-4 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#343A3C]/60 font-mono">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-[#A9A59B]">
                    No audit records found.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-[#20352F]/30 transition-colors"
                  >
                    <td className="py-3 px-4 whitespace-nowrap text-[#A9A59B]">
                      {format(new Date(entry.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-sans font-semibold text-[#F5F1E8]">{entry.userName}</p>
                      <Badge variant="info" className="mt-0.5 text-[10px]">
                        {entry.userRole}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#171A1D] border border-[#343A3C] text-[#C79A45] font-bold">
                        {entry.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#F5F1E8] font-bold">
                      {entry.resource}
                    </td>
                    <td className="py-3 px-4 text-[#A9A59B] font-sans text-xs">
                      {entry.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
