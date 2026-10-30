
"use strict";

/* ====================================
   SMART ENGLISH - INTERACTIVE MENU
   ==================================== */

const LEVELS = [
  { id: "a11", name: "A1.1" },
  { id: "a12", name: "A1.2" },
  { id: "a1", name: "A1" }
];

const COLORS = [
  "card-blue",
  "card-yellow",
  "card-green",
  "card-pink",
  "card-purple",
  "card-orange"
];

const state = {
  level: null,
  unit: null,
  evaluation: null,
  variant: null
};

const sidebar = document.getElementById("sidebarMenu");
const cards = document.getElementById("mainCards");
const title = document.getElementById("sectionTitle");
const description =
  document.getElementById("sectionDescription");
const breadcrumbs =
  document.getElementById("breadcrumbs");
const testPanel = document.getElementById("testPanel");

/* BASIC HELPERS */

function createButton(text, className, action) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = text;
  button.addEventListener("click", action);
  return button;
}

function createFlag(extraClass = "") {
  const flag = document.createElement("span");
  flag.className = "uk-flag " + extraClass;
  flag.setAttribute("aria-hidden", "true");
  return flag;
}

function getLevelName() {
  const level = LEVELS.find(
    item => item.id === state.level
  );
  return level ? level.name : "";
}

function getEvaluations(unit) {
  return [
    "Formative Evaluation 1",
    "Formative Evaluation 2",
    "Formative Evaluation on Unit " + unit
  ];
}

/* NAVIGATION */

function goHome() {
  state.level = null;
  state.unit = null;
  state.evaluation = null;
  state.variant = null;
  render();
}

function chooseLevel(level) {
  state.level = level;
  state.unit = null;
  state.evaluation = null;
  state.variant = null;
  render();
}

function chooseUnit(unit) {
  state.unit = unit;
  state.evaluation = null;
  state.variant = null;
  render();
}

function chooseSidebarUnit(level, unit) {
  state.level = level;
  chooseUnit(unit);
}

function chooseEvaluation(evaluation) {
  state.evaluation = evaluation;
  state.variant = null;
  render();
}

function chooseVariant(variant) {
  state.variant = variant;
  render();
}

/* BIG CARD BUILDER */

function addCard(
  label,
  subtitle,
  color,
  action,
  symbol = null,
  showFlag = false
) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "learning-card " + color;

  if (showFlag) {
    button.appendChild(createFlag("card-flag"));
  } else if (symbol !== null) {
    const circle = document.createElement("span");
    circle.className = "card-symbol";
    circle.textContent = symbol;
    button.appendChild(circle);
  }

  const name = document.createElement("span");
  name.textContent = label;
  button.appendChild(name);

  if (subtitle) {
    const small = document.createElement("span");
    small.className = "card-subtitle";
    small.textContent = subtitle;
    button.appendChild(small);
  }

  button.addEventListener("click", action);
  cards.appendChild(button);
}

/* SIDEBAR */

function buildSidebar() {
  sidebar.replaceChildren();

  LEVELS.forEach(level => {
    const group = document.createElement("div");
    group.className = "sidebar-level";

    const levelButton = document.createElement("button");
    levelButton.type = "button";
    levelButton.className = "sidebar-button";

    const expanded = state.level === level.id;

    if (expanded) {
      levelButton.classList.add("active");
    }

    levelButton.setAttribute(
      "aria-expanded",
      String(expanded)
    );

    levelButton.appendChild(createFlag());

    const label = document.createElement("span");
    label.textContent = level.name;
    levelButton.appendChild(label);

    const arrow = document.createElement("span");
    arrow.className = "sidebar-arrow";
    arrow.textContent = expanded ? "−" : "+";
    levelButton.appendChild(arrow);

    levelButton.addEventListener("click", () => {
      if (expanded) {
        goHome();
      } else {
        chooseLevel(level.id);
      }
    });

    group.appendChild(levelButton);

    const unitsMenu = document.createElement("div");
    unitsMenu.className = "sidebar-submenu";
    unitsMenu.hidden = !expanded;

    for (let unit = 1; unit <= 6; unit++) {
      const unitButton = createButton(
        "Unit " + unit,
        "sidebar-unit",
        () => chooseSidebarUnit(level.id, unit)
      );

      unitsMenu.appendChild(unitButton);

      if (expanded && state.unit === unit) {
        const evaluationMenu =
          document.createElement("div");

        evaluationMenu.className = "sidebar-submenu";

        getEvaluations(unit).forEach(evaluation => {
          const evaluationButton = createButton(
            evaluation,
            "sidebar-evaluation",
            () => chooseEvaluation(evaluation)
          );

          evaluationMenu.appendChild(evaluationButton);

          if (state.evaluation === evaluation) {
            const variantMenu =
              document.createElement("div");

            variantMenu.className = "sidebar-submenu";

            [1, 2].forEach(variant => {
              const variantButton = createButton(
                "Variant " + variant,
                "sidebar-variant",
                () => chooseVariant(variant)
              );

              variantMenu.appendChild(variantButton);
            });

            evaluationMenu.appendChild(variantMenu);
          }
        });

        unitsMenu.appendChild(evaluationMenu);
      }
    }

    group.appendChild(unitsMenu);
    sidebar.appendChild(group);
  });
}

/* BREADCRUMBS */

function buildBreadcrumbs() {
  breadcrumbs.replaceChildren();

  const steps = [
    { label: "Home", action: goHome }
  ];

  if (state.level) {
    const level = state.level;
    steps.push({
      label: getLevelName(),
      action: () => chooseLevel(level)
    });
  }

  if (state.unit !== null) {
    const unit = state.unit;
    steps.push({
      label: "Unit " + unit,
      action: () => chooseUnit(unit)
    });
  }

  if (state.evaluation) {
    const evaluation = state.evaluation;
    steps.push({
      label: evaluation,
      action: () => chooseEvaluation(evaluation)
    });
  }

  if (state.variant !== null) {
    steps.push({
      label: "Variant " + state.variant,
      action: null
    });
  }

  steps.forEach((step, index) => {
    if (index > 0) {
      const separator = document.createElement("span");
      separator.className = "breadcrumb-separator";
      separator.textContent = "›";
      breadcrumbs.appendChild(separator);
    }

    const button = createButton(
      step.label,
      "",
      step.action || (() => {})
    );

    if (index === steps.length - 1) {
      button.setAttribute("aria-current", "page");
    }

    breadcrumbs.appendChild(button);
  });
}

/* SHOW LEVELS */

function showLevels() {
  title.textContent = "Choose Your Level";
  description.textContent =
    "Your English adventure starts here!";

  LEVELS.forEach((level, index) => {
    addCard(
      level.name,
      "Let's start learning!",
      COLORS[index],
      () => chooseLevel(level.id),
      null,
      true
    );
  });
}

/* SHOW UNITS */

function showUnits() {
  cards.classList.add("units-grid");
  title.textContent =
    getLevelName() + " — Choose Your Unit";

  description.textContent =
    "Pick a unit and discover new challenges!";

  for (let unit = 1; unit <= 6; unit++) {
    addCard(
      "Unit " + unit,
      "Explore and learn",
      COLORS[unit - 1],
      () => chooseUnit(unit),
      String(unit)
    );
  }
}

/* SHOW EVALUATIONS */

function showEvaluations() {
  title.textContent =
    "Unit " + state.unit + " — Evaluations";

  description.textContent =
    "Choose your formative evaluation!";

  getEvaluations(state.unit).forEach(
    (evaluation, index) => {
      addCard(
        evaluation,
        "Let's test your skills!",
        COLORS[index],
        () => chooseEvaluation(evaluation),
        String(index + 1)
      );
    }
  );
}

/* SHOW VARIANTS */

function showVariants() {
  title.textContent = state.evaluation;
  description.textContent =
    "Choose a variant and show what you know!";

  [1, 2].forEach((variant, index) => {
    addCard(
      "Variant " + variant,
      "You can do it!",
      index === 0 ? "card-green" : "card-pink",
      () => chooseVariant(variant),
      String(variant)
    );
  });
}

/* SHOW SELECTED TEST */

function showSelectedTest() {
  title.textContent =
    state.evaluation + " — Variant " + state.variant;

  description.textContent =
    "Believe in yourself. You are ready!";

  const heading = document.createElement("h3");
  heading.textContent =
    getLevelName() + " / Unit " + state.unit;

  const details = document.createElement("p");
  details.textContent =
    state.evaluation + " / Variant " + state.variant;

  const note = document.createElement("p");
  note.textContent =
    "Open the unit page to continue your challenge.";

  const evaluationIndex =
    getEvaluations(state.unit).indexOf(
      state.evaluation
    ) + 1;

  const params = new URLSearchParams({
    evaluation: String(evaluationIndex),
    variant: String(state.variant)
  });

  const link = document.createElement("a");
  link.className = "open-test";
  link.textContent = "Open Unit " + state.unit;

  link.href =
    state.level +
    "/unit" +
    state.unit +
    "/?" +
    params.toString();

  testPanel.append(
    heading,
    details,
    note,
    link
  );

  testPanel.hidden = false;
}

/* MAIN RENDER */

function render() {
  cards.classList.remove("units-grid");
  cards.replaceChildren();
  testPanel.replaceChildren();
  testPanel.hidden = true;

  buildSidebar();
  buildBreadcrumbs();

  if (!state.level) {
    showLevels();
  } else if (state.unit === null) {
    showUnits();
  } else if (!state.evaluation) {
    showEvaluations();
  } else if (state.variant === null) {
    showVariants();
  } else {
    showSelectedTest();
  }
}

/* START */

render();

