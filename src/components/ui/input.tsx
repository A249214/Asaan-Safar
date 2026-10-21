import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-xs font-medium tracking-wide uppercase text-[#A9A59B]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full px-3.5 py-2.5 rounded-lg bg-[#171A1D] border border-[#343A3C] text-[#F5F1E8] text-sm',
          'focus:outline-none focus:border-[#C79A45] focus:ring-1 focus:ring-[#C79A45] transition-colors',
          'placeholder:text-[#A9A59B]/60 disabled:opacity-50',
          error && 'border-[#B85C4A] focus:border-[#B85C4A] focus:ring-[#B85C4A]',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[#B85C4A] mt-1">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';
