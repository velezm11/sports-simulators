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
    id:"neutral",group:"foundation",n:1,title:"Neutral",kid:"Nobody is winning yet.",
    frames:[
      {pose:"NEUTRAL",state:"neutral",controller:null,caption:"Both kids are standing up. Nobody is winning yet. This is called NEUTRAL.",thumb:"Standing up",coach:"Neutral means neither wrestler has control. Most matches start here and every period can return here.",signal:"Neutral position (signal 8)"},
      {pose:"TIE_UP",state:"neutral",controller:null,caption:"They grab each other. Still neutral! Touching is not the same as control.",thumb:"Grab and push",coach:"A collar tie or hand fight is contact, not control. No points change hands in neutral.",signal:"Indicates no control (signal 9)"}
    ],
    source:"S1, S3",status:"verified",rule:"Position vocabulary from the NFHS signals chart. No point value."
  },
  {
    id:"top",group:"foundation",n:2,title:"Top",kid:"The wrestler on top is in control.",
    frames:[
      {pose:"REF_POSITION_RED_TOP",state:"red-control",controller:"red",caption:"Red is on TOP. Red holds Green's belly and elbow. Red is in control.",thumb:"Red on top",coach:"The top wrestler has the advantage position. The top wrestler's job is to control, turn, and work toward a fall.",signal:"Wrestler in control (signal 11)"}
    ],
    source:"S3",status:"verified",rule:"Advantage position vocabulary. No point value."
  },
  {
    id:"bottom",group:"foundation",n:3,title:"Bottom",kid:"The wrestler on bottom is being controlled.",
    frames:[
      {pose:"REF_POSITION_RED_TOP",state:"red-control",controller:"red",caption:"Green is on the BOTTOM, on hands and knees. Green wants to get free or get on top.",thumb:"Green on bottom",coach:"The bottom wrestler is in the defensive position. Getting back to neutral is an escape; getting on top is a reversal.",signal:"Wrestler in control (signal 11)"}
    ],
    source:"S3",status:"verified",rule:"Defensive position vocabulary. No point value."
  },
  {
    id:"control",group:"foundation",n:4,title:"Control",kid:"Control means you are the boss.",
    frames:[
      {pose:"SHOT",state:"neutral",controller:null,caption:"Red grabs Green's legs. Not control yet! Green is still standing.",thumb:"Red grabs legs",coach:"An attempt is not control. The referee waits until one wrestler is clearly in the advantage position.",signal:"Indicates no control (signal 9)"},
      {pose:"FINISH",state:"neutral",controller:null,caption:"Green is falling but still fighting. Still no control. The ref is watching.",thumb:"Green falling",coach:"Control is developing but not established. No points yet.",signal:"Indicates no control (signal 9)"},
      {pose:"CONTROL_RED",state:"red-control",controller:"red",caption:"Now Red is on top and Green is down. Red has CONTROL!",thumb:"Red in control",coach:"Control is established: Red is behind and on top, Green is down on the mat. This is the moment the referee awards points.",signal:"Wrestler in control (signal 11)"}
    ],
    source:"S1, S3",status:"verified",rule:"Control is the gate for every scoring call. Points are never given for an attempt."
  },
  {
    id:"pin",group:"foundation",n:5,title:"Pin (fall)",kid:"Both shoulders down = match over.",
    frames:[
      {pose:"REF_POSITION_RED_TOP",state:"red-control",controller:"red",caption:"Red is on top. Green is on hands and knees. Green's back is safe, so no pin.",coach:"The pin is the goal of every top position. From here the top wrestler works to turn the bottom wrestler over.",signal:"Wrestler in control (signal 11)",thumb:"Back is safe"},
      {pose:"PIN",state:"red-control",controller:"red",caption:"Now both of Green's shoulders are on the mat. The ref slaps the mat. PIN! The match is over.",coach:"A fall ends the match immediately regardless of score. The exact count length is listed as pending in the rules record until the rules book text is on file.",signal:"Stopping the match (signal 2)",badge:"FALL",badgeTone:"score",ends:true,thumb:"Pin!"}
    ],
    source:"S3, pending",status:"partly-verified",rule:"A fall ends the match. The count duration is still unresolved in our record."
  },
  {
    id:"takedown",group:"scoring",n:6,title:"Takedown",kid:"Take them down and stay on top.",
    frames:[
      {pose:"NEUTRAL",state:"neutral",controller:null,caption:"Step 1. Both kids stand up. Nobody has points.",thumb:"Standing up",coach:"Start in neutral.",signal:"Neutral position (signal 8)"},
      {pose:"TIE_UP",state:"neutral",controller:null,caption:"Step 2. Red grabs Green's head and arm. Still no points.",thumb:"Red grabs",coach:"Set-ups move the opponent's hands and feet. No score.",signal:"Indicates no control (signal 9)"},
      {pose:"SHOT",state:"neutral",controller:null,caption:"Step 3. Red gets low and shoots for the legs. That is a try, not a score. No points yet!",thumb:"Red shoots",coach:"Many kids think the shot is the takedown. It is not. The shot is the attempt.",signal:"Indicates no control (signal 9)"},
      {pose:"FINISH",state:"neutral",controller:null,caption:"Step 4. Red pushes and Green falls. Almost... but not yet!",thumb:"Green falls",coach:"The referee waits for control to be established.",signal:"Indicates no control (signal 9)"},
      {pose:"CONTROL_RED",state:"red-control",controller:"red",caption:"Step 5. Red is on top. Green is down. TAKEDOWN! Red gets points.",thumb:"Takedown!",coach:"Takedown: neutral to control. The points are awarded at this moment.",signal:"Awarding points (signal 22)",score:{call:"takedown",wrestler:"red"}}
    ],
    source:"S1, S2, engine",status:"verified",rule:"Takedown is scored when a wrestler goes from neutral to established control."
  },
  {
    id:"escape",group:"scoring",n:7,title:"Escape",kid:"Get free and turn around.",
    frames:[
      {pose:"REF_POSITION_RED_TOP",state:"red-control",controller:"red",caption:"Step 1. Red is on top. Green is on the bottom.",thumb:"Red on top",coach:"Start in the referee's position.",signal:"Wrestler in control (signal 11)"},
      {pose:"STAND_UP",state:"red-control",controller:"red",caption:"Step 2. Green stands up, but Red still holds Green's belly. Not free yet. No points.",thumb:"Green stands",coach:"Standing up is not an escape while the top wrestler still has control.",signal:"Wrestler in control (signal 11)"},
      {pose:"ESCAPE_NEUTRAL",state:"neutral",controller:null,caption:"Step 3. Green breaks free and turns around to face Red. ESCAPE! Green gets a point.",thumb:"Escape!",coach:"Escape: from being controlled back to neutral. Awarded when control is lost and the wrestlers are neutral.",signal:"Awarding points (signal 22)",score:{call:"escape",wrestler:"green"}}
    ],
    source:"S1, S2, engine",status:"verified",rule:"Escape is scored when the controlled wrestler gets back to neutral."
  },
  {
    id:"reversal",group:"scoring",n:8,title:"Reversal",kid:"Bottom to top in one move.",
    frames:[
      {pose:"REF_POSITION_RED_TOP",state:"red-control",controller:"red",caption:"Step 1. Red is on top. Green is on the bottom.",thumb:"Red on top",coach:"Start in the referee's position.",signal:"Wrestler in control (signal 11)"},
      {pose:"SIT_OUT",state:"red-control",controller:"red",caption:"Step 2. Green sits out and turns to face Red. Red lost his grip. Nobody is in control right now.",thumb:"Green turns",coach:"Red has lost his grip but Green is not behind Red yet, so nobody is in control. No points yet.",signal:"Indicates no control (signal 9)"},
      {pose:"CONTROL_GREEN",state:"green-control",controller:"green",caption:"Step 3. Now Green is on top of Red! REVERSAL! Green gets points.",thumb:"Reversal!",coach:"Reversal: from being controlled straight to control, without a neutral position in between.",signal:"Awarding points (signal 22)",score:{call:"reversal",wrestler:"green"}}
    ],
    source:"S1, S2, engine",status:"verified",rule:"Reversal is scored when the bottom wrestler gains control without going through neutral."
  },
  {
    id:"nearfall",group:"scoring",n:9,title:"Near fall",kid:"Back near the mat? The ref counts.",
    frames:[
      {pose:"REF_POSITION_RED_TOP",state:"red-control",controller:"red",caption:"Step 1. Red is on top and in control.",thumb:"Red on top",coach:"Near fall needs control first.",signal:"Wrestler in control (signal 11)"},
      {pose:"REF_POSITION_RED_TOP",state:"red-control",controller:"red",caption:"Step 2. Red turned Green's back toward the mat and the ref counted 1... 2... Green gets back to the belly. Red gets near fall points.",thumb:"Points!",coach:"Points are awarded when the near-fall situation ends. Only one near fall per pinning situation.",signal:"Awarding points (signal 22)",nearFall:{seconds:2,wrestler:"red"}}
    ],
    source:"S1, engine",status:"verified",rule:"Near fall: control, pinning situation, criteria met, 2 or more seconds. Scored once when the situation ends."
  },
  {
    id:"fall",group:"scoring",n:10,title:"Fall beats points",kid:"A pin wins, no matter the score.",
    preset:{red:0,green:6},
    frames:[
      {pose:"CONTROL_RED",state:"red-control",controller:"red",caption:"Look at the scoreboard: Green is winning 6 to 0. But Red just got on top.",coach:"The scoreboard shows a preset 0-6 so children can see that a fall overrides points.",signal:"Wrestler in control (signal 11)",thumb:"Green leads 6-0"},
      {pose:"PIN",state:"red-control",controller:"red",caption:"Red pins Green. Both shoulders down! Red wins right now, even though Green had more points.",coach:"The fall ends the match immediately. Score does not matter.",signal:"Stopping the match (signal 2)",badge:"FALL",badgeTone:"score",ends:true,thumb:"Red wins by pin"}
    ],
    source:"S3, pending",status:"partly-verified",rule:"A fall ends the match immediately, whatever the score. Count duration unresolved."
  },
  {
    id:"techfall",group:"match",n:11,title:"Technical fall",kid:"Way ahead? The match stops.",
    frames:[
      {pose:"CONTROL_RED",state:"red-control",controller:"red",caption:"If one wrestler gets way ahead, the match stops. That is a technical fall.",thumb:"Way ahead",coach:"If a near fall creates the margin, the match continues until the near-fall criteria are no longer met, then ends immediately.",signal:"Default, technical fall, disqualification (signal 27)",badge:"TECH FALL",badgeTone:"score"}
    ],
    source:"S1 (5-11-2c)",status:"verified",rule:"15-point margin. Near-fall exception verified in NFHS 2025-26 changes."
  }
]);

export const MAKE_THE_CALL=Object.freeze([
  {id:"q-shot",from:"SHOT",to:"FINISH",fromState:"neutral",toState:"neutral",prompt:"Red shoots and pushes. Green is still up. What is the call?",answer:"none",why:"Still neutral. An attempt is not control."},
  {id:"q-td",from:"FINISH",to:"CONTROL_RED",fromState:"neutral",toState:"red-control",prompt:"Red is on top now and Green is down. What is the call?",answer:"takedown",why:"Neutral to control. Takedown for Red."},
  {id:"q-standup",from:"REF_POSITION_RED_TOP",to:"STAND_UP",fromState:"red-control",toState:"red-control",prompt:"Green stands up, but Red still holds Green's belly. What is the call?",answer:"none",why:"Red still has control. Not an escape yet."},
  {id:"q-escape",from:"STAND_UP",to:"ESCAPE_NEUTRAL",fromState:"red-control",toState:"neutral",prompt:"Green breaks free and turns to face Red. What is the call?",answer:"escape",why:"Controlled to neutral. Escape for Green."},
  {id:"q-reversal",from:"SIT_OUT",to:"CONTROL_GREEN",fromState:"red-control",toState:"green-control",prompt:"Green spins out and is on top of Red. What is the call?",answer:"reversal",why:"Controlled straight to control. Reversal for Green."},
  {id:"q-pin",from:"NEAR_FALL",to:"PIN",fromState:"red-control",toState:"red-control",prompt:"Both of Green's shoulders are down and the ref slaps the mat. What is the call?",answer:"fall",why:"Fall. The match is over."},
  {id:"q-neutral",from:"NEUTRAL",to:"TIE_UP",fromState:"neutral",toState:"neutral",prompt:"They grab each other and push. Points?",answer:"none",why:"Neutral. Touching is not control."}
]);

export const CALL_OPTIONS=Object.freeze([
  {id:"none",label:"No points",icon:"0",sub:"Nothing changed",tone:"gray"},
  {id:"takedown",label:"Takedown",icon:"TD",tone:"green"},
  {id:"escape",label:"Escape",icon:"E",tone:"blue"},
  {id:"reversal",label:"Reversal",icon:"R",tone:"orange"},
  {id:"nearfall-wait",label:"Keep counting",icon:"1..2",sub:"Points when it ends",tone:"purple"},
  {id:"fall",label:"Pin!",icon:"PIN",sub:"Match over",tone:"red"}
]);
