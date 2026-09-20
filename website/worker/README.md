# spotify-panels worker

Feeds the "Now Listening" and "Top 5" panels on the home page cave.

The site is a static GitHub Pages build, so it has nowhere safe to keep a Spotify
refresh token. This Worker holds the credentials and exposes one public GET
endpoint returning already-trimmed JSON. Nothing secret reaches the browser.

## Setup

**1. Create the Spotify app**

At <https://developer.spotify.com/dashboard>, create an app (Web API), and add
`http://127.0.0.1:8888/callback` as a redirect URI. Spotify rejects `localhost`
here — it has to be the loopback IP. Note the client ID and secret.

If something already occupies port 8888 (Jupyter, commonly), use another and
register that URI instead — see step 2.

**2. Put the client credentials in `worker/.dev.vars`** (gitignored):

```
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_REFRESH_TOKEN=
```

**3. Mint a refresh token** — once, from the repo root (this is the only step
that needs a browser):

```sh
node scripts/spotify-auth.mjs
# or, if 8888 is taken (register the matching redirect URI first):
SPOTIFY_AUTH_PORT=8899 node scripts/spotify-auth.mjs
```

It reads the client id/secret from `.dev.vars` so they stay out of shell
history, prints the redirect URI to register and an authorize URL to open, and
after you approve, writes the refresh token straight into `.dev.vars`. It is
never printed, so it stays out of terminal scrollback and logs.

Scopes granted: `user-read-currently-playing`, `user-read-playback-state`,
`user-top-read`, `user-read-recently-played`.

**4. Check it locally** — `npx wrangler dev`, then from the repo root:

```sh
PUBLIC_SPOTIFY_ENDPOINT=http://127.0.0.1:8787 npx astro dev
```

**5. Deploy**

```sh
npx wrangler login
./push-secrets.sh      # pipes all three from .dev.vars without echoing them
npx wrangler deploy
```

Then point the site at the resulting URL by setting `PUBLIC_SPOTIFY_ENDPOINT`
— in `.env` locally, and as a repository *variable* (not a secret; it's a public
URL) named `PUBLIC_SPOTIFY_ENDPOINT` for the GitHub Pages build.

## Local development

```sh
npm install
npx wrangler dev      # http://localhost:8787
```

`wrangler dev` reads the three credentials from `.dev.vars`. With them blank the
Worker still answers 200 with an empty payload, which is a useful way to check
the page's degraded state.

CORS allows `https://indiguana.github.io` plus `localhost:4321` and
`127.0.0.1:4321` for the Astro dev server. Adding an origin means editing
`ALLOWED_ORIGINS` in `src/index.ts`.

## Response shape

```jsonc
{
  "nowPlaying": {
    "isPlaying": true,          // false when this is the last-played fallback
    "title": "...", "artist": "...", "album": "...",
    "art": "https://i.scdn.co/...", "url": "https://open.spotify.com/track/...",
    "progressMs": 61000, "durationMs": 214000
  },
  "topArtists": [{ "name": "...", "sub": "Alt Rock", "art": "...", "url": "..." }],
  "topTracks":  [{ "name": "...", "sub": "Artist name", "art": "...", "url": "..." }]
}
```

`nowPlaying` is `null` and the arrays are empty when Spotify can't be reached.
The page treats that as "hide the panel", so a dead Worker just gives you the
plain cave.

## Notes

- When nothing is playing, Spotify's currently-playing endpoint returns **204
  with an empty body**. The Worker falls back to the most recent track, which
  the page labels "Last played".
- Top artists/tracks use `time_range=short_term` (~last 4 weeks) and are cached
  for an hour, so 30-second polling doesn't spend the rate limit on data that
  changes weekly.
- Spotify has no listening-time endpoint, so there is deliberately no weekly
  minutes stat. The only real source for that would be Last.fm.
