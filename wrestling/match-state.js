import {RULESET,transitionScore,nearFall as nearFallRule,technicalFall} from "./rules/nfhs-2026-27.js";

export function createMatch(){return {red:0,green:0,state:"neutral",history:[],ended:null};}

function controller(state){return state==="red-control"?"red":state==="green-control"?"green":null;}
function other(w){return w==="red"?"green":"red";}

function finish(next){
  if(next.ended)return next;
  const tf=technicalFall({red:next.red,green:next.green});
  if(tf.stopNow)next.ended={reason:"technical-fall",winner:next.red>next.green?"red":"green",margin:tf.margin};
  return next;
}

/** Position change (neutral / red-control / green-control). Points come only from the rules engine. */
export function applyTransition(match,nextState){
  if(match.ended)return match;
  const result=transitionScore(match.state,nextState);
  const next={...match,history:[...match.history]};
  if(result.points>0){
    const scoringWrestler=controller(nextState)||other(controller(match.state));
    next[scoringWrestler]+=result.points;
    next.history.push({type:"position",from:match.state,to:nextState,call:result.call,points:result.points,scoringWrestler});
  }
  next.state=nextState;
  return finish(next);
}

/**
 * Near fall awarded when the pinning situation ends. Requires the current
 * controller; criteria and seconds come from the caller (referee's count).
 */
export function applyNearFall(match,{seconds,criteriaMet=true}){
  if(match.ended)return match;
  const w=controller(match.state);
  const result=nearFallRule({offensiveControl:!!w,pinningSituation:!!w,criteriaMet,seconds});
  if(result.points===0)return match;
  const next={...match,history:[...match.history]};
  next[w]+=result.points;
  next.history.push({type:"near-fall",seconds,call:"near fall",points:result.points,scoringWrestler:w});
  return finish(next);
}

/** Fall ends the match immediately for the controlling wrestler. */
export function applyFall(match){
  if(match.ended)return match;
  const w=controller(match.state);
  if(!w)return match;
  const next={...match,history:[...match.history]};
  next.history.push({type:"fall",call:"fall",points:0,scoringWrestler:w});
  next.ended={reason:"fall",winner:w};
  return next;
}

export function resetMatch(){return createMatch();}
export {RULESET};
