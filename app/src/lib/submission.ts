import {
  SURVEY_SECTIONS,
  type AudioRecordings,
  type MatrixAnswer,
  type OtherTexts,
  type Question,
  type QuestionValue,
  type SurveyAnswers,
} from '@/data/survey';

interface SerializedAudioRecording {
  questionId: string;
  fileName: string;
  mimeType: string;
  base64: string;
}

export interface SurveySubmissionPayload {
  submissionId: string;
  submittedAt: string;
  pageUrl: string;
  userAgent: string;
  row: Record<string, string>;
  answers: Record<string, string>;
  audioRecordings: SerializedAudioRecording[];
}

function createSubmissionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `survey-${Date.now()}`;
}

function getMatrixValue(value: QuestionValue): MatrixAnswer {
  return typeof value === 'object' && !Array.isArray(value) && value ? value : {};
}

function getSelectedOptions(value: QuestionValue) {
  return Array.isArray(value) ? value : [];
}

function formatMatrixAnswer(question: Question, value: QuestionValue) {
  const matrixValue = getMatrixValue(value);
  const labels = question.type === 'likert' ? question.likertLabels : question.scaleLabels;

  return (question.items ?? [])
    .map((item, index) => {
      const selectedIndex = matrixValue[index];
      const selectedLabel = typeof selectedIndex === 'number' ? labels?.[selectedIndex] : undefined;
      return `${item}: ${selectedLabel ?? 'No answer'}`;
    })
    .join(' | ');
}

function formatMultiAnswer(value: QuestionValue, otherText?: string) {
  const selections = getSelectedOptions(value).map((option) => {
    if (option === '__other__') {
      return otherText?.trim() ? `Other: ${otherText.trim()}` : 'Other';
    }

    return option;
  });

  return selections.join(' | ');
}

function formatAnswer(question: Question, value: QuestionValue, otherText?: string, hasAudio?: boolean) {
  if (question.type === 'multi') {
    return formatMultiAnswer(value, otherText);
  }

  if (question.type === 'scale' || question.type === 'likert') {
    return formatMatrixAnswer(question, value);
  }

  if (question.type === 'open') {
    const textValue = typeof value === 'string' ? value.trim() : '';

    if (textValue) {
      return textValue;
    }

    return hasAudio ? 'VOICE_RECORDED' : '';
  }

  return typeof value === 'string' ? value : '';
}

function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result;

      if (typeof result !== 'string') {
        reject(new Error('Unable to serialize audio recording.'));
        return;
      }

      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };

    reader.onerror = () => reject(reader.error ?? new Error('Unable to read audio recording.'));
    reader.readAsDataURL(blob);
  });
}

export async function buildSubmissionPayload(
  answers: SurveyAnswers,
  otherTexts: OtherTexts,
  audioRecordings: AudioRecordings,
): Promise<SurveySubmissionPayload> {
  const submissionId = createSubmissionId();
  const submittedAt = new Date().toISOString();
  const row: Record<string, string> = {
    submission_id: submissionId,
    submitted_at: submittedAt,
    page_url: window.location.href,
  };
  const formattedAnswers: Record<string, string> = {};

  for (const section of SURVEY_SECTIONS) {
    for (const question of section.questions) {
      const answer = formatAnswer(
        question,
        answers[question.id],
        otherTexts[question.id],
        Boolean(audioRecordings[question.id]),
      );

      formattedAnswers[question.id] = answer;
      row[question.id] = answer;

      if (question.hasOther) {
        row[`${question.id}_other`] = otherTexts[question.id]?.trim() ?? '';
      }
    }
  }

  const audioPayload = await Promise.all(
    Object.entries(audioRecordings)
      .filter(([, recording]) => Boolean(recording))
      .map(async ([questionId, recording]) => {
        const currentRecording = recording!;

        return {
          questionId,
          fileName: `${submissionId}-${questionId}.webm`,
          mimeType: currentRecording.blob.type || 'audio/webm',
          base64: await blobToBase64(currentRecording.blob),
        };
      }),
  );

  row.audio_question_ids = audioPayload.map((recording) => recording.questionId).join(' | ');
  row.audio_file_names = audioPayload.map((recording) => recording.fileName).join(' | ');

  return {
    submissionId,
    submittedAt,
    pageUrl: window.location.href,
    userAgent: window.navigator.userAgent,
    row,
    answers: formattedAnswers,
    audioRecordings: audioPayload,
  };
}
