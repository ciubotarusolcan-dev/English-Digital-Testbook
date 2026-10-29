const levels=[["A1.1","🌟","a11/"],["A1.2","🔎","a12/"],["A1","📗","a1/"],["Reading Comprehension","📖","reading/"]];
const container=document.getElementById("levelCards");
levels.forEach(([name,icon,url])=>{const a=document.createElement("a");a.className="card";a.href=url;const e=document.createElement("span");e.className="emoji";e.textContent=icon;const t=document.createElement("span");t.textContent=name;a.append(e,t);container.append(a)});
