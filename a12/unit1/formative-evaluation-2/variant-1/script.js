import { startEvaluation } from "../evaluation.js?v=1";

startEvaluation({
  variant: 1,
  choose: [
    ["I ___ to school at 8 o’clock.", "go", "goes", "go"],
    ["We ___ breakfast at home.", "have", "has", "have"],
    ["She ___ her car fast.", "drive", "drives", "drives"],
    ["My brother ___ a lot of books.", "read", "reads", "reads"],
    ["The dogs ___ in the park.", "run", "runs", "run"]
  ],
  negatives: [
    ["She ___ drink juice.", "doesn’t"],
    ["My friend ___ eat cheese.", "doesn’t"],
    ["Her classmate ___ read books.", "doesn’t"],
    ["They ___ open the window.", "don’t"],
    ["My friends ___ run quickly.", "don’t"]
  ],
  verbs: [
    ["Ann ___ (watch) TV in her room.", "watch", "watches", "watches"],
    ["Jack ___ (go) to the cinema.", "go", "goes", "goes"],
    ["My brothers ___ (drink) tea every morning.", "drink", "drinks", "drink"],
    ["Her sister ___ (like) vegetables.", "like", "likes", "likes"],
    ["They ___ (sleep) late on Sunday.", "sleep", "sleeps", "sleep"]
  ],
  matching: {
    title: "Label the picture. Use the words in the box.",
    image: "FE21.png",
    width: 1536,
    height: 1024,
    alt: "Five numbered pictures of faces, with 1–3 on the top row and 4–5 on the bottom row.",
    label: "Picture",
    words: ["thirsty", "sad", "happy", "hungry", "tired"],
    targets: [
      { answer: "happy", x: 28, y: 45 },
      { answer: "sad", x: 57, y: 45 },
      { answer: "hungry", x: 96, y: 45 },
      { answer: "tired", x: 41, y: 92 },
      { answer: "thirsty", x: 82, y: 92 }
    ]
  }
});
