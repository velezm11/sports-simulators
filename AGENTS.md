# Agents guide

Read before any change:

1. `docs/SME-PLAYBOOK.md`: the panel of SME roles every task is reviewed through, and the hard gates that block a ship.
2. `docs/rules-sources.md`: what is verified, from where, and what is unresolved.
3. `BUILD-LOG.md`: what was done, what was found, what is pending. Append an entry for every PR.
4. `wrestling/README.md`: file layout and the art pipeline.

Commands: `npm test` (rules + match state), `npm run test:ui` (headless Chrome click-through; needs `python3 -m http.server 8765` and Chrome with `--remote-debugging-port=9333`).

Paths are fixed: `/wrestling/`, `/bjj/`, `/hockey/`, `/soccer/`. No versioned production paths. Deploy is automatic from `main`.
