import {createMatch,applyTransition,applyNearFall,applyFall,resetMatch,RULESET} from "./match-state.js";
import {transitionScore} from "./rules/nfhs-2026-27.js";
import {renderStage} from "./ui/scene.js";
import {GROUPS,LESSONS,MAKE_THE_CALL,CALL_OPTIONS} from "./ui/lessons.js";
import {ART} from "./ui/art.js";

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const S=RULESET.scoring;
const STATE_META={
  neutral:{cls:"neutral",label:"NEUTRAL",hint:"Nobody has control",pose:"NEUTRAL",controller:null},
  "red-control":{cls:"red",label:"RED CONTROL",hint:"Red is on top",pose:"CONTROL_RED",controller:"red"},
  "green-control":{cls:"green",label:"GREEN CONTROL",hint:"Green is on top",pose:"CONTROL_GREEN",controller:"green"}
};
const CALL_LABEL={takedown:"Takedown",escape:"Escape",reversal:"Reversal","near fall":"Near fall",fall:"Fall"};
function pointsFor(call){return call==="takedown"?S.takedown:call==="escape"?S.escape:call==="reversal"?S.reversal:0;}

// ---------- local progress (no personal data) ----------
const KEY="sports-simulators.wrestling.progress.v1";
function loadProgress(){try{return JSON.parse(localStorage.getItem(KEY))||{lessons:{},calls:{correct:0,total:0}};}catch{return {lessons:{},calls:{correct:0,total:0}};}}
function saveProgress(){try{localStorage.setItem(KEY,JSON.stringify(progress));}catch{}}
let progress=loadProgress();

// ---------- app state ----------
let mode="learn";
let lessonId=LESSONS[0].id;
let frameIndex=0;
let match=createMatch();      // Learn demo / Practice / Match scorer
let quiz={index:0,answered:false,revealed:false,correct:0,total:0};
let practice={target:null};

const lesson=()=>LESSONS.find(l=>l.id===lessonId);

// ---------- rendering helpers ----------
function thumbFor(frame,cls){
  const art=ART[frame.pose];
  if(art){const img=document.createElement("img");img.className=cls||"thumb";img.src=art.src;img.alt="";img.loading="lazy";return img;}
  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("viewBox","0 0 900 500");svg.setAttribute("class",cls||"thumb");svg.setAttribute("aria-hidden","true");
  renderStage(svg,{pose:frame.pose,controller:frame.controller});
  return svg;
}
function renderHappening(frame,textHtml){
  const box=$("#happening");box.innerHTML="";
  box.appendChild(thumbFor(frame));
  const p=document.createElement("p");p.innerHTML=textHtml;box.appendChild(p);
}
const STATE_KID={neutral:"<b>Neutral.</b> Both kids are up. Nobody is winning yet.","red-control":"<b>Red is in control.</b> Red is on top and Green is down.","green-control":"<b>Green is in control.</b> Green is on top and Red is down."};
function setStateChip(state){
  const m=STATE_META[state];
  const chip=$("#stateChip");
  chip.className="state-chip "+m.cls;
  chip.querySelector("b").textContent=m.label;
  chip.querySelector("small").textContent=m.hint;
}
function setSignal(text){$("#signalText").textContent=text;$("#signalChip").hidden=!text;}
function stage(frame,aria){
  renderStage($("#stage"),frame);
  if(aria)$("#stage").setAttribute("aria-label",aria);
}
function feedback(title,text,tone){
  const box=$("#feedback");
  if(!title){box.hidden=true;return;}
  box.hidden=false;
  box.className="feedback"+(tone==="score"?" fb-score":tone?" "+tone:"");
  box.innerHTML='<span class="fb-ico" aria-hidden="true">'+(tone==="score"?"+":tone==="warn"?"!":"i")+'</span><div><b></b><p></p></div>';
  box.querySelector("b").textContent=title;
  box.querySelector("p").textContent=text;
}
function renderScore(){
  $("#redScore").textContent=match.red;
  $("#greenScore").textContent=match.green;
  const last=match.history.at(-1);
  $("#lastCall").textContent=match.ended?(match.ended.reason==="fall"?"FALL · "+match.ended.winner.toUpperCase()+" WINS":"TECHNICAL FALL · "+match.ended.winner.toUpperCase()+" WINS")
    :last?(last.scoringWrestler.toUpperCase()+" · "+(CALL_LABEL[last.call]||last.call)+(last.points?" +"+last.points:"")):"Ready to wrestle";
  const h=$("#history");h.innerHTML="";
  match.history.slice().reverse().forEach(e=>{
    const li=document.createElement("li");li.className=e.scoringWrestler;
    li.innerHTML="<span></span><b></b>";
    li.querySelector("span").textContent=e.scoringWrestler.toUpperCase()+" "+(CALL_LABEL[e.call]||e.call)+(e.seconds?" ("+e.seconds+"s)":"");
    li.querySelector("b").textContent=e.points?"+"+e.points:"";
    h.appendChild(li);
  });
}
function renderGuide(l){
  $("#ruleText").textContent=l.rule;
  const st=$("#ruleStatus");st.className="pill "+l.status;st.textContent=l.status.replace("-"," ");
  $("#ruleSource").textContent="Source: "+l.source+" (docs/rules-sources.md)";
}
function renderGlance(){
  const items=[["Takedown",S.takedown],["Escape",S.escape],["Reversal",S.reversal],["Near fall 2s / 3s / 4s",S.nearFall[2]+" / "+S.nearFall[3]+" / "+S.nearFall[4]],["Technical fall margin",S.technicalFallMargin],["Fall","Match over"]];
  $("#glance").innerHTML=items.map(([k,v])=>"<li><span>"+k+"</span><b>"+v+"</b></li>").join("");
}
function renderRail(){
  const list=$("#lessonList");list.innerHTML="";
  GROUPS.forEach(g=>{
    const ls=LESSONS.filter(l=>l.group===g.id);if(!ls.length)return;
    const h=document.createElement("div");h.className="lesson-group";h.textContent=g.title;list.appendChild(h);
    ls.forEach(l=>{
      const b=document.createElement("button");
      b.className="lesson"+(l.id===lessonId?" active":"")+(progress.lessons[l.id]?" is-done":"");
      b.dataset.lesson=l.id;b.setAttribute("aria-current",l.id===lessonId?"true":"false");
      b.innerHTML='<span class="ico-wrap"></span><div><b></b><small></small></div><span class="done" aria-label="done">✓</span>';
      b.querySelector(".ico-wrap").replaceWith(thumbFor(l.frames.at(-1),"thumb-ico"));
      b.querySelector("b").textContent=l.n+". "+l.title;b.querySelector("small").textContent=l.kid;
      b.addEventListener("click",()=>{lessonId=l.id;frameIndex=0;match=createMatch();render();});
      list.appendChild(b);
    });
  });
  const done=LESSONS.filter(l=>progress.lessons[l.id]).length;
  $("#progressText").textContent=done+" of "+LESSONS.length+" done";
  $("#progressBar").style.width=Math.round(done/LESSONS.length*100)+"%";
}
function head(eyebrow,title,kid){$("#stageEyebrow").textContent=eyebrow;$("#stageTitle").textContent=title;$("#stageKid").textContent=kid;}

// ---------- Learn ----------
function renderLearn(){
  const l=lesson();
  const f=l.frames[frameIndex];
  head("Lesson "+l.n+" · "+GROUPS.find(g=>g.id===l.group).title,l.title,l.kid);
  // replay the sequence through the engine so the scoreboard is rule-driven
  match=createMatch();
  if(l.preset){match.red=l.preset.red;match.green=l.preset.green;}
  for(let i=0;i<=frameIndex;i++){
    const fr=l.frames[i];
    if(fr.score)match=applyTransition(match,fr.state);else match={...match,state:fr.state};
    if(fr.nearFall)match=applyNearFall(match,{seconds:fr.nearFall.seconds});
    if(fr.ends)match=applyFall(match);
  }
  const scored=f.score?pointsFor(f.score.call):f.nearFall?S.nearFall[f.nearFall.seconds]:0;
  stage({pose:f.pose,controller:f.controller,badge:f.badge||(scored?(f.score?CALL_LABEL[f.score.call].toUpperCase():"NEAR FALL")+" +"+scored:undefined),badgeTone:f.badgeTone||(scored?"score":undefined)},"Red and green youth wrestlers: "+f.caption);
  setStateChip(f.state);setSignal(f.signal);
  $("#caption").textContent=f.caption;
  const frames=$("#frames");frames.innerHTML="";
  const strip=document.createElement("div");strip.className="filmstrip";
  l.frames.forEach((fr,i)=>{
    const pts=fr.score?pointsFor(fr.score.call):fr.nearFall?S.nearFall[fr.nearFall.seconds]:0;
    const b=document.createElement("button");
    b.className="film"+(i===frameIndex?" active":"")+(pts||fr.ends?" scored":"");
    b.setAttribute("aria-pressed",i===frameIndex?"true":"false");
    b.appendChild(thumbFor(fr));
    const lab=document.createElement("div");lab.className="film-label";lab.innerHTML="<span></span><em></em>";
    lab.querySelector("span").textContent=i+1;lab.querySelector("em").textContent=fr.thumb||"";lab.querySelector("em").style.fontStyle="normal";
    b.appendChild(lab);
    if(pts){const pill=document.createElement("span");pill.className="pts";pill.textContent="+"+pts;b.appendChild(pill);}
    if(fr.ends){const pill=document.createElement("span");pill.className="pts";pill.textContent="WIN";b.appendChild(pill);}
    b.addEventListener("click",()=>{frameIndex=i;render();});
    strip.appendChild(b);
    if(i<l.frames.length-1){const ar=document.createElement("span");ar.className="film-arrow";ar.setAttribute("aria-hidden","true");ar.textContent="→";strip.appendChild(ar);}
  });
  frames.appendChild(strip);
  const nav=document.createElement("div");nav.className="film-nav";
  const prev=document.createElement("button");prev.className="nav-btn secondary";prev.textContent="Back";prev.disabled=frameIndex===0;prev.addEventListener("click",()=>{frameIndex--;render();});
  const next=document.createElement("button");next.className="nav-btn";
  const lastFrame=frameIndex===l.frames.length-1;
  next.textContent=lastFrame?"Next lesson":"Next step";
  next.addEventListener("click",()=>{
    if(lastFrame){progress.lessons[l.id]=true;saveProgress();const i=LESSONS.indexOf(l);lessonId=LESSONS[(i+1)%LESSONS.length].id;frameIndex=0;}
    else frameIndex++;
    render();
  });
  nav.appendChild(prev);nav.appendChild(next);frames.appendChild(nav);
  renderHappening(f,(f.controller?STATE_KID[f.state]:STATE_KID.neutral)+(scored?" <b>+"+scored+" for "+(f.score?f.score.wrestler:f.nearFall.wrestler).toUpperCase()+"!</b>":f.ends?" <b>Match over!</b>":""));
  $("#actions").innerHTML="";
  if(lastFrame){progress.lessons[l.id]=true;saveProgress();}
  if(scored)feedback((f.score?f.score.wrestler:f.nearFall.wrestler).toUpperCase()+" scores "+scored,f.coach,"score");
  else if(f.ends)feedback("Match over",f.coach,"score");
  else feedback(f.controller?STATE_META[f.state].label.split(" ")[0]+" has control, no points":"No points here",f.coach);
  $("#coachText").textContent=f.coach;
  renderGuide(l);renderScore();
}

// ---------- Practice ----------
const PRACTICE_TASKS=[
  {id:"td",start:"neutral",ask:"Make RED score a takedown. Pick the position that comes next.",want:"red-control",lesson:"takedown"},
  {id:"esc",start:"red-control",ask:"GREEN is on bottom. Make Green score an escape.",want:"neutral",lesson:"escape"},
  {id:"rev",start:"red-control",ask:"GREEN is on bottom. Make Green score a reversal.",want:"green-control",lesson:"reversal"},
  {id:"none",start:"neutral",ask:"Red shoots but Green stays on their feet. What position are they in?",want:"neutral",lesson:"control"},
  {id:"td-g",start:"neutral",ask:"Make GREEN score a takedown.",want:"green-control",lesson:"takedown"}
];
let practiceIndex=0;
function renderPractice(){
  const t=PRACTICE_TASKS[practiceIndex];
  const l=LESSONS.find(x=>x.id===t.lesson);
  head("Practice "+(practiceIndex+1)+" of "+PRACTICE_TASKS.length,"What comes next?","You choose the position. The rules decide the points.");
  if(!practice.target){match={...createMatch(),state:t.start};}
  const m=STATE_META[match.state];
  stage({pose:m.pose,controller:m.controller},"Youth wrestlers in "+m.label.toLowerCase());
  setStateChip(match.state);setSignal(m.controller?"Wrestler in control (signal 11)":"Neutral position (signal 8)");
  $("#caption").textContent=t.ask;
  $("#frames").innerHTML="";
  const a=$("#actions");a.innerHTML='<div class="big-grid"></div>';
  const grid=a.querySelector(".big-grid");
  renderHappening({pose:m.pose,controller:m.controller},STATE_KID[match.state]);
  Object.entries(STATE_META).forEach(([state,meta])=>{
    const b=document.createElement("button");b.className="big "+(meta.cls==="neutral"?"gray":meta.cls);
    b.innerHTML='<span class="ico" aria-hidden="true"></span><div><b></b><small></small></div>';
    b.querySelector(".ico").textContent=meta.cls==="neutral"?"N":meta.cls==="red"?"R":"G";
    b.querySelector("b").textContent=meta.cls==="neutral"?"Both up":meta.cls==="red"?"Red on top":"Green on top";
    b.querySelector("small").textContent=meta.hint;
    b.disabled=!!practice.target;
    if(practice.target){if(state===t.want)b.classList.add("correct");else if(state===practice.target)b.classList.add("wrong");}
    b.addEventListener("click",()=>{
      const before=match;practice.target=state;
      match=applyTransition(match,state);
      const e=match.history.length>before.history.length?match.history.at(-1):null;
      const right=state===t.want;
      if(e)feedback((right?"Yes! ":"Not what we asked, but ")+e.scoringWrestler.toUpperCase()+" scores "+e.points,CALL_LABEL[e.call]+": "+before.state.replace("-"," ")+" to "+state.replace("-"," ")+". "+l.rule,right?"score":"warn");
      else feedback(right?"Right: no points":"No points on that change","Position did not change hands, so the rules award nothing. "+l.rule,right?"score":"warn");
      if(right){progress.lessons[l.id]=true;saveProgress();}
      render();
    });
    grid.appendChild(b);
  });
  if(practice.target){
    const n=document.createElement("button");n.className="nav-btn";n.textContent="Next task";
    n.addEventListener("click",()=>{practiceIndex=(practiceIndex+1)%PRACTICE_TASKS.length;practice.target=null;feedback();render();});
    a.appendChild(n);
  } else feedback();
  $("#coachText").textContent=l.frames.at(-1).coach;
  renderGuide(l);renderScore();
}

// ---------- Make the Call ----------
function renderCall(){
  const q=MAKE_THE_CALL[quiz.index];
  head("Make the Call · "+(quiz.index+1)+" of "+MAKE_THE_CALL.length,"You are the referee","Watch, then make the call.");
  const showTo=quiz.revealed;
  const state=showTo?q.toState:q.fromState;
  const ctrl=STATE_META[state].controller;
  stage({pose:showTo?q.to:q.from,controller:ctrl,badge:showTo?"WHAT IS THE CALL?":"BEFORE",badgeTone:showTo?"warn":undefined},"Wrestlers "+(showTo?"after":"before")+" the action: "+q.prompt);
  setStateChip(state);setSignal(quiz.answered?(q.answer==="none"?"Indicates no control (signal 9)":q.answer==="fall"?"Stopping the match (signal 2)":q.answer==="nearfall-wait"?"Near fall (signal 21)":"Awarding points (signal 22)"):"Referee is watching");
  $("#caption").textContent=showTo?q.prompt:"Here is the start. Press Play to see what happens!";
  renderHappening({pose:showTo?q.to:q.from,controller:ctrl},STATE_KID[state]);
  const fr=$("#frames");fr.innerHTML="";
  if(!showTo){const p=document.createElement("button");p.className="nav-btn";p.textContent="Play the action";p.addEventListener("click",()=>{quiz.revealed=true;render();});fr.appendChild(p);}
  else{const r=document.createElement("button");r.className="nav-btn secondary";r.textContent="Show start";r.addEventListener("click",()=>{quiz.revealed=false;render();});fr.appendChild(r);
    if(!quiz.answered){const p=document.createElement("button");p.className="nav-btn secondary";p.textContent="Show finish";p.disabled=true;fr.appendChild(p);}}
  const a=$("#actions");a.innerHTML="";
  if(showTo){
    a.innerHTML='<div class="big-grid"></div>';
    const grid=a.querySelector(".big-grid");
    CALL_OPTIONS.forEach(o=>{
      const b=document.createElement("button");b.className="big "+o.tone;
      const pts=pointsFor(o.id);
      b.innerHTML='<span class="ico" aria-hidden="true"></span><div><b></b><small></small></div>';
      b.querySelector(".ico").textContent=o.icon;b.querySelector("b").textContent=o.label;
      b.querySelector("small").textContent=pts?"+"+pts+" points":o.sub;
      b.disabled=quiz.answered;
      if(quiz.answered){if(o.id===q.answer)b.classList.add("correct");else if(o.id===quiz.picked)b.classList.add("wrong");}
      b.addEventListener("click",()=>{
        quiz.answered=true;quiz.picked=o.id;quiz.total++;progress.calls.total++;
        const right=o.id===q.answer;
        if(right){quiz.correct++;progress.calls.correct++;}
        saveProgress();
        // the engine confirms transition calls so the answer key cannot drift from the rules
        const engine=transitionScore(q.fromState,q.toState);
        const engineNote=engine.points?" The rules engine awards "+engine.points+" for "+engine.call+".":"";
        feedback(right?"Correct call!":"Not this time. The call is "+CALL_OPTIONS.find(x=>x.id===q.answer).label+".",q.why+engineNote,right?"score":"warn");
        render();
      });
      grid.appendChild(b);
    });
    if(quiz.answered){const n=document.createElement("button");n.className="nav-btn";n.textContent=quiz.index===MAKE_THE_CALL.length-1?"Start over":"Next call";
      n.addEventListener("click",()=>{quiz.index=(quiz.index+1)%MAKE_THE_CALL.length;quiz.answered=false;quiz.revealed=false;quiz.picked=null;feedback();render();});a.appendChild(n);}
  }
  if(!quiz.answered)feedback("Referee tip","Look for control first. Then ask: did the position change hands?");
  const l=LESSONS.find(x=>x.id==="control");
  $("#ruleText").textContent="Session: "+quiz.correct+" of "+quiz.total+" calls right. All time: "+progress.calls.correct+" of "+progress.calls.total+".";
  $("#ruleStatus").className="pill verified";$("#ruleStatus").textContent="rules engine";$("#ruleSource").textContent="Answers are checked against wrestling/rules/nfhs-2026-27.js";
  $("#coachText").textContent=l.frames.at(-1).coach;
  // quiz scoreboard: show the engine result of the revealed action on a fresh match
  const demo=showTo?applyTransition({...createMatch(),state:q.fromState},q.toState):{...createMatch(),state:q.fromState};
  const saved=match;match=demo;renderScore();match=saved;
}

// ---------- Score a Match ----------
let nfPending=false;
function renderMatch(){
  head("Score a Match","Rule-driven scorer","Every point comes from the rules engine. No free buttons.");
  const m=STATE_META[match.state];
  const poseName=nfPending&&m.controller==="red"?"REF_POSITION_RED_TOP":m.pose;
  const mirrored=false;
  stage({pose:poseName,controller:m.controller,badge:match.ended?(match.ended.reason==="fall"?"FALL":"TECHNICAL FALL"):nfPending?"NEAR FALL COUNT":undefined,badgeTone:match.ended?"score":nfPending?"warn":undefined},"Match position: "+m.label.toLowerCase());
  setStateChip(match.state);setSignal(match.ended?"Stopping the match (signal 2)":nfPending?"Near fall (signal 21)":m.controller?"Wrestler in control (signal 11)":"Neutral position (signal 8)");
  renderHappening({pose:poseName,controller:m.controller},match.ended?"<b>Match over!</b> "+match.ended.winner.toUpperCase()+" wins.":STATE_KID[match.state]);
  $("#caption").textContent=match.ended?(match.ended.winner.toUpperCase()+" wins by "+(match.ended.reason==="fall"?"pin!":"technical fall! "+match.ended.margin+" points ahead.")):nfPending?"The ref is counting! How long was "+(m.controller==="red"?"Green":"Red")+"'s back near the mat?":"What happened on the mat? Tap where they are now.";
  $("#frames").innerHTML="";
  const a=$("#actions");a.innerHTML="";
  if(match.ended){const e=document.createElement("div");e.className="ended";e.textContent="Match over · "+match.ended.winner.toUpperCase()+" wins";a.appendChild(e);
    const r=document.createElement("button");r.className="nav-btn";r.textContent="New match";r.addEventListener("click",()=>{match=resetMatch();nfPending=false;feedback();render();});a.appendChild(r);renderMatchGuide();renderScore();return;}
  const wrap=document.createElement("div");wrap.className="match-controls";
  if(nfPending){
    const g=document.createElement("div");g.className="group";g.innerHTML='<span class="group-title">How long did the ref count?</span><div class="big-grid"></div>';
    const grid=g.querySelector(".big-grid");
    [["Under 2 seconds",1,"No points","gray"],["2 seconds",2,"+"+S.nearFall[2],"blue"],["3 seconds",3,"+"+S.nearFall[3],"purple"],["4 or more",4,"+"+S.nearFall[4],"green"]].forEach(([lab,sec,sub,tone])=>{
      const b=document.createElement("button");b.className="big "+tone;b.innerHTML='<span class="ico" aria-hidden="true"></span><div><b></b><small></small></div>';
      b.querySelector(".ico").textContent=sec>=4?"4+":String(sec);b.querySelector("b").textContent=lab;b.querySelector("small").textContent=sub;
      b.addEventListener("click",()=>{const before=match;match=applyNearFall(match,{seconds:sec});nfPending=false;
        const e=match.history.length>before.history.length?match.history.at(-1):null;
        feedback(e?e.scoringWrestler.toUpperCase()+" scores "+e.points:"No near-fall points",e?"Near fall held for "+sec+" seconds. Awarded once, when the situation ended.":"Criteria were held for less than 2 seconds, so nothing is awarded.",e?"score":"warn");render();});
      grid.appendChild(b);
    });
    const c=document.createElement("button");c.className="nav-btn secondary";c.textContent="Cancel";c.addEventListener("click",()=>{nfPending=false;render();});
    wrap.appendChild(g);wrap.appendChild(c);
  } else {
    const g=document.createElement("div");g.className="group";g.innerHTML='<span class="group-title">Where are they now?</span><div class="big-grid"></div>';
    const grid=g.querySelector(".big-grid");
    Object.entries(STATE_META).forEach(([state,meta])=>{
      const b=document.createElement("button");b.className="big "+(meta.cls==="neutral"?"gray":meta.cls);
      const res=transitionScore(match.state,state);
      b.innerHTML='<span class="ico" aria-hidden="true"></span><div><b></b><small></small></div>';
      b.querySelector(".ico").textContent=meta.cls==="neutral"?"N":meta.cls==="red"?"R":"G";
      b.querySelector("b").textContent=meta.cls==="neutral"?"Both up":meta.cls==="red"?"Red on top":"Green on top";
      b.querySelector("small").textContent=state===match.state?"Current position":res.points?CALL_LABEL[res.call]+" +"+res.points:"No points";
      b.disabled=state===match.state;b.setAttribute("aria-pressed",state===match.state?"true":"false");
      b.addEventListener("click",()=>{const before=match;match=applyTransition(match,state);
        const e=match.history.length>before.history.length?match.history.at(-1):null;
        feedback(e?e.scoringWrestler.toUpperCase()+" scores "+e.points:"Position changed, no points",e?CALL_LABEL[e.call]+": "+before.state.replace("-"," ")+" to "+state.replace("-"," ")+".":"The rules award points only for takedown, escape and reversal transitions.",e?"score":undefined);render();});
      grid.appendChild(b);
    });
    wrap.appendChild(g);
    if(m.controller){
      const g2=document.createElement("div");g2.className="group";g2.innerHTML='<span class="group-title">'+m.controller.toUpperCase()+' is on top. Did this happen?</span><div class="big-grid"></div>';
      const grid2=g2.querySelector(".big-grid");
      const nf=document.createElement("button");nf.className="big purple";nf.innerHTML='<span class="ico" aria-hidden="true">1..2</span><div><b>Near fall</b><small>Back near the mat, ref counts</small></div>';
      nf.addEventListener("click",()=>{nfPending=true;feedback();render();});
      const pin=document.createElement("button");pin.className="big red";pin.innerHTML='<span class="ico" aria-hidden="true">PIN</span><div><b>Pin!</b><small>Both shoulders down</small></div>';
      pin.addEventListener("click",()=>{match=applyFall(match);feedback("FALL",match.ended.winner.toUpperCase()+" wins the match by fall.","score");render();});
      grid2.appendChild(nf);grid2.appendChild(pin);wrap.appendChild(g2);
    }
    const r=document.createElement("button");r.className="nav-btn secondary";r.textContent="Reset match";r.addEventListener("click",()=>{match=resetMatch();feedback();render();});
    wrap.appendChild(r);
  }
  a.appendChild(wrap);
  renderMatchGuide();renderScore();
}
function renderMatchGuide(){
  $("#ruleText").textContent="Points: takedown "+S.takedown+", escape "+S.escape+", reversal "+S.reversal+", near fall "+S.nearFall[2]+"/"+S.nearFall[3]+"/"+S.nearFall[4]+". Technical fall at a "+S.technicalFallMargin+"-point margin. Fall ends the match.";
  $("#ruleStatus").className="pill partly-verified";$("#ruleStatus").textContent="clock pending";
  $("#ruleSource").textContent="ICWL period lengths and overtime are unresolved, so this scorer has no clock.";
  $("#coachText").textContent="Use this to score along with a real match on TV or at practice. Ask your wrestler to say the call before you press it.";
}

// ---------- shell ----------
function render(){
  $$(".mode").forEach(b=>{const on=b.dataset.mode===mode;b.classList.toggle("active",on);b.setAttribute("aria-selected",on?"true":"false");});
  renderRail();
  $(".rail").hidden=mode!=="learn";
  $(".workspace").classList.toggle("no-rail",mode!=="learn");
  if(mode==="learn")renderLearn();else if(mode==="practice")renderPractice();else if(mode==="call")renderCall();else renderMatch();
  writeHash();
}
$$(".mode").forEach(b=>b.addEventListener("click",()=>{mode=b.dataset.mode;feedback();if(mode==="match"||mode==="practice"){match=createMatch();practice.target=null;}render();}));
$("#coachToggle").addEventListener("click",e=>{const on=e.currentTarget.getAttribute("aria-pressed")!=="true";e.currentTarget.setAttribute("aria-pressed",on);$("#coachNote").hidden=!on;});
$("#resetAll").addEventListener("click",()=>{match=resetMatch();frameIndex=0;nfPending=false;practice.target=null;quiz={index:0,answered:false,revealed:false,correct:0,total:0};feedback();render();});
function readHash(){
  const [m,l,st]=location.hash.replace("#","").split("/");
  if(["learn","practice","call","match"].includes(m))mode=m;
  if(l&&LESSONS.some(x=>x.id===l)){lessonId=l;frameIndex=0;}
  const step=parseInt(st,10);
  if(step>0&&step<=lesson().frames.length)frameIndex=step-1;
}
function writeHash(){const h="#"+mode+(mode==="learn"?"/"+lessonId+"/"+(frameIndex+1):"");if(location.hash!==h)history.replaceState(null,"",h);}
readHash();
window.addEventListener("hashchange",()=>{readHash();render();});
renderGlance();
render();
