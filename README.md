# JavaScript Fundamentals — Week 1 Assessment

A single-page, self-contained test for new interns learning JavaScript basics.
15 questions, 100 points, roughly 30 minutes. No build step, no dependencies.

**Live:** https://poojanair564.github.io/js-basics-test/

---

## What the test covers

| Part | Count | Points | Topics |
|---|---|---|---|
| Multiple choice | 12 | 5 each | Variables & data types, operators, conditionals, loops, functions, arrays & objects, ES6, DOM & events |
| Coding exercises | 2 | 12 each | `greet(name)` with a template literal, `sumEven(numbers)` with a loop |
| DOM lab | 1 | 16 | Wire up a live click counter with `querySelector` and `addEventListener` |

The coding answers run in the browser and are graded against visible test cases, with
partial credit per passing case. `console.log` works and prints under the editor.

## Proctoring built in

- Paste and drag-drop are blocked in every code editor; attempts are counted.
- Leaving the tab, window or app triggers a beep, flashes the tab title, and puts a
  centre-screen warning over the whole test that must be dismissed to continue.
- Warnings escalate: first warning, then "warning N of 3", then the paper is flagged.
- Every trip away is timestamped in the event log on the result sheet.
- Closing or reloading the tab raises the browser's "Leave site?" confirmation.

It cannot see a second monitor or a phone. Require a full-screen share and camera on.

---

## Setup 1 — hosting (done)

The page is plain static HTML, so GitHub Pages serves it as-is.
Settings → Pages → Source: `main`, folder `/ (root)`. Any push to `main` redeploys.

## Setup 2 — collecting the results in a Google Sheet

Without this, candidates email or download their result and send it to you by hand.
With it, every submission lands in your spreadsheet and your inbox automatically.
It is free and takes about five minutes, once.

1. Create a new Google Sheet — name it something like *JS Assessment Results*.
2. In that sheet: **Extensions → Apps Script**.
3. Delete whatever is in `Code.gs` and paste in the whole of
   [`google-apps-script.gs`](google-apps-script.gs) from this repo. Save.
4. Check the `NOTIFY_EMAIL` line at the top is your address. Set it to `""` if you
   do not want an email per submission.
5. Click **Deploy → New deployment**. Choose type **Web app**.
   - *Description*: anything
   - *Execute as*: **Me**
   - *Who has access*: **Anyone** — this matters, the interns are not signed in as you
6. **Deploy**, then **Authorize access** and accept the permission screens.
   Google will warn that the app is unverified; it is your own script — choose
   *Advanced → Go to (project name)*.
7. Copy the **Web app URL**. It looks like
   `https://script.google.com/macros/s/AKfy……/exec`
8. In `index.html`, find this line near the top of the `<script>` block:

   ```js
   var SUBMIT_URL = "";
   ```

   Paste your URL between the quotes, then commit and push:

   ```sh
   git add index.html && git commit -m "Point submissions at the results sheet" && git push
   ```

Take the test yourself once to confirm a row appears in the sheet.

### What you get per submission

**Results tab** — one row per candidate: name, score out of 100, MCQ correct out of 12,
time taken, page switches, paste attempts, flagged yes/no, test runs, the full event log
and the per-topic breakdown. Flagged rows are shaded red.

**Answers tab** — one row per question: the question, what they answered, the correct
answer, and right/wrong — followed by the full source code they typed for all three
coding exercises.

**Email** — the same summary, subject line `JS test — <name> — <score>/100`, with
`[FLAGGED]` appended when the integrity thresholds trip.

---

## Running it

1. Send the interns the Pages link.
2. Have them share their **entire screen** in the meeting before pressing Begin.
3. They enter their name, answer, and submit.
4. Results reach you automatically; the result sheet also has Email / Download /
   Copy buttons as a backup.

## A note on the answer key

This is client-side marking, so the correct answers are in the page source. Anyone
who opens DevTools can read them. The screen share is what prevents that — it is not
worth building a server to close a gap that watching the screen already closes.

## Editing the questions

Everything lives in the `<script>` block of `index.html`:

- `MCQ` — array of questions. `answer` is the **zero-based index** into `opts`.
- `EXERCISES` — coding tasks. `fn` is the function name they must define; `cases` are
  the test cases, `args` in, `expect` out.
- `LAB` — the DOM exercise, its starter markup and its click-simulation checks.
- `MCQ_POINTS`, `EX_POINTS`, `LAB_POINTS` — keep the total at 100.
