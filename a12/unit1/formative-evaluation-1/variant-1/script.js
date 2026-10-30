"use strict";
const CONFIG={"v":1,"tasks":[{"title":"Complete the sentences using:","options":["I","It","We","They","He"],"rows":[["___ are good pupils.","We"],["___ is my father.","He"],["___ is a big house.","It"],["___ am a pupil.","I"],["___ are my pretty sisters.","They"]]},{"title":"Fill in the sentences using:","options":["my","his","her","its","their"],"rows":[["He is a student. ___ name is Jack.","his"],["I am Mary. ___ mother is a doctor.","my"],["It is a dog. ___ name is Black.","its"],["This is Ann. Sidney is ___ little sister.","her"],["They are good friends. ___ toys are in the box.","their"]]},{"title":"Use am, is, are to complete the sentences.","options":["am","is","are"],"rows":[["Their jobs ___ interesting.","are"],["It ___ sunny today.","is"],["We ___ hungry.","are"],["I ___ eleven.","am"],["They ___ my mother and father.","are"]]}]};
const BODY_PARTS=["ear","nose","mouth","finger","leg"];
const BODY_LABELS=["1","2","3","4","5"];
const tasks=CONFIG.tasks;
const form=document.getElementById("testForm"),root=document.getElementById("exercises"),resultBox=document.getElementById("results");
const key="smartEnglish_FE1_Unit1";
let chosenWord=null;let submitted=false;let latest=null;
const escapes=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const mix=(a)=>[...a].sort(()=>Math.random()-.5);
function addExercise(task,idx){
 const section=document.createElement("section");section.className="exercise";
 const opts=task.options.map(s=>'<option value="'+escapes(s)+'">'+escapes(s)+'</option>').join("");
 const rows=task.rows.map(([text,answer],i)=>'<div class="question" data-ex="'+idx+'" data-idx="'+i+'" data-answer="'+escapes(answer)+'"><span class="number">'+(i+1)+'.</span><span class="sentence">'+escapes(text).replace("___",'<span aria-label="blank">_____</span>')+'</span><select aria-label="Exercise '+(idx+1)+' question '+(i+1)+'"><option value="">Choose an answer</option>'+opts+'</select><span class="feedback"></span></div>').join("");
 section.innerHTML='<h2>'+(idx+1)+'. '+escapes(task.title)+'</h2><div class="wordbank">'+escapes(task.options.join(" · "))+'</div><div class="questions">'+rows+'</div>';
 root.append(section);
}
tasks.forEach(addExercise);
const section=document.createElement("section");section.className="exercise";
section.innerHTML=`<h2>4. Label the picture. Use the words in the box.</h2><p class="hint">Drag each word onto its matching numbered body part. You can also click a word, then click its target.</p><div class="wordtray" id="wordTray"></div><div class="figure-layout"><div class="figure"><svg viewBox="0 0 320 390" role="img" aria-label="Child body diagram with numbered targets on ear, nose, mouth, finger and leg">
<ellipse cx="160" cy="360" rx="104" ry="14" fill="#dceaf6"/>
<path d="M143 176 Q130 210 138 251 L182 251 Q190 208 177 176" fill="#ed8d71" stroke="#a94445" stroke-width="3"/>
<path d="M139 250 L181 250 L183 278 L137 278Z" fill="#3d75b5" stroke="#245183" stroke-width="3"/>
<path d="M145 278 L142 354 Q139 365 126 368 Q124 375 149 372 L156 279" fill="#ee987d" stroke="#a94445" stroke-width="3"/>
<path d="M166 279 L172 356 Q174 368 184 370 Q194 378 169 374 L158 279" fill="#ee987d" stroke="#a94445" stroke-width="3"/>
<path d="M145 193 L105 238 L67 221 M174 191 L224 232 L260 211" fill="none" stroke="#e58a72" stroke-width="19" stroke-linecap="round"/>
<path d="M67 221 l-12 -14 m12 14 l-17 3 m17 -3 l-8 15 M260 211 l11 -16 m-11 16 l17 -2 m-17 2 l10 13" fill="none" stroke="#e58a72" stroke-width="6" stroke-linecap="round"/>
<ellipse cx="160" cy="104" rx="64" ry="74" fill="#f29a7b" stroke="#b76259" stroke-width="3"/>
<ellipse cx="98" cy="112" rx="12" ry="19" fill="#f29a7b" stroke="#b76259" stroke-width="3"/>
<ellipse cx="222" cy="112" rx="12" ry="19" fill="#f29a7b" stroke="#b76259" stroke-width="3"/>
<path d="M98 87 Q88 37 134 25 Q183 -3 213 46 L222 91 Q205 69 189 65 Q151 94 102 83Z" fill="#b64d2e" stroke="#8d382b" stroke-width="4"/>
<ellipse cx="136" cy="110" rx="15" ry="18" fill="white"/><ellipse cx="184" cy="110" rx="15" ry="18" fill="white"/>
<circle cx="137" cy="111" r="10" fill="#277f65"/><circle cx="185" cy="111" r="10" fill="#277f65"/>
<circle cx="139" cy="107" r="3" fill="white"/><circle cx="187" cy="107" r="3" fill="white"/>
<path d="M154 135 Q160 130 166 135" fill="none" stroke="#a75e50" stroke-width="4" stroke-linecap="round"/>
<path d="M143 150 Q160 165 176 150" fill="none" stroke="#ab3c42" stroke-width="4" stroke-linecap="round"/>
<circle cx="98" cy="110" r="12" fill="#fff" stroke="#2c74bc" stroke-width="3"/><text x="98" y="114" font-size="12" font-weight="bold" text-anchor="middle" fill="#245fa9">1</text><circle cx="160" cy="135" r="12" fill="#fff" stroke="#2c74bc" stroke-width="3"/><text x="160" y="139" font-size="12" font-weight="bold" text-anchor="middle" fill="#245fa9">2</text><circle cx="160" cy="155" r="12" fill="#fff" stroke="#2c74bc" stroke-width="3"/><text x="160" y="159" font-size="12" font-weight="bold" text-anchor="middle" fill="#245fa9">3</text><circle cx="60" cy="224" r="12" fill="#fff" stroke="#2c74bc" stroke-width="3"/><text x="60" y="228" font-size="12" font-weight="bold" text-anchor="middle" fill="#245fa9">4</text><circle cx="144" cy="325" r="12" fill="#fff" stroke="#2c74bc" stroke-width="3"/><text x="144" y="329" font-size="12" font-weight="bold" text-anchor="middle" fill="#245fa9">5</text>
</svg></div><div class="drop-list" id="dropList"></div></div>`;
root.append(section);
const tray=document.getElementById("wordTray"),dropList=document.getElementById("dropList");
BODY_PARTS.forEach(word=>{const chip=document.createElement("button");chip.type="button";chip.className="wordchip";chip.textContent=word;chip.draggable=true;chip.dataset.word=word;chip.addEventListener("dragstart",event=>{if(submitted){event.preventDefault();return;}event.dataTransfer.setData("text/plain",word);event.dataTransfer.effectAllowed="move"});chip.addEventListener("click",()=>{if(submitted)return;chosenWord=word;document.querySelectorAll(".wordchip").forEach(c=>c.classList.toggle("selected",c===chip))});tray.append(chip)});
function refreshChips(){const values=[...document.querySelectorAll(".dropzone")].map(e=>e.dataset.value).filter(Boolean);document.querySelectorAll(".wordchip").forEach(chip=>chip.classList.toggle("used",values.includes(chip.dataset.word)))}
function setWord(zone,word){if(submitted||!BODY_PARTS.includes(word))return;document.querySelectorAll(".dropzone").forEach(z=>{if(z!==zone&&z.dataset.value===word){z.dataset.value="";z.textContent="Drop here"}});zone.dataset.value=word;zone.textContent=word;zone.classList.add("filled");chosenWord=null;document.querySelectorAll(".wordchip").forEach(c=>c.classList.remove("selected"));refreshChips()}
BODY_PARTS.forEach((answer,i)=>{const row=document.createElement("div");row.className="drop-row";const label=document.createElement("strong");label.textContent="Line "+(i+1);const zone=document.createElement("button");zone.type="button";zone.className="dropzone";zone.textContent="Drop here";zone.dataset.answer=answer;zone.dataset.value="";zone.setAttribute("aria-label","Picture line "+(i+1)+" — place a word");zone.addEventListener("dragover",event=>{if(!submitted)event.preventDefault()});zone.addEventListener("drop",event=>{event.preventDefault();setWord(zone,event.dataTransfer.getData("text/plain"))});zone.addEventListener("click",()=>{if(chosenWord)setWord(zone,chosenWord);else if(!submitted){zone.dataset.value="";zone.textContent="Drop here";zone.classList.remove("filled");refreshChips()}});const feedback=document.createElement("span");feedback.className="drop-feedback";row.append(label,zone,feedback);dropList.append(row)});
function descriptor(score){return score>=17?"I":score>=8?"G":score>=1?"S":"S (0 points)"}
function download(filename,content,type){const a=document.createElement("a");const url=URL.createObjectURL(new Blob([content],{type}));a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function getRecords(){try{return JSON.parse(localStorage.getItem(key)||"[]")}catch{return []}}
function saveRecord(rec){try{const records=getRecords();records.push(rec);localStorage.setItem(key,JSON.stringify(records))}catch{alert("Local saving is not available in this browser. Please download your result file.")}}
function renderTeacher(){const tbody=document.getElementById("teacherRows");tbody.replaceChildren();getRecords().filter(r=>r.variant===CONFIG.v).forEach(r=>{const tr=document.createElement("tr");[r.name,r.className,""+r.variant,r.score+"/20",r.descriptor,r.errors.map(e=>e.item+": "+e.given+" → "+e.expected).join("; ")||"None",r.date].forEach(val=>{const td=document.createElement("td");td.textContent=val;tr.append(td)});tbody.append(tr)})}
document.getElementById("exportCsv").addEventListener("click",()=>{const fields=["name","className","variant","score","descriptor","date","errors"];const csv=[fields.join(","),...getRecords().map(r=>fields.map(f=>{const val=f==="errors"?r.errors.map(e=>e.item+": "+e.given+" -> "+e.expected).join("; "):r[f];return '"'+String(val??"").replace(/"/g,'""')+'"'}).join(","))].join("\r\n");download("SmartEnglish_Unit1_FE1_results.csv","\uFEFF"+csv,"text/csv;charset=utf-8")});
document.getElementById("downloadStudent").addEventListener("click",()=>{if(latest)download("SmartEnglish_"+latest.name.replace(/[^a-z0-9-]/gi,"_")+"_V"+CONFIG.v+".json",JSON.stringify(latest,null,2),"application/json")});
form.addEventListener("submit",e=>{e.preventDefault();if(submitted)return;const name=document.getElementById("studentName").value.trim();if(!name){alert("Please enter your name before submitting.");document.getElementById("studentName").focus();return}
let score=0;const errors=[];const all=[];
document.querySelectorAll(".question").forEach(row=>{const input=row.querySelector("select"),given=input.value,correct=row.dataset.answer,alternatives=row.dataset.ex==="0"&&row.dataset.idx==="0"?["We","They"]:[],ok=given===correct||alternatives.includes(given);const item="Ex "+(Number(row.dataset.ex)+1)+"."+ (Number(row.dataset.idx)+1);all.push({item,given:given||"(blank)",expected:correct,correct:ok});if(ok)score++;else errors.push({item,given:given||"(blank)",expected:correct});row.classList.add(ok?"correct":"incorrect");row.querySelector(".feedback").textContent=ok?"Correct!":"Your answer: "+(given||"not answered")+". Correct answer: "+correct;input.disabled=true});
document.querySelectorAll(".drop-row").forEach((row,i)=>{const zone=row.querySelector(".dropzone"),given=zone.dataset.value,correct=zone.dataset.answer,ok=given===correct;const item="Ex 4."+(i+1);all.push({item,given:given||"(blank)",expected:correct,correct:ok});if(ok)score++;else errors.push({item,given:given||"(blank)",expected:correct});zone.classList.add(ok?"correct":"incorrect");row.querySelector(".drop-feedback").textContent=ok?"Correct!":"Your answer: "+(given||"not answered")+". Correct answer: "+correct});
submitted=true;form.classList.add("submitted");document.querySelectorAll(".wordchip").forEach(c=>{c.disabled=true;c.draggable=false});form.querySelector(".submit").disabled=true;
latest={name,className:document.getElementById("studentClass").value.trim(),variant:CONFIG.v,score,descriptor:descriptor(score),date:new Date().toLocaleString(),errors,answers:all};
saveRecord(latest);
const heading=document.createElement("h2");heading.textContent="Your Learning and Progress";const points=document.createElement("p");points.className="score";points.textContent=score+" / 20 points · Descriptor "+descriptor(score);const explanation=document.createElement("p");explanation.textContent="I: 17–20 · G: 8–16 · S: 1–7"+(score===0?" · No correct answers":"")+". Review each answer below.";
resultBox.append(heading,points,explanation);
all.forEach(a=>{const div=document.createElement("div");div.className="result-line "+(a.correct?"good":"bad");div.textContent=a.item+" — "+(a.correct?"Correct: ":"Incorrect: ")+a.given+(a.correct?"":" → Correct: "+a.expected);resultBox.append(div)});
resultBox.hidden=false;document.getElementById("downloadStudent").disabled=false;renderTeacher();resultBox.scrollIntoView({behavior:"smooth",block:"start"});
});
renderTeacher();
