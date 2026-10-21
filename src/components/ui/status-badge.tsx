import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Bus, ShieldCheck } from 'lucide-react';

export type DepartureStatus = 'on-time' | 'boarding' | 'delayed' | 'departed';
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'refunded' | 'boarded' | 'valid' | 'used' | 'expired';
export type CoachClass = 'standard' | 'executive' | 'luxury' | 'business';

interface DepartureStatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: DepartureStatus;
}

export function DepartureStatusBadge({ status, className, ...props }: DepartureStatusBadgeProps) {
  const configs: Record<DepartureStatus, { label: string; style: string; icon: typeof Clock }> = {
    'on-time': {
      label: 'On Schedule',
      style: 'bg-[#5F8F72]/15 text-[#5F8F72] border-[#5F8F72]/30',
      icon: CheckCircle2,
    },
    boarding: {
      label: 'Now Boarding',
      style: 'bg-[#C79A45]/20 text-[#D9B56A] border-[#C79A45]/40 animate-pulse',
      icon: Clock,
    },
    delayed: {
      label: 'Delayed',
      style: 'bg-[#B85C4A]/15 text-[#CC7360] border-[#B85C4A]/30',
      icon: AlertTriangle,
    },
    departed: {
      label: 'Departed',
      style: 'bg-[#22272A] text-[#A9A59B] border-[#343A3C]',
      icon: Bus,
    },
  };

  const config = configs[status] || configs['on-time'];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold tracking-wide uppercase border',
        config.style,
        className
      )}
      {...props}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}

interface CoachClassBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tier: CoachClass | string;
}

export function CoachClassBadge({ tier, className, ...props }: CoachClassBadgeProps) {
  const normalized = tier.toLowerCase();
  const styles: Record<string, string> = {
    standard: 'bg-[#22272A] text-[#F5F1E8] border-[#343A3C]',
    executive: 'bg-[#20352F] text-[#C79A45] border-[#C79A45]/50 shadow-sm',
    luxury: 'bg-[#C79A45] text-[#171A1D] border-[#C79A45] font-extrabold',
    business: 'bg-gradient-to-r from-[#20352F] to-[#C79A45] text-[#F5F1E8] border-[#C79A45]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border',
        styles[normalized] || styles.standard,
        className
      )}
      {...props}
    >
      <Bus className="w-3 h-3" />
      <span>{tier} Class</span>
    </span>
  );
}

interface CorridorBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  code: string;
}

export function CorridorBadge({ code, className, ...props }: CorridorBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#171A1D] border border-[#343A3C] text-[10px] font-mono font-bold text-[#C79A45]',
        className
      )}
      {...props}
    >
      <span>{code} CORRIDOR</span>
    </span>
  );
}
