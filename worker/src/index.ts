/**
 * Optional live Spotify endpoint for the cave panels.
 *
 * The site normally gets its data from a JSON snapshot published by
 * .github/workflows/spotify.yml, which needs no hosting account. This Worker is
 * the alternative for when you want genuinely live now-playing instead of a
 * snapshot that is up to 30 minutes stale — deploy it and point
 * PUBLIC_SPOTIFY_ENDPOINT at it. See README.md.
 *
 * All the Spotify logic lives in ../../scripts/spotify-core.mjs so this and the
 * Actions script can't drift apart; this file is just the HTTP wrapper.
 */

import { buildSnapshot, type Snapshot } from "../../scripts/spotify-core.mjs";

interface Env {
	SPOTIFY_CLIENT_ID: string;
	SPOTIFY_CLIENT_SECRET: string;
	SPOTIFY_REFRESH_TOKEN: string;
}

const ALLOWED_ORIGINS = new Set([
	"https://indiguana.github.io",
	"http://localhost:4321",
	"http://127.0.0.1:4321",
]);

function corsHeaders(origin: string | null): Record<string, string> {
	const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://indiguana.github.io";
	return {
		"Access-Control-Allow-Origin": allowed,
		"Access-Control-Allow-Methods": "GET, OPTIONS",
		Vary: "Origin",
	};
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const cors = corsHeaders(request.headers.get("Origin"));

		if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
		if (request.method !== "GET") return new Response("Method not allowed", { status: 405, headers: cors });

		const snapshot: Snapshot = await buildSnapshot({
			clientId: env.SPOTIFY_CLIENT_ID,
			clientSecret: env.SPOTIFY_CLIENT_SECRET,
			refreshToken: env.SPOTIFY_REFRESH_TOKEN,
		});

		return new Response(JSON.stringify(snapshot), {
			headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "public, max-age=30" },
		});
	},
};
