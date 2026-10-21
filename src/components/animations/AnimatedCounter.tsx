import CountUp from 'react-countup';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}

export function AnimatedCounter({ value, prefix = '', suffix = '', className, duration = 2 }: AnimatedCounterProps) {
  return (
    <span className={cn('tabular-nums', className)}>
      {prefix}
      <CountUp end={value} duration={duration} separator="," />
      {suffix}
    </span>
  );
}
