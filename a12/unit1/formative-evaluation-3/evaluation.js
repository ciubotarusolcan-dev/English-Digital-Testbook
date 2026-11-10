import { answerDetails, descriptor, element, isCorrect, needsReview, scoreFor, teacherTools } from "./teacher-results.js?v=1";

const possessiveOptions = ["My", "Your", "His", "Her", "Our"];
const questionOptions = ["Do", "Does"];

function normalize(text, romanian = false) {
  const words = text.toLowerCase().replace(/[’‘]/g, "'").replace(/[^\p{L}\p{M}\p{N}' -]/gu, " ")
    .replace(/\s+/g, " ").trim();
  return romanian ? words.normalize("NFD").replace(/\p{M}/gu, "") : words.normalize("NFC");
}

function matches(value, choices, romanian = false) {
  return choices.some(choice => normalize(value, romanian) === normalize(choice, romanian));
}

function dropdown(item, sentence, options) {
  const select = element("select");
  select.setAttribute("aria-label", "Item " + item + ": " + sentence.replace("___", "blank"));
  select.append(new Option("Choose", ""));
  for (const option of options) select.append(new Option(option, option));
  return select;
}

function writingField(labelText, placeholder) {
  const label = element("label", labelText, "answer-label");
  const input = element("textarea");
  input.rows = 2;
  input.maxLength = 300;
  input.placeholder = placeholder;
  input.autocomplete = "off";
  input.spellcheck = false;
  label.append(input);
  return { label, input };
}

function sentenceWithDropdown(sentence, select) {
  const [before, after] = sentence.split("___");
  const label = element("label");
  label.append(before, select, after);
  return label;
}

function renderExercise(root, number, title, items, makeRow, responses) {
  const section = element("section", null, "exercise");
  const rows = element("div", null, "questions");
  section.append(element("h2", number + ". " + title), rows);
  items.forEach((data, index) => {
    const item = number + "." + (index + 1);
    const row = element("div", null, "question");
    row.append(element("span", (index + 1) + ".", "number"));
    const read = makeRow(data, item, row);
    responses.push({ row, item, read });
    rows.append(row);
  });
  root.append(section);
}

function selectRow([prompt, expected, options], item, row) {
  const select = dropdown(item, prompt, options);
  row.append(sentenceWithDropdown(prompt, select));
  return () => ({ prompt, expected, given: select.value, correct: select.value === expected });
}

function textRow(row, item, prompt, hint, answers, placeholder) {
  row.append(prompt);
  if (hint) row.append(" " + hint);
  const { label, input } = writingField("Write your answer for item " + item, placeholder);
  row.append(label);
  return () => {
    const given = input.value.trim();
    return { prompt, expected: answers[0], given, correct: matches(given, answers) };
  };
}

function shortAnswerRow([prompt, cue, ...answers], item, row) {
  return textRow(row, item, prompt, "Start with “" + cue + "”", answers, "Write your answer");
}

function scrambledRow([template, clue, word], item, row) {
  return textRow(row, item, template, "(" + clue + ")", [template.replace("___", word), word],
    "Write the completed sentence or the missing word");
}

function orderRow([words, expected], item, row) {
  row.classList.add("order-question");
  const bank = element("div", null, "wordtray");
  const slots = element("div", null, "order-slots");
  const status = element("p", null, "hint order-status");
  status.setAttribute("role", "status");
  row.append(bank, slots, status);
  const positions = Array(words.length).fill(null);
  let selected = null;
  const chips = [];
  const targets = [];

  function refresh() {
    chips.forEach((chip, index) => {
      chip.classList.toggle("used", positions.includes(index));
      chip.classList.toggle("selected", selected === index);
      chip.setAttribute("aria-pressed", String(selected === index));
    });
    targets.forEach((target, index) => {
      const word = words[positions[index]];
      target.textContent = word ?? String(index + 1);
      target.classList.toggle("filled", word !== undefined);
      target.setAttribute("aria-label", "Item " + item + ", position " + (index + 1) + ": " + (word ?? "empty"));
    });
  }

  function place(position, wordIndex) {
    const previous = positions.indexOf(wordIndex);
    if (wordIndex !== null && previous !== -1 && previous !== position) positions[previous] = positions[position];
    positions[position] = wordIndex;
    selected = null;
    status.textContent = wordIndex === null ? "Position " + (position + 1) + " cleared."
      : words[wordIndex] + " placed in position " + (position + 1) + ".";
    refresh();
  }

  words.forEach((word, index) => {
    const chip = element("button", word, "wordchip");
    chip.type = "button";
    chip.draggable = true;
    chip.addEventListener("click", () => {
      selected = selected === index ? null : index;
      status.textContent = selected === null ? "Selection cleared." : word + " selected. Choose a position.";
      refresh();
    });
    chip.addEventListener("dragstart", event => {
      if (chip.disabled) return event.preventDefault();
      event.dataTransfer.setData("text/plain", item + ":" + index);
      event.dataTransfer.effectAllowed = "move";
    });
    bank.append(chip);
    chips.push(chip);

    const target = element("button", null, "dropzone");
    target.type = "button";
    target.addEventListener("click", () => place(index, selected));
    target.addEventListener("dragover", event => {
      if (!target.disabled) event.preventDefault();
    });
    target.addEventListener("drop", event => {
      event.preventDefault();
      const [source, token] = event.dataTransfer.getData("text/plain").split(":");
      const wordIndex = Number(token);
      if (!target.disabled && source === item && /^\d+$/.test(token) && wordIndex < words.length) {
        place(index, wordIndex);
      }
    });
    slots.append(target);
    targets.push(target);
  });
  refresh();
  return () => {
    const given = positions.map(index => words[index] ?? "").join(" ").trim();
    return { prompt: words.join(" / "), expected, given, correct: positions.every(index => index !== null) && matches(given, [expected]) };
  };
}

function translationRow([prompt, options, expected, translations], item, row) {
  const select = dropdown(item, prompt, options);
  const { label, input } = writingField("Romanian translation for item " + item, "Scrie traducerea în limba română");
  input.lang = "ro";
  row.append(sentenceWithDropdown(prompt, select), label);
  return () => {
    const given = input.value.trim();
    return { prompt, expected, given: select.value, correct: select.value === expected,
      translation: { given, expected: translations[0], correct: matches(given, translations, true), reviewed: false } };
  };
}

function showResults(box, record) {
  const score = scoreFor(record);
  const review = record.answers.some(needsReview);
  const label = score ? "Descriptor " + descriptor(score) : "No descriptor for 0 points";
  box.append(element("h2", "My Learning and Progress"),
    element("p", score + " / 35 points · " + label + (review ? " · Provisional" : ""), "score"),
    element("p", "I: 31–35 points · G: 17–30 points · S: 1–16 points"));
  if (review) box.append(element("p", "A translation can be correct even if it differs from the example. Your teacher can review it."));
  for (let exercise = 1; exercise <= 7; exercise++) {
    const section = element("section", null, "result-exercise");
    section.append(element("h3", "Exercise " + exercise));
    for (const answer of record.answers.filter(answer => answer.item.startsWith(exercise + "."))) {
      const state = needsReview(answer) ? "pending" : isCorrect(answer) ? "good" : "bad";
      section.append(element("p", answer.item + " " + answer.prompt + " — " + answerDetails(answer), "result-line " + state));
    }
    box.append(section);
  }
}

export function startEvaluation(config) {
  const root = document.getElementById("exercises");
  const form = document.getElementById("testForm");
  const box = document.getElementById("results");
  const responses = [];
  const choices = (rows, options) => rows.map(([prompt, expected]) => [prompt, expected, options]);
  renderExercise(root, 1, "Complete the sentences using My, Your, His, Her or Our.",
    choices(config.possessives, possessiveOptions), selectRow, responses);
  renderExercise(root, 2, "Make up questions using Do or Does.",
    choices(config.questions, questionOptions), selectRow, responses);
  renderExercise(root, 3, "Answer the questions. Write your answers.", config.shortAnswers, shortAnswerRow, responses);
  renderExercise(root, 4, "Choose the correct form of the verbs.",
    config.verbs.map(([prompt, first, second, expected]) => [prompt, expected, [first, second]]), selectRow, responses);
  renderExercise(root, 5, "Unscramble the words and complete the sentences.", config.scrambled, scrambledRow, responses);
  renderExercise(root, 6, "Unjumble the sentences. Drag each word to a position, or select a word and then a position.",
    config.order, orderRow, responses);
  renderExercise(root, 7, "Use the Present Simple Tense. Choose the verb form and write the Romanian translation.",
    config.translations, translationRow, responses);
  const teacher = teacherTools();
  const fields = ["studentName", "studentClass", "teacherName"].map(name => form.elements.namedItem(name));
  for (const field of fields) field.addEventListener("input", () => field.setCustomValidity(""));
  let submitted = false;

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (submitted) return;
    const empty = fields.find(field => !field.value.trim());
    if (empty) {
      empty.setCustomValidity("Please complete this field.");
      empty.reportValidity();
      return;
    }
    submitted = true;
    const [name, className, teacherName] = fields.map(field => field.value.trim());
    const answers = responses.map(({ row, item, read }) => {
      const answer = { item, ...read() };
      row.classList.add(needsReview(answer) ? "pending" : isCorrect(answer) ? "correct" : "incorrect");
      return answer;
    });
    const record = { evaluation: "smartEnglish_FE3_Unit1", id: crypto.randomUUID(), variant: config.variant,
      name, className, teacherName, date: new Date().toISOString(), answers };
    const saved = teacher.save(record);
    for (const control of form.elements) control.disabled = true;
    showResults(box, record);
    if (!saved) box.append(element("p", "Local saving is unavailable. Download your result before leaving this page."));
    const actions = element("div", null, "actions");
    const button = element("button", "Download my result (JSON)");
    button.type = "button";
    button.addEventListener("click", () => teacher.downloadResult(record));
    actions.append(button);
    box.append(actions);
    box.hidden = false;
    box.focus();
  });
}
