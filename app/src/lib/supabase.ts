import type { SurveySubmissionPayload } from '@/lib/submission';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim();
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export function hasSupabaseStorage() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

export async function saveSubmissionToSupabase(payload: SurveySubmissionPayload) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase is not configured.');
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/survey_responses`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      submission_id: payload.submissionId,
      submitted_at: payload.submittedAt,
      page_url: payload.pageUrl,
      user_agent: payload.userAgent,
      row_data: payload.row,
      answers: payload.answers,
      audio_recordings: payload.audioRecordings,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase insert failed with status ${response.status}: ${errorText}`);
  }
}
