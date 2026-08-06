/**
 * JavaScript Fundamentals Assessment — result collector
 *
 * Paste this into a Google Apps Script bound to a Google Sheet,
 * deploy it as a Web App, and paste the deployment URL into
 * SUBMIT_URL at the top of the <script> block in index.html.
 *
 * Full step-by-step setup is in README.md.
 */

var NOTIFY_EMAIL = "claude_1@coremodules.tech";   // who gets the email alert; "" to switch emails off

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    writeSummaryRow(ss, data);
    writeAnswerRows(ss, data);
    if (NOTIFY_EMAIL) notify(data);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* One row per candidate — the sheet you will actually look at. */
function writeSummaryRow(ss, d) {
  var sheet = ss.getSheetByName("Results") || ss.insertSheet("Results");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Submitted", "Candidate", "Score /100", "MCQ correct /12", "Time taken",
      "Page switches", "Paste attempts", "Flagged", "Test runs", "Event log", "Topic breakdown"
    ]);
    sheet.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#f3efe5");
    sheet.setFrozenRows(1);
  }

  var topics = Object.keys(d.topics || {}).map(function (k) { return k + ": " + d.topics[k]; }).join("  |  ");

  sheet.appendRow([
    new Date(d.submittedAt), d.candidate, d.score, d.correctCount + "/12", d.timeTaken,
    d.pageSwitches, d.pasteAttempts, d.flagged ? "YES — CHECK RECORDING" : "no",
    d.testRuns, d.eventLog || "clean", topics
  ]);

  if (d.flagged) {
    sheet.getRange(sheet.getLastRow(), 1, 1, 11).setBackground("#f8e7e3");
  }
  sheet.autoResizeColumns(1, 9);
}

/* One row per question, plus the code they wrote — the detail tab. */
function writeAnswerRows(ss, d) {
  var sheet = ss.getSheetByName("Answers") || ss.insertSheet("Answers");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Submitted", "Candidate", "Q", "Topic", "Question", "Their answer", "Correct answer", "Right?"]);
    sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#f3efe5");
    sheet.setFrozenRows(1);
  }

  var when = new Date(d.submittedAt);
  var rows = (d.answers || []).map(function (a) {
    return [when, d.candidate, a.n, a.topic, a.question, a.answered, a.correct, a.isCorrect ? "correct" : "WRONG"];
  });

  (d.codeAnswers || []).forEach(function (c, i) {
    rows.push([when, d.candidate, "code " + (i + 1), "Coding", c.name + "  (" + c.points + ")", c.code, "—", c.points]);
  });

  if (rows.length) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 8).setValues(rows);
  }
}

/* Email alert so you do not have to watch the sheet. */
function notify(d) {
  var subject = "JS test — " + d.candidate + " — " + d.score + "/100" + (d.flagged ? "  [FLAGGED]" : "");

  var wrong = (d.answers || []).filter(function (a) { return !a.isCorrect; })
    .map(function (a) { return "  Q" + a.n + "  answered: " + a.answered + "\n        correct: " + a.correct; })
    .join("\n");

  var code = (d.codeAnswers || [])
    .map(function (c) { return "--- " + c.name + "  (" + c.points + ") ---\n" + c.code; })
    .join("\n\n");

  var body =
    "Candidate     : " + d.candidate + "\n" +
    "Score         : " + d.score + "/100   (" + d.correctCount + "/12 multiple choice)\n" +
    "Time taken    : " + d.timeTaken + "\n" +
    "Page switches : " + d.pageSwitches + "\n" +
    "Paste attempts: " + d.pasteAttempts + "\n" +
    "Flagged       : " + (d.flagged ? "YES — check the screen-share recording" : "no") + "\n" +
    "Event log     : " + (d.eventLog || "clean") + "\n\n" +
    "BY TOPIC\n" +
    Object.keys(d.topics || {}).map(function (k) { return "  " + k + ": " + d.topics[k]; }).join("\n") +
    "\n\nMISSED QUESTIONS\n" + (wrong || "  none — all correct") +
    "\n\nCODE SUBMITTED\n" + code + "\n";

  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

/* Optional: open the Web App URL in a browser to check it is alive. */
function doGet() {
  return ContentService.createTextOutput("Assessment collector is running.");
}
