import {transitionScore} from "./rules/nfhs-2026-27.js";
export function createMatch(){return {red:0,green:0,state:"neutral",history:[]};}
export function applyTransition(match,nextState){const result=transitionScore(match.state,nextState);const next={...match,history:[...match.history]};if(result.points>0){const scoringWrestler=nextState==="red-control"?"red":nextState==="green-control"?"green":match.state==="red-control"?"green":match.state==="green-control"?"red":null;if(scoringWrestler)next[scoringWrestler]+=result.points;next.history.push({from:match.state,to:nextState,call:result.call,points:result.points,scoringWrestler});}next.state=nextState;return next;}
export function resetMatch(){return createMatch();}
