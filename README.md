# gamechanger

A monorepo for my projects. Each lives in its own directory and is
self-contained — there is no shared build, no workspace tooling, and nothing at
the root that any one project depends on.

| Directory | What it is | Stack |
| :-- | :-- | :-- |
| [`website/`](website/) | My personal site, deployed to GitHub Pages at [indiguana.github.io](https://indiguana.github.io) | Astro, plus an optional Cloudflare Worker |
| [`07280-guide/`](07280-guide/) | A study guide rebuilding CMU 07-280 (Intro to AI & ML) from the course notes | Static HTML, KaTeX |
| `llmtrain/` | Working copy of *LLMs from Scratch*. Gitignored — it is 2.2 GB and carries its own `.git`. | Python |

## Running each project

```sh
# website — dev server on :4321
cd website && npm install && npm run dev

# 07280-guide — no build step
cd 07280-guide && python3 -m http.server 4280
```

## Deployment

Only `website/` deploys. `.github/workflows/deploy.yml` builds it with
`withastro/action@v3` pointed at `path: ./website`, and
`.github/workflows/spotify.yml` refreshes a Spotify snapshot every 30 minutes
onto the detached `spotify-data` branch.

The deploy workflow is filtered to `paths: website/**`, so committing any other
project here will **not** rebuild the site. That matters: each site build makes
~148 SteamGridDB calls. Trigger one by hand from the Actions tab if you ever
need to.

**If you add another project that needs CI, give it its own workflow with its
own `paths:` filter** so the two never trigger each other.
