# Wrestling Simulator

## Canonical path
`/wrestling/index.html`

The repository is structured for multiple sport simulators:
- `/wrestling/`
- `/bjj/`
- `/hockey/`
- `/soccer/`


## Audience
Neshaminy Youth Wrestling Club / ICWL families learning folkstyle wrestling.

## Implemented
- Kid-first Learn / Practice / You Make the Call flow
- Illustrated youth wrestlers with neutral / red-control / green-control poses
- Tested scoreboard and scoring history
- Takedown: 3
- Escape: 1
- Reversal: 2
- Near-fall lab with prerequisite gates and 2 / 3 / 4 point counts
- Technical-fall rule helper
- Resettable match state
- Parent/Coach teaching note
- Responsive mobile layout
- GitHub Actions regression workflow

## Rule boundaries
The code uses a versioned NFHS 2026-27 baseline for the implemented scoring concepts. NYWC / ICWL context remains separate, and unverified league-specific rules remain marked pending rather than guessed.

## Run tests
```bash
npm test
```

## Run locally
Serve the repository root with any static HTTP server and open `/wrestling/`.

## Layout (after the 2026-10-22 rebuild)

- `index.html`, `styles.css`, `app.js`: shell with four modes (Learn, Practice, Make the Call, Score a Match). Deep links: `#learn/<lessonId>/<step>`, `#practice`, `#call`, `#match`.
- `ui/figures.js`: rig-based youth wrestler renderer (joint map in, SVG group out). `ui/poses.js`: pose library for both wrestlers per frame. `ui/scene.js`: gym, mat, control marker, badges. `ui/lessons.js`: curriculum content, Make the Call items. Point values shown in the UI are read from `rules/nfhs-2026-27.js` at render time.
- `match-state.js`: `applyTransition`, `applyNearFall`, `applyFall`; the UI never adds points itself.
- `tools/pose-sheet.html`: contact sheet of every pose for checking body positions (`?f=SHOT,FINISH` to filter).
- Progress is stored in `localStorage` only (lesson completion and Make the Call tallies). No names, accounts or network calls.
