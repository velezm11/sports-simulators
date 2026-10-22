// Pose library. Scene space is 900x500; the mat surface is at y=400.
// Red faces right from the left side; green faces left from the right side.
// Each frame is {red, green} joint maps (see figures.js for joint names).

const STAND_R={ // red, athletic neutral stance, facing right
  head:[318,238],neck:[330,262],hip:[300,330],
  sF:[326,268],eF:[352,300],wF:[380,312],
  sN:[334,268],eN:[366,296],wN:[398,300],
  kF:[318,364],aF:[310,395],tF:[330,397],
  kN:[266,366],aN:[250,395],tN:[270,397]
};
function mirror(p,x){const o={};for(const k in p)o[k]=[2*x-p[k][0],p[k][1]];return o;}
function shift(p,dx,dy){const o={};for(const k in p)o[k]=[p[k][0]+dx,p[k][1]+dy];return o;}
const STAND_G=mirror(STAND_R,450); // green mirrored on the right

// --- Neutral --------------------------------------------------------------
export const NEUTRAL={red:STAND_R,green:STAND_G};

// Collar tie: both reach to the opponent's head / arm, still neutral.
export const TIE_UP={
  red:{...STAND_R,head:[338,236],neck:[348,260],hip:[318,330],sF:[344,266],eF:[392,268],wF:[446,250],sN:[352,266],eN:[398,300],wN:[452,276],kF:[336,364],aF:[328,395],tF:[348,397],kN:[286,366],aN:[270,395],tN:[290,397]},
  green:mirror({...STAND_R,head:[338,236],neck:[348,260],hip:[318,330],sF:[344,266],eF:[392,268],wF:[446,250],sN:[352,266],eN:[398,300],wN:[452,276],kF:[336,364],aF:[328,395],tF:[348,397],kN:[286,366],aN:[270,395],tN:[290,397]},450)
};

// Level change + penetration step: red lowers hips, lead knee near the mat,
// head to the outside of green's hip, hands wrapped behind green's knees.
export const SHOT={
  red:{head:[458,318],neck:[438,322],hip:[352,352],sF:[438,330],eF:[476,352],wF:[514,366],sN:[446,328],eN:[486,344],wN:[522,352],kF:[404,392],aF:[344,392],tF:[322,394],kN:[330,398],aN:[300,392],tN:[278,396]},
  green:{head:[536,246],neck:[526,270],hip:[548,336],sF:[530,276],eF:[498,306],wF:[470,316],sN:[522,276],eN:[492,302],wN:[458,324],kF:[566,368],aF:[586,394],tF:[568,397],kN:[516,370],aN:[518,394],tN:[498,396]}
};

// Finish: red drives through, green's near leg lifted, green posts a hand on
// the mat. Control is developing; no points yet.
export const FINISH={
  red:{head:[500,306],neck:[478,312],hip:[400,340],sF:[478,320],eF:[520,338],wF:[560,342],sN:[486,318],eN:[526,326],wN:[556,322],kF:[428,388],aF:[380,392],tF:[358,395],kN:[368,386],aN:[336,392],tN:[312,396]},
  green:{head:[608,312],neck:[594,328],hip:[566,352],sF:[598,336],eF:[640,366],wF:[664,392],sN:[590,336],eN:[632,364],wN:[656,392],kF:[598,378],aF:[640,394],tF:[662,396],kN:[520,322],aN:[500,352],tN:[484,366]}
};

// Control: green down on hands and knees, red behind and on top with chest on
// green's back and an arm around the waist. Takedown is awarded here.
export const CONTROL_RED={
  red:{head:[560,286],neck:[536,296],hip:[438,318],sF:[536,304],eF:[566,332],wF:[586,350],sN:[528,304],eN:[560,336],wN:[596,338],kF:[456,372],aF:[428,394],tF:[406,397],kN:[416,378],aN:[392,394],tN:[368,397]},
  green:{head:[618,332],neck:[600,342],hip:[508,352],sF:[602,352],eF:[628,380],wF:[640,398],sN:[596,352],eN:[618,382],wN:[626,398],kF:[536,396],aF:[598,394],tF:[618,398],kN:[526,396],aN:[590,394],tN:[612,398]}
};
export const CONTROL_GREEN={red:mirror(CONTROL_RED.green,450),green:mirror(CONTROL_RED.red,450)};

// Referee's position: bottom wrestler on hands and knees, top wrestler at the
// side with one arm around the waist and one hand on the elbow.
export const REF_POSITION_RED_TOP={
  red:{head:[560,300],neck:[536,310],hip:[458,336],sF:[536,318],eF:[562,352],wF:[598,364],sN:[528,318],eN:[556,348],wN:[560,370],kF:[476,392],aF:[436,394],tF:[414,398],kN:[466,396],aN:[430,392],tN:[408,396]},
  green:{head:[628,318],neck:[608,330],hip:[516,350],sF:[610,340],eF:[632,374],wF:[640,398],sN:[604,340],eN:[624,376],wN:[630,398],kF:[536,396],aF:[598,394],tF:[618,398],kN:[526,396],aN:[590,394],tN:[612,398]}
};

// Escape: green stands up, red still has hands around the waist (no points),
// then green clears the hands and faces red (escape).
export const STAND_UP={
  red:{head:[576,276],neck:[556,292],hip:[476,340],sF:[556,300],eF:[596,322],wF:[628,318],sN:[548,300],eN:[590,326],wN:[624,320],kF:[496,388],aF:[456,394],tF:[434,398],kN:[480,386],aN:[446,394],tN:[422,398]},
  green:{head:[646,250],neck:[640,272],hip:[618,338],sF:[642,278],eF:[690,296],wF:[708,330],sN:[636,278],eN:[668,310],wN:[640,330],kF:[636,368],aF:[648,394],tF:[630,398],kN:[600,370],aN:[596,394],tN:[576,398]}
};
export const ESCAPE_NEUTRAL={red:shift(STAND_R,60,0),green:shift(STAND_G,120,0)};

// Reversal: green sits out and turns, red is driven forward and loses control,
// then green is behind red in control.
export const SIT_OUT={
  red:{head:[600,312],neck:[580,320],hip:[500,338],sF:[580,328],eF:[612,356],wF:[628,384],sN:[572,328],eN:[600,360],wN:[618,386],kF:[514,392],aF:[476,394],tF:[454,398],kN:[504,394],aN:[470,392],tN:[448,398]},
  green:{head:[560,286],neck:[568,308],hip:[600,368],sF:[562,314],eF:[540,348],wF:[520,382],sN:[570,314],eN:[560,352],wN:[536,390],kF:[650,366],aF:[690,394],tF:[710,398],kN:[640,372],aN:[670,394],tN:[692,398]}
};
export const CONTROL_GREEN_BEHIND={red:CONTROL_GREEN.red,green:CONTROL_GREEN.green};

// Near fall: red turns green with a half nelson; green's back is exposed and
// shoulders are within the near-fall angle. Pin: both shoulders on the mat.
export const NEAR_FALL={
  red:{head:[588,286],neck:[566,300],hip:[470,330],sF:[568,310],eF:[600,344],wF:[576,366],sN:[560,310],eN:[596,338],wN:[612,344],kF:[476,386],aF:[432,394],tF:[410,398],kN:[504,390],aN:[468,394],tN:[446,398]},
  green:{head:[612,350],neck:[596,362],hip:[520,372],sF:[598,372],eF:[636,386],wF:[662,394],sN:[590,360],eN:[560,336],wN:[520,330],kF:[556,392],aF:[612,392],tF:[636,396],kN:[560,394],aN:[620,394],tN:[644,398]}
};
export const PIN={
  red:{head:[590,308],neck:[566,318],hip:[464,352],sF:[568,328],eF:[604,360],wF:[640,380],sN:[558,328],eN:[600,356],wN:[632,376],kF:[466,392],aF:[422,394],tF:[400,398],kN:[496,392],aN:[458,396],tN:[436,398]},
  green:{head:[640,372],neck:[618,378],hip:[520,380],sF:[616,384],eF:[656,392],wF:[690,386],sN:[612,380],eN:[586,356],wN:[548,350],kF:[556,392],aF:[618,396],tF:[640,398],kN:[564,394],aN:[626,396],tN:[650,398]}
};
