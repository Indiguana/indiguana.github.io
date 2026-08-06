export interface GameEntry {
	// Just the game's name — used to automatically look up cover art via SteamGridDB.
	title: string;
	platform: string;
	// Freeform, e.g. "9/10", "S tier", "Still deciding".
	rating?: string;
	note: string;
}

// Add one entry per game you want listed. Order here is display order.
export const gamesList: GameEntry[] = [];
