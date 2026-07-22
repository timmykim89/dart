// Vercel Cron — keeps the Instagram token alive automatically.
//
// Long-lived Instagram tokens last ~60 days. This runs daily (see vercel.json),
// refreshes the token, and stores the new value in a Redis store (Upstash), so
// the feed keeps working with zero manual maintenance.
//
// Requires a Redis store connected to the project (KV_REST_API_* or
// UPSTASH_REDIS_REST_* env vars). Without it, this is a harmless no-op and you
// instead refresh the IG_ACCESS_TOKEN env var manually every ~50 days.

const GRAPH = 'https://graph.instagram.com';

function redisEnv() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

async function redisCmd(cmd) {
  const env = redisEnv();
  if (!env) return null;
  const r = await fetch(env.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
  });
  const j = await r.json();
  return j.result;
}

module.exports = async (req, res) => {
  if (!redisEnv()) {
    res.status(200).json({ ok: false, error: 'no_redis' });
    return;
  }
  try {
    const current = (await redisCmd(['GET', 'ig_access_token'])) || process.env.IG_ACCESS_TOKEN;
    if (!current) {
      res.status(200).json({ ok: false, error: 'no_token' });
      return;
    }

    const url = `${GRAPH}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(current)}`;
    const r = await fetch(url);
    const json = await r.json();

    if (json.access_token) {
      await redisCmd(['SET', 'ig_access_token', json.access_token]);
      res.status(200).json({ ok: true, expires_in: json.expires_in });
    } else {
      res.status(200).json({ ok: false, error: (json.error && json.error.message) || 'refresh_failed' });
    }
  } catch (e) {
    res.status(200).json({ ok: false, error: String(e) });
  }
};
