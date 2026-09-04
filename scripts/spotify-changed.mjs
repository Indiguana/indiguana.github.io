#!/usr/bin/env node
/**
 * Exits 0 when two snapshots differ in a way worth committing, 1 when they
 * don't. `fetchedAt` and `progressMs` are ignored: both change on every run
 * while music is playing, and neither is meaningful in a snapshot that can be
 * half an hour old by the time anyone loads the page.
 *
 *   node scripts/spotify-changed.mjs <old.json> <new.json>
 */
import { readFileSync } from "node:fs";

function normalise(path) {
	const o = JSON.parse(readFileSync(path, "utf8"));
	delete o.fetchedAt;
	if (o.nowPlaying) delete o.nowPlaying.progressMs;
	return JSON.stringify(o);
}

let a;
try {
	a = normalise(process.argv[2]);
} catch {
	process.exit(0); // no previous snapshot — always publish
}

try {
	process.exit(a === normalise(process.argv[3]) ? 1 : 0);
} catch (err) {
	console.error("could not read new snapshot:", err.message);
	process.exit(0);
}
