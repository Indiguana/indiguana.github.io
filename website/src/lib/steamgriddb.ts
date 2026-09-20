const apiKey = import.meta.env.STEAMGRIDDB_API_KEY;

interface SgdbSearchResult {
	id: number;
	name: string;
}

interface SgdbGrid {
	url: string;
}

let warnedMissingKey = false;

export async function fetchCoverUrl(title: string): Promise<string | null> {
	if (!title) return null;
	if (!apiKey) {
		if (!warnedMissingKey) {
			console.warn("STEAMGRIDDB_API_KEY is not set — skipping cover art lookups.");
			warnedMissingKey = true;
		}
		return null;
	}
	try {
		const searchRes = await fetch(`https://www.steamgriddb.com/api/v2/search/autocomplete/${encodeURIComponent(title)}`, {
			headers: { Authorization: `Bearer ${apiKey}` },
		});
		if (!searchRes.ok) {
			console.warn(`SteamGridDB search failed for "${title}": ${searchRes.status}`);
			return null;
		}
		const searchJson = await searchRes.json();
		const results: SgdbSearchResult[] = searchJson.data ?? [];
		if (results.length === 0) {
			console.warn(`SteamGridDB found no games for "${title}"`);
			return null;
		}
		const gameId = results[0].id;

		const gridsRes = await fetch(`https://www.steamgriddb.com/api/v2/grids/game/${gameId}?dimensions=600x900&limit=1`, {
			headers: { Authorization: `Bearer ${apiKey}` },
		});
		if (!gridsRes.ok) {
			console.warn(`SteamGridDB grids lookup failed for "${title}": ${gridsRes.status}`);
			return null;
		}
		const gridsJson = await gridsRes.json();
		const grids: SgdbGrid[] = gridsJson.data ?? [];
		return grids[0]?.url ?? null;
	} catch (err) {
		console.warn(`SteamGridDB lookup errored for "${title}":`, err);
		return null;
	}
}
