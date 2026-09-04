# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Spotify panels

The home page cave shows a "Recently Played" panel on the left and a top-5
artists/songs toggle on the right, from your Spotify account.

Data comes from a JSON snapshot that `.github/workflows/spotify.yml` refreshes
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
