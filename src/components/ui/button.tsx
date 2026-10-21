import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'brass';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const variants = {
      // Primary Brass Gold CTA with Asphalt text
      default:
        'bg-[#C79A45] hover:bg-[#D9B56A] text-[#171A1D] font-semibold shadow-sm hover:shadow-brass transition-colors border border-[#C79A45]/30',
      brass:
        'bg-[#C79A45] hover:bg-[#D9B56A] text-[#171A1D] font-semibold shadow-sm hover:shadow-brass transition-colors border border-[#C79A45]/30',
      // Secondary Deep Forest
      secondary:
        'bg-[#20352F] hover:bg-[#2C4941] text-[#F5F1E8] font-medium border border-[#343A3C] shadow-sm',
      // Outline with subtle dark stone border and brass hover
      outline:
        'border border-[#343A3C] hover:border-[#C79A45] bg-transparent hover:bg-[#20352F]/40 text-[#F5F1E8] font-medium transition-all',
      // Ghost button
      ghost:
        'text-[#A9A59B] hover:text-[#F5F1E8] hover:bg-[#20352F]/40 font-medium transition-colors',
      // Gradient variant mapped to refined brass
      gradient:
        'bg-[#C79A45] hover:bg-[#D9B56A] text-[#171A1D] font-semibold shadow-sm hover:shadow-brass transition-all',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded-lg font-medium',
      md: 'px-4 py-2 text-sm rounded-lg',
      lg: 'px-6 py-3 text-base rounded-lg font-semibold tracking-wide',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.99]',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
