// Illustrated scene art, keyed by pose name. Each entry is a full-stage image
// (gym, mat and both wrestlers) generated from the rig pose description and
// checked against the pose sheet for a plausible wrestling position before it
// is listed here. Poses without an entry fall back to the rig renderer.
// Anchors are in the 900x500 stage space (image is 1350x900 shown with
// "slice", so stage y = image y * 2/3 - 50) and place the name tags and the
// "IN CONTROL" marker over the right wrestler in the picture.
const src=n=>"art/poses/"+n+".jpg";
export const ART=Object.freeze({
  NEUTRAL:{src:src("NEUTRAL"),red:[300,38],green:[590,38]},
  TIE_UP:{src:src("TIE_UP"),red:[330,36],green:[540,36]},
  SHOT:{src:src("SHOT"),red:[420,150],green:[480,36]},
  FINISH:{src:src("FINISH"),red:[330,150],green:[700,40]},
  CONTROL_RED:{src:src("CONTROL_RED"),red:[440,80],green:[660,150]},
  CONTROL_GREEN:{src:src("CONTROL_GREEN"),red:[200,90],green:[430,55]},
  REF_POSITION_RED_TOP:{src:src("REF_POSITION_RED_TOP"),red:[470,50],green:[660,125]},
  STAND_UP:{src:src("STAND_UP"),red:[330,36],green:[600,36]},
  ESCAPE_NEUTRAL:{src:src("ESCAPE_NEUTRAL"),red:[250,36],green:[720,36]},
  SIT_OUT:{src:src("SIT_OUT"),red:[300,36],green:[610,50]},
  PIN:{src:src("PIN"),red:[560,70],green:[720,235]}
});
