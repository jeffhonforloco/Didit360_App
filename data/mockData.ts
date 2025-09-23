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

export const allTracks: Track[] = [
  ...featuredContent,
  ...recentlyPlayed,
  ...topCharts,
  ...newReleases,
  ...podcasts,
  ...audiobooks,
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