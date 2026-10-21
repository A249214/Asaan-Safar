import React from 'react';
import { Check } from 'lucide-react';

interface BookingStepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export const BookingStepIndicator: React.FC<BookingStepIndicatorProps> = React.memo(
  ({ currentStep, steps }) => {
    return (
      <nav aria-label="Booking steps" className="flex items-center justify-between gap-1 mb-8 overflow-x-auto pb-2 scrollbar-none">
        {steps.map((s, i) => {
          const stepNumber = i + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={s} className="flex items-center gap-2 shrink-0">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  isCurrent
                    ? 'bg-[#20352F] text-[#C79A45] border border-[#C79A45] font-bold shadow-sm'
                    : isCompleted
                    ? 'bg-[#FAF7F1] text-[#20352F] border border-[#DDD5C5]'
                    : 'bg-[#FAF7F1]/60 text-[#A9A59B] border border-transparent'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    isCurrent
                      ? 'bg-[#C79A45] text-[#171A1D]'
                      : isCompleted
                      ? 'bg-[#5F8F72] text-[#F5F1E8]'
                      : 'bg-[#DDD5C5] text-[#66635C]'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : stepNumber}
                </span>
                <span className="font-sans font-medium">{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-4 h-[1px] bg-[#DDD5C5] hidden sm:block" />
              )}
            </div>
          );
        })}
      </nav>
    );
  }
);

BookingStepIndicator.displayName = 'BookingStepIndicator';
