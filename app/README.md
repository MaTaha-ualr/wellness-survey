# Inclusive Teen UX Survey

This app is a production-ready Vite + React survey for collecting anonymous youth mental wellness feedback.

## What is already set up

- TypeScript, ESLint, and a passing production build
- GitHub Actions CI for `lint` + `build`
- GitHub Pages deployment workflow from the `app/` directory
- GitHub Pages-safe asset paths
- Mobile-friendly layouts for intro, survey, and thank-you screens
- Real submission handling through a configurable endpoint
- Excel-friendly JSON payloads for Power Automate or a similar webhook

## Local development

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run check
```

## Build for production

```bash
npm run build
```

## Required environment variable

Create `app/.env` from `app/.env.example` and set:

```bash
VITE_SURVEY_SUBMIT_URL=https://your-survey-endpoint.example.com/api/surveys
```

This app will not silently fake successful submissions anymore. If `VITE_SURVEY_SUBMIT_URL` is missing, the UI shows a submission error instead of dropping data.

## Submission contract

On submit, the frontend sends a `POST` request as JSON to `VITE_SURVEY_SUBMIT_URL`.

The request body includes:

- `submissionId`, `submittedAt`, `pageUrl`, `userAgent`
- `row`: a flat key/value object ready to map into one Excel table row
- `answers`: formatted answers by question id
- `audioRecordings`: optional base64-encoded audio files with `questionId`, `fileName`, and `mimeType`

That payload shape is intended for Power Automate or any webhook that will map values into Excel.

## GitHub Pages deployment

This repo includes `.github/workflows/deploy-pages.yml`, which builds the app from `app/` and deploys `app/dist` to GitHub Pages.

Before turning the site live:

1. Push the repo to GitHub.
2. In GitHub, go to `Settings -> Pages` and set the source to `GitHub Actions`.
3. In `Settings -> Secrets and variables -> Actions -> Variables`, add `VITE_SURVEY_SUBMIT_URL`.
4. Push to `main`.

`VITE_` variables are embedded into the client bundle, so use a repository variable, not a secret, unless you are proxying through a private backend URL.

## Excel storage path

If you want responses to land in an Excel sheet while hosting on GitHub Pages, the practical path is:

1. Host the frontend on GitHub Pages.
2. Create a Power Automate flow with an HTTP trigger.
3. Save responses into an Excel table stored in OneDrive or SharePoint using Excel Online (Business).
4. Put the flow URL into `VITE_SURVEY_SUBMIT_URL`.

The Excel workbook must use a formatted table, not just plain cells.

Suggested Excel columns:

- `submission_id`
- `submitted_at`
- `page_url`
- `q1` through `q14`
- `q2_other`, `q5_other`, `q7_other`, `q10_other`, `q12_other`
- `audio_question_ids`
- `audio_file_names`

If you want audio preserved too, have the flow create files from `audioRecordings[*].base64` and write the resulting file names or links back into Excel.

## Important hosting note

GitHub Pages is static hosting. It can host the survey UI, but it cannot store survey responses by itself. You need the separate submission endpoint described above.
