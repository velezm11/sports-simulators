// Rig-based youth wrestler renderer. A pose is a map of joint names to [x,y]
// points in scene space. Each wrestler is drawn as a side-view figure with a
// far side (drawn first, shaded) and a near side, so limbs read as a body
// rather than a stick figure.
//
// Joint names: head, neck, hip, sF/eF/wF (far shoulder/elbow/wrist),
// sN/eN/wN (near), kF/aF/tF (far knee/ankle/toe), kN/aN/tN (near).

export const WRESTLERS=Object.freeze({
  red:  Object.freeze({id:"red",  label:"RED",  singlet:"#d7263d",singletDark:"#a51a2d",trim:"#ffffff",skin:"#c68642",skinDark:"#a86f35",hair:"#2b1b12",band:"#d7263d"}),
  green:Object.freeze({id:"green",label:"GREEN",singlet:"#1f9d55",singletDark:"#15743e",trim:"#ffe066",skin:"#f1c9a5",skinDark:"#d9a97f",hair:"#4a2f1a",band:"#1f9d55"})
});

const NS="http://www.w3.org/2000/svg";
function el(name,attrs,children){
  const n=document.createElementNS(NS,name);
  for(const k in attrs)if(attrs[k]!==undefined&&attrs[k]!==null)n.setAttribute(k,attrs[k]);
  (children||[]).forEach(c=>n.appendChild(c));
  return n;
}
function limb(a,b,w,color){
  return el("line",{x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:color,"stroke-width":w,"stroke-linecap":"round"});
}
function path(points,w,color){
  const d=points.map((p,i)=>(i?"L":"M")+p[0]+" "+p[1]).join(" ");
  return el("path",{d,fill:"none",stroke:color,"stroke-width":w,"stroke-linecap":"round","stroke-linejoin":"round"});
}
function shoe(ankle,toe,color){
  const dx=toe[0]-ankle[0],dy=toe[1]-ankle[1];
  const len=Math.hypot(dx,dy)||1;
  const ux=dx/len,uy=dy/len;
  const heel=[ankle[0]-ux*6,ankle[1]-uy*6];
  return path([heel,toe],13,color);
}
function headGroup(head,neck,c,facing){
  const r=20;
  const dir=facing==="right"?1:-1;
  const ang=Math.atan2(head[1]-neck[1],head[0]-neck[0]);
  const hx=head[0],hy=head[1];
  const g=el("g",{class:"head"});
  g.appendChild(el("circle",{cx:hx,cy:hy,r,fill:c.skin}));
  // hair cap on the back/top of the head
  g.appendChild(el("path",{d:`M ${hx-r*dir*0.2} ${hy-r} A ${r} ${r} 0 0 ${dir>0?0:1} ${hx-r*dir} ${hy+2} L ${hx-r*dir*0.55} ${hy-4} Z`,fill:c.hair}));
  // headgear: ear cup + straps
  g.appendChild(el("path",{d:`M ${hx-r*dir*0.1} ${hy-r+1} Q ${hx-r*dir*0.9} ${hy-r*0.9} ${hx-r*dir*1.05} ${hy}`,fill:"none",stroke:"#1e2a3a","stroke-width":4,"stroke-linecap":"round"}));
  g.appendChild(el("path",{d:`M ${hx-r*dir*0.1} ${hy+r-1} Q ${hx-r*dir*0.9} ${hy+r*0.9} ${hx-r*dir*1.05} ${hy}`,fill:"none",stroke:"#1e2a3a","stroke-width":4,"stroke-linecap":"round"}));
  g.appendChild(el("circle",{cx:hx-r*dir*0.1,cy:hy+2,r:8,fill:"#1e2a3a"}));
  g.appendChild(el("circle",{cx:hx-r*dir*0.1,cy:hy+2,r:4.5,fill:"#3b4b63"}));
  // eye, brow, mouth on the facing side
  g.appendChild(el("circle",{cx:hx+r*dir*0.5,cy:hy-2,r:2.4,fill:"#1e2a3a"}));
  g.appendChild(el("path",{d:`M ${hx+r*dir*0.3} ${hy-8} L ${hx+r*dir*0.7} ${hy-7}`,stroke:"#1e2a3a","stroke-width":2,"stroke-linecap":"round",fill:"none"}));
  g.appendChild(el("path",{d:`M ${hx+r*dir*0.45} ${hy+9} Q ${hx+r*dir*0.65} ${hy+11} ${hx+r*dir*0.8} ${hy+7}`,stroke:"#8a4b3a","stroke-width":2,"stroke-linecap":"round",fill:"none"}));
  return g;
}

/**
 * Draw one wrestler.
 * @param {object} pose joint map
 * @param {object} c color set from WRESTLERS
 * @param {{facing:"left"|"right", label?:string}} opts
 */
export function drawWrestler(pose,c,opts={}){
  const facing=opts.facing||"right";
  const g=el("g",{class:"wrestler wrestler-"+c.id,"data-wrestler":c.id});
  const p=pose;
  // far side limbs (shaded)
  g.appendChild(path([p.hip,p.kF,p.aF],20,c.singletDark));           // far thigh is singlet, shin skin
  g.appendChild(path([p.kF,p.aF],17,c.skinDark));
  g.appendChild(shoe(p.aF,p.tF,"#22303f"));
  g.appendChild(path([p.sF,p.eF,p.wF],15,c.skinDark));
  g.appendChild(el("circle",{cx:p.wF[0],cy:p.wF[1],r:8,fill:c.skinDark}));
  // torso
  g.appendChild(limb(p.neck,p.hip,36,c.singlet));
  g.appendChild(el("circle",{cx:p.hip[0],cy:p.hip[1],r:19,fill:c.singlet}));
  // singlet trim stripe
  const mx=(p.neck[0]*0.35+p.hip[0]*0.65),my=(p.neck[1]*0.35+p.hip[1]*0.65);
  g.appendChild(el("circle",{cx:mx,cy:my,r:5,fill:c.trim,opacity:.9}));
  // near leg
  g.appendChild(path([p.hip,p.kN],21,c.singlet));
  g.appendChild(path([p.kN,p.aN],18,c.skin));
  g.appendChild(el("circle",{cx:p.kN[0],cy:p.kN[1],r:10,fill:c.skin}));
  g.appendChild(shoe(p.aN,p.tN,"#2e3f52"));
  // ankle band (folkstyle red/green)
  g.appendChild(el("circle",{cx:p.aN[0],cy:p.aN[1],r:8,fill:"none",stroke:c.band,"stroke-width":4}));
  // head
  g.appendChild(headGroup(p.head,p.neck,c,facing));
  // near arm on top so it reads as reaching toward the opponent
  g.appendChild(path([p.sN,p.eN,p.wN],16,c.skin));
  g.appendChild(el("circle",{cx:p.wN[0],cy:p.wN[1],r:8.5,fill:c.skin}));
  if(opts.label!==false){
    const lx=p.head[0],ly=Math.min(p.head[1],p.hip[1],p.neck[1])-34;
    const t=el("g",{class:"tag"});
    t.appendChild(el("rect",{x:lx-30,y:ly-13,width:60,height:24,rx:12,fill:c.singlet}));
    const txt=el("text",{x:lx,y:ly+4,"text-anchor":"middle","font-size":13,"font-weight":800,fill:"#fff","font-family":"Inter,system-ui,sans-serif","letter-spacing":".06em"});
    txt.textContent=c.label;
    t.appendChild(txt);
    g.appendChild(t);
  }
  return g;
}

/** Linear interpolation between two poses for reduced-motion-safe tweening. */
export function lerpPose(a,b,t){
  const out={};
  for(const k in a)out[k]=[a[k][0]+(b[k][0]-a[k][0])*t,a[k][1]+(b[k][1]-a[k][1])*t];
  return out;
}

/** Mirror a pose horizontally around x (used to build the opposite wrestler). */
export function mirrorPose(pose,x){
  const out={};
  for(const k in pose)out[k]=[2*x-pose[k][0],pose[k][1]];
  return out;
}

/** Translate a pose. */
export function shiftPose(pose,dx,dy){
  const out={};
  for(const k in pose)out[k]=[pose[k][0]+dx,pose[k][1]+dy];
  return out;
}
