# Power Automate Field Mapping

Use this if you want to wire the GitHub Pages survey into an Excel workbook through Power Automate.

## Flow shape

Recommended actions:

1. `When an HTTP request is received`
2. `Parse JSON`
   Rename this action to `Parse_JSON`
3. `Add a row into a table`
4. Optional: `Apply to each` over `audioRecordings`
5. Optional: `Create file` in OneDrive for Business or SharePoint

## Excel workbook setup

Create the workbook in OneDrive for Business or SharePoint, not local desktop Excel only.

Create a table with the headers from:

- `docs/excel-table-columns.csv`

Suggested table name:

- `SurveyResponses`

Microsoft notes that Excel connector actions require a table, and in some cases you may need to type the table name manually rather than selecting it from a dropdown.

## Parse JSON schema

Use:

- `docs/power-automate-parse-json-schema.json`

## Add A Row Mapping

If your `Parse JSON` action is named `Parse_JSON`, use these exact expressions in `Add a row into a table`.

| Excel column | Power Automate expression |
| --- | --- |
| `submission_id` | `body('Parse_JSON')?['row']?['submission_id']` |
| `submitted_at` | `body('Parse_JSON')?['row']?['submitted_at']` |
| `page_url` | `body('Parse_JSON')?['row']?['page_url']` |
| `q1` | `body('Parse_JSON')?['row']?['q1']` |
| `q2` | `body('Parse_JSON')?['row']?['q2']` |
| `q2_other` | `body('Parse_JSON')?['row']?['q2_other']` |
| `q3` | `body('Parse_JSON')?['row']?['q3']` |
| `q4` | `body('Parse_JSON')?['row']?['q4']` |
| `q5` | `body('Parse_JSON')?['row']?['q5']` |
| `q5_other` | `body('Parse_JSON')?['row']?['q5_other']` |
| `q6` | `body('Parse_JSON')?['row']?['q6']` |
| `q7` | `body('Parse_JSON')?['row']?['q7']` |
| `q7_other` | `body('Parse_JSON')?['row']?['q7_other']` |
| `q8` | `body('Parse_JSON')?['row']?['q8']` |
| `q9` | `body('Parse_JSON')?['row']?['q9']` |
| `q10` | `body('Parse_JSON')?['row']?['q10']` |
| `q10_other` | `body('Parse_JSON')?['row']?['q10_other']` |
| `q11` | `body('Parse_JSON')?['row']?['q11']` |
| `q12` | `body('Parse_JSON')?['row']?['q12']` |
| `q12_other` | `body('Parse_JSON')?['row']?['q12_other']` |
| `q13` | `body('Parse_JSON')?['row']?['q13']` |
| `q14` | `body('Parse_JSON')?['row']?['q14']` |
| `audio_question_ids` | `body('Parse_JSON')?['row']?['audio_question_ids']` |
| `audio_file_names` | `body('Parse_JSON')?['row']?['audio_file_names']` |

If you keep the default action name `Parse JSON`, Power Automate may internally reference it as `Parse_JSON` in expressions. If your expression editor shows a different internal name, use that exact name.

## Optional Audio File Handling

If you want the voice recording stored as files:

1. Add `Apply to each`
   Input:
   `body('Parse_JSON')?['audioRecordings']`
2. Inside the loop, add `Create file`
3. File name:
   `items('Apply_to_each')?['fileName']`
4. File content:
   `base64ToBinary(items('Apply_to_each')?['base64'])`

You can store those files in:

- OneDrive for Business
- SharePoint document library

The survey payload already includes `audio_file_names`, so Excel can store a trace of what was uploaded even before you add links.

## Recommended First Test

Test with a manual POST before going live.

Send one payload through the flow and confirm:

1. A new row appears in Excel.
2. Multi-select answers arrive as pipe-separated text.
3. Matrix questions (`q4`, `q8`) arrive as readable text.
4. If you recorded audio, the file is created and the file name matches the Excel row.

## Source Notes

This mapping is designed around:

- Microsoft Power Automate HTTP trigger naming
- Excel Online (Business) `Add a row into a table`
- the app payload generated in `app/src/lib/submission.ts`
