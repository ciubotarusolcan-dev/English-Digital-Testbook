import { startEvaluation } from "../evaluation.js?v=1";

startEvaluation({
  variant: 2,
  possessives: [
    ["She has a bag. ___ bag is pink.", "Her"],
    ["You have a dog. ___ dog is small.", "Your"],
    ["We have a garden. ___ garden is green.", "Our"],
    ["I have a brother. ___ brother is nine.", "My"],
    ["He has a ball. ___ ball is red.", "His"]
  ],
  questions: [
    ["___ she draw flowers?", "Does"],
    ["___ we go to school by bus?", "Do"],
    ["___ he play tennis?", "Does"],
    ["___ you like apples?", "Do"],
    ["___ it drink milk?", "Does"]
  ],
  shortAnswers: [
    ["Are you thirsty?", "No, I", "No, I am not.", "No, I’m not.", "No, I am not thirsty.", "No, I’m not thirsty.", "am not", "am not thirsty"],
    ["Are you happy?", "Yes,", "Yes, I am.", "Yes, I am happy.", "Yes, I’m happy.", "I am", "I am happy", "I’m happy"],
    ["Does he play football on Sunday?", "Yes,", "Yes, he does.", "Yes, he plays football on Sunday.", "he does", "he plays football on Sunday"],
    ["Is she tired?", "Yes,", "Yes, she is.", "Yes, she is tired.", "Yes, she’s tired.", "she is", "she is tired", "she’s tired"],
    ["Do we read books at school?", "Yes, we", "Yes, we do.", "Yes, we read books at school.", "do", "read books at school"]
  ],
  verbs: [
    ["We ___ flowers in the garden.", "pick", "picks", "pick"],
    ["My brother ___ cartoons after school.", "watch", "watches", "watches"],
    ["They ___ their hands before lunch.", "wash", "washes", "wash"],
    ["Anna ___ books in the evening.", "read", "reads", "reads"],
    ["I ___ my grandmother on Sundays.", "help", "helps", "help"]
  ],
  scrambled: [
    ["We have ___ at noon.", "hcnul", "lunch"],
    ["Tom says ___ to his friends after school.", "ebygood", "goodbye"],
    ["The children ___ songs in class.", "gnis", "sing"],
    ["My brother eats ___ for breakfast.", "pelasp", "apples"],
    ["I drink ___ when I am thirsty.", "teraw", "water"]
  ],
  order: [
    [["brush", "you", "Do", "teeth", "your"], "Do you brush your teeth?"],
    [["says", "Tom", "to", "hello", "his", "teacher"], "Tom says hello to his teacher."],
    [["window", "the", "girl", "The", "opens"], "The girl opens the window."],
    [["by bus", "goes", "to", "He", "school"], "He goes to school by bus."],
    [["English", "teacher", "speaks", "Our"], "Our teacher speaks English."]
  ],
  translations: [
    ["We often ___ (read) books.", ["read", "reads"], "read",
      ["Noi citim adesea cărți.", "Noi citim des cărți.", "Citim adesea cărți.", "Citim des cărți.", "Noi citim deseori cărți.", "Citim deseori cărți."]],
    ["My sisters ___ (be) always happy.", ["am", "is", "are"], "are",
      ["Surorile mele sunt mereu fericite.", "Surorile mele sunt întotdeauna fericite.", "Surorile mele sunt tot timpul fericite.", "Surorile mele sunt mereu bucuroase."]],
    ["Anna ___ (have) a little brother.", ["have", "has"], "has",
      ["Anna are un frate mai mic.", "Anna are un frate mic.", "Anna are un frățior.", "Ana are un frate mai mic.", "Ana are un frate mic.", "Ana are un frățior."]],
    ["The girls ___ (play) tennis every day.", ["play", "plays"], "play",
      ["Fetele joacă tenis în fiecare zi.", "Fetele joacă tenis zilnic.", "Fetele joacă tenis zi de zi."]],
    ["She ___ (study) at home.", ["study", "studies"], "studies",
      ["Ea studiază acasă.", "Studiază acasă.", "Ea învață acasă.", "Învață acasă."]]
  ]
});
