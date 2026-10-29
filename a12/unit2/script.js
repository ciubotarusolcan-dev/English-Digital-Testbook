const match=location.pathname.match(/\/unit(\d+)(?:\/|\/index\.html|$)/);
const unitNumber=match?Number(match[1]):1;
const byId=id=>document.getElementById(id);
const evaluationCards=byId("evaluationCards"),variantPanel=byId("variantPanel"),variantCards=byId("variantCards"),testPanel=byId("testPanel");
document.title="Smart English | Unit "+unitNumber;byId("unitTitle").textContent="🌟 Unit "+unitNumber;byId("instruction").textContent="Choose your formative evaluation.";
function makeCard(label,emoji,action){const b=document.createElement("button");b.type="button";b.className="card";const e=document.createElement("span");e.className="emoji";e.textContent=emoji;const t=document.createElement("span");t.textContent=label;b.append(e,t);b.addEventListener("click",action);return b}
["Formative Evaluation 1","Formative Evaluation 2","Formative Evaluation on Unit "+unitNumber].forEach((evaluation,index)=>{
evaluationCards.append(makeCard(evaluation,["✏️","🧩","🏆"][index],()=>{byId("evaluationTitle").textContent=evaluation;variantPanel.hidden=false;testPanel.hidden=true;variantCards.replaceChildren();
[1,2].forEach(variant=>variantCards.append(makeCard("Variant "+variant,variant===1?"🟢":"🔴",()=>{testPanel.hidden=false;byId("testTitle").textContent=evaluation+" – Variant "+variant;testPanel.scrollIntoView({behavior:"smooth",block:"start"})})));
variantPanel.scrollIntoView({behavior:"smooth",block:"start"})}))});
