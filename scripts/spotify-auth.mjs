#!/usr/bin/env node
/**
 * One-time helper to mint a Spotify refresh token for the cave panels Worker.
 *
 *   node scripts/spotify-auth.mjs
 *
 * Reads the client id/secret from worker/.dev.vars (gitignored) so they never
 * land in shell history; the environment overrides that if you'd rather.
 *
 * Your Spotify app must list the redirect URI this prints (by default
 * http://127.0.0.1:8888/callback; set SPOTIFY_AUTH_PORT to change the port).
 * Spotify no longer accepts "localhost" there — it has to be the loopback IP.
 *
 * The refresh token is a long-lived credential, so it is written straight into
 * worker/.dev.vars and never printed. Push it to production with
 * `worker/push-secrets.sh`, which pipes it without echoing it either.
 */

import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DEV_VARS = join(dirname(dirname(fileURLToPath(import.meta.url))), "worker", ".dev.vars");

function readDevVars() {
	try {
		const vars = {};
		for (const line of readFileSync(DEV_VARS, "utf8").split("\n")) {
			const match = /^\s*([A-Z_]+)\s*=\s*(.*)$/.exec(line);
			if (match && match[2]) vars[match[1]] = match[2].trim();
		}
		return vars;
	} catch {
		return {};
	}
}

const devVars = readDevVars();
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID ?? devVars.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET ?? devVars.SPOTIFY_CLIENT_SECRET;
/* Port 8888 collides with Jupyter often enough to be worth overriding:
   SPOTIFY_AUTH_PORT=8899 node scripts/spotify-auth.mjs
   Whatever you pick, the matching redirect URI must be registered on the
   Spotify app — the script prints it below so you can copy it across. */
const PORT = Number(process.env.SPOTIFY_AUTH_PORT ?? 8888);
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;

const SCOPES = [
	"user-read-currently-playing",
	"user-read-playback-state",
	"user-top-read",
	"user-read-recently-played",
].join(" ");

if (!CLIENT_ID || !CLIENT_SECRET) {
	console.error("No Spotify client id/secret found.");
	console.error(`Fill SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET into ${DEV_VARS},`);
	console.error("or pass them in the environment. Create the app at https://developer.spotify.com/dashboard");
	process.exit(1);
}

const state = randomBytes(16).toString("hex");

const authUrl =
	"https://accounts.spotify.com/authorize?" +
	new URLSearchParams({
		response_type: "code",
		client_id: CLIENT_ID,
		scope: SCOPES,
		redirect_uri: REDIRECT_URI,
		state,
	});

async function exchange(code) {
	const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
	const res = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			Authorization: `Basic ${basic}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			grant_type: "authorization_code",
			code,
			redirect_uri: REDIRECT_URI,
		}),
	});
	const json = await res.json();
	if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(json)}`);
	return json;
}

const server = createServer(async (req, res) => {
	const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
	if (url.pathname !== "/callback") {
		res.writeHead(404).end("Not found");
		return;
	}

	const error = url.searchParams.get("error");
	if (error) {
		res.writeHead(400, { "Content-Type": "text/plain" }).end(`Spotify returned an error: ${error}`);
		console.error(`Authorization denied: ${error}`);
		server.close();
		process.exit(1);
	}

	if (url.searchParams.get("state") !== state) {
		res.writeHead(400, { "Content-Type": "text/plain" }).end("State mismatch — start over.");
		console.error("State mismatch. Aborting.");
		server.close();
		process.exit(1);
	}

	try {
		const token = await exchange(url.searchParams.get("code"));
		if (!token.refresh_token) throw new Error("Spotify returned no refresh_token");

		/* Written, never printed — keeping it off the terminal and out of logs. */
		const current = readFileSync(DEV_VARS, "utf8");
		const line = `SPOTIFY_REFRESH_TOKEN=${token.refresh_token}`;
		const updated = /^SPOTIFY_REFRESH_TOKEN=.*$/m.test(current)
			? current.replace(/^SPOTIFY_REFRESH_TOKEN=.*$/m, line)
			: `${current.replace(/\n*$/, "")}\n${line}\n`;
		writeFileSync(DEV_VARS, updated);

		res.writeHead(200, { "Content-Type": "text/plain" }).end("Done — you can close this tab.");
		console.log(`\nRefresh token written to ${DEV_VARS} (not printed).`);
		console.log("Next:  cd worker && npx wrangler dev\n");
	} catch (err) {
		res.writeHead(500, { "Content-Type": "text/plain" }).end("Token exchange failed — check the terminal.");
		console.error("Token exchange failed:", err.message);
		server.close();
		process.exit(1);
	}

	server.close();
});

server.on("error", (err) => {
	if (err.code === "EADDRINUSE") {
		console.error(`Port ${PORT} is already in use by another process.`);
		console.error("Pick a free one, then register the matching redirect URI on your Spotify app:");
		console.error(`  SPOTIFY_AUTH_PORT=8899 node scripts/spotify-auth.mjs`);
	} else {
		console.error("Could not start the callback server:", err.message);
	}
	process.exit(1);
});

server.listen(PORT, "127.0.0.1", () => {
	console.log(`Register this exact redirect URI on your Spotify app:\n\n  ${REDIRECT_URI}\n`);
	console.log("Then open this URL in your browser and approve access:\n");
	console.log(authUrl);
	console.log(`\nWaiting for the redirect back to 127.0.0.1:${PORT} ...`);
});
