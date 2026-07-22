// Vercel Cron — keeps the Instagram token alive automatically.
//
// Long-lived Instagram tokens last ~60 days. This runs daily (see vercel.json),
// refreshes the token, and stores the new value in Vercel KV so the feed keeps
// working with zero manual maintenance.
//
// This path is OPTIONAL. It only does something once a Vercel KV store is
// connected to the project. Without KV it's a harmless no-op, and you instead
// refresh the `IG_ACCESS_TOKEN` env var manually every ~50 days
// (see INSTAGRAM_SETUP.md).

const GRAPH = 'https://graph.instagram.com';

module.exports = async (req, res) => {
  try {
    const { kv } = await import('@vercel/kv');
    const current = (await kv.get('ig_access_token')) || process.env.IG_ACCESS_TOKEN;
    if (!current) {
      res.status(200).json({ ok: false, error: 'no_token' });
      return;
    }

    const url = `${GRAPH}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(current)}`;
    const r = await fetch(url);
    const json = await r.json();

    if (json.access_token) {
      await kv.set('ig_access_token', json.access_token);
      res.status(200).json({ ok: true, expires_in: json.expires_in });
    } else {
      res.status(200).json({ ok: false, error: (json.error && json.error.message) || 'refresh_failed' });
    }
  } catch (e) {
    // KV not configured (or unreachable) — nothing to refresh here.
    res.status(200).json({ ok: false, error: String(e) });
  }
};
