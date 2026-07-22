// Vercel serverless function — live Instagram feed for @dartseoul.
//
// Holds the access token server-side (never exposed to the browser), fetches
// the account's latest media from the Instagram Graph API, and returns a
// normalized list the Curatorial grid renders as-is.
//
// Token source, in order of preference:
//   1. A Redis-stored token (kept fresh by the daily refresh cron, api/refresh.js).
//      Works with an Upstash Redis store connected on Vercel — reads either the
//      KV_REST_API_* or UPSTASH_REDIS_REST_* env vars, whichever is present.
//   2. The IG_ACCESS_TOKEN environment variable — a long-lived token you paste
//      into Vercel. Works on its own; lasts ~60 days between refreshes.
//
// See INSTAGRAM_SETUP.md for how to obtain the token / set up auto-refresh.

const GRAPH = 'https://graph.instagram.com';
const FIELDS = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp';
const LIMIT = 15; // grid shows up to 15 cells

function redisEnv() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

// Minimal Upstash REST call: POST the store URL with a single Redis command
// as a JSON array, e.g. ['GET', 'ig_access_token'] -> { result: '...' }.
async function redisCmd(cmd) {
  const env = redisEnv();
  if (!env) return null;
  try {
    const r = await fetch(env.url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(cmd),
    });
    const j = await r.json();
    return j.result;
  } catch (_) {
    return null;
  }
}

async function getToken() {
  const stored = await redisCmd(['GET', 'ig_access_token']);
  if (stored) return stored;
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
