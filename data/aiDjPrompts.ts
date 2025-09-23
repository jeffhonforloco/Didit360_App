export interface AIDJPrompts {
  energy_mood: string[];
  genre_fusions: string[];
  regional_vibes: string[];
  decades_eras: string[];
  activity_based: string[];
  discovery_deepcuts: string[];
  controls_examples: string[];
}

export const aiDjPrompts: AIDJPrompts = {
  energy_mood: [
    "High-energy Afrobeats + amapiano for a 60-min gym set, no explicit",
    "Chill lo-fi + alt-R&B for late night focus, low vocals, 75–90 BPM",
    "Warm-up → peak → cool-down house set, 110→126→112 BPM, soulful only",
    "Dark trap + drill, moody vibe, 130–150 BPM, minimal ad-libs",
    "Sunset deep house by the beach, vocal cuts OK, 118–122 BPM",
  ],
  genre_fusions: [
    "Afro house x gqom x amapiano, club-ready, 118–124 BPM",
    "Old-school hip-hop x jazz rap, East Coast tilt, 88–96 BPM",
    "Neo-soul x R&B slow jams, 70–85 BPM, lush harmonies",
    "Indie dance x synthwave, retro-future, 110–120 BPM",
    "Latin urbano x dancehall crossover, party vibe",
  ],
  regional_vibes: [
    "Lagos → Johannesburg heaters: afropop + kwaito + piano",
    "Parisian electro + French touch classics, 115–124 BPM",
    "UKG + 2-step + bassline, warehouse vibe",
    "Brazilian funk carioca + baile favela, peak energy",
    "K-R&B + Korean hip-hop smooth blend, late night",
  ],
  decades_eras: [
    "90s East Coast boom bap deep cuts",
    "2000s R&B radio hits vs B-sides",
    "Classic house from Chicago & NYC, vinyl feel",
    "Golden era reggae & lovers rock",
    "Blog-house 2007–2012 throwback party",
  ],
  activity_based: [
    "Coding marathon: instrumental beats, no vocals, 70–90 BPM",
    "Morning coffee: mellow indie, acoustic lean",
    "Road trip: upbeat pop + disco edits, 105–120 BPM",
    "Study session: ambient + neoclassical, low energy",
    "Lift heavy: rage rap + trap metal, max hype",
  ],
  discovery_deepcuts: [
    "Only underground afro-house labels, no mainstream",
    "Indie R&B from emerging artists, < 250k monthly plays",
    "Left-field jazz fusion with modern beats",
    "Obscure UK grime instrumentals",
    "Future baile + global bass rarities",
  ],
  controls_examples: [
    "Keep energy at 6/10 and gradually climb to 8/10 by track 6",
    "No explicit content, English + Yoruba only",
    "Focus on female vocalists, avoid remixes",
    "Instrumental-only for first 20 minutes",
    "Surprise me with one classic every 5 tracks",
  ],
};

export type AIDJPromptCategoryKey = keyof AIDJPrompts;
