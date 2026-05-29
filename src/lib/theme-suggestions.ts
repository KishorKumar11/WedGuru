export interface ThemeSuggestion {
  checklistTasks: Array<{ title: string; category: string; monthsBefore: string; order: number }>;
  budgetCategories: Array<{ category: string; vendor: string; estimated: number; actual: number }>;
}

const SUGGESTIONS: Record<string, ThemeSuggestion> = {
  classic: {
    checklistTasks: [
      { title: "Book string quartet or pianist", category: "Music", monthsBefore: "12mo", order: 20 },
      { title: "Order classic white flowers (roses, lilies)", category: "Decor", monthsBefore: "6mo", order: 21 },
      { title: "Source black-tie invitation suite", category: "Stationery", monthsBefore: "6mo", order: 22 },
    ],
    budgetCategories: [
      { category: "Music/DJ", vendor: "String Quartet", estimated: 1500, actual: 0 },
      { category: "Flowers", vendor: "Classic florals", estimated: 2500, actual: 0 },
      { category: "Invitations", vendor: "Engraved invitations", estimated: 800, actual: 0 },
    ],
  },
  boho: {
    checklistTasks: [
      { title: "Source dried pampas grass and macrame decor", category: "Decor", monthsBefore: "3mo", order: 20 },
      { title: "Find outdoor/barn venue", category: "Venue", monthsBefore: "12mo", order: 21 },
      { title: "Book acoustic/folk musician", category: "Music", monthsBefore: "6mo", order: 22 },
    ],
    budgetCategories: [
      { category: "Decor", vendor: "Boho decor rentals", estimated: 1200, actual: 0 },
      { category: "Venue", vendor: "Barn / outdoor space", estimated: 4000, actual: 0 },
    ],
  },
  minimalist: {
    checklistTasks: [
      { title: "Design simple geometric table settings", category: "Decor", monthsBefore: "3mo", order: 20 },
      { title: "Source monochrome floral arrangements", category: "Flowers", monthsBefore: "3mo", order: 21 },
    ],
    budgetCategories: [
      { category: "Flowers", vendor: "Single-bloom minimalist arrangements", estimated: 800, actual: 0 },
      { category: "Decor", vendor: "Clean geometric centerpieces", estimated: 600, actual: 0 },
    ],
  },
  royal: {
    checklistTasks: [
      { title: "Book grand ballroom venue", category: "Venue", monthsBefore: "12mo", order: 20 },
      { title: "Order gold/crystal candelabras", category: "Decor", monthsBefore: "3mo", order: 21 },
      { title: "Hire live orchestra or big band", category: "Music", monthsBefore: "9mo", order: 22 },
    ],
    budgetCategories: [
      { category: "Venue", vendor: "Ballroom / grand hall", estimated: 12000, actual: 0 },
      { category: "Decor", vendor: "Crystal and gold accents", estimated: 4000, actual: 0 },
      { category: "Music/DJ", vendor: "Live orchestra", estimated: 5000, actual: 0 },
    ],
  },
  garden: {
    checklistTasks: [
      { title: "Book garden or estate venue", category: "Venue", monthsBefore: "12mo", order: 20 },
      { title: "Arrange seasonal wildflower arrangements", category: "Flowers", monthsBefore: "3mo", order: 21 },
      { title: "Plan outdoor lighting (fairy lights/lanterns)", category: "Decor", monthsBefore: "3mo", order: 22 },
    ],
    budgetCategories: [
      { category: "Venue", vendor: "Garden estate rental", estimated: 5000, actual: 0 },
      { category: "Flowers", vendor: "Wildflower arrangements", estimated: 1500, actual: 0 },
      { category: "Decor", vendor: "Outdoor lighting", estimated: 800, actual: 0 },
    ],
  },
  beach: {
    checklistTasks: [
      { title: "Obtain beach wedding permit", category: "Venue", monthsBefore: "9mo", order: 20 },
      { title: "Arrange tent/canopy for ceremony", category: "Decor", monthsBefore: "3mo", order: 21 },
      { title: "Plan barefoot reception area", category: "Decor", monthsBefore: "3mo", order: 22 },
    ],
    budgetCategories: [
      { category: "Venue", vendor: "Beach permit + setup", estimated: 2500, actual: 0 },
      { category: "Decor", vendor: "Canopy and coastal decor", estimated: 1500, actual: 0 },
    ],
  },
};

export function getThemeSuggestions(category: string): ThemeSuggestion | null {
  return SUGGESTIONS[category] ?? null;
}
