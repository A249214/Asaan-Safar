import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brass' | 'forest';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[#22272A] text-[#A9A59B] border border-[#343A3C]',
    success: 'bg-[#5F8F72]/15 text-[#5F8F72] border border-[#5F8F72]/30',
    warning: 'bg-[#C79A45]/15 text-[#D9B56A] border border-[#C79A45]/30',
    danger: 'bg-[#B85C4A]/15 text-[#B85C4A] border border-[#B85C4A]/30',
    info: 'bg-[#20352F] text-[#F5F1E8] border border-[#343A3C]',
    brass: 'bg-[#C79A45] text-[#171A1D] font-semibold border border-[#C79A45]',
    forest: 'bg-[#20352F] text-[#C79A45] border border-[#343A3C]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium tracking-wide uppercase',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
