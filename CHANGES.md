# D'ART site — updated files

These replace the matching files in your `timmykim89/dart` repo. Overwrite in place, keep everything else (api/, package.json, vercel.json, other assets).

## What changed this session
- **Color palette**: gold/brown accents → soft silver-gray (marquee, brand bar, buttons, hover states).
- **Menu**: full-screen dark drawer → compact white dropdown block, top-right, under the hamburger.
- **Home hero**: new two-line headline "Modern and Contemporary Art / Considered Guidance"; marquee text replaced with the mission statement (no diamond bullets), set in italic serif.
- **About**: "D'ART" heading replaced with the logo image; new intro line and founder bio (two paragraphs); photo strip gets bottom spacing; Contact band background changed to white (was matching the footer's tint, looked like one block) with tighter padding; footnote forced to one line.
- **Services**: removed the "Send Inquiry" button/section.
- **Social**: "cync" heading replaced with the cync logo (`assets/cync-logo.png` — new file, included here); the inline link removed from the paragraph, replaced with two standalone links (www.cync.art, @cync.official) below it.
- **Curatorial**: header reordered to eyebrow → title → handle line (matches other pages); title changed to "From the Field" so it doesn't repeat the "Curatorial View" eyebrow/nav label; nav label updated to "Curatorial View".
- **Footer**: brand bar text/slash removed (logo only, sized down slightly); copyright text moved from the menu into the footer under Contact; mobile layout gets a distinct background block for the info column instead of just stacking.

## Latest changes (URL/back-button/favicon)
- **Clean URLs**: `vercel.json` now sets `cleanUrls: true` — nav links point to `/about`, `/services`, `/social`, `/curatorial` (no `.html` in the address bar). Logo links to `/`.
- **Back button**: from any inner page, pressing Back always returns to Home (`/`), not whatever page you arrived from.
- **Favicon**: new `assets/favicon.png` (white background, black D'ART wordmark) — linked in every page's `<head>`.

## Steps

1. Copy `assets/cync-logo.png` into your repo's `assets/` folder (new file).
2. Overwrite `index.html`, `about.html`, `services.html`, `social.html`, `curatorial.html`, `css/style.css`, `js/main.js` with the versions here.
3. Commit and push.
