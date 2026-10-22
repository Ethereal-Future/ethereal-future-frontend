# Viridian Frontend

Viridian is an open interface for discovering public-good projects, understanding their milestones, and choosing transparent contribution paths. This repository contains an original, dependency-free browser prototype that can grow into a wallet-connected application.

## Product goals

- **Clarity first:** show purpose, progress, target, and next milestone without requiring a wallet.
- **Evidence over hype:** surface measurable milestones rather than vague promises.
- **User-owned actions:** prepare contribution intents while leaving signing and custody to a future wallet adapter.

## Current implementation

- Responsive project discovery page with search, category filtering, and active/completed status filtering.
- Summary metrics for total projects, active goals, and tracked contribution targets.
- Project cards with progress bars, supporter counts, milestone completion, category labels, and accessible status text.
- Detail dialog explaining a project’s milestones and contribution path.
- Empty-state handling, keyboard-visible focus styles, and semantic progress indicators.

## Structure

```text
index.html       Semantic browser shell and project detail dialog
src/app.js       Rendering, filtering, metrics, and dialog interaction
src/projects.js  Local project model and selector helpers
src/styles.css   Responsive visual system and accessibility states
```

## Roadmap

1. Add a wallet adapter with explicit network and transaction review.
2. Replace local project data with the backend API.
3. Add verifiable milestone evidence links and activity history.
4. Add localization and reduced-motion preferences.

## Contribution workflow

Open or identify an issue, create a focused branch from `develop`, and submit a pull request back into `develop`. Include screenshots for visual changes and describe accessibility impact. Drips points or funding are determined by the applicable program and maintainers; a merged contribution is not a promise of rewards.

## License

MIT. See `LICENSE`.
