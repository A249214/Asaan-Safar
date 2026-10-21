import { ReactNode } from 'react';
import { LucideIcon, Bus } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon = Bus,
  title,
  description,
  actionLabel,
  onAction,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'p-8 sm:p-12 text-center rounded-2xl bg-[#22272A]/60 border border-[#343A3C] flex flex-col items-center justify-center max-w-lg mx-auto',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#20352F] border border-[#343A3C] text-[#C79A45] flex items-center justify-center mb-4 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-display font-bold text-lg text-[#F5F1E8] mb-1.5">{title}</h3>
      <p className="text-xs sm:text-sm text-[#A9A59B] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="md" className="shadow-brass text-xs">
          {actionLabel}
        </Button>
      )}
      {children}
    </div>
  );
}
