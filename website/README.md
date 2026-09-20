# indiguana.github.io

My personal site. Astro, deployed to GitHub Pages by
`.github/workflows/deploy.yml` (which builds with `path: ./website`).

```sh
npm install
npm run dev      # localhost:4321
npm run build    # -> dist/
npm run preview
```

Pages live in `src/pages/`; components in `src/components/`; static assets in
`public/`.

## Spotify panels

The home page cave shows a "Recently Played" panel on the left and a top-5
artists/songs toggle on the right, from your Spotify account.

Data comes from a JSON snapshot that `.github/workflows/spotify.yml` (at the repo root) refreshes
every 30 minutes and publishes to the `spotify-data` branch; the page fetches it
from `raw.githubusercontent.com` at runtime. No hosting account is involved.

Because a snapshot can be ~30 minutes old (plus a 5-minute CDN cache), the left
panel is labelled **Recently Played** with a relative timestamp rather than
claiming live playback. Top 5 is unaffected — it moves over weeks. Spotify has
no listening-time endpoint, so there is deliberately no weekly-minutes stat.

### Setup

1. Create an app at <https://developer.spotify.com/dashboard> (Web API), with
   redirect URI `http://127.0.0.1:8899/callback`.
2. Put the client id and secret in `worker/.dev.vars` (gitignored).
3. `SPOTIFY_AUTH_PORT=8899 node scripts/spotify-auth.mjs` — approve in the
   browser. The refresh token is written into `.dev.vars`, never printed.
4. Add all three as **repository secrets** (Settings → Secrets and variables →
   Actions): `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`,
   `SPOTIFY_REFRESH_TOKEN`.
5. Run the workflow once by hand (Actions → Refresh Spotify snapshot → Run
   workflow) to create the `spotify-data` branch.

Preview locally without any of the GitHub setup — this reads `.dev.vars`
directly:

```sh
node scripts/fetch-spotify.mjs public/spotify.json
PUBLIC_SPOTIFY_ENDPOINT=/spotify.json npm run dev
```

### Genuinely live instead of a snapshot

`worker/` holds an optional Cloudflare Worker that serves the same payload on
demand, so now-playing is real rather than up to half an hour old. It shares all
its logic with the snapshot script via `scripts/spotify-core.mjs`. Deploy it and
set the `PUBLIC_SPOTIFY_ENDPOINT` repo variable to its URL. See
`worker/README.md`. Not required — the snapshot path is the default.
