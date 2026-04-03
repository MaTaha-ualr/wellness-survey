import { useState } from 'react';
import { cn } from '@/lib/utils';
import { VoiceRecorder } from './VoiceRecorder';
import type { AudioRecording, MatrixAnswer, Question, QuestionValue } from '@/data/survey';

interface QuestionProps {
  question: Question;
  value: QuestionValue;
  onChange: (value: QuestionValue) => void;
  otherText?: string;
  onOtherTextChange?: (text: string) => void;
  audioRecording?: AudioRecording | null;
  onAudioRecordingChange?: (recording: AudioRecording | null) => void;
}

export function SingleSelect({ question, value, onChange }: QuestionProps) {
  return (
    <div className="flex flex-col gap-2">
      {question.options?.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={cn('option-btn', value === option && 'selected')}
        >
          <div className="radio-dot" />
          <span className="text-sm text-white/90">{option}</span>
        </button>
      ))}
    </div>
  );
}

export function MultiSelect({
  question,
  value,
  onChange,
  otherText = '',
  onOtherTextChange,
}: QuestionProps) {
  const selected = Array.isArray(value) ? value : [];
  const isOtherSelected = selected.includes('__other__');

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((selectedOption) => selectedOption !== option));
      return;
    }

    if (question.maxSelect && selected.length >= question.maxSelect) {
      return;
    }

    onChange([...selected, option]);
  };

  return (
    <div className="flex flex-col gap-2">
      {question.maxSelect && (
        <div className="mb-1 text-xs font-semibold text-coral">
          {selected.length}/{question.maxSelect} selected
        </div>
      )}

      {question.options?.map((option) => {
        const isSelected = selected.includes(option);
        const isDisabled = Boolean(question.maxSelect && selected.length >= question.maxSelect && !isSelected);

        return (
          <button
            key={option}
            onClick={() => toggleOption(option)}
            disabled={isDisabled}
            className={cn('option-btn', isSelected && 'selected', isDisabled && 'cursor-not-allowed opacity-40')}
          >
            <div className="checkbox">{isSelected ? '\u2713' : null}</div>
            <span className="text-sm text-white/90">{option}</span>
          </button>
        );
      })}

      {question.hasOther && (
        <>
          <button
            onClick={() => toggleOption('__other__')}
            className={cn('option-btn', isOtherSelected && 'selected')}
          >
            <div className="checkbox">{isOtherSelected ? '\u2713' : null}</div>
            <span className="text-sm text-white/90">{question.otherLabel || 'Other'}</span>
          </button>

          {isOtherSelected && (
            <input
              type="text"
              value={otherText}
              onChange={(event) => onOtherTextChange?.(event.target.value)}
              placeholder="Type your answer..."
              className="ml-8 rounded-xl border-2 border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 transition-all focus:border-coral focus:outline-none"
            />
          )}
        </>
      )}
    </div>
  );
}

function getMatrixValue(value: QuestionValue): MatrixAnswer {
  return typeof value === 'object' && !Array.isArray(value) && value ? value : {};
}

export function ScaleQuestion({ question, value, onChange }: QuestionProps) {
  const matrixValue = getMatrixValue(value);

  return (
    <div className="flex flex-col gap-4">
      {question.items?.map((item, itemIndex) => (
        <div key={item} className="flex flex-col gap-2">
          <div className="text-sm font-medium text-white/80">{item}</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
            {question.scaleLabels?.map((label, labelIndex) => (
              <button
                key={label}
                onClick={() => onChange({ ...matrixValue, [itemIndex]: labelIndex })}
                className={cn('scale-btn', matrixValue[itemIndex] === labelIndex && 'active')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function LikertQuestion({ question, value, onChange }: QuestionProps) {
  const matrixValue = getMatrixValue(value);

  return (
    <div className="flex flex-col gap-4">
      {question.items?.map((item, itemIndex) => (
        <div key={item} className="flex flex-col gap-2">
          <div className="text-sm font-medium text-white/80">{item}</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
            {question.likertLabels?.map((label, labelIndex) => (
              <button
                key={label}
                onClick={() => onChange({ ...matrixValue, [itemIndex]: labelIndex })}
                className={cn('scale-btn', matrixValue[itemIndex] === labelIndex && 'active')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function OpenQuestion({ value, onChange, audioRecording, onAudioRecordingChange }: QuestionProps) {
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const textValue = typeof value === 'string' ? value : '';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 rounded-xl bg-white/5 p-1">
        <button
          onClick={() => setInputMode('text')}
          className={cn(
            'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all',
            inputMode === 'text' ? 'bg-coral text-navy' : 'text-white/60 hover:text-white',
          )}
        >
          Type answer
        </button>
        <button
          onClick={() => setInputMode('voice')}
          className={cn(
            'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all',
            inputMode === 'voice' ? 'bg-coral text-navy' : 'text-white/60 hover:text-white',
          )}
        >
          Voice record
        </button>
      </div>

      {inputMode === 'text' && (
        <textarea
          value={textValue}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Type your thoughts here. Take your time."
          className="survey-textarea"
          rows={4}
        />
      )}

      {inputMode === 'voice' && (
        <VoiceRecorder
          onRecordingComplete={(blob, url) => onAudioRecordingChange?.({ blob, url })}
          onClear={() => onAudioRecordingChange?.(null)}
          existingRecording={audioRecording}
        />
      )}
    </div>
  );
}

export function QuestionCard({
  question,
  value,
  onChange,
  otherText,
  onOtherTextChange,
  audioRecording,
  onAudioRecordingChange,
}: QuestionProps) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/8 p-4 backdrop-blur-sm xl:p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="inline-flex items-center rounded-full bg-coral/20 px-2.5 py-1 text-xs font-bold text-coral">
          Q{question.num}
        </div>
        {question.hint && <span className="text-xs italic text-white/40">{question.hint}</span>}
      </div>

      <h3 className="mb-3 text-base font-semibold leading-snug text-white">{question.text}</h3>

      <div>
        {question.type === 'single' && <SingleSelect question={question} value={value} onChange={onChange} />}
        {question.type === 'multi' && (
          <MultiSelect
            question={question}
            value={value}
            onChange={onChange}
            otherText={otherText}
            onOtherTextChange={onOtherTextChange}
          />
        )}
        {question.type === 'scale' && <ScaleQuestion question={question} value={value} onChange={onChange} />}
        {question.type === 'likert' && <LikertQuestion question={question} value={value} onChange={onChange} />}
        {question.type === 'open' && (
          <OpenQuestion
            question={question}
            value={value}
            onChange={onChange}
            audioRecording={audioRecording}
            onAudioRecordingChange={onAudioRecordingChange}
          />
        )}
      </div>
    </div>
  );
}
