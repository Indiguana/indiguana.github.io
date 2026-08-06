export interface GameEntry {
	// Slug from the game's RAWG.io URL, e.g. https://rawg.io/games/elden-ring -> "elden-ring".
	rawgSlug: string;
	platform: string;
	// Freeform, e.g. "9/10", "S tier", "Still deciding".
	rating?: string;
	note: string;
}

// Add one entry per game you want listed. Order here is display order.
export const gamesList: GameEntry[] = [];
