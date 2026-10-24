# Avel aviation operations website

A responsive, single-page Avel marketing experience built from the reviewed visual direction. It preserves the long-form product story layout while applying the Avel black, white, and silver identity, YD Gothic typography, Lucide icons, and a draggable Cobe route globe.

## Run locally

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:4173`.

## Verify a production build

```bash
npm run build
npm run preview
```

The globe rotates through seven connected itineraries spanning North America, the Atlantic, Europe, the Gulf, Asia, and the Pacific before returning to North America. Airport markers, local departure and arrival times, calculated great-circle distances, and itinerary cards update together. The route courses use solid, color-tinted arcs with a traveling silver glint and moving position markers. The setup illustration uses the same traveling-glint motion on its connectors.

The itinerary is illustrative interface data, not live flight tracking or an operational flight plan.

## Workflow diagrams

The seven workflow demonstrations use `@lucasmarkes/hairline` 0.5.1 for their
isometric SVG diagrams. Request hubs, record drawers, coordination relays,
review layers, a quote loupe, recovery tiles, and aligned invoice lines appear
inside the existing preview card before the corresponding product artifacts.
The workflow clock cues Hairline's gestures, keeping each task at 2.5 seconds.
Figures are destroyed when a preview or tab changes. Pause, page visibility,
offscreen state, and reduced motion also control diagram playback.

Hairline is MIT licensed: https://github.com/lucasmarkes/hairline.
The optional `hairline-create` and `hairline-adopt` agent skills are installed
locally in the user's Codex skills directory; they are not shipped to visitors.
