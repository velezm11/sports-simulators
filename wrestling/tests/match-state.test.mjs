import assert from "node:assert/strict";
import {createMatch,applyTransition,applyNearFall,applyFall,resetMatch} from "../match-state.js";

let m=createMatch();
assert.deepEqual([m.red,m.green,m.state,m.history.length,m.ended],[0,0,"neutral",0,null]);

// takedown: neutral -> control scores for the controller
m=applyTransition(m,"red-control");
assert.equal(m.red,3);assert.equal(m.green,0);assert.equal(m.history.at(-1).call,"takedown");
// same-state change is not a score
const same=applyTransition(m,"red-control");
assert.equal(same.red,3);assert.equal(same.history.length,1);
// escape: control -> neutral scores for the defensive wrestler
m=applyTransition(m,"neutral");
assert.equal(m.green,1);assert.equal(m.history.at(-1).call,"escape");
// reversal: control -> opposite control scores for the new controller
m=applyTransition(applyTransition(m,"green-control"),"red-control");
assert.equal(m.red,5);assert.equal(m.history.at(-1).call,"reversal");
// ownership: green takedown scores green
const g=applyTransition(createMatch(),"green-control");
assert.equal(g.green,3);assert.equal(g.red,0);

// near fall needs control: neutral gives nothing
assert.equal(applyNearFall(createMatch(),{seconds:4}).red,0);
// near fall below the 2-second boundary does not score
let nf=applyTransition(createMatch(),"red-control");
assert.equal(applyNearFall(nf,{seconds:1}).red,3);
// criteria not met does not score even with time
assert.equal(applyNearFall(nf,{seconds:4,criteriaMet:false}).red,3);
// 2 / 3 / 4 second counts
assert.equal(applyNearFall(nf,{seconds:2}).red,5);
assert.equal(applyNearFall(nf,{seconds:3}).red,6);
assert.equal(applyNearFall(nf,{seconds:4}).red,7);
assert.equal(applyNearFall(nf,{seconds:4}).history.at(-1).scoringWrestler,"red");

// fall needs control and ends the match
assert.equal(applyFall(createMatch()).ended,null);
const pinned=applyFall(nf);
assert.deepEqual(pinned.ended,{reason:"fall",winner:"red"});
// nothing scores after the match ends
assert.equal(applyTransition(pinned,"neutral").green,0);
assert.equal(applyNearFall(pinned,{seconds:4}).red,3);

// technical fall at a 15-point margin ends the match
let tf=applyTransition(createMatch(),"red-control"); // 3
tf=applyNearFall(tf,{seconds:4});                     // 7
tf=applyNearFall(tf,{seconds:4});                     // 11
assert.equal(tf.ended,null);
tf=applyNearFall(tf,{seconds:4});                     // 15
assert.deepEqual(tf.ended,{reason:"technical-fall",winner:"red",margin:15});
// margin, not raw score: 14-1 is a 13 margin, no tech fall; 16-1 ends it
let mg=applyTransition(createMatch(),"red-control");   // 3-0
mg=applyTransition(mg,"neutral");                      // 3-1
mg=applyTransition(mg,"red-control");                  // 6-1
mg=applyNearFall(mg,{seconds:4});                      // 10-1
mg=applyNearFall(mg,{seconds:4});                      // 14-1
assert.equal(mg.ended,null);
mg=applyNearFall(mg,{seconds:2});                      // 16-1
assert.deepEqual(mg.ended,{reason:"technical-fall",winner:"red",margin:15});

// reset
assert.deepEqual(resetMatch(),createMatch());
console.log("PASS: wrestling match-state regression");
