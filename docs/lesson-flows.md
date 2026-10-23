# Lesson flows: correct step sequences and the pictures each one needs

Reviewed as Wrestling rules SME + certified official + youth coach (playbook roles 1-3). Sources: NFHS definitions and signals (docs/rules-sources.md S1-S3), the collegiate/scholastic technique vocabulary (double leg: level change, penetration step, drive, cover; bottom: base, stand-up, sit-out; reversals: switch; pinning: half nelson, 45-degree back exposure for 2+ seconds; referee's position: top wrestler's palm on the navel and hand on the elbow), and standard youth coaching progressions. Every picture must pass playbook gates G3-G5 before it is listed in `wrestling/ui/art.js`.

Legend: KEEP = current picture is correct for this step. NEW = picture to generate. FIX = regenerate the same position because of a defect.

## 1 Neutral
1. Stance: both on feet, knees bent, hands up, not touching. KEEP (NEUTRAL)
2. Tie-up: each has one hand on the back of the other's neck, other hand on the arm. Still neutral. KEEP (TIE_UP)

## 2 Top / 3 Bottom (referee's position)
1. Bottom wrestler on hands and knees, hands flat in front of the knees, knees behind the rear line. Top wrestler at the side: one knee down, near arm around the waist with the palm on the navel, far hand cupping the back of the elbow. FIX (REF_POSITION_RED_TOP: regenerate for the deformed elbow hand; same position)

## 4 Control and 6 Takedown (double leg)
1. Stance. KEEP (NEUTRAL)
2. Setup / tie-up: hand on head, hand on arm. KEEP (TIE_UP)
3. Level change: Red bends knees, hips drop below Green's hands, head up, still on feet. NEW (LEVEL_CHANGE)
4. Penetration step: Red's lead knee drives to the mat between Green's feet, head to Green's hip, both arms wrap behind Green's knees. KEEP (SHOT)
5. Finish / drive: Red drives through, lifts and turns, Green goes to the mat. KEEP (FINISH)
6. Control / cover: Green down on the mat; Red behind and on top, chest on Green's back, arms locked around the waist, hips behind Green's hips. This is the moment the takedown is awarded. NEW (TAKEDOWN_CONTROL). Replaces the referee's-position reuse.

Control lesson uses steps 4-6. Takedown lesson uses steps 1-6.

## 7 Escape (stand-up)
1. Referee's position, Red on top. FIX (REF_POSITION_RED_TOP)
2. Stand-up: Green explodes to the feet, Red still has both arms around the waist. No points. KEEP (STAND_UP)
3. Hand control: Green pulls Red's hands apart at the waist (two hands on one wrist), hips forward. Still no points. NEW (CLEAR_HANDS)
4. Face: Green turns to face Red in neutral. Escape. KEEP (ESCAPE_NEUTRAL)

## 8 Reversal (sit-out and turn in / switch)
1. Referee's position. FIX (REF_POSITION_RED_TOP)
2. Sit-out: Green sits through on one hip with legs out, Red still has one arm around Green's waist. No points. NEW (SIT_OUT_TIGHT; the current SIT_OUT shows Red with no grip, which reads as an escape, so it is retired)
3. Turn in: Green turns toward Red, comes up behind Red's hips. NEW (TURN_IN)
4. Control: Green behind and on top of Red, arms around the waist. Reversal. NEW (REVERSAL_CONTROL; mirror of TAKEDOWN_CONTROL with roles swapped)

## 9 Near fall (half nelson)
1. Red on top in control (active ride: chest on back, arm around waist, far-side hand on the wrist). NEW (TOP_RIDE)
2. Half nelson: Red's arm under Green's near armpit, hand on the back of Green's head, driving Green toward the far shoulder. Back not yet exposed. NEW (HALF_NELSON)
3. Exposure: Green's back toward the mat at 45 degrees or less, one shoulder on the mat, the other up. Referee counts. NEW (NEAR_FALL_EXPOSURE)
4. Green fights back to the belly; the count stops; points awarded. KEEP (REF_POSITION or TOP_RIDE)

## 5 Pin and 10 Fall beats points
1. Exposure (as above). NEW (NEAR_FALL_EXPOSURE)
2. Both shoulders on the mat, referee slaps. KEEP (PIN)

## 11 Technical fall
1. Any control picture. Use TOP_RIDE after it exists.

## Score a Match stage pictures
- Neutral: NEUTRAL. Red control: TOP_RIDE. Green control: TOP_RIDE mirrored (NEW, TOP_RIDE_GREEN). Near-fall count: NEAR_FALL_EXPOSURE. Fall: PIN.

## Generation budget (free plan, 50 credits a day, about 4 per image)
Day 1 (12 images, in priority order): TAKEDOWN_CONTROL, REF_POSITION_RED_TOP fix, TOP_RIDE, TOP_RIDE_GREEN, NEAR_FALL_EXPOSURE, HALF_NELSON, LEVEL_CHANGE, CLEAR_HANDS, SIT_OUT_TIGHT, TURN_IN, REVERSAL_CONTROL, spare for one redo.
Each image: generate at 1536x1024, open the original, count fingers on every hand, check joints, headgear and singlet colors, then confirm the caption nouns are visible before listing it.

## Make the Call after the new pictures
Add back the near-fall count question (HALF_NELSON -> NEAR_FALL_EXPOSURE, answer "Keep counting") and add "Red is in the level change, Green still standing: no points", and "Green clears the hands but has not turned: no points".

## Status (day 1 generation, 2026-10-23)
Scenario's free plan stopped after 7 jobs (not 12), so the day-1 queue landed in two parts.

Reviewed at the 1536x1024 original and listed in `art.js` (fingers counted on every hand, joints, headgear, singlet colors, caption nouns visible):
- TAKEDOWN_CONTROL: pass. Red behind and on top, chest on back, hands clasped under Green's waist, Green down on hands and knees.
- REF_POSITION_RED_TOP (fix): pass. Palm on the navel, far hand cupping the back of the elbow, Green's hands flat in front of the knees. Replaces the deformed-hand original and its CONTROL_RED copy.
- NEAR_FALL_EXPOSURE: pass. Half nelson (arm under the near arm, hand on the back of the head), Green bridging with the back toward the mat, one shoulder up, Red chest to chest.
- SIT_OUT_TIGHT: pass. Green seated with legs out, Red kneeling behind with the arm still around the waist, Green's hand on Red's hand.
- TURN_IN: pass. Green on his knees facing Red, arm around Red's lower back, Red off balance leaning back.

Rejected:
- HALF_NELSON (first render): Red's arm goes over Green's shoulder to the head instead of under the near arm. Not a half nelson. Redo.

Not generated yet (plan limit): TOP_RIDE, TOP_RIDE_GREEN, LEVEL_CHANGE, CLEAR_HANDS, REVERSAL_CONTROL, HALF_NELSON redo.

Interim mapping until those exist:
- CONTROL_GREEN (mirrored referee's position, flagged hands) remains the only Green-in-control picture: reversal step 4, Make the Call reversal answer, Score a Match green control. It is replaced by REVERSAL_CONTROL / TOP_RIDE_GREEN as soon as they pass review.
- TAKEDOWN_CONTROL stands in for TOP_RIDE (Red on top in control: near fall step 3, fall lesson step 1, technical fall, Score a Match red control). Same concept, so gate G4 holds.
- Takedown lesson keeps 5 frames (level change is described in step 3's caption and coach note until LEVEL_CHANGE exists). Escape keeps 3 frames (hand control is described in step 3 until CLEAR_HANDS exists).
- SIT_OUT and CONTROL_RED art files are deleted; the smoke test fails if they come back.
