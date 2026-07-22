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

## Instagram feed (Curatorial page)
The Curatorial grid pulls live from `@dartseoul` via a Vercel serverless
function that keeps the access token server-side:
- `api/instagram.js` — fetches + normalizes the latest posts (edge-cached).
- `api/refresh.js` + `vercel.json` cron — optional daily token auto-refresh
  (needs a Vercel KV store; without it, refresh the token manually).
- `curatorial.html` shows placeholder images instantly and swaps in the live
  feed, so it never looks broken before the token is set.

**One-time setup:** see [`INSTAGRAM_SETUP.md`](INSTAGRAM_SETUP.md) — create a
Meta app, get a long-lived token, and add it as `IG_ACCESS_TOKEN` in Vercel.

## Inquiry
"Send Inquiry" (About/Services) and the brand-bar email icon are `mailto:`
links to `timmykim@dartseoul.com` — clicking opens the visitor's mail app.

## Newsletter
The footer form shows a local thank-you but has no backend yet. Wire the submit
handler in `js/main.js` to a real email service when ready.

## Assets
All images live in `assets/`. Fonts: Cormorant Garamond + DM Sans (Google Fonts).
