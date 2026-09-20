/* Types for the shared JS core in scripts/spotify-core.mjs, which this Worker
   and the GitHub Actions snapshot script both use. */
declare module "*/spotify-core.mjs" {
	export interface PanelItem {
		name: string;
		sub: string;
		art: string | null;
		url: string | null;
	}

	export interface NowPlaying {
		isPlaying: boolean;
		title: string;
		artist: string;
		album: string;
		art: string | null;
		url: string | null;
		progressMs: number | null;
		durationMs: number | null;
		playedAt: string | null;
	}

	export interface Snapshot {
		fetchedAt: string;
		nowPlaying: NowPlaying | null;
		topArtists: PanelItem[];
		topTracks: PanelItem[];
	}

	export interface Credentials {
		clientId?: string;
		clientSecret?: string;
		refreshToken?: string;
	}

	export function buildSnapshot(credentials: Credentials): Promise<Snapshot>;
}
