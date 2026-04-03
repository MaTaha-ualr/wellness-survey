# GitHub Pages + Excel Storage

This app is ready to post survey submissions to a webhook URL. For an Excel-backed workflow, use Power Automate.

## Recommended architecture

1. GitHub Pages hosts the React app.
2. The app sends a JSON `POST` request to your Power Automate HTTP endpoint.
3. Power Automate writes one row per response into an Excel table stored in OneDrive or SharePoint.
4. Optional: Power Automate creates audio files from base64 and stores links or file names in Excel.

## Excel workbook setup

Create an `.xlsx` workbook in OneDrive for Business or SharePoint with a sheet that contains a formatted table.

Suggested columns:

- `submission_id`
- `submitted_at`
- `page_url`
- `q1`
- `q2`
- `q2_other`
- `q3`
- `q4`
- `q5`
- `q5_other`
- `q6`
- `q7`
- `q7_other`
- `q8`
- `q9`
- `q10`
- `q10_other`
- `q11`
- `q12`
- `q12_other`
- `q13`
- `q14`
- `audio_question_ids`
- `audio_file_names`

You can copy the exact header row from:

- `docs/excel-table-columns.csv`

## Flow outline

1. Trigger: `When an HTTP request is received`
2. Action: `Parse JSON`
   Use the schema in `docs/power-automate-parse-json-schema.json`
3. Optional loop: `Apply to each` over `audioRecordings`
4. Optional file action: create an audio file in OneDrive or SharePoint from `base64`
5. Action: `Add a row into a table`

For the exact column-to-expression mapping, use:

- `docs/power-automate-field-mapping.md`

## Payload shape

The frontend sends JSON like this:

```json
{
  "submissionId": "uuid",
  "submittedAt": "2026-04-03T01:23:45.000Z",
  "pageUrl": "https://your-name.github.io/your-repo/",
  "userAgent": "browser info",
  "row": {
    "submission_id": "uuid",
    "submitted_at": "2026-04-03T01:23:45.000Z",
    "page_url": "https://your-name.github.io/your-repo/",
    "q1": "15-16",
    "q2": "Female | Other: ...",
    "q14": "VOICE_RECORDED",
    "audio_question_ids": "q14",
    "audio_file_names": "uuid-q14.webm"
  },
  "answers": {
    "q1": "15-16"
  },
  "audioRecordings": [
    {
      "questionId": "q14",
      "fileName": "uuid-q14.webm",
      "mimeType": "audio/webm",
      "base64": "..."
    }
  ]
}
```

## Environment variable

Set this in GitHub Actions repository variables:

```bash
VITE_SURVEY_SUBMIT_URL=https://your-flow-endpoint
```

That value is injected at build time by the GitHub Pages deployment workflow.

## Important limitation

If the Power Automate HTTP endpoint is publicly callable, anyone who discovers the URL can post to it. For a public survey this may be acceptable, but if you need stronger abuse protection, put a small authenticated backend or bot protection layer in front of the flow.
