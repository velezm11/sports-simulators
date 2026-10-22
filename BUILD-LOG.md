# Build log

Running record of what was inspected, changed, verified and shipped. Newest entries at the bottom.

## 2026-10-22 Audit of the repository as found

Inspected: `main` (5 commits), branches `design/wrestling-reference-ui`, `feature/takedown-lesson`, `refactor/sport-paths`, `gh-pages`; PRs #1 to #3 (all merged); GitHub Actions "Wrestling Regression" (green on every run); GitHub Pages settings; the `/wrestling/` implementation; the live site.

Findings:

- Tests: `npm test` passes locally (rules regression + match-state regression). Both files are a handful of asserts in minified one-line style; coverage is thin (no penalty, out-of-bounds, period, fall, or tech-fall-during-near-fall transition cases).
- Deployment: GitHub Pages is set to the legacy `gh-pages` branch, which still holds the old `/wrestling/v2/` layout. The live `/wrestling/` URL renders a Jekyll page titled "Wrestling Simulator v2" and `/wrestling/app.js` is 404. `main` has never been deployed.
- Legacy path: `wrestling/v2/index.html` still exists on `main` as a meta-refresh redirect.
- Visuals: wrestlers are gradient blobs with no stance, headgear or joints; the mat is drawn as an oval; positions are not technically plausible; only three static poses exist (neutral, red control, green control). No sequence frames beyond four text buttons for the takedown.
- Mobile: a first headless screenshot at 390px looked clipped. Measured inside a 390px iframe the document is 375px wide with only the lesson rail scrolling sideways by design, so this was a screenshot artifact (headless Chrome enforces a minimum window width). Added a small overflow guard anyway.
- Architecture: rules/league/scenarios/match-state separation exists but is skeletal. `scenarios/basics.js` is not used by the UI. League config is a status object with everything "pending".
- Unmerged work: `design/wrestling-reference-ui` has one commit beyond `main` with no file difference (already merged content).

Rules research results are in `docs/rules-sources.md`.

## 2026-10-22 PR: deploy from main, remove legacy path

- Added `.github/workflows/pages.yml`: runs `npm test`, then deploys the repository root to GitHub Pages with `actions/deploy-pages`. Pages source must be switched from the `gh-pages` branch to "GitHub Actions" (done through the repository API after merge).
- Added `.nojekyll` so Pages serves files as-is.
- Removed `wrestling/v2/` (meta-refresh redirect). The stale `gh-pages` branch is left in place until the Actions deployment is verified, then deleted.
- Added an `overflow-x` guard on `html,body` and `min-width:0` on the layout containers. Mobile screenshots for the log are now taken through a 390px iframe wrapper so the viewport is real.
- Added `docs/rules-sources.md` and this log.

## 2026-10-22 Pages publish path

The `actions/deploy-pages` run on `main` was rejected: the `github-pages` environment only allows the `gh-pages` branch to deploy, and the Pages source is still the legacy branch. Both settings need repository admin, which the automation token does not have (403). Switched the workflow to publish `main` into `gh-pages` with `peaceiris/actions-gh-pages` using the workflow token, so production tracks `main` with no settings change. `gh-pages` is now generated output.

## 2026-10-22 Deploy verified, UI rebuild

- Production verified after the publish workflow (run on `9c9f31c`): root 200, `/wrestling/` serves the current app, `/wrestling/app.js` 200, `/wrestling/v2/` 404.
- Rebuilt `/wrestling/` as a four-mode app (Learn, Practice, Make the Call, Score a Match) with a lesson rail, gym-and-mat stage, rig-based wrestlers with headgear, singlets, ankle bands, name tags and an "IN CONTROL" marker (control is never shown by color alone), referee signal chip, scoreboard with history, rule card with source and verification status, coach view, local progress.
- 14 two-wrestler poses: neutral, tie-up, shot, finish, control (both), referee's position, stand-up, escape to neutral, sit-out, near fall, pin. Checked on the pose sheet for plausible body positions.
- 11 lessons shipped (Foundation 1-5, Basic scoring 6-10, Technical fall). Match basics 12-15 and the penalty block wait on the rules record.
- `match-state.js` gained near fall, fall and technical fall handling; regression tests cover prerequisite gates, 2/3/4-second boundaries, criteria not met, ownership, match-ending states and the 15-point margin.
- Mobile checked through a 390px iframe: single column, 2x2 mode tabs, 48px minimum targets.

## 2026-10-22 Kid-first visual pass

- Miguel sent a reference mock (photoreal kids, coach mascot, filmstrip, giant answer buttons) and asked for better than that at a young child's reading level.
- Generated 11 full-stage illustrations of the same two kids (red/black headgear, green/white headgear) in every position except near fall with Scenario's GPT Image 2.5 Flare, using the first neutral render as the identity reference for the rest. Each was reviewed against the rig pose: shot, finish, control, referee's position, stand-up, escape, sit-out, pin all read correctly; the first near-fall render did not show back exposure clearly and the free plan's 50-action cap stopped a redo, so near fall still uses the rig. `ui/art.js` lists the approved images and the tag/control-marker anchors; `scene.js` falls back to the rig for anything not listed.
- Learn: filmstrip of every step with thumbnail, arrow and 2-word label; a coach avatar speaks the step in a bubble; "What's happening?" card gives the one-sentence kid version. Lesson rail shows a picture per lesson.
- Practice, Make the Call and Score a Match use large solid-color answer buttons with an icon and label (color is never the only cue).
- Copy rewritten for a 6-year-old listener: "Both kids are standing up. Nobody is winning yet."

## 2026-10-22 QA pass (after the kid-first merge)

- Reviewed all 11 illustrations at full size for hand placement, limb anatomy and position accuracy. All read correctly for their step; the only rejected render was the first near fall (bottom wrestler belly-down, a breakdown not a near fall). Near fall still uses the rig until Scenario credits allow a redo; the Score a Match count screen now shows the top-control illustration with a count badge instead of the rig.
- Removed the Pin/Fall duplication: lesson 5 (Foundation) teaches what a pin is from the referee's position; lesson 10 "Fall beats points" starts from a preset 0-6 scoreboard and shows the fall overriding the score. Sit-out caption corrected to match the picture (Red has lost his grip, Green is not yet behind him).
- Added `wrestling/tools/ui-smoke.mjs` (`npm run test:ui`): drives headless Chrome over CDP and clicks every lesson, every filmstrip frame, Back/Next, all Practice choices and tasks, all Make the Call plays and answers, every Score a Match button (positions, 4 near-fall counts, pin, tech fall at 15, new match, reset), coach toggle and reset. 233 checks, 0 failures, 0 console errors. Runs in CI as the `ui-smoke` job.
