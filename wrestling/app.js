import {createMatch,applyTransition,resetMatch} from "./match-state.js";

let match=createMatch();
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

const lessonData={
 control:{n:1,eyebrow:"LESSON 1 • CONTROL",title:"Who has control?",text:"Start with the most important idea in folkstyle wrestling: identify whether the wrestlers are neutral or one wrestler has established control.",badge:"POSITION FIRST",state:"neutral"},
 takedown:{n:2,eyebrow:"LESSON 2 • TAKEDOWN",title:"When does the takedown score?",text:"A shot or finish is not automatically a score. The takedown is awarded when the wrestler goes from neutral to established control.",badge:"TAKEDOWN +3",state:"neutral"},
 escape:{n:3,eyebrow:"LESSON 3 • ESCAPE",title:"Can the bottom wrestler get free?",text:"An escape is earned when the controlled wrestler gets free and returns to neutral without immediately gaining control.",badge:"ESCAPE +1",state:"red-control"},
 reversal:{n:4,eyebrow:"LESSON 4 • REVERSAL",title:"Who changed control?",text:"A reversal is earned when the wrestler who was controlled gains control of the opponent.",badge:"REVERSAL +2",state:"red-control"},
 nearfall:{n:5,eyebrow:"LESSON 5 • NEAR FALL",title:"Is this really near-fall scoring?",text:"Near-fall points require offensive control, a pinning situation, the required criteria, and enough count time. Seconds alone are not enough.",badge:"2 / 3 / 4",state:"red-control"}
};

function setScene(state){
  $$(".scene").forEach(x=>x.classList.remove("is-active"));
  $("#scene-"+state)?.classList.add("is-active");
  $$(".state").forEach(x=>x.classList.toggle("active",x.dataset.state===state));
  const map={neutral:["NEUTRAL","Nobody has control"],"red-control":["RED CONTROL","Red has established control"],"green-control":["GREEN CONTROL","Green has established control"]};
  $("#sceneLabel").textContent=map[state][0];
  $("#sceneHint").textContent=map[state][1];
  $("#wrestlingScene").setAttribute("aria-label","Two youth wrestlers demonstrating "+map[state][0].toLowerCase());
}
function setTeachingState(state){match={...match,state};setScene(state)}
function renderScore(){
  $("#redScore").textContent=match.red;
  $("#greenScore").textContent=match.green;
  const x=match.history.at(-1);
  $("#lastCall").textContent=x?x.call.toUpperCase()+" +"+x.points:"MATCH READY";
}
function feedback(title,text,tone="info"){
  const box=$("#feedback");
  box.className="feedback "+tone;
  box.innerHTML='<span class="feedback-icon">'+(tone==="score"?"✓":"i")+'</span><div><b>'+title+'</b><p>'+text+'</p></div>';
}

$$(".state").forEach(btn=>btn.addEventListener("click",()=>{
  const before=match;
  const next=btn.dataset.state;
  match=applyTransition(match,next);
  setScene(next);
  renderScore();
  if(match.history.length>before.history.length){
    const e=match.history.at(-1);
    feedback(e.scoringWrestler.toUpperCase()+" scores "+e.points,e.call.toUpperCase()+": the wrestling state changed from "+e.from+" to "+e.to+".","score");
  } else {
    feedback("No points on that change","Identify the position first. A scoring call requires the rule conditions for that transition.");
  }
}));

$$(".lesson").forEach(btn=>btn.addEventListener("click",()=>{
  $$(".lesson").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
  const d=lessonData[btn.dataset.lesson];
  $("#lessonEyebrow").textContent=d.eyebrow;
  $("#lessonTitle").textContent=d.title;
  $("#lessonText").textContent=d.text;
  $("#ruleBadge").textContent=d.badge;
  $("#progressText").textContent=d.n+" of 5";
  $(".progress i").style.width=(d.n*20)+"%";
  setTeachingState(d.state);
  $("#takedownSteps").hidden=btn.dataset.lesson!=="takedown";
  feedback("Watch the position",btn.dataset.lesson==="takedown"?"Use the four steps below. The score appears only after established control.":"Tap the position choices under the mat to see what changes.");
}));

$$("[data-step]").forEach(btn=>btn.addEventListener("click",()=>{
  $$("[data-step]").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
  const step=Number(btn.dataset.step);
  if(step===0){setTeachingState("neutral");feedback("Step 1 — Neutral","Neither wrestler has control. No takedown points yet.");}
  if(step===1){setTeachingState("neutral");feedback("Step 2 — Attack","Red attacks, but an attack by itself does not score a takedown.");}
  if(step===2){setTeachingState("red-control");feedback("Step 3 — Finish","The finish is creating control. The scoring moment depends on established control.");}
  if(step===3){setTeachingState("red-control");feedback("Step 4 — Established control","Takedown: 3 points.","score");}
}));

$("#parentMode").addEventListener("click",()=>{$("#parentNote").hidden=!$("#parentNote").hidden});
$("#reset").addEventListener("click",()=>{match=resetMatch();renderScore();setScene("neutral");feedback("Match reset","Score and match state returned to neutral.")});
setScene("neutral");renderScore();
