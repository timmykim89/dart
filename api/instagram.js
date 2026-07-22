// Vercel serverless function — live Instagram feed for @dartseoul.
//
// Holds the access token server-side (never exposed to the browser), fetches
// the account's latest media from the Instagram Graph API, and returns a
// normalized list the Curatorial grid renders as-is.
//
// Token source, in order of preference:
//   1. Vercel KV key `ig_access_token` — kept fresh by the daily refresh cron
//      (api/refresh.js). This is the zero-maintenance path.
//   2. The `IG_ACCESS_TOKEN` environment variable — a long-lived token you
//      paste into Vercel. Works on its own; lasts ~60 days between refreshes.
//
// See INSTAGRAM_SETUP.md for how to obtain the token.

const GRAPH = 'https://graph.instagram.com';
const FIELDS = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp';
const LIMIT = 15; // grid shows up to 15 cells

async function getToken() {
  // KV is optional. If it isn't configured, this quietly falls through to env.
  try {
    const { kv } = await import('@vercel/kv');
    const t = await kv.get('ig_access_token');
    if (t) return t;
  } catch (_) {
    /* KV not set up — use the env token */
  }
  return process.env.IG_ACCESS_TOKEN || null;
}

module.exports = async (req, res) => {
  const token = await getToken();
  if (!token) {
    // Not configured yet — the frontend keeps its placeholder grid.
    res.status(200).json({ ok: false, error: 'no_token', data: [] });
    return;
  }

  try {
    const url = `${GRAPH}/me/media?fields=${FIELDS}&limit=${LIMIT}&access_token=${encodeURIComponent(token)}`;
    const r = await fetch(url);
    const json = await r.json();

    if (json.error) {
      res.status(200).json({ ok: false, error: json.error.message, data: [] });
      return;
    }

    const data = (json.data || [])
      .map((m) => ({
        src: m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url,
        href: m.permalink,
        alt: (m.caption || '').replace(/\s+/g, ' ').trim().slice(0, 120),
      }))
      .filter((m) => m.src);

    // Edge-cache so the grid is instant and we stay well under rate limits:
    // serve cached for 30 min, revalidate in the background for another hour.
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    res.status(200).json({ ok: true, data });
  } catch (e) {
    res.status(200).json({ ok: false, error: String(e), data: [] });
  }
};
