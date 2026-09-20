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
	{ text: "Do not be sorry. Be better.", source: "God of War"},
	{ text: "The proud do not endure.", source: "Ghost of Tsushima" },
	{ text: "Be Greater", source: "Spiderman" },
	{ text: "Courage need not be remembered, for it is never forgotten", source: "Breath of the Wild" },
	{ text: "Think of it as a running gag", source: "Batman: Arkham" },
	{ text: "The cycle ends here", source: "God of War" },
	{ text: "Fortune and glory, kid. Fortune and glory.", source: "Indiana Jones" },
	{ text: "Revenge is a fool's game", source: "Red Dead Redemption" },
	{ text: "I have a plan", source: "Red Dead Redemption" },
	{ text: "Be yourself", source: "Spiderman: Miles Morales" },
	{ text: "I have a plan", source: "Red Dead Redemption" },
	{ text: "In a world without gold, we might have been heroes", source: "Black Flag" },
	{ text: "It's the job that's never started as takes longest to finish", source: "gamgee" },
	{ text: "The nature of a thing’s more important than the form of a thing", source: "gow ragnarok" },
	{ text: "When you help someone, you help everyone.", source: "Spiderman" },
	{ text: "We named the dog Indiana", source: "Indiana Jones" },
	{ text: "Do you understand the words that are coming out of my mouth", source: "Rush Hour" },
	{ text: "Always look people in the eye, even if they're blind", source: "Phil Dunphy" },
];
