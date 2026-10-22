# Wrestling Simulator

## Canonical path
`/wrestling/index.html`

The repository is structured for multiple sport simulators:
- `/wrestling/`
- `/bjj/`
- `/hockey/`
- `/soccer/`

`/wrestling/v2/` is retained only as a compatibility redirect to `/wrestling/`.

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
