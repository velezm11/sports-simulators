# Wrestling Simulator v2

## Status
Merged to `main` as the current kid-first wrestling MVP.

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
- Root redirect at repository `index.html`
- GitHub Actions regression workflow

## Validation
Automated tests cover:
- valid and invalid takedown event conditions
- valid and invalid escape event conditions
- valid and invalid reversal event conditions
- state transitions
- score ownership
- duplicate-state no-score behavior
- reset behavior
- near-fall prerequisites
- 2 / 3 / 4 point near fall
- special fifth-point case
- 15-point technical-fall threshold
- ongoing near-fall technical-fall stop behavior

## Rule boundaries
The code uses a versioned NFHS 2026-27 baseline for the implemented scoring concepts.

NYWC / ICWL context is stored separately. League-specific items that have not yet been verified from an authoritative league source remain explicitly marked pending rather than guessed, including:
- period lengths
- overtime procedure
- age/division modifications
- league scoring overrides

Do not describe the simulator as a complete officiating engine until those league-specific items and the remaining rulebook areas are independently validated.

## Run tests
```bash
npm test
```

## Run locally
Serve the repository root with any static HTTP server and open `/wrestling/v2/`.
