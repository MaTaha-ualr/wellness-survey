import { useCallback, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  SURVEY_SECTIONS,
  TOTAL_QUESTIONS,
  type AudioRecordings,
  type OtherTexts,
  type SurveyAnswers,
} from '@/data/survey';
import { buildSubmissionPayload } from '@/lib/submission';
import { IntroScreen } from '@/sections/IntroScreen';
import { QuestionScreen } from '@/sections/QuestionScreen';
import { ThankYouScreen } from '@/sections/ThankYouScreen';
import './App.css';

const SUBMISSION_ENDPOINT = import.meta.env.VITE_SURVEY_SUBMIT_URL?.trim();

function hasAnswer(value: SurveyAnswers[string]) {
  if (value === undefined || value === '') {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }

  return true;
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(target.closest('input, textarea, button, select, audio, [contenteditable="true"]'));
}

function App() {
  const [screen, setScreen] = useState<'intro' | 'survey' | 'thanks'>('intro');
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [otherTexts, setOtherTexts] = useState<OtherTexts>({});
  const [audioRecordings, setAudioRecordings] = useState<AudioRecordings>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const calculateProgress = useCallback(() => {
    let answeredCount = 0;

    SURVEY_SECTIONS.forEach((section, index) => {
      if (index > currentSection) {
        return;
      }

      section.questions.forEach((question) => {
        if (hasAnswer(answers[question.id]) || audioRecordings[question.id]) {
          answeredCount += 1;
        }
      });
    });

    return Math.min((answeredCount / TOTAL_QUESTIONS) * 100, 100);
  }, [answers, audioRecordings, currentSection]);

  const handleAnswerChange = useCallback((questionId: string, value: SurveyAnswers[string]) => {
    setAnswers((previous) => ({ ...previous, [questionId]: value }));
    setSubmissionError(null);
  }, []);

  const handleOtherTextChange = useCallback((questionId: string, text: string) => {
    setOtherTexts((previous) => ({ ...previous, [questionId]: text }));
    setSubmissionError(null);
  }, []);

  const handleAudioRecordingChange = useCallback(
    (questionId: string, recording: AudioRecordings[string]) => {
      setAudioRecordings((previous) => ({ ...previous, [questionId]: recording }));
      setSubmissionError(null);
    },
    [],
  );

  const handleStart = useCallback(() => {
    setScreen('survey');
    setSubmissionError(null);
  }, []);

  const handleBack = useCallback(() => {
    setSubmissionError(null);

    if (currentSection > 0) {
      setCurrentSection((previous) => previous - 1);
      return;
    }

    setScreen('intro');
  }, [currentSection]);

  const handleNext = useCallback(() => {
    setSubmissionError(null);

    if (currentSection < SURVEY_SECTIONS.length - 1) {
      setCurrentSection((previous) => previous + 1);
    }
  }, [currentSection]);

  const triggerConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ['#F6B7B0', '#6B5BFF', '#FF6B9D', '#2EC4B6', '#FFD166'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!SUBMISSION_ENDPOINT) {
      setSubmissionError(
        'Submission is not configured yet. Set VITE_SURVEY_SUBMIT_URL before publishing this survey.',
      );
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const payload = await buildSubmissionPayload(answers, otherTexts, audioRecordings);
      const response = await fetch(SUBMISSION_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Submission failed with status ${response.status}`);
      }

      setScreen('thanks');
      triggerConfetti();
    } catch (error) {
      console.error('Error submitting survey:', error);
      setSubmissionError(
        'We could not send your response right now. Please try again in a moment.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, audioRecordings, otherTexts, triggerConfetti]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isInteractiveTarget(event.target)) {
        return;
      }

      if (event.key === 'Enter' && screen === 'intro') {
        event.preventDefault();
        handleStart();
        return;
      }

      if (event.key === 'ArrowRight' && screen === 'survey' && currentSection < SURVEY_SECTIONS.length - 1) {
        event.preventDefault();
        handleNext();
        return;
      }

      if ((event.key === 'ArrowLeft' || event.key === 'Escape') && screen === 'survey') {
        event.preventDefault();
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, handleBack, handleNext, handleStart, screen]);

  return (
    <div className="noise-overlay min-h-screen overflow-hidden bg-navy">
      {screen !== 'intro' && (
        <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-4 sm:px-6">
          <div className="font-poppins text-sm font-semibold tracking-wide text-white">
            Mental Wellness Survey
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur-sm">
              Anonymous
            </div>
            {screen === 'survey' && (
              <div className="rounded-full bg-coral/20 px-3 py-1 text-xs font-bold text-coral">
                {Math.round(calculateProgress())}%
              </div>
            )}
          </div>
        </header>
      )}

      {screen === 'survey' && (
        <div className="fixed left-0 right-0 top-0 z-40 h-1 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-coral to-panel-pink transition-all duration-500"
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>
      )}

      <main className="relative min-h-screen">
        {screen === 'intro' && <IntroScreen onStart={handleStart} />}

        {screen === 'survey' && (
          <QuestionScreen
            section={SURVEY_SECTIONS[currentSection]}
            sectionIndex={currentSection}
            totalSections={SURVEY_SECTIONS.length}
            answers={answers}
            otherTexts={otherTexts}
            audioRecordings={audioRecordings}
            submissionError={submissionError}
            onAnswerChange={handleAnswerChange}
            onOtherTextChange={handleOtherTextChange}
            onAudioRecordingChange={handleAudioRecordingChange}
            onBack={handleBack}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {screen === 'thanks' && <ThankYouScreen />}
      </main>
    </div>
  );
}

export default App;
