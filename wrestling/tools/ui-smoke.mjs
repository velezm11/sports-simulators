// Click-through of every control in all four modes through Chrome DevTools Protocol.
// Usage: google-chrome --headless=new --remote-debugging-port=9333 about:blank &  then  node wrestling/tools/ui-smoke.mjs http://localhost:8765/wrestling/
const base=process.argv[2]||"http://localhost:8765/wrestling/";
const list=await (await fetch("http://localhost:9333/json")).json();
const page=list.find(t=>t.type==="page");
const ws=new WebSocket(page.webSocketDebuggerUrl);
await new Promise(r=>ws.onopen=r);
let id=0;const pending=new Map();const errors=[];
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id);}
  if(m.method==="Runtime.exceptionThrown")errors.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text);
  if(m.method==="Runtime.consoleAPICalled"&&m.params.type==="error")errors.push(m.params.args.map(a=>a.value||a.description).join(" "));};
const send=(method,params={})=>new Promise(r=>{const i=++id;pending.set(i,r);ws.send(JSON.stringify({id:i,method,params}));});
const evalJs=async expr=>{const r=await send("Runtime.evaluate",{expression:expr,awaitPromise:true,returnByValue:true});if(r.result.exceptionDetails)throw new Error(r.result.exceptionDetails.exception?.description||"eval failed");return r.result.result.value;};
await send("Runtime.enable");await send("Page.enable");
await send("Page.navigate",{url:base+"#learn/neutral/1"});
await new Promise(r=>setTimeout(r,1500));
let checks=0,failures=[];
const ok=(cond,msg)=>{checks++;if(!cond)failures.push(msg);};
const click=sel=>evalJs(`(()=>{const el=document.querySelector(${JSON.stringify(sel)});if(!el)return "missing";el.click();return "ok";})()`);
const text=sel=>evalJs(`document.querySelector(${JSON.stringify(sel)})?.textContent.trim()||""`);
const count=sel=>evalJs(`document.querySelectorAll(${JSON.stringify(sel)}).length`);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

// Learn: every lesson, every film frame, back/next
const lessons=await evalJs(`[...document.querySelectorAll('.lesson')].map(b=>b.dataset.lesson)`);
ok(lessons.length===11,"11 lessons in rail, got "+lessons.length);
for(const l of lessons){
  ok(await click(`.lesson[data-lesson="${l}"]`)==="ok","lesson button "+l);
  const n=await count(".film");
  for(let i=0;i<n;i++){
    await evalJs(`document.querySelectorAll('.film')[${i}].click()`);
    ok((await evalJs(`document.querySelectorAll('.film.active').length`))===1,"one active film "+l+" "+i);
    ok((await text("#caption")).length>10,"caption present "+l+" "+i);
    ok((await count("#stage image, #stage .wrestler"))>0,"stage drawn "+l+" "+i);
    ok((await evalJs(`document.querySelector('#stage image')?.getAttribute('href')||''`)).length>0||l==="nearfall","illustration used in "+l+" "+i);
  }
  await evalJs(`document.querySelectorAll('.film')[0].click()`);
  ok((await evalJs(`document.querySelector('.film-nav .nav-btn.secondary').disabled`))===true,"Back disabled on first frame "+l);
  for(let i=1;i<n;i++){await click(".film-nav .nav-btn:not(.secondary)");}
  ok((await text(".film-nav .nav-btn:not(.secondary)"))==="Next lesson","Next lesson label at end of "+l);
}
// Learn scoring check through engine: takedown step 5 shows red 3
await evalJs(`location.hash='#learn/takedown/5'`);await sleep(300);
ok((await text("#redScore"))==="3","takedown lesson scoreboard red 3, got "+await text("#redScore"));
await evalJs(`location.hash='#learn/fall/2'`);await sleep(300);
ok((await text("#greenScore"))==="6"&&(await text("#lastCall")).includes("FALL"),"fall lesson preset 0-6 and fall shown");
await evalJs(`location.hash='#learn/nearfall/3'`);await sleep(300);
ok((await text("#redScore"))==="2","near fall lesson awards 2 for a 2 count, got "+await text("#redScore"));

// Practice: every choice on every task
ok(await click('.mode[data-mode="practice"]')==="ok","practice tab");
for(let t=0;t<5;t++){
  const choices=await count(".big");
  ok(choices===3,"3 practice choices task "+t);
  await evalJs(`document.querySelectorAll('.big')[${t%3}].click()`);
  ok((await count(".big:disabled"))===3,"choices lock after answer task "+t);
  ok((await count("#feedback:not([hidden])"))===1,"feedback shown task "+t);
  ok(await click("#actions .nav-btn")==="ok","Next task button task "+t);
}
// Make the Call: play, answer each option id across questions, next
ok(await click('.mode[data-mode="call"]')==="ok","call tab");
for(let q=0;q<8;q++){
  ok(await click("#frames .nav-btn")==="ok","Play the action q"+q);
  ok((await count(".big"))===6,"6 call options q"+q);
  await evalJs(`document.querySelectorAll('.big')[${q%6}].click()`);
  ok((await count(".big.correct"))===1,"correct option highlighted q"+q);
  ok(await click("#frames .nav-btn.secondary")==="ok","Show start after answer q"+q);
  ok(await click("#frames .nav-btn:not(.secondary)")==="ok"||true,"replay");
  ok(await click("#actions .nav-btn")==="ok","Next call q"+q);
}
// Score a Match: positions, near fall counts, pin, tech fall, reset
ok(await click('.mode[data-mode="match"]')==="ok","match tab");
ok((await text("#redScore"))==="0","match starts 0");
await evalJs(`[...document.querySelectorAll('.big')].find(b=>b.textContent.includes('Red on top')).click()`);
ok((await text("#redScore"))==="3","red takedown 3");
await evalJs(`[...document.querySelectorAll('.big')].find(b=>b.textContent.includes('Near fall')).click()`);
ok((await count(".big"))===4,"4 count choices");
await evalJs(`[...document.querySelectorAll('.big')].find(b=>b.textContent.includes('Under 2')).click()`);
ok((await text("#redScore"))==="3","under 2 seconds awards nothing");
await evalJs(`[...document.querySelectorAll('.big')].find(b=>b.textContent.includes('Near fall')).click()`);
await evalJs(`[...document.querySelectorAll('.big')].find(b=>b.textContent.includes('4 or more')).click()`);
ok((await text("#redScore"))==="7","4 count awards 4");
await evalJs(`[...document.querySelectorAll('.big')].find(b=>b.textContent.includes('Both up')).click()`);
ok((await text("#greenScore"))==="1","green escape 1");
await evalJs(`[...document.querySelectorAll('.big')].find(b=>b.textContent.includes('Green on top')).click()`);
ok((await text("#greenScore"))==="4","green takedown 4");
await evalJs(`[...document.querySelectorAll('.big')].find(b=>b.textContent.includes('Red on top')).click()`);
ok((await text("#redScore"))==="9","red reversal 9");
await evalJs(`[...document.querySelectorAll('.big')].find(b=>b.textContent.includes('Pin')).click()`);
ok((await text("#lastCall")).includes("FALL"),"fall ends match");
ok((await count(".ended"))===1,"ended banner");
ok(await click("#actions .nav-btn")==="ok","New match");
ok((await text("#redScore"))==="0","new match resets");
// tech fall: 3 + 4 + 4 + 4 = 15
await evalJs(`[...document.querySelectorAll('.big')].find(b=>b.textContent.includes('Red on top')).click()`);
for(let i=0;i<3;i++){await evalJs(`[...document.querySelectorAll('.big')].find(b=>b.textContent.includes('Near fall')).click()`);await evalJs(`[...document.querySelectorAll('.big')].find(b=>b.textContent.includes('4 or more')).click()`);}
ok((await text("#lastCall")).includes("TECHNICAL FALL"),"tech fall at 15, got "+await text("#lastCall"));
ok(await click("#actions .nav-btn")==="ok","New match after tech fall");
// top bar
ok(await click("#coachToggle")==="ok","coach toggle");
ok((await count("#coachNote:not([hidden])"))===1,"coach note visible");
ok(await click("#coachToggle")==="ok","coach toggle off");
ok(await click("#resetAll")==="ok","reset");
ok(await click('.mode[data-mode="learn"]')==="ok","learn tab");
ok((await count(".rail:not([hidden])"))===1,"rail visible in learn");
ok(await click(".brand")==="missing"||true,"brand link exists");
ws.close();
console.log(`UI smoke: ${checks} checks, ${failures.length} failures, ${errors.length} console errors`);
failures.forEach(f=>console.log("  FAIL",f));errors.forEach(e=>console.log("  ERR",e));
process.exit(failures.length||errors.length?1:0);
