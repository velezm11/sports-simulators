# SME playbook for the Wrestling simulator

Every task on this repository is run as a panel review. The agent takes each role below in turn, writes the role's findings in the PR description, and does not ship until every hard gate passes. The order matters: rules before pictures, pictures before copy, copy before layout.

## Roles

| # | Role | Owns | Asks |
|---|------|------|------|
| 1 | Wrestling rules SME | Point values, triggers, prerequisites, exceptions, match-ending states | Is every rule traced to `docs/rules-sources.md`? Is anything unresolved shown as if verified? |
| 2 | Certified official (referee) | Signals, calls, timing of awards, what the referee is actually watching | Would a referee award this at this moment? Is the signal named correctly? |
| 3 | Youth wrestling coach (K-8 folkstyle) | Technique plausibility, hand placement, body position, sequence order | Is this how the move looks on a real mat? Is each hand where a coach would put it? |
| 4 | Illustration QA | Generated art: anatomy, consistency, position, re-use | Hands, fingers, limbs, headgear, singlet colors correct at full size? Same two kids in every frame? One picture per concept? |
| 5 | Child-learning SME (ages 5-10) | One idea per step, concrete words, repetition | Can a 6-year-old say back what happened after reading one caption? |
| 6 | Parent-education SME | Coach view, rule card, sources | Can a parent explain the call to their child from the side panel? |
| 7 | Kids UX / interaction designer | Targets, hierarchy, filmstrip, bubbles, feedback | Is the next tap obvious? Is any text smaller than 13px or any target under 48px? |
| 8 | Accessibility SME | Contrast, focus, text alternatives, motion, color-independence | Is control ever shown by color alone? Do all controls work by keyboard? |
| 9 | Youth sports safety SME | What the simulator must not encourage | Any illegal or dangerous hold shown as normal? |
| 10 | Software architecture SME | Rules vs UI separation, league config, deploy | Does any UI code add points on its own? Does the deploy path still publish main? |
| 11 | QA / rules regression SME | `npm test`, `npm run test:ui`, no regression | Did every existing behavior survive? Is the new behavior covered? |
| 12 | Child privacy SME | Data, accounts, network | Any new storage, request or identifier? |
| 13 | Educational game designer | Modes, progression, reward | Does Learn, Practice, Make the Call, Score a Match each add something? |

## Procedure for every task

1. Read `AGENTS.md`, this file, `docs/rules-sources.md`, `BUILD-LOG.md`.
2. Reproduce the reported problem on the live URL at phone width (390px iframe) and desktop. Write the list before touching code.
3. Rules first (roles 1, 2): confirm or mark unresolved. Never implement from memory.
4. Pictures (roles 3, 4): see the image gates below.
5. Copy (roles 5, 6): one sentence per step for kids, one paragraph per step for adults.
6. Layout and interaction (roles 7, 8): check desktop and 390px screenshots.
7. Tests (role 11): `npm test` and `npm run test:ui` locally; extend `ui-smoke.mjs` for every new control.
8. PR with a role-by-role findings table, screenshots, and the gate checklist ticked. Merge only when CI is green. Verify the live URL after the publish run.
9. Append to `BUILD-LOG.md`.

## Hard gates (ship blockers)

- G1 Every rule value in the UI is read from `wrestling/rules/*.js`; no literal points in UI code or copy.
- G2 Every lesson frame has an illustrated picture listed in `wrestling/ui/art.js`. The rig renderer is a development tool only; it must not appear on the live site.
- G3 Image review at full size (1536x1024 original) before listing in `art.js`: count fingers on every visible hand, check each joint bends the right way, check headgear and singlet colors per wrestler, confirm the position matches the caption and the coach note. Record the review in the PR.
- G4 One picture, one concept. The same image may be reused only when the concept is identical (the referee's position for "Top" and "Bottom" is allowed because both describe that position; it is not allowed as "takedown finish" or "active control").
- G5 Caption-vs-picture: a reviewer reads each caption and confirms every noun in it is visible in the picture (who is on top, which hand, back exposure, feet on mat).
- G6 Control is never shown by color alone: marker plus text chip plus caption.
- G7 Touch targets 48px or larger, text 13px or larger, visible focus ring, no iOS text-selection on tap.
- G8 `npm test` and `npm run test:ui` green locally and in CI.
- G9 Unresolved rules stay labeled unresolved in the UI (status pill) and in `docs/rules-sources.md`.
- G10 No new personal data, accounts, or network calls.

## Image generation recipe (role 4)

Scenario model `model_openai-gpt-image-2-5-flare`, 1536x1024, quality medium. The neutral render (`asset_VCQheNmqZMHchCmfvKPjoLzK`) is the identity reference for both kids; pass it plus the closest approved pose as `referenceImages` and describe the position in plain English: who is on top, each hand's grip, where the knees and feet are, where the head is, what the bottom wrestler's back is doing. Generate, download the original, review under G3, and only then resize to 1350x900 JPEG in `wrestling/art/poses/` and add anchors in `ui/art.js`. The free plan gives 50 credits a day (about 12 images).
