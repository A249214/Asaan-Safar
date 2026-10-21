import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  variant?: 'dark' | 'forest' | 'warm';
}

export function GlassCard({ className, hover, variant = 'dark', children, ...props }: GlassCardProps) {
  const variantStyles = {
    dark: 'bg-[#22272A] border-[#343A3C] text-[#F5F1E8]',
    forest: 'bg-[#20352F] border-[#343A3C] text-[#F5F1E8]',
    warm: 'bg-[#F5F1E8] border-[#DDD5C5] text-[#171A1D]',
  };

  return (
    <div
      className={cn(
        'rounded-xl p-5 border shadow-card-dark transition-all duration-200',
        variantStyles[variant],
        hover && 'hover:border-[#C79A45]/50 hover:-translate-y-0.5 hover:shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
