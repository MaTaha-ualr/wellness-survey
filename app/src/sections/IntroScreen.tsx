import { useEffect, useRef } from 'react';
import { ArrowRight, BadgeCheck, Clock3, LockKeyhole } from 'lucide-react';
import { gsap } from 'gsap';
import { resolvePublicAsset } from '@/lib/assets';

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subcopyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

      timeline
        .fromTo(
          leftPanelRef.current,
          { x: '-100%', opacity: 0, rotateY: -15 },
          { x: 0, opacity: 1, rotateY: 0, duration: 1.2 },
        )
        .fromTo(
          rightPanelRef.current,
          { x: '100%', opacity: 0, rotateY: 15 },
          { x: 0, opacity: 1, rotateY: 0, duration: 1.2 },
          '<',
        )
        .fromTo(
          orbRef.current,
          { scale: 0, rotation: -180 },
          { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(2)' },
          '-=0.6',
        )
        .fromTo(
          headlineRef.current?.querySelectorAll('.word') ?? [],
          { y: 60, opacity: 0, rotateX: -45 },
          { y: 0, opacity: 1, rotateX: 0, duration: 0.6, stagger: 0.08 },
          '-=0.4',
        )
        .fromTo(subcopyRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.2')
        .fromTo(
          featuresRef.current?.children ?? [],
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
          '-=0.3',
        )
        .fromTo(
          ctaRef.current,
          { y: 40, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' },
          '-=0.2',
        );

      gsap.to(orbRef.current, {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, containerRef);

    return () => context.revert();
  }, []);

  const headlineWords = 'YOUR VOICE SHAPES BETTER SUPPORT'.split(' ');

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-panel-purple/20 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-panel-pink/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-6 lg:flex-row lg:gap-8">
        <div
          ref={leftPanelRef}
          className="relative h-72 w-full max-w-[380px] overflow-hidden rounded-[32px] shadow-2xl sm:h-[420px] lg:h-[500px] lg:rounded-[40px]"
          style={{ perspective: '1000px' }}
        >
          <img
            src={resolvePublicAsset('images/intro_photo_group.jpg')}
            alt="Diverse young people together"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-panel-purple/60 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 h-12 w-12 rounded-tl-2xl border-l-4 border-t-4 border-coral" />
          <div className="absolute bottom-4 right-4 h-12 w-12 rounded-br-2xl border-b-4 border-r-4 border-coral" />
        </div>

        <div ref={rightPanelRef} className="relative w-full max-w-[500px]" style={{ perspective: '1000px' }}>
          <div
            ref={orbRef}
            className="absolute -left-2 -top-6 z-20 flex h-16 w-16 items-center justify-center rounded-full bg-panel-green text-3xl shadow-orb sm:-left-6 sm:-top-8 sm:h-20 sm:w-20 sm:text-4xl"
          >
            {'\u{1F33F}'}
          </div>

          <div className="relative overflow-hidden rounded-[32px] bg-panel-pink p-6 shadow-panel sm:p-8 lg:rounded-[40px] lg:p-10">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5" />
            <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/5" />

            <h1
              ref={headlineRef}
              className="mb-6 font-poppins text-[clamp(32px,8vw,48px)] font-bold uppercase leading-[1.05] tracking-tight text-white"
            >
              {headlineWords.map((word) => (
                <span key={word} className="word mr-[0.25em] inline-block">
                  {word}
                </span>
              ))}
            </h1>

            <p ref={subcopyRef} className="mb-8 text-base leading-relaxed text-white/85">
              A quick, anonymous survey about what young people actually need so we can build support
              that fits your life.
            </p>

            <div ref={featuresRef} className="mb-8 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
                <LockKeyhole className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white/90">100% Anonymous</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
                <Clock3 className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white/90">6 Minutes</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
                <BadgeCheck className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white/90">No Wrong Answers</span>
              </div>
            </div>

            <div ref={ctaRef}>
              <button
                onClick={onStart}
                className="group relative overflow-hidden rounded-2xl bg-white px-8 py-4 text-lg font-bold text-panel-pink shadow-button transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:px-10 sm:py-5"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Survey
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-coral/20 to-panel-pink/20 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>

              <p className="mt-4 text-sm text-white/50">
                Press <kbd className="rounded bg-white/10 px-2 py-1 text-white/70">Enter</kbd> or click to begin
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-panel-purple via-panel-pink to-panel-teal" />
    </div>
  );
}
