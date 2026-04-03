import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface EmojiOrbProps {
  emoji: string;
  className?: string;
}

export const EmojiOrb = forwardRef<HTMLDivElement, EmojiOrbProps>(
  ({ emoji, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'emoji-orb border border-white/35 backdrop-blur-sm',
          className
        )}
      >
        {emoji}
      </div>
    );
  }
);

EmojiOrb.displayName = 'EmojiOrb';
