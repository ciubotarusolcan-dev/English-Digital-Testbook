// Add questions to this array to activate the interactive test.
// Each item: { question: "Question?", options: ["A", "B", "C"], answer: 0 }
// The answer is the zero-based index of the correct option.
const questions = [];
const form = document.getElementById("testForm");
const container = document.getElementById("questions");
const status = document.getElementById("status");
const result = document.getElementById("result");

if (questions.length) {
  status.hidden = true;
  form.hidden = false;
  questions.forEach((item, index) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "question";
    const legend = document.createElement("legend");
    legend.textContent = (index + 1) + ". " + item.question;
    fieldset.appendChild(legend);
    item.options.forEach((option, optionIndex) => {
      const label = document.createElement("label");
      label.className = "answer";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "q" + index;
      input.value = String(optionIndex);
      label.append(input, document.createTextNode(option));
      fieldset.appendChild(label);
    });
    container.appendChild(fieldset);
  });
}
form.addEventListener("submit", event => {
  event.preventDefault();
  let score = 0;
  questions.forEach((item, index) => {
    const selected = form.querySelector('input[name="q' + index + '"]:checked');
    const correct = selected && Number(selected.value) === item.answer;
    const fieldset = container.children[index];
    fieldset.classList.toggle("correct", Boolean(correct));
    fieldset.classList.toggle("incorrect", !correct);
    if (correct) score++;
  });
  result.textContent = "Your score: " + score + " / " + questions.length + " (" + Math.round(score / questions.length * 100) + "%)";
});
