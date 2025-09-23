import type { Track } from "@/types";

export const featuredContent: Track[] = [
  {
    id: "1",
    title: "Midnight Dreams",
    artist: "Luna Echo",
    album: "Celestial Vibes",
    artwork: "https://picsum.photos/400/400?random=1",
    duration: 225,
    type: "song",
  },
  {
    id: "2",
    title: "Electric Pulse",
    artist: "Neon Waves",
    album: "Digital Horizon",
    artwork: "https://picsum.photos/400/400?random=2",
    duration: 198,
    type: "song",
  },
  {
    id: "3",
    title: "Golden Hour",
    artist: "Sunset Boulevard",
    album: "California Dreams",
    artwork: "https://picsum.photos/400/400?random=3",
    duration: 242,
    type: "song",
  },
];

export const recentlyPlayed: Track[] = [
  {
    id: "4",
    title: "Lost in Tokyo",
    artist: "Urban Nights",
    album: "City Lights",
    artwork: "https://picsum.photos/400/400?random=4",
    duration: 186,
    type: "song",
  },
  {
    id: "5",
    title: "Ocean Waves",
    artist: "Coastal Breeze",
    album: "Seaside Sessions",
    artwork: "https://picsum.photos/400/400?random=5",
    duration: 210,
    type: "song",
  },
  {
    id: "6",
    title: "Mountain High",
    artist: "Alpine Echo",
    album: "Peak Performance",
    artwork: "https://picsum.photos/400/400?random=6",
    duration: 195,
    type: "song",
  },
];

export const topCharts: Track[] = [
  {
    id: "7",
    title: "Starlight",
    artist: "Cosmic Dreams",
    album: "Galaxy Express",
    artwork: "https://picsum.photos/400/400?random=7",
    duration: 234,
    type: "song",
  },
  {
    id: "8",
    title: "Thunder Road",
    artist: "Lightning Strike",
    album: "Storm Chaser",
    artwork: "https://picsum.photos/400/400?random=8",
    duration: 267,
    type: "song",
  },
  {
    id: "9",
    title: "Crystal Clear",
    artist: "Diamond Sky",
    album: "Precious Moments",
    artwork: "https://picsum.photos/400/400?random=9",
    duration: 189,
    type: "song",
  },
  {
    id: "10",
    title: "Velvet Dreams",
    artist: "Silk Road",
    album: "Smooth Journey",
    artwork: "https://picsum.photos/400/400?random=10",
    duration: 212,
    type: "song",
  },
];

export const newReleases: Track[] = [
  {
    id: "11",
    title: "Future Bass",
    artist: "Tomorrow Sound",
    album: "Next Generation",
    artwork: "https://picsum.photos/400/400?random=11",
    duration: 178,
    type: "song",
  },
  {
    id: "12",
    title: "Retro Wave",
    artist: "Vintage Vibes",
    album: "Back to 80s",
    artwork: "https://picsum.photos/400/400?random=12",
    duration: 203,
    type: "song",
  },
  {
    id: "13",
    title: "Jazz Fusion",
    artist: "Blue Note",
    album: "Modern Classic",
    artwork: "https://picsum.photos/400/400?random=13",
    duration: 256,
    type: "song",
  },
  {
    id: "14",
    title: "Latin Heat",
    artist: "Salsa Kings",
    album: "Tropical Nights",
    artwork: "https://picsum.photos/400/400?random=14",
    duration: 194,
    type: "song",
  },
];

export const podcasts: Track[] = [
  {
    id: "p1",
    title: "Tech Talk Daily",
    artist: "Silicon Valley Insider",
    artwork: "https://picsum.photos/400/400?random=15",
    duration: 2400,
    type: "podcast",
    description: "Latest tech news and insights",
  },
  {
    id: "p2",
    title: "Mind & Body",
    artist: "Wellness Warriors",
    artwork: "https://picsum.photos/400/400?random=16",
    duration: 1800,
    type: "podcast",
    description: "Health and wellness tips",
  },
  {
    id: "p3",
    title: "True Crime Files",
    artist: "Mystery Hunters",
    artwork: "https://picsum.photos/400/400?random=17",
    duration: 3600,
    type: "podcast",
    description: "Unsolved mysteries explored",
  },
  {
    id: "p4",
    title: "Comedy Central",
    artist: "Laugh Factory",
    artwork: "https://picsum.photos/400/400?random=18",
    duration: 2700,
    type: "podcast",
    description: "Daily dose of humor",
  },
  {
    id: "p5",
    title: "Miss You",
    artist: "Oliver Tree, Robin Schulz",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 185,
    type: "podcast",
    description: "A deep dive into modern relationships and emotional connections",
  },
];

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  transcript?: string;
  hostInfo?: {
    name: string;
    bio: string;
    image: string;
    followers: string;
  };
  liveEvents?: {
    title: string;
    date: string;
    image: string;
  }[];
}

export const podcastEpisodes: Record<string, PodcastEpisode> = {
  p5: {
    id: "p5",
    title: "Miss You",
    description: "A deep dive into modern relationships and emotional connections",
    transcript: "Don't remind me\nI'm minding my own damn business\nDon't try to find me\nI'm better left alone than in this\nIt doesn't surprise me\nDo you really think that I could care",
    hostInfo: {
      name: "Oliver Tree",
      bio: "An internet-based vocalist, producer, writer, director and performance artist, oliver tree...",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
      followers: "24,419,528 monthly listeners"
    },
    liveEvents: [
      {
        title: "Jun 9 - Aug 25",
        date: "4 events on tour",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=300&h=200&fit=crop"
      }
    ]
  }
};

export const audiobooks: Track[] = [
  {
    id: "a1",
    title: "The Digital Revolution",
    artist: "Dr. Sarah Tech",
    artwork: "https://picsum.photos/400/400?random=19",
    duration: 18000,
    type: "audiobook",
    description: "How technology changed our world",
  },
  {
    id: "a2",
    title: "Mindful Living",
    artist: "Zen Master Lee",
    artwork: "https://picsum.photos/400/400?random=20",
    duration: 14400,
    type: "audiobook",
    description: "A guide to peaceful existence",
  },
  {
    id: "a3",
    title: "Space Odyssey",
    artist: "Captain Nova",
    artwork: "https://picsum.photos/400/400?random=21",
    duration: 21600,
    type: "audiobook",
    description: "Journey through the cosmos",
  },
  {
    id: "a4",
    title: "Ancient Wisdom",
    artist: "Professor Stone",
    artwork: "https://picsum.photos/400/400?random=22",
    duration: 16200,
    type: "audiobook",
    description: "Lessons from history",
  },
];

// Add more realistic search data
export const searchAlbums = [
  {
    id: 'sweetener',
    title: 'Sweetener',
    artist: 'Ariana Grande',
    year: '2018',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    type: 'album' as const,
  },
  {
    id: 'dangerous-woman',
    title: 'Dangerous Woman',
    artist: 'Ariana Grande',
    year: '2016',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    type: 'album' as const,
  },
  {
    id: 'yours-truly',
    title: 'Yours Truly',
    artist: 'Ariana Grande',
    year: '2013',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    type: 'album' as const,
  },
  {
    id: 'my-everything',
    title: 'My Everything',
    artist: 'Ariana Grande',
    year: '2014',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    type: 'album' as const,
  },
  {
    id: 'starboy',
    title: 'Starboy',
    artist: 'The Weeknd',
    year: '2016',
    artwork: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    type: 'album' as const,
  },
  {
    id: 'after-hours',
    title: 'After Hours',
    artist: 'The Weeknd',
    year: '2020',
    artwork: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    type: 'album' as const,
  },
];

export const searchTracks: Track[] = [
  {
    id: "s1",
    title: "Firework",
    artist: "Katy Perry",
    album: "Teenage Dream",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 228,
    type: "song",
  },
  {
    id: "s2",
    title: "Firework - Acoustic",
    artist: "The Mayries",
    album: "Acoustic Sessions",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 195,
    type: "song",
  },
  {
    id: "s3",
    title: "Last Friday Night",
    artist: "Katy Perry",
    album: "Teenage Dream",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 231,
    type: "song",
  },
  {
    id: "s4",
    title: "Firework Cover",
    artist: "The Sapphear",
    album: "Cover Sessions",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 210,
    type: "song",
  },
  {
    id: "s5",
    title: "Teenage Dream",
    artist: "Katy Perry",
    album: "Teenage Dream",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 225,
    type: "song",
  },
  {
    id: "s6",
    title: "Starboy",
    artist: "The Weeknd, Daft Punk",
    album: "Starboy",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 230,
    type: "song",
  },
  {
    id: "s7",
    title: "Starboy Speed Up",
    artist: "Just Lowkey",
    album: "Speed Up Sessions",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 180,
    type: "song",
  },
  {
    id: "s8",
    title: "Die For You",
    artist: "The Weeknd",
    album: "Starboy",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 260,
    type: "song",
  },
  {
    id: "s9",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 200,
    type: "song",
  },
  {
    id: "s10",
    title: "The Hills",
    artist: "The Weeknd",
    album: "Beauty Behind the Madness",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 242,
    type: "song",
  },
  {
    id: "s11",
    title: "I Feel It Coming",
    artist: "The Weeknd, Daft Punk",
    album: "Starboy",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 269,
    type: "song",
  },
  {
    id: "s12",
    title: "Call Out My Name",
    artist: "The Weeknd",
    album: "My Dear Melancholy,",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 228,
    type: "song",
  },
  {
    id: "s13",
    title: "Save Your Tears",
    artist: "The Weeknd",
    album: "After Hours",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 215,
    type: "song",
  },
  {
    id: "s14",
    title: "Roar",
    artist: "Katy Perry",
    album: "Prism",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 223,
    type: "song",
  },
  {
    id: "s15",
    title: "Side to Side",
    artist: "Ariana Grande",
    album: "Dangerous Woman",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 226,
    type: "song",
  },
  {
    id: "s16",
    title: "7 Rings",
    artist: "Ariana Grande",
    album: "Thank U, Next",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 178,
    type: "song",
  },
  {
    id: "s17",
    title: "Stuck With U",
    artist: "Ariana Grande",
    album: "Stuck With U",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 228,
    type: "song",
  },
];

export const searchArtists = [
  {
    id: "sa1",
    name: "Ariana Grande",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    followers: "55,278,829",
    verified: true,
    type: "artist" as const,
  },
  {
    id: "sa2",
    name: "Katy Perry",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    followers: "45.2M",
    verified: true,
    type: "artist" as const,
  },
  {
    id: "sa3",
    name: "The Weeknd",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    followers: "92.1M",
    verified: true,
    type: "artist" as const,
  },
  {
    id: "sa4",
    name: "Acidrap",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    followers: "45.8M",
    verified: true,
    type: "artist" as const,
  },
  {
    id: "sa5",
    name: "Ryan Jones",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    followers: "12.3M",
    verified: true,
    type: "artist" as const,
  },
  {
    id: "sa6",
    name: "Troye Sivan",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    followers: "34.5M",
    verified: true,
    type: "artist" as const,
  },
  {
    id: "sa7",
    name: "James Gray",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    followers: "28.7M",
    verified: true,
    type: "artist" as const,
  },
  {
    id: "sa8",
    name: "Clean Bandit",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    followers: "12.8M",
    verified: true,
    type: "artist" as const,
  },
];

// Jordan Harbinger Show Episodes
export const jordanHarbingerEpisodes: Track[] = [
  {
    id: "jh1",
    title: "691: Shaquille O'Neal | Circling Back on Flat Earth Theory",
    artist: "Jordan Harbinger",
    artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    duration: 2906, // 48:26 mins
    type: "podcast",
    description: "The Jordan Harbinger Show",
  },
  {
    id: "jh2",
    title: "692: Jane McGonigal | How to See the Future Coming and Feel Ready for Anything",
    artist: "Jordan Harbinger",
    artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    duration: 3240, // 54 mins
    type: "podcast",
    description: "The Jordan Harbinger Show",
  },
];

// Twenty Thousand Hertz Episodes
export const twentyThousandHertzEpisodes: Track[] = [
  {
    id: "tth1",
    title: "688: A-Rod | Still Having a Ball After All",
    artist: "Twenty Thousand Hertz",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 2956, // 49:26 mins
    type: "podcast",
    description: "Twenty Thousand Hertz",
  },
];

// Hidden Brain Episodes
export const hiddenBrainEpisodes: Track[] = [
  {
    id: "hb1",
    title: "837: Amy Webb | Changing Lives with Synthetic Biology",
    artist: "Hidden Brain",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 3288, // 54:48 mins
    type: "podcast",
    description: "Hidden Brain",
  },
];

// SaaS & Scotch Episodes
export const saasScotchEpisodes: Track[] = [
  {
    id: "ss1",
    title: "593: Chris Voss | Hostage Negotiation Tactics for Everyday Life",
    artist: "SaaS & Scotch",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 2617, // 43:37 mins
    type: "podcast",
    description: "SaaS & Scotch",
  },
];

// All podcast episodes combined
export const allPodcastEpisodes: Track[] = [
  ...jordanHarbingerEpisodes,
  ...twentyThousandHertzEpisodes,
  ...hiddenBrainEpisodes,
  ...saasScotchEpisodes,
];

export const allTracks: Track[] = [
  ...featuredContent,
  ...recentlyPlayed,
  ...topCharts,
  ...newReleases,
  ...podcasts,
  ...audiobooks,
  ...searchTracks,
  ...allPodcastEpisodes,
];

export const trendingNow: Track[] = [
  {
    id: "t1",
    title: "Shades of Love",
    artist: "Ania Szarmach",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 195,
    type: "song",
  },
  {
    id: "t2",
    title: "Without You",
    artist: "The Kid LAROI",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 210,
    type: "song",
  },
  {
    id: "t3",
    title: "Save Your Tears",
    artist: "The Weeknd & Ariana Grande",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 225,
    type: "song",
  },
  {
    id: "t4",
    title: "Kiss Me More",
    artist: "Doja Cat Featuring SZA",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 198,
    type: "song",
  },
  {
    id: "t5",
    title: "Drivers License",
    artist: "Olivia Rodrigo",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 242,
    type: "song",
  },
  {
    id: "t6",
    title: "Forever After All",
    artist: "Luke Combs",
    artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    duration: 186,
    type: "song",
  },
];

export const popularArtists = [
  {
    id: "a1",
    name: "Ariana Grande",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    followers: "85.2M",
    verified: true,
  },
  {
    id: "a2",
    name: "The Weeknd",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    followers: "92.1M",
    verified: true,
  },
  {
    id: "a3",
    name: "Acidrap",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    followers: "45.8M",
    verified: true,
  },
  {
    id: "a4",
    name: "Ryan Jones",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    followers: "12.3M",
    verified: false,
  },
  {
    id: "a5",
    name: "Jamie Gray",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    followers: "28.7M",
    verified: true,
  },
  {
    id: "a6",
    name: "Troye Sivan",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    followers: "34.5M",
    verified: true,
  },
];

export const podcastCategories = [
  {
    id: "pc1",
    title: "Business",
    color: "#8B5CF6",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  },
  {
    id: "pc2",
    title: "Politics",
    color: "#F59E0B",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=200&h=200&fit=crop",
  },
  {
    id: "pc3",
    title: "Music",
    color: "#3B82F6",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
  },
  {
    id: "pc4",
    title: "Comedy",
    color: "#F97316",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
  },
];

export const popularPodcasts: Track[] = [
  {
    id: "pp1",
    title: "610: Bill Sullivan | Pleased to Meet Me",
    artist: "Jordan Harbinger",
    artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    duration: 3600,
    type: "podcast",
    description: "The Jordan Harbinger Show",
  },
  {
    id: "pp2",
    title: "487: Mike Rowe | Dirty Jobs and Personal Responsibility",
    artist: "Mike Rowe",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    duration: 2700,
    type: "podcast",
    description: "SaaS & Scotch",
  },
  {
    id: "pp3",
    title: "938: Tom Bilyeu | Billion Dollar Advice",
    artist: "Tom Bilyeu",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 4200,
    type: "podcast",
    description: "Impact Theory",
  },
];

// Podcast Shows
export const podcastShows = [
  {
    id: "show1",
    title: "The Jordan Harbinger Show",
    host: "Jordan Harbinger",
    artwork: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, view more...",
    episodes: jordanHarbingerEpisodes,
  },
  {
    id: "show2",
    title: "Apple Talk",
    host: "Apple Talk",
    artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    description: "Technology discussions and insights from the world of Apple.",
    episodes: [],
  },
  {
    id: "show3",
    title: "Dr. Death",
    host: "Dr. Death",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    description: "True crime podcast exploring medical malpractice cases.",
    episodes: [],
  },
];

export const popularPodcastArtists = [
  {
    id: "ppa1",
    name: "Dr. Death",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    category: "True Crime",
  },
  {
    id: "ppa2",
    name: "Apple Talk",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    category: "Technology",
  },
  {
    id: "ppa3",
    name: "Wondery",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    category: "Entertainment",
  },
];

export const genres = [
  "Pop",
  "Rock",
  "Hip-Hop",
  "Electronic",
  "Jazz",
  "Classical",
  "R&B",
  "Country",
  "Latin",
  "Indie",
  "Metal",
  "Reggae",
  "Afro Beat",
  "Afro Beats",
  "High Life",
];