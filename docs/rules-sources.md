# Rules sources and verification status

Rules hierarchy used by the Wrestling simulator (highest first):

1. NYWC published requirements
2. ICWL rules and league modifications
3. PIAA guidance (Pennsylvania)
4. USA Wrestling folkstyle guidance
5. NFHS rules when adopted or otherwise applicable

Nothing below is implemented from memory alone. Each item lists the source that was read, what it says, and whether it is verified, partially verified, or unresolved. "Verified" means the text was read directly from the source listed. It does not mean a certified official has reviewed the simulator.

## Sources read (2026-10-22)

| Id | Source | What it covers |
|----|--------|----------------|
| S1 | NFHS, "Wrestling Rules Changes - 2025-26" (nfhs.org/resources/sports/wrestling-rules-changes-2025-26, published 2025-06-02) | 5-11-2c / 5-11-4b near fall and technical fall wording; 7-1-5n leg block; 7-3-3 locked hands; signal changes |
| S2 | NFHS press release, "Adjustment in Minimum Body Fat Percentage for Females Highlights High School Wrestling Rules Changes" (2026-04-16), 2026-27 season | 18 changes; 7-6-3 stalling calls at the edge; 5-28-3 recovery time; five-second count signalled and vocalized |
| S3 | NFHS 2026-27 Official Wrestling Signals chart (PDF, dated 2026-05-29) | Names and numbers of the 28 official signals |
| S4 | NFHS 2024-25 Wrestling Penalty Chart (PDF) | Penalty progression for illegal holds, technical violations, unnecessary roughness, unsportsmanlike conduct, stalling, false starts |
| S5 | PIAA 2025-26 Wrestling Preseason Bulletin (PDF) | Junior high match length, overtime format, weight classes; PIAA adopts NFHS rules with listed modifications |
| S6 | USA Wrestling Rule Book (usawmembership.com/usa_wrestling_rule_book, 2027 edition) | Folkstyle events sanctioned by USAW follow NFHS rules; freestyle and Greco values are different and are not used here |
| S7 | Inter County Wrestling League site (intercountywrestlingleague.org, SportsEngine) | League structure, age divisions, "Modified PIAA rules", headgear required, USA Wrestling membership required |

Sites that were checked and are not usable: icwlwrestling.com and icwl.net (broken WordPress installs), neshaminyyouthwrestling.com (domain taken over by spam), nywc.org and nywcwrestling.com (unrelated organizations). No public NYWC rules page was found.

## Scoring (NFHS, applied through PIAA and ICWL)

| Rule | Value | Status | Source |
|------|-------|--------|--------|
| Takedown | 3 points, awarded when control is established from neutral | Verified value (NFHS 5-25, 3 points since 2024-25). Baseline carried from the existing engine and consistent with S1/S2 which do not change it | S1, S2, existing engine |
| Escape | 1 point | Verified value, unchanged in S1/S2 | existing engine, S1, S2 |
| Reversal | 2 points | Verified value, unchanged in S1/S2 | existing engine, S1, S2 |
| Near fall | 2 points at 2 seconds, 3 at 3 seconds, 4 at 4 seconds. A near fall requires control in a pinning situation with criteria met for 2 seconds or longer. Only one near fall is scored per pinning situation. The near fall ends when the defensive wrestler gets out of the pinning situation | Count values carried from the existing engine. Prerequisites and "one per pinning situation" verified in S1 (5-11-2) | S1 |
| Near fall extra point | Existing engine adds a 5th point on a 4-count under a "special" condition | Unresolved. The free sources do not state the condition. Kept as is, not expanded, not shown to children | existing engine |
| Technical fall | 15 point margin. If the near fall creates the 15 point advantage the match continues until near-fall criteria are no longer met; the conclusion is immediate | Verified in S1 (5-11-2c) | S1 |
| Fall (pin) | Both shoulders or scapulae held to the mat for the required count. Count length | Count length not verified from a free source. Teaching text says "held down for the count" and does not state seconds until verified | pending |

## Match flow

| Item | What the source says | Status |
|------|---------------------|--------|
| Period length (junior high, PIAA) | Regular matches 4:30 as three periods of 1:30. Consolation matches in tournaments 3:00 as three 1:00 periods. No rest between periods | Verified for PIAA junior high (S5). Not verified for ICWL youth divisions |
| Overtime (junior high, PIAA) | One 1:00 period, then two 30-second tiebreakers, then one 30-second ultimate tiebreaker if needed | Verified for PIAA junior high (S5). Not verified for ICWL |
| ICWL period length and overtime | Not published on the public site. League rules are distributed to registered coaches | Unresolved |
| ICWL age divisions (2026 championship) | PeeWee (born 2019 and later), Bantam (2017-2018), Midget (2015-2016), Junior (2013-2015), Intermediate (2011-2012). Girls division. Novice and Open brackets | Verified (S7) |
| ICWL rules base | "Modified PIAA rules". Headgear required. USA Wrestling membership required | Verified that this is the stated base (S7). The modifications themselves are unresolved |
| Out of bounds in neutral (2026-27) | When wrestling stops for out of bounds in the neutral position the referee makes one of these calls: stalling for leaving the wrestling area, stalling for pushing or pulling the opponent out, stalling for backing out, or wrestling action | Verified (S2, 7-6-3) |
| Five-second count | Referee signals and vocalizes a five-second count (2026-27) | Verified that the change exists (S2). The situations it applies to were not in the free text |

## Penalties (NFHS 2024-25 penalty chart, S4)

| Offense | Warning | 1st | 2nd | 3rd | 4th |
|---------|---------|-----|-----|-----|-----|
| Illegal holds and maneuvers (7-1) | none | 1 pt | 1 pt | 2 pts | Disqualify |
| Technical violations (7-3) | none | 1 pt | 1 pt | 2 pts | Disqualify |
| Unnecessary roughness (7-4-1) | none | 1 pt | 1 pt | 2 pts | Disqualify |
| Unsportsmanlike conduct during a match (7-4-2) | none | 1 pt | 1 pt | 2 pts | Disqualify |
| Stalling (7-6, 8-1-4) | warning | 1 pt | 1 pt | 2 pts | Disqualify (match stopped on the 4th offense; opponent gets choice of position) |
| False start or incorrect starting position (8-1-3) | two cautions | 1 pt for each later infraction | | | |

Notes from S4: points for unnecessary roughness, grasping clothing, or locking hands are awarded in addition to points earned. Technical violations include fleeing the mat (7-3-1), grasping clothing (7-3-2), interlocking hands (7-3-3), leaving the mat without permission (7-3-4), and reporting not properly equipped (7-3-5). The 2024-25 chart is the newest free copy; 2025-26 and 2026-27 changes read in S1 and S2 do not alter this progression.

Locked hands (7-3-3, as changed for 2025-26, S1): interlocking or overlapping the hands, fingers or arms around the opponent's body or both legs by the wrestler in the advantage position is a technical violation, unless the opponent has all weight supported on the feet, has been lifted off the mat, or has met near-fall criteria.

Leg block (7-1-5n, 2025-26, S1): leaving the feet and using the foot or leg to cut out an opponent's leg, including from the rear standing position, is illegal.

## Referee signals (S3, 2026-27)

1 Starting the match, 2 Stopping the match, 3 Time-out, 4 Start injury time, 5 Starting blood time-out, 6 Start recovery time, 7 Stop blood/injury/recovery time, 8 Neutral position, 9 Indicates no control, 10 Out-of-bounds, 11 Wrestler in control (left/right hand), 12 Defer choice, 13 Potentially dangerous, 14 Stalemate, 15 Caution (false start or incorrect starting procedure), 16 Stalling (16a neutral stalling back out, 16b neutral position wrestlers engaged, 16c pulling opponent out of bounds, 16d pushing opponent out of bounds), 17 Interlocking hands or grasping clothing, 18 Reversal, 19 Technical violation, 20 Illegal hold, 21 Near fall (three fingers shown like the "OK" sign per S1), 22 Awarding points, 23 Unsportsmanlike conduct, 24 Flagrant misconduct, 25 Coach misconduct, 26 Unnecessary roughness, 27 Default / technical fall / disqualification, 28 Start head, neck, cervical injury evaluation time.

## Unresolved list (do not implement as confirmed)

- ICWL period lengths by age division
- ICWL overtime procedure
- ICWL youth division modifications to PIAA/NFHS rules
- Any ICWL scoring overrides
- NYWC club-specific requirements
- Fall count duration and the near-fall extra point condition (need the NFHS rules book text or a certified official)
