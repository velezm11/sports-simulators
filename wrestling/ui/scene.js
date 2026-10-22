// Composes the stage: gym backdrop, mat, wrestlers, and overlays.
import {drawWrestler,WRESTLERS} from "./figures.js";
import * as POSES from "./poses.js";
import {ART} from "./art.js";

const NS="http://www.w3.org/2000/svg";
function el(name,attrs,children){
  const n=document.createElementNS(NS,name);
  for(const k in attrs)if(attrs[k]!==undefined)n.setAttribute(k,attrs[k]);
  (children||[]).forEach(c=>n.appendChild(c));
  return n;
}
function text(x,y,str,attrs){const t=el("text",{x,y,...attrs});t.textContent=str;return t;}

function backdrop(){
  const g=el("g",{class:"gym"});
  g.appendChild(el("rect",{x:0,y:0,width:900,height:500,fill:"url(#wallGrad)"}));
  // bleachers
  for(let i=0;i<5;i++){
    g.appendChild(el("rect",{x:0,y:150+i*26,width:900,height:22,fill:i%2?"#3a4c66":"#44587a"}));
    g.appendChild(el("rect",{x:0,y:150+i*26+18,width:900,height:4,fill:"#2d3c54"}));
  }
  // crowd dots (abstract, not faces)
  const colors=["#ffb4a2","#e5989b","#b5838d","#6d6875","#f6bd60","#84a59d","#f28482","#cdb4db"];
  for(let i=0;i<60;i++){
    const x=20+(i*47)%880+((i*13)%17),row=i%5;
    g.appendChild(el("circle",{cx:x,cy:146+row*26,r:8,fill:colors[i%colors.length],opacity:.9}));
  }
  // banners
  const banner=(x,fill,label)=>{
    g.appendChild(el("path",{d:`M ${x} 40 h 120 v 70 l -60 18 l -60 -18 z`,fill}));
    g.appendChild(text(x+60,84,label,{"text-anchor":"middle","font-size":20,"font-weight":900,fill:"#fff","font-family":"Inter,system-ui,sans-serif","letter-spacing":".08em"}));
  };
  banner(120,"#b91c1c","NYWC");banner(380,"#1d4ed8","ICWL");banner(660,"#15803d","FOLKSTYLE");
  // lights
  [150,450,750].forEach(x=>{
    g.appendChild(el("rect",{x:x-40,y:8,width:80,height:10,rx:5,fill:"#f8fafc",opacity:.85}));
  });
  return g;
}
function mat(){
  const g=el("g",{class:"mat"});
  g.appendChild(el("rect",{x:0,y:290,width:900,height:210,fill:"#c9d3df"}));
  g.appendChild(el("ellipse",{cx:450,cy:410,rx:430,ry:95,fill:"#dc2626",opacity:.92}));
  g.appendChild(el("ellipse",{cx:450,cy:410,rx:400,ry:82,fill:"#f8f3e6"}));
  g.appendChild(el("ellipse",{cx:450,cy:410,rx:46,ry:11,fill:"none",stroke:"#2563eb","stroke-width":5}));
  g.appendChild(el("rect",{x:420,y:398,width:60,height:6,rx:3,fill:"#16a34a"}));
  g.appendChild(el("rect",{x:420,y:416,width:60,height:6,rx:3,fill:"#dc2626"}));
  return g;
}
function defs(){
  const d=el("defs");
  const lg=el("linearGradient",{id:"wallGrad",x1:0,y1:0,x2:0,y2:1});
  lg.appendChild(el("stop",{offset:"0","stop-color":"#1b2a44"}));
  lg.appendChild(el("stop",{offset:"1","stop-color":"#2c3e5e"}));
  d.appendChild(lg);
  return d;
}
function shadow(pose){
  const xs=Object.values(pose).map(p=>p[0]);
  const cx=(Math.min(...xs)+Math.max(...xs))/2,rx=(Math.max(...xs)-Math.min(...xs))/2+18;
  return el("ellipse",{cx,cy:404,rx,ry:9,fill:"#000",opacity:.16});
}

/**
 * Render a frame into the stage svg.
 * @param {SVGElement} svg
 * @param {{pose:string, controller?:"red"|"green"|null, highlight?:string}} frame
 */
export function renderStage(svg,frame){
  while(svg.firstChild)svg.removeChild(svg.firstChild);
  const pose=POSES[frame.pose];
  if(!pose)throw new Error("Unknown pose "+frame.pose);
  svg.appendChild(defs());
  const art=ART[frame.pose];
  if(art){
    svg.appendChild(el("image",{href:art.src,x:0,y:0,width:900,height:500,preserveAspectRatio:"xMidYMid slice"}));
    tag(svg,art.red,WRESTLERS.red);tag(svg,art.green,WRESTLERS.green);
    if(frame.controller)controlMarker(svg,art[frame.controller][0],art[frame.controller][1]-30);
    if(frame.badge)badge(svg,frame.badge,frame.badgeTone);
    return;
  }
  svg.appendChild(backdrop());
  svg.appendChild(mat());
  // wrestlers are authored at a small scale; enlarge the whole layer around the mat centre
  const layer=el("g",{class:"wrestlers",transform:"translate(450 404) scale(1.3) translate(-450 -404)"});
  layer.appendChild(shadow(pose.red));
  layer.appendChild(shadow(pose.green));
  // draw order: the wrestler who is lower / behind first
  const redFirst=frame.drawRedFirst!==undefined?frame.drawRedFirst:(pose.red.hip[1]<pose.green.hip[1]);
  const red=drawWrestler(pose.red,WRESTLERS.red,{facing:frame.redFacing||"right"});
  const green=drawWrestler(pose.green,WRESTLERS.green,{facing:frame.greenFacing||"left"});
  if(redFirst){layer.appendChild(red);layer.appendChild(green);}else{layer.appendChild(green);layer.appendChild(red);}
  svg.appendChild(layer);
  // control marker: a crown-like chevron above the controlling wrestler plus text,
  // so control is never shown by color alone
  if(frame.controller){
    const p=pose[frame.controller];
    const sx=v=>450+(v-450)*1.3,sy=v=>404+(v-404)*1.3;
    controlMarker(svg,sx(p.head[0]),sy(Math.min(p.head[1],p.hip[1]))-62);
  }
  if(frame.badge)badge(svg,frame.badge,frame.badgeTone);
}
function tag(svg,at,c){
  if(!at)return;
  const g=el("g",{class:"tag"});
  g.appendChild(el("rect",{x:at[0]-34,y:at[1]-14,width:68,height:28,rx:14,fill:c.singlet,stroke:"#fff","stroke-width":3}));
  g.appendChild(text(at[0],at[1]+5,c.label,{"text-anchor":"middle","font-size":14,"font-weight":900,fill:"#fff","font-family":"Inter,system-ui,sans-serif","letter-spacing":".06em"}));
  svg.appendChild(g);
}
function controlMarker(svg,x,y){
  const g=el("g",{class:"control-marker"});
  g.appendChild(el("path",{d:`M ${x-14} ${y} L ${x} ${y+12} L ${x+14} ${y} Z`,fill:"#fbbf24"}));
  g.appendChild(el("rect",{x:x-52,y:y-26,width:104,height:24,rx:12,fill:"#fbbf24"}));
  g.appendChild(text(x,y-9,"IN CONTROL",{"text-anchor":"middle","font-size":12,"font-weight":900,fill:"#1f2937","font-family":"Inter,system-ui,sans-serif","letter-spacing":".08em"}));
  svg.appendChild(g);
}
function badge(svg,label,tone){
  const g=el("g",{class:"stage-badge"});
  g.appendChild(el("rect",{x:20,y:20,width:14+label.length*11,height:34,rx:17,fill:tone==="score"?"#16a34a":tone==="warn"?"#f59e0b":"#0f172a",opacity:.95}));
  g.appendChild(text(27,43,label,{"font-size":15,"font-weight":900,fill:"#fff","font-family":"Inter,system-ui,sans-serif","letter-spacing":".06em"}));
  svg.appendChild(g);
}
export const POSE_NAMES=Object.keys(POSES);
