export interface GameQuote {
	text: string;
	// Game or series the line comes from — kept for reference, not displayed.
	source: string;
}

// Scrolls across the site header. Add, remove, or reorder freely;
// the banner speed scales with how many are in the list.
export const gameQuotes: GameQuote[] = [
	{ text: "Sic parvis magna.", source: "Uncharted" },
	{ text: "Nothing is true, everything is permitted.", source: "Assassin's Creed" },
	{ text: "Do not be sorry. Be better.", source: "God of War" },
	{ text: "Honor died on the beach.", source: "Ghost of Tsushima" },
	{ text: "Hey! Listen!", source: "Ocarina of Time" },
	{ text: "Open your eyes...", source: "Breath of the Wild" },
	{ text: "I am vengeance. I am the night. I am Batman.", source: "Batman: Arkham" },
	{ text: "Trust only in the Force.", source: "Star Wars Jedi: Fallen Order" },
	{ text: "Fortune and glory, kid. Fortune and glory.", source: "Indiana Jones" },
];
