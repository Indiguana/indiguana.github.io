export interface GameEntry {
	slug: string;
	// Just the game's name — used to automatically look up cover art via SteamGridDB.
	title: string;
	platform: string;
	// Freeform, e.g. "9/10", "S tier", "Still deciding".
	rating?: string;
}

// Add one entry per game you want listed. Order here is display order.
export const gamesList: GameEntry[] = [
	{ slug: "uncharted-drakes-fortune", title: "Uncharted: Drake's Fortune", platform: "" },
	{ slug: "uncharted-2-among-thieves", title: "Uncharted 2: Among Thieves", platform: "" },
	{ slug: "uncharted-3-drakes-deception", title: "Uncharted 3: Drake's Deception", platform: "" },
	{ slug: "uncharted-4-a-thiefs-end", title: "Uncharted 4: A Thief's End", platform: "" },
	{ slug: "uncharted-the-lost-legacy", title: "Uncharted: The Lost Legacy", platform: "" },

	{ slug: "ac4-black-flag", title: "Assassin's Creed IV: Black Flag", platform: "" },
	{ slug: "ac3", title: "Assassin's Creed III", platform: "" },
	{ slug: "ac-odyssey", title: "Assassin's Creed Odyssey", platform: "" },

	{ slug: "spiderman-ps4", title: "Marvel's Spider-Man", platform: "" },
	{ slug: "spiderman-miles-morales", title: "Marvel's Spider-Man: Miles Morales", platform: "" },
	{ slug: "spiderman-2", title: "Marvel's Spider-Man 2", platform: "" },

	{ slug: "batman-arkham-knight", title: "Batman: Arkham Knight", platform: "" },

	{ slug: "ratchet-clank-rift-apart", title: "Ratchet & Clank: Rift Apart", platform: "" },
	{ slug: "ratchet-clank-crack-in-time", title: "Ratchet & Clank: A Crack in Time", platform: "" },

	{ slug: "hitman-trilogy", title: "Hitman Trilogy", platform: "" },

	{ slug: "god-of-war", title: "God of War", platform: "" },
	{ slug: "god-of-war-ragnarok", title: "God of War Ragnarök", platform: "" },

	{ slug: "red-dead-redemption-2", title: "Red Dead Redemption 2", platform: "" },

	{ slug: "horizon-forbidden-west", title: "Horizon Forbidden West", platform: "" },

	{ slug: "zelda-breath-of-the-wild", title: "The Legend of Zelda: Breath of the Wild", platform: "" },
	{ slug: "zelda-tears-of-the-kingdom", title: "The Legend of Zelda: Tears of the Kingdom", platform: "" },
	{ slug: "zelda-links-awakening", title: "The Legend of Zelda: Link's Awakening", platform: "" },

	{ slug: "jedi-survivor", title: "Star Wars Jedi: Survivor", platform: "" },
	{ slug: "jedi-fallen-order", title: "Star Wars Jedi: Fallen Order", platform: "" },

	{ slug: "lego-batman-2", title: "LEGO Batman 2: DC Super Heroes", platform: "" },
	{ slug: "lego-batman", title: "LEGO Batman: The Videogame", platform: "" },
	{ slug: "lego-pirates-of-the-caribbean", title: "LEGO Pirates of the Caribbean: The Video Game", platform: "" },
];
