import { useEffect, useRef, useState } from 'react';
import { RotateCcw, Share2 } from 'lucide-react';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';

const PRIDE_COLORS = ['#FF0018', '#FFA52C', '#FFFF41', '#008018', '#0000F9', '#86007D'];
const FLOATING_SYMBOLS = ['\u{1F308}', '\u{1F496}', '\u{1F495}', '\u{1F49D}', '\u{1F497}'];

interface FloatingSymbol {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
  symbol: string;
}

function createFloatingSymbols(): FloatingSymbol[] {
  return Array.from({ length: 20 }, (_, index) => ({
    left: `${Math.round(Math.random() * 100)}%`,
    top: `${Math.round(Math.random() * 100)}%`,
    animationDelay: `${(index % 5) * 0.4}s`,
    animationDuration: `${3 + (index % 4) * 0.5}s`,
    symbol: FLOATING_SYMBOLS[index % FLOATING_SYMBOLS.length],
  }));
}

export function ThankYouScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [showHearts, setShowHearts] = useState(false);
  const [heartColorIndex, setHeartColorIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [floatingSymbols] = useState<FloatingSymbol[]>(() => createFloatingSymbols());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setHeartColorIndex((previous) => (previous + 1) % PRIDE_COLORS.length);
    }, 400);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

      timeline
        .fromTo(circleRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8 })
        .fromTo(
          cardRef.current,
          { y: 100, opacity: 0, rotateX: 20 },
          { y: 0, opacity: 1, rotateX: 0, duration: 0.8 },
          '-=0.4',
        )
        .fromTo(
          orbRef.current,
          { scale: 0, rotation: -360 },
          { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)' },
          '-=0.4',
        )
        .fromTo(
          headlineRef.current?.querySelectorAll('.char') ?? [],
          { y: 50, opacity: 0, scale: 0.5 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.03, ease: 'back.out(1.5)' },
          '-=0.3',
        )
        .fromTo(messageRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.2')
        .fromTo(
          ctaRef.current?.children ?? [],
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
          '-=0.2',
        );

      gsap.to(orbRef.current, {
        y: -12,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, containerRef);

    const timeoutId = window.setTimeout(() => setShowHearts(true), 1000);

    return () => {
      window.clearTimeout(timeoutId);
      context.revert();
    };
  }, []);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(null), 2500);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const handleShare = async () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: PRIDE_COLORS,
    });

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Youth Mental Wellness Survey',
          text: 'I just completed this mental wellness survey. Your voice matters too.',
          url: window.location.href,
        });
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      setToastMessage('Link copied to clipboard.');
    } catch (error) {
      console.error('Unable to share survey:', error);
      setToastMessage('Could not share automatically. Copy the page URL manually.');
    }
  };

  const headlineChars = 'THANK YOU!'.split('');
  const currentHeartColor = PRIDE_COLORS[heartColorIndex];

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-coral px-4 py-12"
    >
      {showHearts && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {floatingSymbols.map((symbol, index) => (
            <div
              key={`${symbol.symbol}-${index}`}
              className="absolute text-2xl animate-float-slow"
              style={{
                left: symbol.left,
                top: symbol.top,
                animationDelay: symbol.animationDelay,
                animationDuration: symbol.animationDuration,
                opacity: 0.3,
              }}
            >
              {symbol.symbol}
            </div>
          ))}
        </div>
      )}

      <div
        ref={circleRef}
        className="absolute h-[360px] w-[360px] rounded-full bg-navy sm:h-[460px] sm:w-[460px] lg:h-[550px] lg:w-[550px]"
      />

      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-[480px] rounded-[36px] bg-white p-6 text-center shadow-2xl sm:rounded-[44px] sm:p-10 lg:rounded-[48px] lg:p-12"
        style={{ perspective: '1000px' }}
      >
        <div className="absolute -right-3 -top-3 text-4xl animate-pulse">{'\u2728'}</div>
        <div className="absolute -bottom-3 -left-3 text-4xl animate-pulse" style={{ animationDelay: '0.5s' }}>
          {'\u{1F31F}'}
        </div>
        <div className="absolute -right-5 top-1/2 text-2xl animate-pulse" style={{ animationDelay: '1s' }}>
          {'\u{1F4AB}'}
        </div>

        <div ref={orbRef} className="mb-6 flex justify-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full text-5xl shadow-orb transition-all duration-300 sm:h-24 sm:w-24"
            style={{
              backgroundColor: currentHeartColor,
              boxShadow: `0 12px 30px ${currentHeartColor}60, inset 0 2px 4px rgba(255,255,255,0.5)`,
            }}
          >
            {'\u{1F49A}'}
          </div>
        </div>

        <div className="mb-4 flex justify-center gap-1.5">
          {PRIDE_COLORS.map((color, index) => (
            <div
              key={color}
              className="h-2 w-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: color,
                transform: index === heartColorIndex ? 'scale(1.5)' : 'scale(1)',
                opacity: index === heartColorIndex ? 1 : 0.5,
              }}
            />
          ))}
        </div>

        <h2
          ref={headlineRef}
          className="mb-6 font-poppins text-[clamp(40px,10vw,56px)] font-bold uppercase leading-none tracking-tight text-navy"
        >
          {headlineChars.map((char, index) => (
            <span key={`${char}-${index}`} className="char inline-block">
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h2>

        <div ref={messageRef} className="mb-8">
          <p className="text-base leading-relaxed text-navy/70">
            Your answers help us build support that actually fits your life. If you ever need help,
            you are not alone. Reach out to a trusted person or a local helpline.
          </p>
        </div>

        <div ref={ctaRef} className="flex flex-col gap-3">
          <button
            onClick={handleShare}
            className="group relative w-full overflow-hidden rounded-2xl bg-navy px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Share2 className="h-5 w-5" />
              <span>Share the Survey</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-panel-purple to-panel-pink opacity-0 transition-opacity group-hover:opacity-100" />
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full rounded-2xl border-2 border-navy/20 bg-transparent px-8 py-4 font-semibold text-navy transition-all duration-300 hover:border-navy/40 hover:bg-navy/5"
          >
            <span className="flex items-center justify-center gap-2">
              <RotateCcw className="h-5 w-5" />
              <span>Start Over</span>
            </span>
          </button>
        </div>

        <p className="mt-6 text-xs text-navy/40">
          Your responses are anonymous and will only be used for community planning.
        </p>
      </div>

      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full bg-navy px-6 py-3 text-sm text-white shadow-lg">
          {toastMessage}
        </div>
      )}

      <div
        className="absolute bottom-0 left-0 right-0 h-3"
        style={{ background: `linear-gradient(to right, ${PRIDE_COLORS.join(', ')})` }}
      />
    </div>
  );
}
