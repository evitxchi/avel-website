# Reusable UI components

This repository is a single-route static HTML/CSS/JavaScript site. It has no React/Vue/Svelte component library, component directory, or shared primitives. The site header, mega menu, mobile navigation, section cards, and footer are written inline in `index.html`. Their complete layout markup is recorded in `layouts.md`; page-wide markup and control structure are in `index.html`. Keep existing interactive elements and their labels when reproducing the current baseline.

## Controls present in the page

- Navigation triggers and menu links are inline in `index.html`.
- Demo forms, story navigation, FAQ toggles, calculator fields, and dialog controls are inline in `index.html`.
- Their behavior is implemented in `main.js`.

No separately reusable source component is available for extraction.
