export interface ThemeIdea {
  id: string;
  name: string;
  category: "classic" | "boho" | "minimalist" | "royal" | "garden" | "beach";
  description: string;
  imageUrl: string;
  palette: string[];
}

export const weddingThemeIdeas: ThemeIdea[] = [
  {
    id: "classic-ivory",
    name: "Classic Ivory",
    category: "classic",
    description: "Timeless white, candlelight glow, black-tie elegance.",
    imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    palette: ["#f8f5f0", "#d7c4a3", "#8f7355", "#2f2b2a"],
  },
  {
    id: "boho-sunset",
    name: "Boho Sunset",
    category: "boho",
    description: "Warm terracotta tones, dried florals, free-spirited decor.",
    imageUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
    palette: ["#f3d7c2", "#d68c6f", "#a7604b", "#5f3d2f"],
  },
  {
    id: "minimal-silk",
    name: "Minimal Silk",
    category: "minimalist",
    description: "Clean lines, soft neutrals, less elements but premium finish.",
    imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    palette: ["#f4f2ef", "#d8d2cb", "#9d9489", "#3c3834"],
  },
  {
    id: "royal-opulence",
    name: "Royal Opulence",
    category: "royal",
    description: "Rich jewel colors, statement florals, dramatic venue styling.",
    imageUrl: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80",
    palette: ["#efe1f2", "#8d5a97", "#57315f", "#1f1425"],
  },
  {
    id: "garden-bloom",
    name: "Garden Bloom",
    category: "garden",
    description: "Fresh greenery, blush florals, romantic outdoor ceremony.",
    imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80",
    palette: ["#edf6eb", "#b8d1aa", "#8aa57a", "#4d6b4a"],
  },
  {
    id: "beach-breeze",
    name: "Beach Breeze",
    category: "beach",
    description: "Sea-inspired hues, light textures, sunset shoreline moments.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    palette: ["#ecf7fb", "#9ac9da", "#4f8ea8", "#1e5167"],
  },
];
