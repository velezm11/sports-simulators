# Sports Simulators

Kid-first interactive sports learning simulators for families.

| Sport | Path | Status |
|-------|------|--------|
| Wrestling | `/wrestling/` | Live, reference implementation |
| BJJ | `/bjj/` | Coming next |
| Hockey | `/hockey/` | Planned |
| Soccer | `/soccer/` | Planned |

Production: https://velezm11.github.io/sports-simulators/

## Develop

```bash
npm test                      # rules + match-state regression
python3 -m http.server 8765   # then open http://localhost:8765/wrestling/
```

Deployment is GitHub Pages from `main` through `.github/workflows/pages.yml` (tests run first). `.nojekyll` keeps Pages from running Jekyll on the static files.

See `BUILD-LOG.md` for the running engineering log and `docs/rules-sources.md` for the rules verification record.
