import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface EmojiOrbProps {
  emoji: string;
  className?: string;
  color?: string;
}

export const EmojiOrb = forwardRef<HTMLDivElement, EmojiOrbProps>(
  ({ emoji, className, color = 'bg-panel-green' }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-orb',
          color,
          className
        )}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.8)'
        }}
      >
        {emoji}
      </div>
    );
  }
);

EmojiOrb.displayName = 'EmojiOrb';
