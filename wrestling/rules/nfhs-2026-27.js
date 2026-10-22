export const RULESET=Object.freeze({id:"nfhs-wrestling-2026-27",scoring:Object.freeze({takedown:3,escape:1,reversal:2,nearFall:Object.freeze({2:2,3:3,4:4}),technicalFallMargin:15})});
export function scoreEvent(event){
 const {type,established=false,fromNeutral=false,defensiveBecameNeutral=false,defensiveGainedControl=false}=event;
 if(type==="takedown"&&fromNeutral&&established)return{call:"takedown",points:3};
 if(type==="escape"&&defensiveBecameNeutral)return{call:"escape",points:1};
 if(type==="reversal"&&defensiveGainedControl)return{call:"reversal",points:2};
 return{call:"none",points:0};
}
export function transitionScore(from,to){if(from==="neutral"&&(to==="red-control"||to==="green-control"))return scoreEvent({type:"takedown",fromNeutral:true,established:true});if((from==="red-control"||from==="green-control")&&to==="neutral")return scoreEvent({type:"escape",defensiveBecameNeutral:true});if((from==="red-control"&&to==="green-control")||(from==="green-control"&&to==="red-control"))return scoreEvent({type:"reversal",defensiveGainedControl:true});return{call:"none",points:0}}
export function nearFall({offensiveControl,pinningSituation,criteriaMet,seconds,specialFifthPoint=false}){if(!offensiveControl||!pinningSituation||!criteriaMet||seconds<2)return{points:0};const base=seconds>=4?4:seconds>=3?3:2;return{points:base+(base===4&&specialFifthPoint?1:0)}}
export function technicalFall({red,green,nearFallCriteriaStillMet=false}){const margin=Math.abs(red-green);return{margin,earned:margin>=15,stopNow:margin>=15&&!nearFallCriteriaStillMet}}
