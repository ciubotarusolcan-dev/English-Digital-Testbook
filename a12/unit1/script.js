
const folder = location.pathname
  .split("/")
  .filter(Boolean)
  .pop();

const unitNumber = Number(
  folder.replace("unit", "")
);

const title = document.getElementById("unitTitle");
const instruction = document.getElementById("instruction");
const evaluationCards =
  document.getElementById("evaluationCards");
const variantPanel =
  document.getElementById("variantPanel");
const variantCards =
  document.getElementById("variantCards");
const evaluationTitle =
  document.getElementById("evaluationTitle");
const testPanel =
  document.getElementById("testPanel");
const testTitle =
  document.getElementById("testTitle");

document.title =
  "Smart English | Unit " + unitNumber;

title.textContent = "🌟 Unit " + unitNumber;
instruction.textContent =
  "Choose your formative evaluation.";

const evaluations = [
  "Formative Evaluation 1",
  "Formative Evaluation 2",
  "Formative Evaluation on Unit " + unitNumber
];

function makeCard(label, emoji, action) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "card";

  const icon = document.createElement("span");
  icon.className = "emoji";
  icon.textContent = emoji;

  const text = document.createElement("span");
  text.textContent = label;

  button.append(icon, text);
  button.addEventListener("click", action);

  return button;
}

evaluations.forEach((evaluation, index) => {
  const icons = ["✏️", "🧩", "🏆"];

  evaluationCards.appendChild(
    makeCard(evaluation, icons[index], () => {
      evaluationTitle.textContent = evaluation;
      variantPanel.hidden = false;
      testPanel.hidden = true;
      variantCards.replaceChildren();

      [1, 2].forEach(variant => {
        variantCards.appendChild(
          makeCard(
            "Variant " + variant,
            variant === 1 ? "🟢" : "🔴",
            () => {
              testPanel.hidden = false;
              testTitle.textContent =
                evaluation + " – Variant " + variant;
              testPanel.scrollIntoView({
                behavior: "smooth",
                block: "start"
              });
            }
          )
        );
      });

      variantPanel.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    })
  );
});

