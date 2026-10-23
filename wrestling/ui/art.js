// Illustrated scene art, keyed by pose name. Each entry is a full-stage image
// (gym, mat and both wrestlers) generated from the written position in
// docs/lesson-flows.md and reviewed at the 1536x1024 original (every hand,
// joint, headgear and singlet, caption nouns visible) before it is listed here
// (playbook gates G3-G5). Poses without an entry fall back to the rig renderer,
// which must never be reached from a live lesson.
// Anchors are in the 900x500 stage space (image is 1350x900 shown with
// "slice", so stage y = image y * 2/3 - 50) and place the name tags and the
// "IN CONTROL" marker over the right wrestler in the picture.
const src=n=>"art/poses/"+n+".jpg";
export const ART=Object.freeze({
  NEUTRAL:{src:src("NEUTRAL"),red:[300,38],green:[590,38]},
  TIE_UP:{src:src("TIE_UP"),red:[330,36],green:[540,36]},
  SHOT:{src:src("SHOT"),red:[420,150],green:[480,36]},
  FINISH:{src:src("FINISH"),red:[330,150],green:[700,40]},
  // Cover after the double leg: Red behind and on top, arms locked around the waist.
  TAKEDOWN_CONTROL:{src:src("TAKEDOWN_CONTROL"),red:[510,45],green:[700,110]},
  // Mirror-role placeholder for Green in control until REVERSAL_CONTROL / TOP_RIDE_GREEN pass review.
  CONTROL_GREEN:{src:src("CONTROL_GREEN"),red:[200,90],green:[430,55]},
  // Referee's position: palm on the navel, far hand cupping the elbow.
  REF_POSITION_RED_TOP:{src:src("REF_POSITION_RED_TOP"),red:[380,50],green:[690,80]},
  STAND_UP:{src:src("STAND_UP"),red:[330,36],green:[600,36]},
  ESCAPE_NEUTRAL:{src:src("ESCAPE_NEUTRAL"),red:[250,36],green:[720,36]},
  // Sit-out with Red still holding the waist.
  SIT_OUT_TIGHT:{src:src("SIT_OUT_TIGHT"),red:[300,45],green:[600,50]},
  // Turn-in: Green driving into Red, Red off balance, nobody on top yet.
  TURN_IN:{src:src("TURN_IN"),red:[200,45],green:[560,120]},
  // Half nelson exposure: Green's back toward the mat, one shoulder up, referee counting.
  NEAR_FALL_EXPOSURE:{src:src("NEAR_FALL_EXPOSURE"),red:[560,55],green:[790,200]},
  PIN:{src:src("PIN"),red:[560,70],green:[720,235]}
});
