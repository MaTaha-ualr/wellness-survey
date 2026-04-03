import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  onSubmit?: () => void | Promise<void>;
  showBack?: boolean;
  showSubmit?: boolean;
  isSubmitting?: boolean;
  className?: string;
}

export const Navigation = forwardRef<HTMLDivElement, NavigationProps>(
  (
    {
      onBack,
      onNext,
      onSubmit,
      showBack = true,
      showSubmit = false,
      isSubmitting = false,
      className,
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn('flex items-center justify-between gap-4', className)}>
        {showBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-white/20"
            disabled={isSubmitting}
          >
            <span aria-hidden="true">&larr;</span>
            <span>Back</span>
          </button>
        )}

        {!showSubmit ? (
          <button
            onClick={onNext}
            className="ml-auto flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-navy shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
            disabled={isSubmitting}
          >
            <span>Next</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        ) : (
          <button
            onClick={onSubmit}
            className={cn(
              'ml-auto flex items-center gap-2 rounded-xl bg-coral px-6 py-3 font-bold text-navy shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl',
              isSubmitting && 'cursor-not-allowed opacity-70',
            )}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-navy/30 border-t-navy" />
                <span>Submitting...</span>
              </>
            ) : (
              <span>Submit</span>
            )}
          </button>
        )}
      </div>
    );
  },
);

Navigation.displayName = 'Navigation';
