// Curriculum content. Rules text here is presentation only; point values are
// read from the rules engine at render time (see app.js) so the two cannot
// drift. Every lesson lists its source id from docs/rules-sources.md and a
// verification status that is shown to parents and coaches.

export const GROUPS=Object.freeze([
  {id:"foundation",title:"Foundation"},
  {id:"scoring",title:"Basic scoring"},
  {id:"match",title:"Match basics"}
]);

export const LESSONS=Object.freeze([
  {
    id:"neutral",group:"foundation",n:1,title:"Neutral",kid:"Nobody is in charge yet.",
    frames:[
      {pose:"NEUTRAL",state:"neutral",controller:null,caption:"Both wrestlers are on their feet, facing each other. Nobody is in control. This is NEUTRAL.",coach:"Neutral means neither wrestler has control. Most matches start here and every period can return here.",signal:"Neutral position (signal 8)"},
      {pose:"TIE_UP",state:"neutral",controller:null,caption:"They grab each other's head and arm. Still NEUTRAL: touching is not control.",coach:"A collar tie or hand fight is contact, not control. No points change hands in neutral.",signal:"Indicates no control (signal 9)"}
    ],
    source:"S1, S3",status:"verified",rule:"Position vocabulary from the NFHS signals chart. No point value."
  },
  {
    id:"top",group:"foundation",n:2,title:"Top",kid:"The wrestler on top is in control.",
    frames:[
      {pose:"REF_POSITION_RED_TOP",state:"red-control",controller:"red",caption:"RED is on TOP. Red has a hand on Green's elbow and an arm around Green's waist. Red is in control.",coach:"The top wrestler has the advantage position. The top wrestler's job is to control, turn, and work toward a fall.",signal:"Wrestler in control (signal 11)"}
    ],
    source:"S3",status:"verified",rule:"Advantage position vocabulary. No point value."
  },
  {
    id:"bottom",group:"foundation",n:3,title:"Bottom",kid:"The wrestler on bottom is being controlled.",
    frames:[
      {pose:"REF_POSITION_RED_TOP",state:"red-control",controller:"red",caption:"GREEN is on BOTTOM, on hands and knees. Green's job is to get free or get on top.",coach:"The bottom wrestler is in the defensive position. Getting back to neutral is an escape; getting on top is a reversal.",signal:"Wrestler in control (signal 11)"}
    ],
    source:"S3",status:"verified",rule:"Defensive position vocabulary. No point value."
  },
  {
    id:"control",group:"foundation",n:4,title:"Control",kid:"Control means you are the boss of the position.",
    frames:[
      {pose:"SHOT",state:"neutral",controller:null,caption:"Red grabs Green's legs. Not control yet! Green is still standing and fighting.",coach:"An attempt is not control. The referee waits until one wrestler is clearly in the advantage position.",signal:"Indicates no control (signal 9)"},
      {pose:"FINISH",state:"neutral",controller:null,caption:"Green is falling but still fighting. The referee is watching. Still no control.",coach:"Control is developing but not established. No points yet.",signal:"Indicates no control (signal 9)"},
      {pose:"CONTROL_RED",state:"red-control",controller:"red",caption:"Now Red is on top and Green is down. RED HAS CONTROL.",coach:"Control is established: Red is behind and on top, Green is down on the mat. This is the moment the referee awards points.",signal:"Wrestler in control (signal 11)"}
    ],
    source:"S1, S3",status:"verified",rule:"Control is the gate for every scoring call. Points are never given for an attempt."
  },
  {
    id:"pin",group:"foundation",n:5,title:"Pin (fall)",kid:"Both shoulders held on the mat ends the match.",
    frames:[
      {pose:"NEAR_FALL",state:"red-control",controller:"red",caption:"Red turns Green toward the mat. Green's back is showing but the shoulders are not both down.",coach:"Back exposure is a near-fall situation, not a fall.",signal:"Near fall (signal 21)"},
      {pose:"PIN",state:"red-control",controller:"red",caption:"Both of Green's shoulders are held on the mat. The referee counts and slaps the mat. PIN! The match is over.",coach:"A fall ends the match immediately regardless of score. The exact count length is listed as pending in the rules record until the rules book text is on file.",signal:"Stopping the match (signal 2)",badge:"FALL",badgeTone:"score",ends:true}
    ],
    source:"S3, pending",status:"partly-verified",rule:"A fall ends the match. The count duration is still unresolved in our record."
  },
  {
    id:"takedown",group:"scoring",n:6,title:"Takedown",kid:"Take your partner down and be in control.",
    frames:[
      {pose:"NEUTRAL",state:"neutral",controller:null,caption:"Step 1. Neutral. Nobody has points yet.",coach:"Start in neutral.",signal:"Neutral position (signal 8)"},
      {pose:"TIE_UP",state:"neutral",controller:null,caption:"Step 2. Red ties up and sets up the shot. Still no points.",coach:"Set-ups move the opponent's hands and feet. No score.",signal:"Indicates no control (signal 9)"},
      {pose:"SHOT",state:"neutral",controller:null,caption:"Step 3. Red changes levels and shoots. An attempt. Still no points!",coach:"Many kids think the shot is the takedown. It is not. The shot is the attempt.",signal:"Indicates no control (signal 9)"},
      {pose:"FINISH",state:"neutral",controller:null,caption:"Step 4. Red finishes and drives. Control is coming but is not here yet.",coach:"The referee waits for control to be established.",signal:"Indicates no control (signal 9)"},
      {pose:"CONTROL_RED",state:"red-control",controller:"red",caption:"Step 5. Red is on top and in control. TAKEDOWN! Red scores.",coach:"Takedown: neutral to control. The points are awarded at this moment.",signal:"Awarding points (signal 22)",score:{call:"takedown",wrestler:"red"}}
    ],
    source:"S1, S2, engine",status:"verified",rule:"Takedown is scored when a wrestler goes from neutral to established control."
  },
  {
    id:"escape",group:"scoring",n:7,title:"Escape",kid:"Get free and face your partner.",
    frames:[
      {pose:"REF_POSITION_RED_TOP",state:"red-control",controller:"red",caption:"Step 1. Red is on top. Green is on bottom.",coach:"Start in the referee's position.",signal:"Wrestler in control (signal 11)"},
      {pose:"STAND_UP",state:"red-control",controller:"red",caption:"Step 2. Green stands up, but Red still has arms around the waist. Not free yet. No points.",coach:"Standing up is not an escape while the top wrestler still has control.",signal:"Wrestler in control (signal 11)"},
      {pose:"ESCAPE_NEUTRAL",state:"neutral",controller:null,caption:"Step 3. Green breaks the hands and turns to face Red. ESCAPE! Green scores.",coach:"Escape: from being controlled back to neutral. Awarded when control is lost and the wrestlers are neutral.",signal:"Awarding points (signal 22)",score:{call:"escape",wrestler:"green"}}
    ],
    source:"S1, S2, engine",status:"verified",rule:"Escape is scored when the controlled wrestler gets back to neutral."
  },
  {
    id:"reversal",group:"scoring",n:8,title:"Reversal",kid:"Go from bottom straight to top.",
    frames:[
      {pose:"REF_POSITION_RED_TOP",state:"red-control",controller:"red",caption:"Step 1. Red is on top. Green is on bottom.",coach:"Start in the referee's position.",signal:"Wrestler in control (signal 11)"},
      {pose:"SIT_OUT",state:"red-control",controller:"red",caption:"Step 2. Green sits out and turns. Red is losing the position but nobody is in control yet.",coach:"During the switch there is a moment with no clear control. No points yet.",signal:"Indicates no control (signal 9)"},
      {pose:"CONTROL_GREEN",state:"green-control",controller:"green",caption:"Step 3. Green is behind and on top of Red. REVERSAL! Green scores.",coach:"Reversal: from being controlled straight to control, without a neutral position in between.",signal:"Awarding points (signal 22)",score:{call:"reversal",wrestler:"green"}}
    ],
    source:"S1, S2, engine",status:"verified",rule:"Reversal is scored when the bottom wrestler gains control without going through neutral."
  },
  {
    id:"nearfall",group:"scoring",n:9,title:"Near fall",kid:"Back to the mat, count the seconds.",
    frames:[
      {pose:"REF_POSITION_RED_TOP",state:"red-control",controller:"red",caption:"Step 1. Red is on top and in control.",coach:"Near fall needs control first.",signal:"Wrestler in control (signal 11)"},
      {pose:"NEAR_FALL",state:"red-control",controller:"red",caption:"Step 2. Red turns Green. Green's back is toward the mat. The referee starts counting: 1... 2...",coach:"Near-fall criteria must be met and held for at least 2 seconds. The count alone never scores; control plus criteria plus time does.",signal:"Near fall (signal 21)",badge:"COUNT 1... 2...",badgeTone:"warn"},
      {pose:"REF_POSITION_RED_TOP",state:"red-control",controller:"red",caption:"Step 3. Green fights back to the belly. The near fall is over. Red gets points for the count.",coach:"Points are awarded when the near-fall situation ends. Only one near fall per pinning situation.",signal:"Awarding points (signal 22)",nearFall:{seconds:2,wrestler:"red"}}
    ],
    source:"S1, engine",status:"verified",rule:"Near fall: control, pinning situation, criteria met, 2 or more seconds. Scored once when the situation ends."
  },
  {
    id:"fall",group:"scoring",n:10,title:"Fall",kid:"A pin wins no matter the score.",
    frames:[
      {pose:"NEAR_FALL",state:"red-control",controller:"red",caption:"Red is turning Green. Shoulders are close to the mat.",coach:"A pinning situation.",signal:"Near fall (signal 21)"},
      {pose:"PIN",state:"red-control",controller:"red",caption:"Both shoulders down for the count. FALL. Red wins right now, even if Green had more points.",coach:"The fall ends the match immediately. Score does not matter.",signal:"Stopping the match (signal 2)",badge:"FALL",badgeTone:"score",ends:true}
    ],
    source:"S3, pending",status:"partly-verified",rule:"A fall ends the match immediately. Count duration unresolved."
  },
  {
    id:"techfall",group:"match",n:11,title:"Technical fall",kid:"Get far enough ahead and the match ends.",
    frames:[
      {pose:"CONTROL_RED",state:"red-control",controller:"red",caption:"When one wrestler leads by the technical fall margin, the match ends.",coach:"If a near fall creates the margin, the match continues until the near-fall criteria are no longer met, then ends immediately.",signal:"Default, technical fall, disqualification (signal 27)",badge:"TECH FALL",badgeTone:"score"}
    ],
    source:"S1 (5-11-2c)",status:"verified",rule:"15-point margin. Near-fall exception verified in NFHS 2025-26 changes."
  }
]);

export const MAKE_THE_CALL=Object.freeze([
  {id:"q-shot",from:"SHOT",to:"FINISH",fromState:"neutral",toState:"neutral",prompt:"Red shoots and drives. What is the call?",answer:"none",why:"Still neutral. An attempt is not control."},
  {id:"q-td",from:"FINISH",to:"CONTROL_RED",fromState:"neutral",toState:"red-control",prompt:"Red finishes and is on top. What is the call?",answer:"takedown",why:"Neutral to control. Takedown for Red."},
  {id:"q-standup",from:"REF_POSITION_RED_TOP",to:"STAND_UP",fromState:"red-control",toState:"red-control",prompt:"Green stands up but Red still holds the waist. What is the call?",answer:"none",why:"Red still has control. Not an escape yet."},
  {id:"q-escape",from:"STAND_UP",to:"ESCAPE_NEUTRAL",fromState:"red-control",toState:"neutral",prompt:"Green breaks free and faces Red. What is the call?",answer:"escape",why:"Controlled to neutral. Escape for Green."},
  {id:"q-reversal",from:"SIT_OUT",to:"CONTROL_GREEN",fromState:"red-control",toState:"green-control",prompt:"Green comes out the back and is on top. What is the call?",answer:"reversal",why:"Controlled straight to control. Reversal for Green."},
  {id:"q-nf-count",from:"REF_POSITION_RED_TOP",to:"NEAR_FALL",fromState:"red-control",toState:"red-control",prompt:"Red turns Green and the referee is counting 1... 2... Points right now?",answer:"nearfall-wait",why:"Keep counting. Near-fall points are awarded when the situation ends, not during the count."},
  {id:"q-pin",from:"NEAR_FALL",to:"PIN",fromState:"red-control",toState:"red-control",prompt:"Both of Green's shoulders are held down for the count. What is the call?",answer:"fall",why:"Fall. The match is over."},
  {id:"q-neutral",from:"NEUTRAL",to:"TIE_UP",fromState:"neutral",toState:"neutral",prompt:"They tie up. Points?",answer:"none",why:"Neutral. Touching is not control."}
]);

export const CALL_OPTIONS=Object.freeze([
  {id:"none",label:"No points",icon:"0"},
  {id:"takedown",label:"Takedown",icon:"TD"},
  {id:"escape",label:"Escape",icon:"E"},
  {id:"reversal",label:"Reversal",icon:"R"},
  {id:"nearfall-wait",label:"Keep counting",icon:"NF"},
  {id:"fall",label:"Fall",icon:"PIN"}
]);
