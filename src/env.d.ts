/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly STEAMGRIDDB_API_KEY?: string;
	/* Public URL of the Spotify proxy Worker in worker/. Optional: without
	   it the home page just renders without the Spotify panels. */
	readonly PUBLIC_SPOTIFY_ENDPOINT?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
