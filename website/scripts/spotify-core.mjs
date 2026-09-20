/**
 * Shared Spotify fetching logic.
 *
 * Used by scripts/fetch-spotify.mjs (the GitHub Actions path that publishes a
 * JSON snapshot) and by worker/src/index.ts (the optional live path). Keeping
 * it in one place stops the two from drifting.
 *
 * Nothing here throws: every failure returns null/empty and warns, matching the
 * posture of src/lib/steamgriddb.ts. A bad day at Spotify costs the cave its
 * panels and nothing else.
 */

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1";

const b64 = (s) =>
	typeof btoa === "function" ? btoa(s) : Buffer.from(s, "utf8").toString("base64");

export async function getAccessToken({ clientId, clientSecret, refreshToken }) {
	if (!clientId || !clientSecret || !refreshToken) {
		console.warn("Spotify credentials are not fully configured — skipping lookups.");
		return null;
	}
	try {
		const res = await fetch(TOKEN_URL, {
			method: "POST",
			headers: {
				Authorization: `Basic ${b64(`${clientId}:${clientSecret}`)}`,
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
		});
		if (!res.ok) {
			console.warn(`Spotify token refresh failed: ${res.status}`);
			return null;
		}
		const json = await res.json();
		if (!json.access_token) {
			console.warn("Spotify token refresh returned no access_token.");
			return null;
		}
		return { value: json.access_token, expiresInMs: (json.expires_in ?? 3600) * 1000 };
	} catch (err) {
		console.warn("Spotify token refresh errored:", err);
		return null;
	}
}

async function get(path, token) {
	try {
		const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` } });
		if (!res.ok) {
			console.warn(`Spotify GET ${path} failed: ${res.status}`);
			return null;
		}
		return res;
	} catch (err) {
		console.warn(`Spotify GET ${path} errored:`, err);
		return null;
	}
}

/* Spotify returns images largest-first (typically 640/300/64). */
function pickImage(images, prefer) {
	if (!images || images.length === 0) return null;
	return prefer === "small" ? images[images.length - 1].url : images[Math.min(1, images.length - 1)].url;
}

function toTrack(item, { isPlaying, progressMs, playedAt }) {
	/* Usually a track, but the player can also hand back a podcast episode,
	   which carries `show` where a track has `artists`. */
	const artist =
		Array.isArray(item.artists) && item.artists.length > 0
			? item.artists.map((a) => a.name).join(", ")
			: (item.show?.name ?? "");

	return {
		isPlaying,
		title: item.name ?? "",
		artist,
		album: item.album?.name ?? item.show?.name ?? "",
		art: pickImage(item.album?.images ?? item.images, "large"),
		url: item.external_urls?.spotify ?? null,
		progressMs,
		durationMs: item.duration_ms ?? null,
		playedAt,
	};
}

export async function getNowPlaying(token, nowIso) {
	const res = await get("/me/player/currently-playing?additional_types=track,episode", token);

	/* 204 with an empty body is how Spotify says "nothing is playing" — calling
	   .json() on that throws, so the status check has to come first. */
	if (res && res.status !== 204) {
		const json = await res.json().catch(() => null);
		if (json?.item) {
			return toTrack(json.item, {
				isPlaying: json.is_playing === true,
				progressMs: json.progress_ms ?? null,
				playedAt: nowIso,
			});
		}
	}

	const recent = await get("/me/player/recently-played?limit=1", token);
	if (!recent) return null;
	const json = await recent.json().catch(() => null);
	const entry = json?.items?.[0];
	if (!entry?.track) return null;
	return toTrack(entry.track, { isPlaying: false, progressMs: null, playedAt: entry.played_at ?? null });
}

export async function getTopItems(token) {
	const [artistsRes, tracksRes] = await Promise.all([
		get("/me/top/artists?time_range=short_term&limit=5", token),
		get("/me/top/tracks?time_range=short_term&limit=5", token),
	]);

	const artistsJson = artistsRes ? await artistsRes.json().catch(() => null) : null;
	const tracksJson = tracksRes ? await tracksRes.json().catch(() => null) : null;

	/* Spotify removed `genres` from the top-artists payload (and /v1/artists now
	   403s without extended quota), so artist `sub` is empty in practice and the
	   page collapses the line. Kept in case the field ever returns. */
	const topArtists = (artistsJson?.items ?? []).map((a) => ({
		name: a.name ?? "",
		sub: a.genres?.[0] ? a.genres[0].replace(/\b\w/g, (c) => c.toUpperCase()) : "",
		art: pickImage(a.images, "small"),
		url: a.external_urls?.spotify ?? null,
	}));

	const topTracks = (tracksJson?.items ?? []).map((t) => ({
		name: t.name ?? "",
		sub: (t.artists ?? []).map((a) => a.name).join(", "),
		art: pickImage(t.album?.images, "small"),
		url: t.external_urls?.spotify ?? null,
	}));

	return { topArtists, topTracks };
}

/** Everything the cave panels need, in one object. Never throws. */
export async function buildSnapshot(credentials) {
	const fetchedAt = new Date().toISOString();
	const token = await getAccessToken(credentials);
	if (!token) return { fetchedAt, nowPlaying: null, topArtists: [], topTracks: [] };

	const [nowPlaying, top] = await Promise.all([
		getNowPlaying(token.value, fetchedAt),
		getTopItems(token.value),
	]);
	return { fetchedAt, nowPlaying, ...top };
}
