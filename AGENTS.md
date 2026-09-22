# Repository layout

This is a monorepo of independent projects. **There is no build at the repo
root.** Work inside the relevant project directory.

| Directory | Project |
| :-- | :-- |
| `website/` | Astro personal site + Cloudflare Worker. Deploys to GitHub Pages. |
| `07280-guide/` | Separate repo checked out here — see below. Not tracked by gamechanger. |
| `llmtrain/` | Gitignored working copy of an upstream repo. Leave it alone. |

Before editing, confirm which project you are in. A change under `website/` is
published to a live site by `.github/workflows/deploy.yml` on push to `main`.

## website/

Run every command from `website/`, not from the repo root:

```sh
cd website
npm install
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and
`astro dev logs`.

If you move or rename anything under `website/scripts/`, update
`.github/workflows/spotify.yml`, which invokes those scripts by path.

Full Astro documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## 07280-guide/

**Its own git repository**, cloned inside this folder and gitignored here. Commits
and pushes from that directory go to `github.com/Indiguana/07280-guide`, which
publishes to <https://indiguana.github.io/07280-guide/> via GitHub Pages on every
push to `main`. Do not try to commit it from the gamechanger root.

Plain static HTML, no build. Serve with `python3 -m http.server 4280`. See its own
`CLAUDE.md` for conventions.
