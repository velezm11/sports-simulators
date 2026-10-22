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
