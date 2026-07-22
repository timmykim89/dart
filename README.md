# D'ART — Seoul art advisory

Marketing site for D'ART, a Seoul-based art advisory. Static, self-contained
multi-page site (HTML/CSS/JS) — no build step, no framework.

## Pages
- `index.html` — Home (overlay nav, marquee, full-bleed hero)
- `about.html` — About / founder
- `services.html` — Services
- `social.html` — Social Contribution (cync)
- `curatorial.html` — Curatorial (Instagram-style grid)

Shared chrome (header, drawer, footer, brand bar) is injected by `js/main.js`,
so the markup lives in one place and the pages still open from `file://`.

## Run locally
```bash
python3 -m http.server 8899
# open http://localhost:8899
```

## Production TODO
1. **Curatorial grid** — `loadFeed()` in `curatorial.html` returns placeholder
   images. Swap it for a live pull of `@dartseoul` via the Instagram Graph API
   (or a feed-embedding service). The grid renders identically; only the image
   source changes.
2. **Newsletter** — the form shows a local thank-you but has no backend. Wire
   the submit handler in `js/main.js` to a real email service.

## Assets
All images live in `assets/`. Fonts: Cormorant Garamond + DM Sans (Google Fonts).
