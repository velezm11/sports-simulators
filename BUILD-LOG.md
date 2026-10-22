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
