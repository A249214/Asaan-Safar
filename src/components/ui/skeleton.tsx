import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'rounded';
}

export function Skeleton({ className, variant = 'rounded', ...props }: SkeletonProps) {
  const variantStyles = {
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    rounded: 'rounded-xl',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-[#343A3C]/40 dark:bg-[#343A3C]/50',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export function RouteCardSkeleton() {
  return (
    <div className="card-warm p-5 rounded-xl border border-[#DDD5C5] space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24 bg-[#DDD5C5]/60" />
        <Skeleton className="h-4 w-20 bg-[#DDD5C5]/60" />
      </div>
      <Skeleton className="h-6 w-3/4 bg-[#DDD5C5]/60" />
      <Skeleton className="h-4 w-1/2 bg-[#DDD5C5]/60" />
      <div className="pt-3 border-t border-[#DDD5C5] flex items-center justify-between">
        <Skeleton className="h-6 w-20 bg-[#DDD5C5]/60" />
        <Skeleton className="h-8 w-24 bg-[#DDD5C5]/60" />
      </div>
    </div>
  );
}
