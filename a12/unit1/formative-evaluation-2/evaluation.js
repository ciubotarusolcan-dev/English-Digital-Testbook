const storageKey = "smartEnglish_FE2_Unit1";
const total = 20;

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function descriptor(score) {
  if (score >= 17) return "I";
  if (score >= 8) return "G";
  if (score >= 1) return "S";
  return "—";
}

function isRecord(record) {
  return record?.evaluation === storageKey &&
    typeof record.id === "string" && record.id.length > 0 &&
    [1, 2].includes(record.variant) &&
    [record.name, record.className, record.teacherName, record.date].every(value => typeof value === "string" && value.trim()) &&
    Array.isArray(record.answers) && record.answers.length === total &&
    record.answers.every(answer => answer &&
      ["item", "prompt", "given", "expected"].every(key => typeof answer[key] === "string"));
}

function scoreFor(record) {
  return record.answers.filter(answer => answer.given === answer.expected).length;
}

function readRecords() {
  try {
    const records = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(records) ? records.filter(isRecord) : [];
  } catch {
    return [];
  }
}

function mistakesFor(record) {
  return record.answers.filter(answer => answer.given !== answer.expected).map(answer =>
    answer.item + " " + answer.prompt + " — " + (answer.given || "No answer") + " → " + answer.expected
  ).join(" | ");
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

function teacherTools() {
  const byId = id => document.getElementById(id);
  const rows = byId("teacherRows");
  const status = byId("teacherStatus");
  const files = byId("resultFiles");
  const importButton = byId("importResults");
  const exportButton = byId("exportCsv");
  const records = new Map(readRecords().map(record => [record.id, record]));
  const columns = ["Student", "Class", "Teacher", "Variant", "Score", "Descriptor", "Incorrect / blank answers", "Date"];
  const valuesFor = record => {
    const score = scoreFor(record);
    return [record.name, record.className, record.teacherName, record.variant, score + " / 20",
      descriptor(score), mistakesFor(record) || "None", record.date];
  };

  function render() {
    rows.replaceChildren();
    for (const record of records.values()) {
      const row = element("tr");
      row.append(...valuesFor(record).map(value => element("td", String(value))));
      rows.append(row);
    }
    exportButton.disabled = records.size === 0;
    if (!records.size) {
      const empty = element("td", "No results yet.");
      empty.colSpan = columns.length;
      const row = element("tr");
      row.append(empty);
      rows.append(row);
    }
  }

  function save(newRecords) {
    for (const record of readRecords()) {
      if (!records.has(record.id)) records.set(record.id, record);
    }
    let added = 0;
    for (const record of newRecords) {
      if (records.has(record.id)) continue;
      records.set(record.id, record);
      added++;
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify([...records.values()]));
    } catch {
      status.textContent = "Browser storage is unavailable. Export the results before leaving this page.";
      render();
      return null;
    }
    render();
    return added;
  }

  importButton.addEventListener("click", () => files.click());
  files.addEventListener("change", async () => {
    const selectedFiles = [...files.files];
    files.value = "";
    const parsed = await Promise.allSettled(selectedFiles.map(async file => JSON.parse(await file.text())));
    const valid = parsed.filter(result => result.status === "fulfilled" && isRecord(result.value)).map(result => result.value);
    const added = save(valid);
    if (added !== null) {
      status.textContent = added + " imported · " + (valid.length - added) + " already present · " +
        (selectedFiles.length - valid.length) + " invalid files.";
    }
  });
  exportButton.addEventListener("click", () => {
    const lines = [columns, ...Array.from(records.values(), valuesFor)];
    const csv = lines.map(row => row.map(csvCell).join(",")).join("\r\n");
    download("SmartEnglish_Unit1_FE2_results.csv", "\uFEFF" + csv, "text/csv;charset=utf-8");
  });
  render();
  return save;
}

function makeSelectExercise(number, title, questions, list) {
  const section = element("section", null, "exercise");
  section.append(element("h2", number + ". " + title));
  const rows = element("div", null, "questions");
  questions.forEach(({ sentence, options, expected }, index) => {
    const item = number + "." + (index + 1);
    const row = element("label", null, "question");
    const [before, after] = sentence.split("___");
    const select = element("select");
    select.setAttribute("aria-label", "Question " + item + ": " + sentence.replace("___", "blank"));
    select.append(new Option("Choose", ""));
    options.forEach(option => select.append(new Option(option, option)));
    row.append(element("span", (index + 1) + ".", "number"), before, select, after);
    rows.append(row);
    list.push({ item, prompt: sentence, expected, read: () => select.value, row });
  });
  section.append(rows);
  return section;
}

function makeMatchingExercise(config, list) {
  const section = element("section", null, "exercise");
  section.append(element("h2", "4. " + config.title),
    element("p", "Drag a word to the matching number. You can also select a word and then select its answer box.", "hint"));
  const tray = element("div", null, "wordtray");
  const instruction = element("p", null, "hint match-instruction");
  instruction.setAttribute("role", "status");
  const picture = element("div", null, "match-picture");
  const img = element("img");
  Object.assign(img, { src: config.image, alt: config.alt, width: config.width, height: config.height });
  picture.append(img);
  const dropList = element("div", null, "drop-list");
  const slots = [];
  const chips = new Map();
  let selected = "";

  function refresh() {
    for (const [word, chip] of chips) {
      chip.classList.toggle("used", slots.some(slot => slot.word === word));
      chip.classList.toggle("selected", selected === word);
      chip.setAttribute("aria-pressed", String(selected === word));
    }
    for (const { button, word, label } of slots) {
      button.textContent = word || "Drop here";
      button.classList.toggle("filled", Boolean(word));
      button.setAttribute("aria-label", label + ": " + (word || "drop a word here"));
    }
  }

  function place(slot, word) {
    const previous = slots.find(entry => entry.word === word);
    if (word && previous && previous !== slot) previous.word = "";
    slot.word = word;
    selected = "";
    instruction.textContent = word ? word + " placed in " + slot.label.toLowerCase() + "." : slot.label + " cleared.";
    refresh();
  }

  for (const word of config.words) {
    const chip = element("button", word, "wordchip");
    chip.type = "button";
    chip.draggable = true;
    chip.addEventListener("dragstart", event => {
      if (chip.disabled) {
        event.preventDefault();
        return;
      }
      event.dataTransfer.setData("text/plain", word);
      event.dataTransfer.effectAllowed = "move";
    });
    chip.addEventListener("click", () => {
      selected = selected === word ? "" : word;
      instruction.textContent = selected ? selected + " selected. Choose an answer box." : "Selection cleared.";
      refresh();
    });
    tray.append(chip);
    chips.set(word, chip);
  }

  config.targets.forEach(({ answer, x, y }, index) => {
    const marker = element("span", String(index + 1), "picture-marker");
    marker.style.left = x + "%";
    marker.style.top = y + "%";
    marker.setAttribute("aria-hidden", "true");
    picture.append(marker);
    const label = config.label + " " + (index + 1);
    const row = element("div", null, "drop-row");
    const button = element("button", "Drop here", "dropzone");
    button.type = "button";
    const slot = { button, label, word: "" };
    slots.push(slot);
    button.addEventListener("dragover", event => {
      if (!button.disabled) event.preventDefault();
    });
    button.addEventListener("drop", event => {
      event.preventDefault();
      const word = event.dataTransfer.getData("text/plain");
      if (!button.disabled && chips.has(word)) place(slot, word);
    });
    button.addEventListener("click", () => place(slot, selected));
    const phrase = element("span", null, "drop-phrase");
    if (config.sentence) phrase.append("It’s ");
    phrase.append(button);
    if (config.sentence) phrase.append(" o’clock.");
    row.append(element("strong", label), phrase);
    dropList.append(row);
    list.push({ item: "4." + (index + 1), prompt: label, expected: answer, read: () => slot.word, row: button });
  });
  section.append(tray, instruction, picture, dropList);
  refresh();
  return section;
}

export function startEvaluation(config) {
  const list = [];
  const form = document.getElementById("testForm");
  const root = document.getElementById("exercises");
  const resultBox = document.getElementById("results");
  const withOptions = ([sentence, first, second, expected]) => ({ sentence, options: [first, second], expected });
  root.append(
    makeSelectExercise(1, "Choose the correct word in each sentence.", config.choose.map(withOptions), list),
    makeSelectExercise(2, "Complete the sentences using don’t or doesn’t.",
      config.negatives.map(([sentence, expected]) => ({ sentence, expected, options: ["don’t", "doesn’t"] })), list),
    makeSelectExercise(3, "Choose the correct form of the verbs.", config.verbs.map(withOptions), list),
    makeMatchingExercise(config.matching, list)
  );
  const save = teacherTools();
  const fields = ["studentName", "studentClass", "teacherName"].map(name => form.elements.namedItem(name));
  for (const field of fields) {
    field.addEventListener("input", () => field.setCustomValidity(""));
  }
  let submitted = false;

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (submitted) return;
    const [name, className, teacherName] = fields.map(field => field.value.trim());
    for (const field of fields) {
      if (field.value.trim()) continue;
      field.setCustomValidity("Please complete this field.");
      field.reportValidity();
      return;
    }
    submitted = true;
    const answers = list.map(({ item, prompt, expected, read, row }) => {
      const given = read();
      row.classList.add(given === expected ? "correct" : "incorrect");
      return { item, prompt, given, expected };
    });
    const record = { evaluation: storageKey, id: crypto.randomUUID(), variant: config.variant,
      name, className, teacherName, date: new Date().toISOString(), answers };
    const saved = save([record]);
    for (const control of form.elements) control.disabled = true;

    const score = scoreFor(record);
    const result = score === 0 ? "No descriptor for 0 points." : "Descriptor " + descriptor(score);
    resultBox.append(element("h2", "My Learning and Progress"), element("p", score + " / 20 points · " + result, "score"),
      element("p", "I: 17–20 points · G: 8–16 points · S: 1–7 points"));
    if (saved === null) resultBox.append(element("p", "Local saving is unavailable. Download your result before leaving this page."));
    for (const answer of answers) {
      const correct = answer.given === answer.expected;
      const feedback = correct ? "Correct: " + answer.given
        : (answer.given ? "Incorrect: " + answer.given : "No answer") + ". Correct answer: " + answer.expected;
      resultBox.append(element("p", answer.item + " " + answer.prompt + " — " + feedback,
        "result-line " + (correct ? "good" : "bad")));
    }
    const actions = element("div", null, "actions");
    const button = element("button", "Download my result (JSON)");
    button.type = "button";
    button.addEventListener("click", () => {
      const filename = "SmartEnglish_FE2_V" + config.variant + "_" + name.replace(/[^\p{L}\p{N}-]+/gu, "_") + ".json";
      download(filename, JSON.stringify({ ...record, score, descriptor: descriptor(score) }, null, 2), "application/json");
    });
    actions.append(button);
    resultBox.append(actions);
    resultBox.hidden = false;
    resultBox.focus();
  });
}
