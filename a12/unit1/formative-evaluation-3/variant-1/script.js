import { startEvaluation } from "../evaluation.js?v=1";

startEvaluation({
  variant: 1,
  possessives: [
    ["We have cars. ___ cars are new.", "Our"],
    ["He has a bike. ___ bike is blue.", "His"],
    ["I have a sister. ___ sister is 10.", "My"],
    ["She has a house. ___ house is big.", "Her"],
    ["You have friends. ___ friends are kind.", "Your"]
  ],
  questions: [
    ["___ I sing well?", "Do"],
    ["___ you play football?", "Do"],
    ["___ he read books?", "Does"],
    ["___ she speak English?", "Does"],
    ["___ it eat bananas?", "Does"]
  ],
  shortAnswers: [
    ["Are you hungry?", "No, I", "No, I am not.", "No, I’m not.", "No, I am not hungry.", "No, I’m not hungry.", "am not", "am not hungry"],
    ["Are you tired?", "Yes,", "Yes, I am.", "Yes, I am tired.", "Yes, I’m tired.", "I am", "I am tired", "I’m tired"],
    ["Does she have a rest when she is tired?", "Yes,", "Yes, she does.", "Yes, she has a rest when she is tired.", "Yes, she has a rest when she’s tired.", "she does", "she has a rest when she is tired", "she has a rest when she’s tired"],
    ["Is he happy?", "Yes,", "Yes, he is.", "Yes, he is happy.", "Yes, he’s happy.", "he is", "he is happy", "he’s happy"],
    ["Do we wash our hands every day?", "Yes, we", "Yes, we do.", "Yes, we wash our hands every day.", "do", "wash our hands every day"]
  ],
  verbs: [
    ["I ___ books in the evening.", "read", "reads", "read"],
    ["You ___ tennis on Sunday.", "play", "plays", "play"],
    ["The children ___ grapes and pears.", "pick", "picks", "pick"],
    ["My sister often ___ letters to our grandmother.", "write", "writes", "writes"],
    ["Angela ___ her grandmother in the kitchen.", "help", "helps", "helps"]
  ],
  scrambled: [
    ["I have ___ at 8 o’clock in the morning.", "fabestkra", "breakfast"],
    ["Marry says ___ to her teacher.", "lloeh", "hello"],
    ["Pupils ___ nice flowers during the lessons.", "wrda", "draw"],
    ["My sister has ___ for dinner.", "eetglebasv", "vegetables"],
    ["She never has ___ for lunch.", "klim", "milk"]
  ],
  order: [
    [["comb", "your", "Do", "hair", "you"], "Do you comb your hair?"],
    [["Mother", "night", "child", "good", "says", "her", "to"], "Mother says good night to her child."],
    [["opens", "The", "book", "teacher", "the"], "The teacher opens the book."],
    [["to", "She", "school", "goes", "by bus"], "She goes to school by bus."],
    [["teacher", "Our", "German", "speaks"], "Our teacher speaks German."]
  ],
  translations: [
    ["They often ___ (watch) movies.", ["watch", "watches"], "watch",
      ["Ei se uită adesea la filme.", "Ei se uită des la filme.", "Se uită des la filme.", "Se uită adesea la filme.", "Ei urmăresc adesea filme.", "Ei urmăresc des filme.", "Urmăresc des filme.", "Urmăresc adesea filme.", "Ele se uită des la filme.", "Ei vizionează des filme.", "Ei vizionează adesea filme."]],
    ["My brothers ___ (be) always hungry.", ["am", "is", "are"], "are",
      ["Frații mei sunt mereu flămânzi.", "Frații mei sunt întotdeauna flămânzi.", "Frații mei sunt tot timpul flămânzi.", "Fraților mei le este mereu foame.", "Fraților mei le este întotdeauna foame.", "Fraților mei le este tot timpul foame.", "Frații mei sunt mereu înfometați."]],
    ["Peter ___ (have) a little sister.", ["have", "has"], "has",
      ["Peter are o soră mai mică.", "Peter are o soră mică.", "Peter are o surioară.", "Petru are o soră mai mică.", "Petru are o soră mică.", "Petru are o surioară."]],
    ["The boys ___ (play) football every day.", ["play", "plays"], "play",
      ["Băieții joacă fotbal în fiecare zi.", "Băieții joacă fotbal zilnic.", "Băieții se joacă fotbal în fiecare zi.", "Băieții joacă fotbal zi de zi."]],
    ["He ___ (study) in the library.", ["study", "studies"], "studies",
      ["El studiază la bibliotecă.", "El studiază în bibliotecă.", "Studiază la bibliotecă.", "Studiază în bibliotecă.", "El învață la bibliotecă.", "El învață în bibliotecă.", "Învață la bibliotecă.", "Învață în bibliotecă."]]
  ]
});
