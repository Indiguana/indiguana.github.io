#!/usr/bin/env node
/**
 * Publishes a Spotify snapshot for the cave panels.
 *
 *   node scripts/fetch-spotify.mjs [outfile]
 *
 * Reads SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET / SPOTIFY_REFRESH_TOKEN from
 * the environment (GitHub Actions secrets in CI), falling back to
 * worker/.dev.vars locally so it can be run by hand without exporting secrets.
 *
 * Exits 0 even when Spotify is unreachable — it writes a snapshot with empty
 * fields, which the page renders as "no panels" rather than as an error.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildSnapshot } from "./spotify-core.mjs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = resolve(process.argv[2] ?? join(ROOT, "spotify.json"));

function fromDevVars() {
	try {
		const vars = {};
		for (const line of readFileSync(join(ROOT, "worker", ".dev.vars"), "utf8").split("\n")) {
			const m = /^\s*([A-Z_]+)\s*=\s*(.*)$/.exec(line);
			if (m && m[2]) vars[m[1]] = m[2].trim();
		}
		return vars;
	} catch {
		return {};
	}
}

const dev = fromDevVars();
const snapshot = await buildSnapshot({
	clientId: process.env.SPOTIFY_CLIENT_ID ?? dev.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? dev.SPOTIFY_CLIENT_SECRET,
	refreshToken: process.env.SPOTIFY_REFRESH_TOKEN ?? dev.SPOTIFY_REFRESH_TOKEN,
});

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(snapshot, null, 2)}\n`);

const np = snapshot.nowPlaying;
console.log(`wrote ${OUT}`);
console.log(`  nowPlaying: ${np ? `${np.title} — ${np.artist} (playing=${np.isPlaying})` : "null"}`);
console.log(`  topArtists: ${snapshot.topArtists.length}, topTracks: ${snapshot.topTracks.length}`);
