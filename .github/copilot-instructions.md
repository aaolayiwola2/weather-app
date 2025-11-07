## Purpose
Help AI coding agents understand and work productively on this small static Frontend Mentor "Weather app" project.

Keep responses short and actionable. Prefer edits that are minimal and safe for a beginner-friendly static site.

## Big picture
- This is a static, Tailwind-based front-end project (no backend code in repo).
- Key files:
  - `src/index.html` — app UI and layout (Tailwind utility classes, absolute `/assets` paths).
  - `src/scripts.js` — vanilla DOM manipulation and UI behavior (dropdowns, toggles).
  - `src/output.css` — built CSS referenced by the page; `input.css` is the Tailwind source.
  - `tailwind.config.js` — custom color palette, fonts and grid-area definitions.
  - `assets/` — images and local fonts (fonts are stored under `assets/fonts/*`).

## Why things are structured this way
- The project is designed as a single-page static UI using Tailwind utilities and local assets. JavaScript is small and DOM-focused; fetch calls to weather APIs (Open-Meteo) are expected to be added to `src/scripts.js`.
- Styles are prebuilt into `src/output.css`. Editing `input.css` or `tailwind.config.js` requires re-running the Tailwind build to regenerate `output.css`.

## Common developer workflows (how to run / rebuild)
- Quick test/debug: open `src/index.html` in the browser (served via disk or a static server). No compiled build step is required if you only view the existing `output.css`.
- Rebuild Tailwind CSS (if you change `input.css` or `tailwind.config.js`):
  - Recommended (PowerShell):
    - npx tailwindcss -i ./src/input.css -o ./src/output.css --watch
  - Or build once:
    - npx tailwindcss -i ./src/input.css -o ./src/output.css --minify
- There are no tests or linters configured in the repo. Avoid adding new build tooling unless necessary.

## Project-specific code patterns and conventions
- DOM toggles use Tailwind visibility classes (example: `units-dropdown` toggles the `invisible` class in `src/scripts.js`). When changing visibility, prefer toggling Tailwind utility classes rather than changing inline styles.
- Selectors and behavior live in `src/scripts.js`. Common selectors: `.units`, `.units-dropdown`, `.search-field`, `.dropdown-day`. Be conservative when renaming classes — update both HTML and JS.
- Paths in `index.html` use absolute `/assets/...` for images and fonts; keep that convention when adding assets.
- Tailwind custom tokens are defined in `tailwind.config.js` (colors like `Neutral800`, fonts like `BricolageGrotesque`). Use those tokens rather than hard-coded values.

## Integration and external APIs
- The README references the Open-Meteo API for weather data; the codebase currently does not include API calls. If you add network requests, place them in `src/scripts.js` and keep responses local to the UI (no server code expected).
- Be mindful of CORS when testing API calls from `file://` — use a simple static server (e.g., `npx http-server` or `npx serve`) when testing fetches.

## Safety and scope of edits
- Keep changes small and reversible. This repo is a learning challenge; prefer clear, minimal diffs and preserve readability for learners.
- Do not introduce new build pipelines or CI without user consent. Adding tiny helper scripts (npm scripts) is acceptable only after asking.

## Examples of helpful edits
- Implement a small, well-documented fetch in `src/scripts.js` that calls Open-Meteo and updates the `.city` and temperature display.
- Add a toggle handler that closes dropdowns when clicking outside — follow existing `stopPropagation` pattern.

## Files to reference when working
- `src/index.html` — structure and classes
- `src/scripts.js` — existing JS behaviors
- `src/input.css` and `src/output.css` — Tailwind source and built stylesheet
- `tailwind.config.js` — tokens and layout conventions
- `assets/` — images and local font files

If anything above is unclear or you want more detail (example API keys, preferred dev-server, or to add npm scripts), tell me which area to expand and I will iterate.
