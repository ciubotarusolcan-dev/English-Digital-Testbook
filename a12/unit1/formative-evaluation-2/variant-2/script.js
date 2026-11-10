import { startEvaluation } from "../evaluation.js?v=1";

startEvaluation({
  variant: 2,
  choose: [
    ["He ___ to school at 9 o’clock.", "go", "goes", "goes"],
    ["You ___ your bike in the afternoon.", "ride", "rides", "ride"],
    ["I ___ badminton on Sundays.", "play", "plays", "play"],
    ["Our teacher ___ on the board.", "write", "writes", "writes"],
    ["The girls ___ happily.", "smile", "smiles", "smile"]
  ],
  negatives: [
    ["Kate ___ eat apples.", "doesn’t"],
    ["My friend ___ drink milk.", "doesn’t"],
    ["Our teacher ___ speak German.", "doesn’t"],
    ["They ___ open the door.", "don’t"],
    ["These cats ___ sleep much.", "don’t"]
  ],
  verbs: [
    ["His sister ___ (like) ice cream very much.", "like", "likes", "likes"],
    ["Children ___ (drink) a lot of milk.", "drink", "drinks", "drink"],
    ["She ___ (go) to school by bus.", "go", "goes", "goes"],
    ["Tom and Julie ___ (live) in a big city.", "live", "lives", "live"],
    ["He ___ (brush) his teeth in the morning.", "brush", "brushes", "brushes"]
  ],
  matching: {
    title: "What time is it?",
    image: "FE22.png",
    width: 2172,
    height: 724,
    alt: "Five numbered analogue clocks in a row, from 1 on the left to 5 on the right.",
    label: "Clock",
    sentence: true,
    words: ["four", "one", "eight", "two", "three"],
    targets: [
      { answer: "one", x: 12.2, y: 85 },
      { answer: "two", x: 31.3, y: 85 },
      { answer: "three", x: 50, y: 85 },
      { answer: "four", x: 69, y: 85 },
      { answer: "eight", x: 88, y: 85 }
    ]
  }
});
