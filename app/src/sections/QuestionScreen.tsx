import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { EmojiOrb } from '@/components/EmojiOrb';
import { Navigation } from '@/components/Navigation';
import { QuestionCard } from '@/components/QuestionTypes';
import type {
  AudioRecordings,
  OtherTexts,
  SurveyAnswers,
  SurveySection,
} from '@/data/survey';

interface QuestionScreenProps {
  section: SurveySection;
  sectionIndex: number;
  totalSections: number;
  answers: SurveyAnswers;
  otherTexts: OtherTexts;
  audioRecordings: AudioRecordings;
  submissionError: string | null;
  onAnswerChange: (questionId: string, value: SurveyAnswers[string]) => void;
  onOtherTextChange: (questionId: string, text: string) => void;
  onAudioRecordingChange: (questionId: string, recording: AudioRecordings[string]) => void;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void | Promise<void>;
  isSubmitting: boolean;
}

export function QuestionScreen({
  section,
  sectionIndex,
  totalSections,
  answers,
  otherTexts,
  audioRecordings,
  submissionError,
  onAnswerChange,
  onOtherTextChange,
  onAudioRecordingChange,
  onBack,
  onNext,
  onSubmit,
  isSubmitting,
}: QuestionScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });

      gsap.fromTo(
        imageRef.current,
        { x: section.imagePosition === 'left' ? -100 : 100, opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', delay: 0.1 },
      );

      gsap.fromTo(
        panelRef.current,
        { x: section.imagePosition === 'left' ? 100 : -100, opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', delay: 0.15 },
      );

      gsap.fromTo(
        contentRef.current?.children ?? [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, delay: 0.3 },
      );
    });

    return () => context.revert();
  }, [section.id, section.imagePosition]);

  const isImageLeft = section.imagePosition === 'left';
  const isLastSection = sectionIndex === totalSections - 1;

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy px-4 pb-24 pt-20 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-20 ${isImageLeft ? 'right-6 sm:right-20' : 'left-6 sm:left-20'} h-48 w-48 rounded-full ${section.panelColor}/20 blur-3xl`}
        />
        <div
          className={`absolute bottom-20 ${isImageLeft ? 'left-6 sm:left-20' : 'right-6 sm:right-20'} h-64 w-64 rounded-full bg-coral/10 blur-3xl`}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-stretch gap-6 lg:flex-row lg:items-center">
        <div
          ref={imageRef}
          className={`relative h-64 w-full overflow-hidden rounded-[32px] shadow-2xl sm:h-80 lg:h-[480px] lg:w-[320px] ${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}
        >
          <img src={section.image} alt={section.title} className="h-full w-full object-cover" />
          <div className={`absolute inset-0 ${section.panelColor}/40 mix-blend-multiply`} />

          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 backdrop-blur-sm">
            <span className="text-sm font-bold text-navy">
              Section {sectionIndex + 1} of {totalSections}
            </span>
          </div>

          <div className="absolute right-4 top-4 h-10 w-10 rounded-tr-xl border-r-4 border-t-4 border-white/40" />
          <div className="absolute bottom-4 left-4 h-10 w-10 rounded-bl-xl border-b-4 border-l-4 border-white/40" />
        </div>

        <div
          ref={panelRef}
          className={`relative w-full overflow-hidden rounded-[32px] ${section.panelColor} p-5 shadow-panel sm:p-6 lg:h-[480px] lg:w-[520px] lg:rounded-[36px] lg:p-8 ${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}
        >
          <div className={`absolute -top-6 z-20 ${isImageLeft ? '-right-2 sm:-right-6' : '-left-2 sm:-left-6'}`}>
            <EmojiOrb emoji={section.emoji} color="bg-white" />
          </div>

          <div className="absolute right-0 top-0 h-24 w-24 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-0 h-16 w-16 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/5" />

          <div ref={contentRef} className="flex h-full flex-col">
            <div className="mb-4 pr-10">
              <h2
                className="font-poppins text-[clamp(24px,5vw,36px)] font-bold uppercase leading-tight tracking-tight text-white"
              >
                {section.title}
              </h2>
              <p className="mt-1 text-sm text-white/70">{section.subtitle}</p>
            </div>

            <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto pr-1 sm:pr-2">
              {section.questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  value={answers[question.id]}
                  onChange={(value) => onAnswerChange(question.id, value)}
                  otherText={otherTexts[question.id]}
                  onOtherTextChange={(text) => onOtherTextChange(question.id, text)}
                  audioRecording={audioRecordings[question.id]}
                  onAudioRecordingChange={(recording) => onAudioRecordingChange(question.id, recording)}
                />
              ))}
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              {submissionError && (
                <div className="mb-4 rounded-2xl border border-red-300/30 bg-red-500/15 px-4 py-3 text-sm text-red-50">
                  {submissionError}
                </div>
              )}

              <Navigation
                onBack={onBack}
                onNext={onNext}
                onSubmit={onSubmit}
                showBack={true}
                showSubmit={isLastSection}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {Array.from({ length: totalSections }).map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === sectionIndex ? 'w-8 bg-coral' : index < sectionIndex ? 'w-2 bg-coral/60' : 'w-2 bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
