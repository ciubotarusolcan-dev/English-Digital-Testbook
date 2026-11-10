export function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

export function descriptor(score) {
  if (score >= 31) return "I";
  if (score >= 17) return "G";
  if (score >= 1) return "S";
  return "—";
}

export function needsReview(answer) {
  return Boolean(answer.translation?.given && !answer.translation.correct && !answer.translation.reviewed);
}

export function isCorrect(answer) {
  return answer.correct && (!answer.translation || answer.translation.correct);
}

export function scoreFor(record) {
  return record.answers.filter(isCorrect).length;
}

function feedback(given, expected, correct) {
  if (correct) return "Correct: " + given;
  return (given ? "Incorrect: " + given : "No answer") + ". Correct answer: " + expected;
}

export function answerDetails(answer) {
  const main = feedback(answer.given, answer.expected, answer.correct);
  if (!answer.translation) return main;
  const translation = answer.translation;
  const translated = needsReview(answer)
    ? "Check translation: " + translation.given + ". Example: " + translation.expected
    : feedback(translation.given, translation.expected, translation.correct);
  return "Verb — " + main + "\nRomanian — " + translated;
}

const key = "smartEnglish_FE3_Unit1";
const columns = ["Student", "Class", "Teacher", "Variant", "Score", "Descriptor", "Incorrect / blank answers", "Date"];
const itemIds = Array.from({ length: 35 }, (_, i) => (Math.floor(i / 5) + 1) + "." + (i % 5 + 1));

function isRecord(record) {
  return record?.evaluation === key && typeof record.id === "string" && record.id.length > 0 &&
    [1, 2].includes(record.variant) &&
    [record.name, record.className, record.teacherName, record.date].every(value => typeof value === "string" && value.trim()) &&
    Array.isArray(record.answers) && record.answers.length === itemIds.length &&
    record.answers.every((answer, i) => answer?.item === itemIds[i] && typeof answer.prompt === "string" && validAnswer(answer) &&
      (i < 30 ? !answer.translation : validAnswer(answer.translation) && typeof answer.translation.reviewed === "boolean"));
}

function validAnswer(answer) {
  return typeof answer?.correct === "boolean" && typeof answer.given === "string" && typeof answer.expected === "string";
}

function readRecords() {
  try {
    const records = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(records) ? records.filter(isRecord) : [];
  } catch {
    return [];
  }
}

function mistakes(record) {
  const groups = new Map();
  for (const answer of record.answers) {
    if (isCorrect(answer)) continue;
    const number = answer.item.split(".")[0];
    if (!groups.has(number)) groups.set(number, []);
    groups.get(number).push(answer.item + " " + answer.prompt + " — " + answerDetails(answer));
  }
  return Array.from(groups, ([number, items]) => "Ex " + number + " — " + items.join(" | ")).join("\n") || "None";
}

function valuesFor(record) {
  const score = scoreFor(record);
  const review = record.answers.some(needsReview) ? " (provisional)" : "";
  return [record.name, record.className, record.teacherName, record.variant, score + " / 35" + review,
    descriptor(score), mistakes(record), record.date];
}

function download(filename, contents, type) {
  const link = element("a");
  const url = URL.createObjectURL(new Blob([contents], { type }));
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function csvCell(value) {
  const text = String(value);
  const safe = /^\s*[=+@-]|^[\t\r\n]/.test(text) ? "'" + text : text;
  return '"' + safe.replaceAll('"', '""') + '"';
}

export function teacherTools() {
  const byId = id => document.getElementById(id);
  const rows = byId("teacherRows");
  const status = byId("teacherStatus");
  const files = byId("resultFiles");
  const exportButton = byId("exportCsv");
  const review = byId("review");
  const records = new Map(readRecords().map(record => [record.id, record]));

  function render() {
    rows.replaceChildren();
    for (const record of records.values()) {
      const row = element("tr");
      const cells = valuesFor(record).map(value => element("td", String(value)));
      cells[6].className = "mistakes";
      const reviewCell = element("td");
      if (record.answers.some(answer => answer.translation?.given)) {
        const button = element("button", "Review translations");
        button.type = "button";
        button.setAttribute("aria-label", "Review translations for " + record.name + ", variant " + record.variant);
        button.addEventListener("click", () => openReview(record));
        reviewCell.append(button);
      } else {
        reviewCell.textContent = "—";
      }
      row.append(...cells, reviewCell);
      rows.append(row);
    }
    exportButton.disabled = records.size === 0;
    if (!records.size) {
      const cell = element("td", "No results yet.");
      cell.colSpan = columns.length + 1;
      const row = element("tr");
      row.append(cell);
      rows.append(row);
    }
  }

  function persist() {
    try {
      localStorage.setItem(key, JSON.stringify([...records.values()]));
      return true;
    } catch {
      status.textContent = "Browser storage is unavailable. Export the results before leaving this page.";
      return false;
    }
  }

  function syncRecords() {
    for (const record of readRecords()) records.set(record.id, record);
  }

  function openReview(record) {
    const score = scoreFor(record);
    review.replaceChildren(element("h3", record.name + " — Romanian translations"),
      element("p", "Score: " + score + " / 35 · Descriptor: " + descriptor(score)));
    const close = element("button", "Close review");
    close.type = "button";
    close.addEventListener("click", () => { review.hidden = true; });
    review.append(close);
    for (const answer of record.answers.filter(answer => answer.translation?.given)) {
      const part = answer.translation;
      const item = element("div", null, "review-item");
      const state = needsReview(answer) ? "To review" : part.correct ? "Correct" : "Incorrect";
      item.append(element("h4", answer.item + " " + answer.prompt), element("p", "Pupil: " + part.given),
        element("p", "Example: " + part.expected), element("p", "Translation: " + state));
      for (const [text, correct] of [["Accept translation", true], ["Mark translation incorrect", false]]) {
        const button = element("button", text);
        button.type = "button";
        button.addEventListener("click", () => {
          syncRecords();
          const updated = records.get(record.id);
          const translation = updated.answers.find(item => item.item === answer.item).translation;
          translation.correct = correct;
          translation.reviewed = true;
          if (persist()) status.textContent = "Translation review saved.";
          render();
          openReview(updated);
        });
        item.append(button);
      }
      review.append(item);
    }
    review.hidden = false;
    review.focus();
  }

  byId("importResults").addEventListener("click", () => files.click());
  files.addEventListener("change", async () => {
    const selectedFiles = [...files.files];
    files.value = "";
    const parsed = await Promise.allSettled(selectedFiles.map(async file => JSON.parse(await file.text())));
    syncRecords();
    let imported = 0;
    let invalid = 0;
    for (const result of parsed) {
      if (result.status !== "fulfilled" || !isRecord(result.value)) invalid++;
      else if (!records.has(result.value.id)) {
        records.set(result.value.id, result.value);
        imported++;
      }
    }
    if (persist()) status.textContent = imported + " imported · " + (parsed.length - imported - invalid) +
      " already present · " + invalid + " invalid files.";
    render();
  });
  exportButton.addEventListener("click", () => {
    syncRecords();
    const csv = [columns, ...Array.from(records.values(), valuesFor)].map(row => row.map(csvCell).join(",")).join("\r\n");
    download("SmartEnglish_Unit1_FE3_results.csv", "\uFEFF" + csv, "text/csv;charset=utf-8");
  });
  window.addEventListener("storage", event => {
    if (event.key !== key) return;
    syncRecords();
    render();
  });
  render();
  return {
    save(record) {
      syncRecords();
      records.set(record.id, record);
      const saved = persist();
      render();
      return saved;
    },
    downloadResult(record) {
      const latest = records.get(record.id) ?? record;
      const score = scoreFor(latest);
      const filename = "SmartEnglish_FE3_V" + latest.variant + "_" + latest.name.replace(/[^\p{L}\p{N}-]+/gu, "_") + ".json";
      download(filename, JSON.stringify({ ...latest, score, descriptor: descriptor(score) }, null, 2), "application/json");
    }
  };
}
